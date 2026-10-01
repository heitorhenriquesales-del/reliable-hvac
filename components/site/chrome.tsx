"use client";
/* eslint-disable @next/next/no-html-link-for-pages */
import {usePathname} from "next/navigation";
import {Fragment,useEffect,useState} from "react";
import { ArrowUpRight, Menu, X, Globe } from "lucide-react";
import {site} from "@/content/site";
export function ButtonLink({href,children,kind="",onClick}:{href:string;children:React.ReactNode;kind?:string;onClick?:React.MouseEventHandler<HTMLAnchorElement>}) {return <a className={"button "+kind} href={href} onClick={onClick}>{children}<ArrowUpRight size={18}/></a>}
export function Logo(){return <a href="/#home" className="brand" aria-label={`${site.name} home`}><img src={site.logo} alt="Reliable HVAC logo" width="1448" height="1086"/></a>}
const links=[["Home","/#home"],["Services & Projects","/services-projects#services"],["About","/about#about"],["Contact","/about#contact"]] as const;
export function Header(){
 const path=usePathname();
 const [menu,setMenu]=useState({path:"",open:false});
 const open=menu.path===path&&menu.open;
 const setOpen=(next:boolean)=>setMenu({path,open:next});
 useEffect(()=>{const close=(e:KeyboardEvent)=>{if(e.key==="Escape"){setMenu({path,open:false});document.getElementById("menu-toggle")?.focus()}};document.addEventListener("keydown",close);return()=>document.removeEventListener("keydown",close)},[path]);
 return <header className="header"><div className="header-inner"><Logo/><nav aria-label="Main navigation" id="main-nav" className={open?"main-nav open":"main-nav"}>{links.map(([label,href])=><a key={label} href={href} onClick={()=>setOpen(false)} aria-current={path===href.split("#")[0]&&label!=="Contact"?"page":undefined}>{label}</a>)}</nav><ButtonLink href="/about#quote-form" kind="header-quote" onClick={()=>setOpen(false)}>Get a quote</ButtonLink><button type="button" id="menu-toggle" className="menu-toggle" aria-label={open?"Close menu":"Open menu"} aria-expanded={open} aria-controls="main-nav" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div></header>
}
function Instagram({size=18}:{size?:number}){return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg>}
function Facebook({size=18}:{size?:number}){return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 21v-8h3l.5-3H14V8c0-.9.3-1.5 1.6-1.5H18V3.2c-.4-.1-1.8-.2-3.1-.2C11.8 3 10 4.8 10 8v2H7v3h3v8z"/></svg>}
export function Socials(){return <div className="socials">{([['instagram',Instagram,'Instagram @reliablehvac_stefan'],['facebook',Facebook,'Facebook @Reliable HVAC'],['google',Globe,'Google']] as const).map(([key,Icon,label])=>{const href=site.socials[key];if(!href)return null;return <Fragment key={key}><a className="social-link-desktop" href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}><Icon size={18}/></a><a className="social-link-mobile" href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}><Icon size={18}/></a></Fragment>})}</div>}
export function Footer(){return <footer className="footer"><div className="wrap footer-grid"><div><Logo/><p>Heating, cooling, and comfort you can count on.</p><Socials/></div><div><h3>Explore</h3>{links.map(([label,href])=><a href={href} key={label}>{label}</a>)}</div><div><h3>Our services</h3><a href="/services-projects#services">Explore all services</a><a href="/services-projects#projects">View selected work</a></div><div><h3>Have a project in mind?</h3><p>Let’s start a conversation.</p><a href="tel:+17737267560">+1 (773) 726-7560</a><a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a><p>Mundelein, Illinois</p><a className="footer-contact" href="/about#quote-form">Request a quote <ArrowUpRight size={18}/></a></div></div><div className="wrap footer-bottom"><span>© {new Date().getFullYear()} Reliable HVAC. All rights reserved.</span><span>Reliable service. Quality work.</span></div></footer>}
export function Motion(){
 const path=usePathname();const paused=false;
 useEffect(()=>{document.documentElement.classList.toggle("motion-paused",paused);return()=>document.documentElement.classList.remove("motion-paused")},[paused]);
 useEffect(()=>{
  const reduce=matchMedia("(prefers-reduced-motion: reduce)");
  const animations:Animation[]=[];let observer:IntersectionObserver|undefined;let frame=0;let carouselResumeTimer:ReturnType<typeof setTimeout>|undefined;
  const carouselInputs=Array.from(document.querySelectorAll<HTMLInputElement>(".hero-carousel .hero-slide-input"));
  const resumeCarousel=()=>{clearTimeout(carouselResumeTimer);carouselResumeTimer=setTimeout(()=>carouselInputs.forEach(input=>{input.checked=false}),6500)};
  const clear=()=>{observer?.disconnect();clearTimeout(carouselResumeTimer);carouselInputs.forEach(input=>input.removeEventListener("change",resumeCarousel));animations.forEach(a=>a.cancel());document.querySelectorAll(".motion-section-ready").forEach(el=>el.classList.remove("motion-section-ready","motion-section-in"));};
  let routeChanging=false;let routeTimer:ReturnType<typeof setTimeout>|undefined;let scrollFrame=0;let priorScrollBehavior:string|undefined;
  const stopSmoothScroll=()=>{if(scrollFrame)cancelAnimationFrame(scrollFrame);scrollFrame=0;if(priorScrollBehavior!==undefined){document.documentElement.style.scrollBehavior=priorScrollBehavior;priorScrollBehavior=undefined}};
  const smoothScrollTo=(element:HTMLElement)=>{
   stopSmoothScroll();const startY=window.scrollY;const padding=parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0;const endY=Math.max(0,startY+element.getBoundingClientRect().top-padding);const distance=endY-startY;const duration=Math.min(1050,Math.max(520,Math.abs(distance)*.58));const started=performance.now();priorScrollBehavior=document.documentElement.style.scrollBehavior;document.documentElement.style.scrollBehavior="auto";
   const step=(now:number)=>{const progress=Math.min(1,(now-started)/duration);const eased=progress<.5?4*progress**3:1-Math.pow(-2*progress+2,3)/2;window.scrollTo(0,startY+distance*eased);if(progress<1)scrollFrame=requestAnimationFrame(step);else stopSmoothScroll()};
   scrollFrame=requestAnimationFrame(step);
  };
  const interruptScroll=(event:Event)=>{if(event instanceof KeyboardEvent&&!['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key))return;stopSmoothScroll()};
  document.addEventListener("wheel",interruptScroll,{passive:true});document.addEventListener("touchstart",interruptScroll,{passive:true});document.addEventListener("keydown",interruptScroll);
  const transitionRoute=(event:MouseEvent)=>{
   if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||reduce.matches)return;
   const target=event.target;
   if(!(target instanceof Element))return;
   const link=target.closest<HTMLAnchorElement>("a[href]");
   if(!link||link.target==="_blank"||link.hasAttribute("download"))return;
   const destination=new URL(link.href,window.location.href);
   if(destination.origin!==window.location.origin)return;
   if(destination.pathname===window.location.pathname&&destination.search===window.location.search){
    if(!destination.hash)return;
    const target=document.getElementById(decodeURIComponent(destination.hash.slice(1)));
    if(!target)return;
    event.preventDefault();
    if(destination.hash!==window.location.hash)history.pushState(history.state,"",destination.href);
    if(link.classList.contains("skip-link"))target.focus({preventScroll:true});
    smoothScrollTo(target);
    return;
   }
   event.preventDefault();
   if(routeChanging)return;
   routeChanging=true;
   document.documentElement.classList.add("route-leaving");
   routeTimer=setTimeout(()=>window.location.assign(destination.href),380);
  };
  document.addEventListener("click",transitionRoute);
  const setup=()=>{
   clear();carouselInputs.forEach(input=>input.addEventListener("change",resumeCarousel));if(reduce.matches||paused)return;
   const mobile=matchMedia("(max-width: 650px)").matches;
   const animate=(el:Element,delay=0,kind="up")=>{
    const distance=mobile?9:18;
    const control=kind==="control";
    const from=kind==="photo"?"scale(1.025)":control?`translateY(${mobile?4:7}px) scale(.985)`:`translateY(${distance}px)`;
    const to=kind==="photo"?"scale(1)":"translateY(0) scale(1)";
    animations.push(el.animate([{opacity:0,transform:from},{opacity:1,transform:to}],{duration:control?(mobile?420:560):(mobile?560:820),delay,easing:"cubic-bezier(.22,.72,.25,1)",fill:"backwards"}));
   };
   const targets=document.querySelectorAll("main h1, main h2, .hero-copy > p, .hero-buttons, .hero-visual, .page-hero-bottom, .section-heading > .text-link, .intro-bottom, .service-card, .project-teaser, .gallery-card, .about-story > .photo, .about-story > div > p, .principles > div, .review-box, .cta .eyebrow, .cta .button, .contact-copy > p, .contact-line, .quote-form, .button, .menu-toggle, .socials a, .gallery-controls button");
   observer=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(!e.isIntersecting)return;observer?.unobserve(e.target);
     if(e.target.classList.contains("cta")){e.target.classList.add("motion-section-in");return;}
     const el=e.target;let delay=0;
     if(el.matches(".service-card,.gallery-card,.project-teaser,.principles > div"))delay=Array.from(el.parentElement!.children).indexOf(el)%3*(mobile?55:85);
     if(el.closest(".hero,.page-hero"))delay=el.matches("h1")?0:el.matches(".hero-visual")?200:el.matches(".hero-buttons")?160:el.matches(".button")?230:90;
     if(el.closest(".cta"))delay=el.matches("h2")?120:el.matches(".button")?240:60;
     const kind=el.matches(".hero-visual,.about-story > .photo")?"photo":el.matches(".button,.menu-toggle,.socials a,.gallery-controls button")?"control":"up";
     animate(el,delay,kind);
    });
   },{threshold:0.08});
   targets.forEach(el=>observer!.observe(el));
   document.querySelectorAll(".cta").forEach(el=>{el.classList.add("motion-section-ready");observer!.observe(el)});
  };
  setup();reduce.addEventListener("change",setup);
  const move=(e:PointerEvent)=>{if(paused||reduce.matches||e.pointerType!=="mouse"||innerWidth<900)return;cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{document.documentElement.style.setProperty("--mouse-x",((e.clientX/innerWidth-.5)*8)+"px");document.documentElement.style.setProperty("--mouse-y",((e.clientY/innerHeight-.5)*8)+"px")})};
  document.addEventListener("pointermove",move,{passive:true});
  return()=>{clear();clearTimeout(routeTimer);stopSmoothScroll();document.documentElement.classList.remove("route-leaving");reduce.removeEventListener("change",setup);document.removeEventListener("click",transitionRoute);document.removeEventListener("wheel",interruptScroll);document.removeEventListener("touchstart",interruptScroll);document.removeEventListener("keydown",interruptScroll);document.removeEventListener("pointermove",move);cancelAnimationFrame(frame);document.documentElement.style.removeProperty("--mouse-x");document.documentElement.style.removeProperty("--mouse-y")};
 },[path,paused]);
 return null;
}
