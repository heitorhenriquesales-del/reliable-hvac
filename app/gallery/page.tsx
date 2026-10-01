import type { Metadata } from "next";
import { list } from "@vercel/blob";
import { Gallery } from "@/components/site/gallery";
import { gallerySeed } from "@/content/gallery-seed";
import { galleryStorageConfigured, hiddenSeedIds } from "@/lib/gallery-storage";
import { ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  alternates: { canonical: "/gallery" },
  title: "Project Gallery",
  description: "Photos of Reliable HVAC heating, cooling, and installation projects.",
  openGraph: {
    title: "Project Gallery | Reliable HVAC",
    description: "Browse project photos from Reliable HVAC.",
  },
};

function titleFromPath(pathname: string) {
  return pathname
    .split("/")
    .pop()
    ?.replace(/\.[^.]+$/, "")
    .replace(/-(640|1280)$/i, "")
    .replace(/^\d+-/, "")
    .replace(/-[a-z0-9]{6,}$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "HVAC Project";
}

async function uploadedProjects() {
  if (!galleryStorageConfigured()) return [];
  try {
    const { blobs } = await list({ prefix: "gallery/", limit: 1000 });
    const imageBlobs = blobs.filter((blob) => /\.(jpe?g|png|webp|avif)$/i.test(blob.pathname));
    return imageBlobs
      .filter((blob) => !/-640\.webp$/i.test(blob.pathname) || !imageBlobs.some((candidate) => candidate.pathname === blob.pathname.replace(/-640\.webp$/i, "-1280.webp")))
      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
      .map((blob, index) => {
        const title = titleFromPath(blob.pathname);
        const thumbnail = blob.pathname.match(/-1280\.webp$/i)
          ? imageBlobs.find((candidate) => candidate.pathname === blob.pathname.replace(/-1280\.webp$/i, "-640.webp"))
          : undefined;
        return {
          id: blob.pathname,
          number: String(index + 1).padStart(2, "0"),
          title,
          description: `A Reliable HVAC project: ${title}.`,
          photo: {
            id: blob.pathname,
            src: blob.url,
            srcSet: thumbnail ? `${thumbnail.url} 640w, ${blob.url} 1280w` : undefined,
            alt: `Reliable HVAC project: ${title}`,
          },
        };
      });
  } catch (error) {
    console.error("Unable to load public gallery photos:", error);
    return [];
  }
}

async function visibleSeedProjects() {
  if (!galleryStorageConfigured()) return gallerySeed;
  try {
    const hidden = new Set(await hiddenSeedIds());
    return gallerySeed.filter((item) => !hidden.has(item.id));
  } catch (error) {
    console.error("Unable to load gallery settings:", error);
    return gallerySeed;
  }
}

export default async function GalleryPage() {
  const [uploaded, seeded] = await Promise.all([uploadedProjects(), visibleSeedProjects()]);
  const items = [...uploaded, ...seeded].map((item, index) => ({
    ...item,
    number: String(index + 1).padStart(2, "0"),
  }));

  return (
    <main id="main">
      <section className="page-hero blue-hero">
        <div className="wrap">
          <p className="eyebrow">RELIABLE HVAC PROJECTS</p>
          <h1>Work built<br />for comfort.</h1>
          <div className="page-hero-bottom"><p>Browse HVAC installations and project details.</p></div>
        </div>
        <div className="page-orbit" aria-hidden="true" />
      </section>
      <section className="gallery-section section">
        <div className="wrap">
          <div className="section-heading">
            <div><p className="eyebrow">PROJECT GALLERY</p><h2>A closer look.</h2></div>
            <div className="gallery-heading-side">
              <p className="heading-note">New project photos appear here as they are uploaded.</p>
              <a className="gallery-admin-link" href="/gallery-admin">Client Access <ArrowUpRight size={16} aria-hidden="true" /></a>
            </div>
          </div>
          <Gallery items={items} />
        </div>
      </section>
    </main>
  );
}
