import type { Metadata } from "next";
import "./globals.css";
import {site} from "@/content/site";
import {Header,Footer,Motion} from "@/components/site/chrome";
export const metadata:Metadata={
 metadataBase:site.publicUrl?new URL(site.publicUrl):undefined,alternates:{canonical:"/"},
 title:{default:"Reliable HVAC | Reliable Heating, Cooling & Comfort",template:"%s | Reliable HVAC"},
 description:"Explore Reliable HVAC’s heating, cooling, ventilation, radiant heating, and water-heating services. Request dependable comfort solutions for your home or business.",
 robots:{index:false,follow:false},
 openGraph:{title:"Reliable HVAC",description:"Reliable service. Quality work. Comfort you can count on.",type:"website",locale:"en_US",siteName:"Reliable HVAC"},
 twitter:{card:"summary",title:"Reliable HVAC",description:"Reliable service. Quality work. Comfort you can count on."},
 icons:{icon:"/brand/reliable-construct-cropped.png",shortcut:"/brand/reliable-construct-cropped.png"},
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Header/>{children}<Footer/><Motion/></body></html>}
