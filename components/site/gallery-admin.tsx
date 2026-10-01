"use client";

import { useEffect, useState } from "react";
import { upload } from "@vercel/blob/client";
import { AlertCircle, CheckCircle2, LoaderCircle, LogOut, Trash2, UploadCloud } from "lucide-react";

type GalleryImage = { url: string; pathname: string; uploadedAt: string };

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

function uploadPath(file: File) {
  const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
  const base = file.name
    .replace(/\.[^.]+$/, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "hvac-project";
  return `gallery/${Date.now()}-${base}.${extension}`;
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
    refresh()
      .catch(() => setError("Photo storage is not set up yet."))
      .finally(() => setChecking(false));
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
    try {
      for (const [index, file] of files.entries()) {
        setMessage(`Uploading ${index + 1} of ${files.length}: ${file.name}`);
        await upload(uploadPath(file), file, {
          access: "public",
          handleUploadUrl: "/api/gallery/upload",
        });
      }
      await refresh();
      form.reset();
      setMessage(`${files.length} photo${files.length === 1 ? "" : "s"} added to the website gallery.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The photos could not be uploaded.");
    } finally {
      setBusy(false);
    }
  }

  async function removePhoto(image: GalleryImage) {
    if (!window.confirm(`Remove “${readableName(image.pathname)}” from the website gallery?`)) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: image.url }),
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
          <h1>Gallery<br />management.</h1>
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
              <div><p className="eyebrow">CLIENT GALLERY</p><h2>Manage project photos.</h2></div>
              <button type="button" className="gallery-logout" onClick={signOut}><LogOut size={17}/> Sign out</button>
            </div>
            <form className="gallery-upload-form" onSubmit={addPhotos}>
              <label htmlFor="gallery-photos">Choose project photos</label>
              <p>JPG, PNG, WebP, or AVIF. Up to 15 MB per photo. You can select several at once.</p>
              <input id="gallery-photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple disabled={busy} />
              <button className="button" type="submit" disabled={busy}>{busy ? <><LoaderCircle className="spinner" size={18}/> Uploading…</> : <><UploadCloud size={18}/> Add photos</>}</button>
            </form>
            {message && <p className="gallery-admin-feedback success"><CheckCircle2 size={18}/>{message}</p>}
            {images.length > 0 && <div className="gallery-admin-list"><h3>Photos in the public gallery ({images.length})</h3><div className="gallery-admin-grid">{images.map((image) => <article key={image.url} className="gallery-admin-card"><img src={image.url} alt={readableName(image.pathname)} loading="lazy"/><div><strong>{readableName(image.pathname)}</strong><button type="button" aria-label={`Remove ${readableName(image.pathname)}`} onClick={() => removePhoto(image)} disabled={busy}><Trash2 size={17}/></button></div></article>)}</div></div>}
            {!images.length && <p className="gallery-admin-note">No uploaded photos yet. The existing project photos remain visible on the website.</p>}
          </>
        )}
        {error && <p className="gallery-admin-feedback error"><AlertCircle size={18}/>{error}</p>}
      </section>
    </main>
  );
}
