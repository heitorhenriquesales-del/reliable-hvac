"use client";

import { useEffect, useState } from "react";
import { upload } from "@vercel/blob/client";
import { AlertCircle, CheckCircle2, LoaderCircle, LogOut, Trash2, UploadCloud } from "lucide-react";

type GalleryImage = { id: string; source: "seed" | "blob"; url: string; thumbnailUrl?: string; pathname: string; uploadedAt: string; title: string };

function readableName(pathname: string) {
  return pathname
    .split("/")
    .pop()
    ?.replace(/\.[^.]+$/, "")
    .replace(/^\d+-/, "")
    .replace(/-[a-z0-9]{6,}$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "HVAC Project";
}

function safeBaseName(file: File) {
  return file.name
    .replace(/\.[^.]+$/, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "hvac-project";
}

function uploadPath(id: string, file: File, width?: 640 | 1280, original = false) {
  if (original) {
    const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
    return `gallery-originals/${id}/original.${extension}`;
  }
  return `gallery/${id}/${safeBaseName(file)}-${width}.webp`;
}

async function makeWebpVariants(file: File) {
  const bitmap = await createImageBitmap(file);
  try {
    const variants: File[] = [];
    for (const width of [640, 1280] as const) {
      const scale = Math.min(1, width / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("This photo could not be prepared. Please try another image.");
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.82));
      if (!blob || blob.type !== "image/webp") throw new Error("This browser could not optimize the photo. Please try JPG or PNG in an up-to-date browser.");
      variants.push(new File([blob], `${safeBaseName(file)}-${width}.webp`, { type: "image/webp", lastModified: Date.now() }));
    }
    return variants;
  } finally {
    bitmap.close();
  }
}

export function GalleryAdmin() {
  const [password, setPassword] = useState("");
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function refresh() {
    const response = await fetch("/api/gallery", { cache: "no-store" });
    if (response.status === 401) {
      setAuthenticated(false);
      return false;
    }
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not load the gallery.");
    setImages(data.items);
    setAuthenticated(true);
    return true;
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      refresh()
        .catch(() => setError("Photo storage is not set up yet."))
        .finally(() => setChecking(false));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/gallery/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not sign in.");
      await refresh();
      setPassword("");
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await fetch("/api/gallery/session", { method: "DELETE" });
    setAuthenticated(false);
    setImages([]);
    setMessage("");
  }

  async function addPhotos(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("photos");
    const files = input instanceof HTMLInputElement ? Array.from(input.files ?? []) : [];
    if (!files.length) {
      setError("Choose at least one JPG, PNG, WebP, or AVIF image.");
      return;
    }
    const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
    const invalid = files.find((file) => !allowed.has(file.type) || file.size > 15 * 1024 * 1024);
    if (invalid) {
      setError(`${invalid.name} must be JPG, PNG, WebP, or AVIF and no larger than 15 MB.`);
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");
    let uploadedCount = 0;
    try {
      for (const [index, file] of files.entries()) {
        setMessage(`Preparing photo ${index + 1} of ${files.length}: ${file.name}`);
        const optimizedVariants = await makeWebpVariants(file);
        const id = crypto.randomUUID();
        setMessage(`Uploading ${index + 1} of ${files.length}: ${file.name}`);
        let publicImage: Awaited<ReturnType<typeof upload>> | null = null;
        try {
          for (const [variantIndex, optimized] of optimizedVariants.entries()) {
            publicImage = await upload(uploadPath(id, file, variantIndex === 0 ? 640 : 1280), optimized, {
              access: "public",
              handleUploadUrl: "/api/gallery/upload",
            });
          }
          await upload(uploadPath(id, file, undefined, true), file, {
            access: "public",
            handleUploadUrl: "/api/gallery/upload",
          });
        } catch (cause) {
          if (publicImage) {
            await fetch("/api/gallery", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: publicImage.pathname, source: "blob" }),
            }).catch(() => undefined);
          }
          throw cause;
        }
        uploadedCount += 1;
      }
      await refresh();
      form.reset();
      setMessage("Photos successfully added to the gallery.");
    } catch (cause) {
      if (uploadedCount > 0) {
        await refresh().catch(() => undefined);
        setMessage("Photos successfully added to the gallery.");
      }
      setError(cause instanceof Error ? cause.message : "The photos could not be uploaded.");
    } finally {
      setBusy(false);
    }
  }

  async function removePhoto(image: GalleryImage) {
    if (!window.confirm("Are you sure you want to remove this photo from the website gallery?")) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: image.id, source: image.source }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The photo could not be removed.");
      await refresh();
      setMessage("Photo removed from the gallery.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The photo could not be removed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="gallery-admin-page">
      <section className="page-hero blue-hero">
        <div className="wrap">
          <p className="eyebrow">RELIABLE HVAC</p>
          <h1>Gallery<br />Management.</h1>
          <div className="page-hero-bottom"><p>Add project photos to the public website gallery.</p></div>
        </div>
        <div className="page-orbit" aria-hidden="true" />
      </section>
      <section className="wrap section gallery-admin-content">
        {checking ? <p className="gallery-admin-note">Checking access…</p> : !authenticated ? (
          <form className="gallery-login" onSubmit={signIn}>
            <p className="eyebrow">CLIENT ACCESS</p>
            <h2>Sign in to manage photos.</h2>
            <label htmlFor="gallery-password">Password</label>
            <input id="gallery-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <button className="button" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
          </form>
        ) : (
          <>
            <div className="gallery-admin-heading">
              <div><p className="eyebrow">CLIENT GALLERY</p><h2>Manage Project Photos</h2><p className="gallery-admin-intro">Upload new project photos or remove images currently displayed in the public gallery.</p></div>
              <button type="button" className="gallery-logout" onClick={signOut}><LogOut size={17}/> Sign out</button>
            </div>
            <form className="gallery-upload-form" onSubmit={addPhotos}>
              <label htmlFor="gallery-photos">Choose Project Photos</label>
              <p>JPG, PNG, WebP, or AVIF. You can select several photos at once. Maximum 15 MB per photo.</p>
              <input id="gallery-photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple disabled={busy} />
              <button className="button" type="submit" disabled={busy}>{busy ? <><LoaderCircle className="spinner" size={18}/> Uploading…</> : <><UploadCloud size={18}/> Add Photos</>}</button>
            </form>
            {message && <p className={`gallery-admin-feedback ${message.startsWith("Uploading") || message.startsWith("Preparing") ? "progress" : "success"}`} role="status" aria-live="polite">{message.startsWith("Uploading") || message.startsWith("Preparing") ? <LoaderCircle className="spinner" size={18}/> : <CheckCircle2 size={18}/>}<span>{message}</span></p>}
            <div className="gallery-admin-list"><h3>Photos in the public gallery ({images.length})</h3>{images.length > 0 ? <div className="gallery-admin-grid">{images.map((image) => <article key={image.id} className="gallery-admin-card"><img src={image.thumbnailUrl || image.url} alt={image.title} loading="lazy"/><div><strong>{image.title || readableName(image.pathname)}</strong><button type="button" onClick={() => removePhoto(image)} disabled={busy}><Trash2 size={17}/><span>Remove Photo</span></button></div></article>)}</div> : <p className="gallery-admin-note">No photos are currently displayed in the public gallery.</p>}</div>
          </>
        )}
        {error && <p className="gallery-admin-feedback error" role="alert"><AlertCircle size={18}/>{error}</p>}
      </section>
    </main>
  );
}
