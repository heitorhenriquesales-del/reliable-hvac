import type { Metadata } from "next";
import { list } from "@vercel/blob";
import { Gallery } from "@/components/site/gallery";
import { projects } from "@/content/site";

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
    .replace(/^\d+-/, "")
    .replace(/-[a-z0-9]{6,}$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "HVAC Project";
}

async function uploadedProjects() {
  if (!process.env.BLOB_STORE_ID && !process.env.BLOB_READ_WRITE_TOKEN) return [];
  try {
    const { blobs } = await list({ prefix: "gallery/", limit: 1000 });
    return blobs
      .filter((blob) => /\.(jpe?g|png|webp|avif)$/i.test(blob.pathname))
      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
      .map((blob, index) => {
        const title = titleFromPath(blob.pathname);
        return {
          id: blob.pathname,
          number: String(index + 1).padStart(2, "0"),
          title,
          description: `A Reliable HVAC project: ${title}.`,
          photo: { id: blob.pathname, src: blob.url, alt: `Reliable HVAC project: ${title}` },
        };
      });
  } catch (error) {
    console.error("Unable to load public gallery photos:", error);
    return [];
  }
}

export default async function GalleryPage() {
  const uploaded = await uploadedProjects();
  const items = [...uploaded, ...projects];

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
            <p className="heading-note">New project photos appear here as they are uploaded.</p>
          </div>
          <Gallery items={items} />
        </div>
      </section>
    </main>
  );
}
