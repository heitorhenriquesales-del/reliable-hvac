import type { Metadata } from "next";
import { GalleryAdmin } from "@/components/site/gallery-admin";

export const metadata: Metadata = {
  title: "Gallery Management",
  robots: { index: false, follow: false },
};

export default function GalleryAdminPage() {
  return <GalleryAdmin />;
}
