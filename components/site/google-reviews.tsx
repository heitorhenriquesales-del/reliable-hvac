"use client";

import {useEffect, useState} from "react";
import {ArrowLeft, ArrowRight, Quote} from "lucide-react";
import {Dialog,DialogContent,DialogDescription,DialogTitle} from "@/components/ui/dialog";
import type {Review} from "@/content/site";

export function GoogleReviews({reviews, googleUrl}:{reviews:Review[];googleUrl:string}) {
  const [allReviews,setAllReviews]=useState<(Review & {rating?:number})[]>(reviews);
  const [totalReviewCount,setTotalReviewCount]=useState(reviews.length);
  const [connected,setConnected]=useState(false);
  const [index,setIndex]=useState(0);
  const [expanded,setExpanded]=useState(false);
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
    if(expanded||allReviews.length<2||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    const timer=window.setTimeout(()=>setIndex(current=>(current+1)%allReviews.length),6500);
    return()=>window.clearTimeout(timer);
  },[allReviews,index,expanded]);
  if(!allReviews.length)return null;
  const review=allReviews[index];
  const Card=review.quote?"blockquote":"div";
  const isLong=review.quote.length>150||review.quote.includes("\n");
  const move=(step:number)=>setIndex(current=>(current+step+allReviews.length)%allReviews.length);
  return <div className="google-reviews" aria-label="Google customer reviews">
    <Card className="review-box" key={review.id}>
      {review.quote&&<Quote size={36} strokeWidth={1.4}/>}
      {review.rating&&<div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(Math.min(5,review.rating))}</div>}
      <p className={isLong?"review-excerpt":undefined}>{review.quote||"5-star rating on Google"}</p>
      {isLong&&<button className="review-expand" type="button" onClick={()=>setExpanded(true)}>Read full review</button>}
      <cite>{review.name}</cite>
      <a className="text-link" href={googleUrl} target="_blank" rel="noopener noreferrer">Read on Google</a>
    </Card>
    {allReviews.length>1&&<div className="review-controls" aria-label="Review controls">
      <button type="button" onClick={()=>move(-1)} aria-label="Previous review"><ArrowLeft size={18}/></button>
      <span aria-live="polite">{index+1} / {allReviews.length}{connected ? ` · ${totalReviewCount} Google reviews` : ""}</span>
      <button type="button" onClick={()=>move(1)} aria-label="Next review"><ArrowRight size={18}/></button>
    </div>}
    <Dialog open={expanded} onOpenChange={setExpanded}>
      <DialogContent className="google-review-dialog">
        <div className="review-stars" aria-label={`${review.rating??5} out of 5 stars`}>{"★".repeat(Math.min(5,review.rating??5))}</div>
        <DialogTitle>{review.name}</DialogTitle>
        <DialogDescription className="google-review-dialog-quote">{review.quote}</DialogDescription>
        <a className="google-review-dialog-link" href={googleUrl} target="_blank" rel="noopener noreferrer">Read on Google ↗</a>
      </DialogContent>
    </Dialog>
  </div>;
}
