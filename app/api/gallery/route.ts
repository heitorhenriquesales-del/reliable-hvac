import { del, list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { hasGallerySession } from "@/lib/gallery-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!hasGallerySession(request)) {
    return NextResponse.json({ error: "Sign in to manage the gallery." }, { status: 401 });
  }

  try {
    const { blobs } = await list({ prefix: "gallery/", limit: 1000 });
    const items = blobs
      .filter((blob) => /\.(jpe?g|png|webp|avif)$/i.test(blob.pathname))
      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
      .map((blob) => ({
        url: blob.url,
        pathname: blob.pathname,
        uploadedAt: blob.uploadedAt.toISOString(),
      }));
    return NextResponse.json({ items }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Unable to list gallery images:", error);
    return NextResponse.json({ error: "Gallery storage is not configured yet." }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  if (!hasGallerySession(request)) {
    return NextResponse.json({ error: "Sign in to manage the gallery." }, { status: 401 });
  }

  let url: unknown;
  try {
    url = (await request.json())?.url;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (typeof url !== "string") {
    return NextResponse.json({ error: "Select an image to remove." }, { status: 400 });
  }

  try {
    const { blobs } = await list({ prefix: "gallery/", limit: 1000 });
    if (!blobs.some((blob) => blob.url === url)) {
      return NextResponse.json({ error: "Image not found." }, { status: 404 });
    }
    await del(url);
    return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Unable to remove gallery image:", error);
    return NextResponse.json({ error: "The image could not be removed." }, { status: 503 });
  }
}
