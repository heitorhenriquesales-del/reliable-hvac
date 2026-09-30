"use client";
import {useState} from "react";
import {ArrowUpRight,ArrowLeft,ArrowRight} from "lucide-react";
import {Dialog,DialogContent,DialogTitle,DialogDescription} from "@/components/ui/dialog";
import {projects,beforeAfter} from "@/content/site";
import {Photo} from "./photo";
export function Gallery(){
 const[index,setIndex]=useState<number|null>(null);const selected=index===null?null:projects[index];
 return <><div className="project-gallery">{projects.map((p,i)=><button type="button" className="gallery-card" key={p.id} onClick={()=>setIndex(i)} aria-label={`Open ${p.title} project preview`} data-reveal><Photo photo={p.photo}/><span className="gallery-caption"><span><small>PROJECT / {p.number}</small><strong>{p.title}</strong></span><ArrowUpRight size={22}/></span></button>)}</div><Dialog open={selected!==null} onOpenChange={v=>{if(!v)setIndex(null)}}><DialogContent className="project-dialog">{selected&&<><DialogTitle>Project preview {selected.number}</DialogTitle><DialogDescription>{selected.description}</DialogDescription><Photo photo={selected.photo}/><div className="gallery-controls"><button type="button" onClick={()=>setIndex(((index??0)+projects.length-1)%projects.length)} aria-label="Previous project"><ArrowLeft/>Previous</button><span>{(index??0)+1} / {projects.length}</span><button type="button" onClick={()=>setIndex(((index??0)+1)%projects.length)} aria-label="Next project">Next<ArrowRight/></button></div></>}</DialogContent></Dialog></>
}
export function BeforeAfter(){if(!beforeAfter.length)return null;return <section className="wrap section"><p className="eyebrow">THE TRANSFORMATION</p><h2>Before & after.</h2>{beforeAfter.map(p=><article key={p.id}><h3>{p.title}</h3><div className="before-after"><div><Photo photo={p.before}/><p>Before</p></div><div><Photo photo={p.after}/><p>After</p></div></div></article>)}</section>}
