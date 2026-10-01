import { list, put } from "@vercel/blob";

const STATE_PATH = "gallery/.gallery-state.json";

export function galleryStorageConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function hiddenSeedIds() {
  const { blobs } = await list({ prefix: STATE_PATH, limit: 1 });
  const stateBlob = blobs.find((blob) => blob.pathname === STATE_PATH);
  if (!stateBlob) return [] as string[];

  const response = await fetch(stateBlob.url, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to read gallery settings.");
  const state: unknown = await response.json();
  if (!state || typeof state !== "object" || !("hiddenSeedIds" in state)) return [];
  const ids = (state as { hiddenSeedIds?: unknown }).hiddenSeedIds;
  return Array.isArray(ids) ? ids.filter((id): id is string => typeof id === "string") : [];
}

export async function hideSeedId(id: string) {
  const hidden = await hiddenSeedIds();
  if (hidden.includes(id)) return;
  await put(STATE_PATH, JSON.stringify({ hiddenSeedIds: [...hidden, id] }), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}
