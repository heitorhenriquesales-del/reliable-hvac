"use client";

import {useEffect,useState} from "react";

type Report = {configured:boolean;period?:string;visitors?:number;views?:number;quotes?:number;phones?:number;quoteClicks?:number;campaigns?:{name:string;event:string;count:number}[]};

export function AdminAnalytics() {
  const [report,setReport] = useState<Report|null>(null);
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    const controller = new AbortController();
    fetch("/api/gallery/analytics",{cache:"no-store",signal:controller.signal})
      .then(async response=>{const data=await response.json();if(!response.ok)throw new Error(data.error||"Could not load metrics.");setReport(data)})
      .catch(cause=>{if(!controller.signal.aborted)setError(cause instanceof Error?cause.message:"Could not load metrics.")})
      .finally(()=>{if(!controller.signal.aborted)setLoading(false)});
    return ()=>controller.abort();
  },[]);

  return <section className="admin-analytics" aria-labelledby="admin-analytics-title">
    <p className="eyebrow">WEBSITE RESULTS</p>
    <h3 id="admin-analytics-title">Analytics overview</h3>
    {loading?<p>Loading metrics…</p>:error?<p role="alert">{error}</p>:!report?.configured?<p>Google Analytics is not connected yet. Once the GA4 property and read access are configured, results will appear here.</p>:<>
      <p>{report.period} · Google Analytics 4</p>
      <div className="admin-analytics-grid">
        {([ ["Visitors",report.visitors],["Page views",report.views],["Quote requests sent",report.quotes],["Phone link clicks",report.phones],["Quote button clicks",report.quoteClicks]] as const).map(([label,value])=><div key={label}><strong>{(value||0).toLocaleString("en-US")}</strong><span>{label}</span></div>)}
      </div>
      <h4>Leads by campaign</h4>
      {report.campaigns?.length?<div className="admin-analytics-table"><table><thead><tr><th>Campaign</th><th>Action</th><th>Count</th></tr></thead><tbody>{report.campaigns.map((row,index)=><tr key={`${row.name}-${row.event}-${index}`}><td>{row.name}</td><td>{row.event==="generate_lead"?"Quote sent":"Phone click"}</td><td>{row.count}</td></tr>)}</tbody></table></div>:<p>No campaign leads were recorded in this period.</p>}
      <p className="admin-analytics-note">Quote requests are counted only after a successful form submission. Phone clicks do not confirm that a call was completed.</p>
    </>}
  </section>;
}
