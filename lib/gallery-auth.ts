import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const GALLERY_SESSION_COOKIE = "reliable_gallery_session";
const SESSION_SECONDS = 60 * 60 * 12;

function configuredPassword() {
  const password = process.env.GALLERY_ADMIN_PASSWORD;
  return password && password.length >= 20 ? password : null;
}

function safeEqual(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

export function isGalleryPasswordValid(candidate: unknown) {
  const password = configuredPassword();
  return !!password && typeof candidate === "string" && safeEqual(candidate, password);
}

export function makeGallerySession() {
  const password = configuredPassword();
  if (!password) return null;
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const signature = createHmac("sha256", password).update(String(expires)).digest("base64url");
  return { value: `${expires}.${signature}`, maxAge: SESSION_SECONDS };
}

export function hasGallerySession(request: Request) {
  const password = configuredPassword();
  if (!password) return false;

  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${GALLERY_SESSION_COOKIE}=`));
  if (!cookie) return false;

  const value = cookie.slice(GALLERY_SESSION_COOKIE.length + 1);
  const separator = value.indexOf(".");
  if (separator < 1) return false;
  const expires = value.slice(0, separator);
  const signature = value.slice(separator + 1);
  if (!/^\d+$/.test(expires) || Number(expires) <= Math.floor(Date.now() / 1000)) return false;

  const expected = createHmac("sha256", password).update(expires).digest("base64url");
  return safeEqual(signature, expected);
}

export function gallerySessionCookie(value: string, maxAge: number) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${GALLERY_SESSION_COOKIE}=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${secure}`;
}

export function clearGallerySessionCookie() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${GALLERY_SESSION_COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`;
}

export function galleryAdminConfigured() {
  return configuredPassword() !== null;
}
