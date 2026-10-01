import { NextResponse } from "next/server";
import {
  clearGallerySessionCookie,
  galleryAdminConfigured,
  gallerySessionCookie,
  isGalleryPasswordValid,
  makeGallerySession,
} from "@/lib/gallery-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!galleryAdminConfigured()) {
    return NextResponse.json({ error: "Gallery access is not configured." }, { status: 503 });
  }

  let password: unknown;
  try {
    password = (await request.json())?.password;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!isGalleryPasswordValid(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const session = makeGallerySession();
  if (!session) {
    return NextResponse.json({ error: "Gallery access is not configured." }, { status: 503 });
  }

  const response = NextResponse.json({ success: true });
  response.headers.set("Set-Cookie", gallerySessionCookie(session.value, session.maxAge));
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.headers.set("Set-Cookie", clearGallerySessionCookie());
  response.headers.set("Cache-Control", "no-store");
  return response;
}
