import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import {site} from "@/content/site";
import {Header,Footer,Motion} from "@/components/site/chrome";
import {AnalyticsClicks} from "@/components/site/analytics";
const analyticsId=process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const adsId=process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const tagId=analyticsId||adsId;
export const metadata:Metadata={
 metadataBase:site.publicUrl?new URL(site.publicUrl):undefined,alternates:{canonical:"/"},
 title:{default:"Reliable HVAC | Reliable Heating, Cooling & Comfort",template:"%s | Reliable HVAC"},
 description:"Explore Reliable HVAC’s heating, cooling, ventilation, radiant heating, and water-heating services. Request dependable comfort solutions for your home or business.",
 robots:{index:false,follow:false},
 openGraph:{title:"Reliable HVAC",description:"Reliable service. Quality work. Comfort you can count on.",type:"website",locale:"en_US",siteName:"Reliable HVAC"},
 twitter:{card:"summary",title:"Reliable HVAC",description:"Reliable service. Quality work. Comfort you can count on."},
 icons:{icon:"/brand/reliable-construct-cropped.png",shortcut:"/brand/reliable-construct-cropped.png"},
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{tagId&&<><Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(tagId)}`} strategy="afterInteractive"/><Script id="google-tag" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());${analyticsId?`gtag('config',${JSON.stringify(analyticsId)},{send_page_view:false});`:""}${adsId?`gtag('config',${JSON.stringify(adsId)});`:""}`}</Script></>}<a className="skip-link" href="#main">Skip to content</a><Header/>{children}<Footer/><Motion/><AnalyticsClicks/></body></html>}
