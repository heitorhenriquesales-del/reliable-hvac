import type {MetadataRoute} from "next";
import {site} from "@/content/site";
export default function sitemap():MetadataRoute.Sitemap{return site.publicUrl?["","/services-projects","/about"].map(path=>({url:site.publicUrl+path,changeFrequency:"monthly",priority:path?0.8:1})):[]}
