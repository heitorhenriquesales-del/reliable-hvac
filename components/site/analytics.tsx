"use client";

import {useEffect} from "react";
import {usePathname} from "next/navigation";

type GoogleWindow = Window & {gtag?: (...args: unknown[]) => void};

const analyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const leadLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL;
const phoneLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_PHONE_LABEL;

function event(name: string, parameters?: Record<string, string>) {
  if (analyticsId) (window as GoogleWindow).gtag?.("event", name, {...parameters, send_to: analyticsId});
}

export function trackQuoteSuccess() {
  if (typeof window === "undefined") return;
  try {
    event("generate_lead", {lead_source: "quote_form"});
    if (adsId && leadLabel) (window as GoogleWindow).gtag?.("event", "conversion", {send_to: `${adsId}/${leadLabel}`});
  } catch {
    // Tracking must never change the result shown after a successful email submission.
  }
}

export function AnalyticsClicks() {
  const pathname = usePathname();

  useEffect(() => {
    if (analyticsId) (window as GoogleWindow).gtag?.("event", "page_view", {page_path: pathname, send_to: analyticsId});
  }, [pathname]);

  useEffect(() => {
    const onClick = (eventObject: MouseEvent) => {
      const target = eventObject.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (href.startsWith("tel:")) {
        event("phone_click", {link_location: window.location.pathname});
        if (adsId && phoneLabel) (window as GoogleWindow).gtag?.("event", "conversion", {send_to: `${adsId}/${phoneLabel}`});
      } else if (href.includes("#quote-form")) {
        event("quote_button_click", {link_location: window.location.pathname});
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
