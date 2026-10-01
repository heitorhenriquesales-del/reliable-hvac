import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { hasGallerySession } from "@/lib/gallery-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid upload request." }, { status: 400 });
  }

  try {
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!hasGallerySession(request)) {
          throw new Error("Sign in to upload gallery photos.");
        }
        const publicPhotoPath = /^gallery\/[a-z0-9-]+\/[a-z0-9-]+-(640|1280)\.webp$/i.test(pathname);
        const originalPhotoPath = /^gallery-originals\/[a-z0-9-]+\/original\.(jpe?g|png|webp|avif)$/i.test(pathname);
        if (!publicPhotoPath && !originalPhotoPath) {
          throw new Error("Invalid gallery image path.");
        }
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
          maximumSizeInBytes: 15 * 1024 * 1024,
          addRandomSuffix: false,
          cacheControlMaxAge: 31536000,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.info("Gallery image uploaded:", blob.pathname);
      },
    });
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
