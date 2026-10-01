import { NextResponse } from "next/server";
import { site } from "@/content/site";

export const runtime = "nodejs";

type QuoteRequest = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  project?: unknown;
};

const clean = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

export async function POST(request: Request) {
  let body: QuoteRequest;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
    }
    body = parsed as QuoteRequest;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 254);
  const phone = clean(body.phone, 40);
  const project = clean(body.project, 5000);
  if (
    !name ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !project
  ) {
    return NextResponse.json({ success: false, error: "Please check the required fields." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error("Quote email delivery is not configured.");
    return NextResponse.json({ success: false, error: "Email delivery is not configured." }, { status: 503 });
  }

  const delivery = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [site.contactEmail],
      reply_to: email,
      subject: `Website quote request from ${name}`,
      text: [
        "New quote request from the Reliable HVAC website",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
        "",
        "Project details:",
        project,
      ].join("\n"),
    }),
  });

  if (!delivery.ok) {
    console.error("Quote email provider returned an error:", delivery.status);
    return NextResponse.json({ success: false, error: "Email could not be delivered." }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
