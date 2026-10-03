import {createSign} from "node:crypto";
import {NextResponse} from "next/server";
import {hasGallerySession} from "@/lib/gallery-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ServiceAccount = {client_email:string;private_key:string};
type Row = {dimensionValues?:{value:string}[];metricValues?:{value:string}[]};

function encode(value: object) {return Buffer.from(JSON.stringify(value)).toString("base64url")}

async function accessToken(account: ServiceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = encode({alg:"RS256",typ:"JWT"});
  const payload = encode({iss:account.client_email,scope:"https://www.googleapis.com/auth/analytics.readonly",aud:"https://oauth2.googleapis.com/token",iat:now,exp:now+3600});
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${payload}`);
  const assertion = `${header}.${payload}.${signer.sign(account.private_key).toString("base64url")}`;
  const response = await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer",assertion}),signal:AbortSignal.timeout(10000),cache:"no-store"});
  if(!response.ok) throw new Error("Google Analytics access was denied.");
  const data = await response.json() as {access_token?:string};
  if(!data.access_token) throw new Error("Google Analytics did not return an access token.");
  return data.access_token;
}

async function report(property:string, token:string, body:object) {
  const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${property}:runReport`,{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify({...body,dateRanges:[{startDate:"30daysAgo",endDate:"yesterday"}]}),signal:AbortSignal.timeout(10000),cache:"no-store"});
  if(!response.ok) throw new Error("Could not read the Google Analytics report. Check property access and the Data API.");
  return response.json() as Promise<{rows?:Row[]}>;
}

export async function GET(request:Request) {
  if(!hasGallerySession(request)) return NextResponse.json({error:"Unauthorized"},{status:401});
  const property = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
  const credentials = process.env.GOOGLE_ANALYTICS_SERVICE_ACCOUNT_JSON;
  if(!property || !/^\d+$/.test(property) || !credentials) return NextResponse.json({configured:false},{headers:{"Cache-Control":"no-store"}});
  try {
    const account = JSON.parse(credentials) as ServiceAccount;
    if(!account.client_email || !account.private_key) throw new Error("Invalid service account configuration.");
    const token = await accessToken(account);
    const [overview, events, campaigns] = await Promise.all([
      report(property,token,{metrics:[{name:"activeUsers"},{name:"screenPageViews"}]}),
      report(property,token,{dimensions:[{name:"eventName"}],metrics:[{name:"eventCount"}],dimensionFilter:{filter:{fieldName:"eventName",inListFilter:{values:["generate_lead","phone_click","quote_button_click"]}}}}),
      report(property,token,{dimensions:[{name:"sessionCampaignName"},{name:"eventName"}],metrics:[{name:"eventCount"}],dimensionFilter:{filter:{fieldName:"eventName",inListFilter:{values:["generate_lead","phone_click"]}}},limit:"20"}),
    ]);
    const counts = Object.fromEntries((events.rows||[]).map(row=>[row.dimensionValues?.[0]?.value||"",Number(row.metricValues?.[0]?.value||0)]));
    return NextResponse.json({configured:true,period:"Previous 30 complete days",visitors:Number(overview.rows?.[0]?.metricValues?.[0]?.value||0),views:Number(overview.rows?.[0]?.metricValues?.[1]?.value||0),quotes:counts.generate_lead||0,phones:counts.phone_click||0,quoteClicks:counts.quote_button_click||0,campaigns:(campaigns.rows||[]).map(row=>({name:row.dimensionValues?.[0]?.value||"(not set)",event:row.dimensionValues?.[1]?.value||"",count:Number(row.metricValues?.[0]?.value||0)}))},{headers:{"Cache-Control":"no-store"}});
  } catch(cause) {
    return NextResponse.json({error:cause instanceof Error?cause.message:"Could not load analytics."},{status:502,headers:{"Cache-Control":"no-store"}});
  }
}
