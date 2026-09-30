import type {MetadataRoute} from "next";
import {site} from "@/content/site";
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:"*",disallow:"/"},...(site.publicUrl?{sitemap:site.publicUrl+"/sitemap.xml"}:{})}}
