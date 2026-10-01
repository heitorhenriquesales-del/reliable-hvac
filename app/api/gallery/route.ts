import { del, list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { hasGallerySession } from "@/lib/gallery-auth";
import { gallerySeed } from "@/content/gallery-seed";
import { galleryStorageConfigured, hideSeedId, hiddenSeedIds } from "@/lib/gallery-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!hasGallerySession(request)) {
    return NextResponse.json({ error: "Sign in to manage the gallery." }, { status: 401 });
  }

  try {
    if (!galleryStorageConfigured()) {
      return NextResponse.json({ error: "Photo storage is not configured yet." }, { status: 503 });
    }
    const hiddenSeeds = new Set(await hiddenSeedIds());
    const { blobs } = await list({ prefix: "gallery/", limit: 1000 });
    const imageBlobs = blobs.filter((blob) => /\.(jpe?g|png|webp|avif)$/i.test(blob.pathname));
    const uploaded = imageBlobs
      .filter((blob) => !/-640\.webp$/i.test(blob.pathname) || !imageBlobs.some((candidate) => candidate.pathname === blob.pathname.replace(/-640\.webp$/i, "-1280.webp")))
      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
      .map((blob) => {
        const thumbnail = blob.pathname.match(/-1280\.webp$/i)
          ? imageBlobs.find((candidate) => candidate.pathname === blob.pathname.replace(/-1280\.webp$/i, "-640.webp"))
          : undefined;
        return {
          id: blob.pathname,
          source: "blob" as const,
          url: blob.url,
          thumbnailUrl: thumbnail?.url || blob.url,
          pathname: blob.pathname,
          uploadedAt: blob.uploadedAt.toISOString(),
          title: blob.pathname.split("/").pop()?.replace(/\.[^.]+$/, "").replace(/-(640|1280)$/i, "") || "HVAC Project",
        };
      });
    const seeded = gallerySeed
      .filter((item) => !hiddenSeeds.has(item.id))
      .map((item) => ({
        id: item.id,
        source: "seed" as const,
        url: item.photo.src || "",
        pathname: item.photo.src || item.id,
        uploadedAt: "",
        title: item.title,
      }));
    const items = [...seeded, ...uploaded];
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

  let id: unknown;
  let source: unknown;
  try {
    const body = await request.json();
    id = body?.id;
    source = body?.source;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (typeof id !== "string" || (source !== "seed" && source !== "blob")) {
    return NextResponse.json({ error: "Select an image to remove." }, { status: 400 });
  }

  try {
    if (!galleryStorageConfigured()) {
      return NextResponse.json({ error: "Photo storage is not configured yet." }, { status: 503 });
    }
    if (source === "seed") {
      if (!gallerySeed.some((item) => item.id === id)) {
        return NextResponse.json({ error: "Image not found." }, { status: 404 });
      }
      await hideSeedId(id);
      return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
    }

    const { blobs } = await list({ prefix: "gallery/", limit: 1000 });
    const blob = blobs.find((item) => item.pathname === id && /\.(jpe?g|png|webp|avif)$/i.test(item.pathname));
    if (!blob) {
      return NextResponse.json({ error: "Image not found." }, { status: 404 });
    }
    const uploadId = blob.pathname.match(/^gallery\/([a-z0-9-]+)\//i)?.[1];
    if (uploadId) {
      const folder = `gallery/${uploadId}/`;
      const variants = blobs.filter((item) => item.pathname.startsWith(folder) && /\.(jpe?g|png|webp|avif)$/i.test(item.pathname));
      for (const variant of variants) await del(variant.url);
      const { blobs: originals } = await list({ prefix: `gallery-originals/${uploadId}/`, limit: 10 });
      for (const original of originals) await del(original.url);
    } else {
      await del(blob.url);
    }
    return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Unable to remove gallery image:", error);
    return NextResponse.json({ error: "The image could not be removed." }, { status: 503 });
  }
}
