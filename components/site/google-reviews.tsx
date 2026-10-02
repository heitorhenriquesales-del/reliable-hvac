"use client";

import {useEffect, useState} from "react";
import {ArrowLeft, ArrowRight, Quote} from "lucide-react";
import type {Review} from "@/content/site";

export function GoogleReviews({reviews, googleUrl}:{reviews:Review[];googleUrl:string}) {
  const [allReviews,setAllReviews]=useState<(Review & {rating?:number})[]>(reviews);
  const [totalReviewCount,setTotalReviewCount]=useState(reviews.length);
  const [connected,setConnected]=useState(false);
  const [index,setIndex]=useState(0);
  useEffect(()=>{
    let active=true;
    const load=async()=>{
      try{
        const response=await fetch("/api/google-reviews",{cache:"no-store"});
        if(!response.ok)return;
        const data=await response.json() as {reviews?: (Review & {rating?:number})[];totalReviewCount?:number};
        if(active&&data.reviews?.length){setAllReviews(data.reviews);setTotalReviewCount(data.totalReviewCount??data.reviews.length);setConnected(true);setIndex(0)}
      }catch{/* Keep the verified fallback reviews visible if Google is temporarily unavailable. */}
    };
    void load();
    const refresh=window.setInterval(load,30*60*1000);
    return()=>{active=false;window.clearInterval(refresh)};
  },[]);
  useEffect(()=>{
    if(allReviews.length<2||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    const duration=allReviews[index]?.quote.length>300?24000:allReviews[index]?.quote.length>140?13000:6500;
    const timer=window.setTimeout(()=>setIndex(current=>(current+1)%allReviews.length),duration);
    return()=>window.clearTimeout(timer);
  },[allReviews,index]);
  if(!allReviews.length)return null;
  const review=allReviews[index];
  const Card=review.quote?"blockquote":"div";
  const move=(step:number)=>setIndex(current=>(current+step+allReviews.length)%allReviews.length);
  return <div className="google-reviews" aria-label="Google customer reviews">
    <Card className="review-box" key={review.id}>
      {review.quote&&<Quote size={36} strokeWidth={1.4}/>}
      {review.rating&&<div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(Math.min(5,review.rating))}</div>}
      <p>{review.quote||"5-star rating on Google"}</p>
      <cite>{review.name}</cite>
      <a className="text-link" href={googleUrl} target="_blank" rel="noopener noreferrer">Read on Google</a>
    </Card>
    {allReviews.length>1&&<div className="review-controls" aria-label="Review controls">
      <button type="button" onClick={()=>move(-1)} aria-label="Previous review"><ArrowLeft size={18}/></button>
      <span aria-live="polite">{index+1} / {allReviews.length}{connected ? ` · ${totalReviewCount} Google reviews` : ""}</span>
      <button type="button" onClick={()=>move(1)} aria-label="Next review"><ArrowRight size={18}/></button>
    </div>}
  </div>;
}
