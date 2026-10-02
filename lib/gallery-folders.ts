export const galleryFolders = [
  { id: "outdoor-hvac", label: "Outdoor HVAC" },
  { id: "radiant-floor", label: "Radiant Floor Heating" },
  { id: "heating-water", label: "Heating & Water Systems" },
  { id: "ductwork-ventilation", label: "Ductwork & Ventilation" },
  { id: "ductless", label: "Ductless Systems" },
  { id: "other", label: "Other Projects" },
] as const;

export type GalleryFolder = (typeof galleryFolders)[number]["id"];

export function folderFromImage(pathname: string, title: string): GalleryFolder {
  const stored = pathname.match(/^gallery\/([^/]+)\//)?.[1];
  if (galleryFolders.some((folder) => folder.id === stored)) return stored as GalleryFolder;

  const name = `${title} ${pathname}`.toLowerCase();
  if (/ductless/.test(name)) return "ductless";
  if (/radiant|floor/.test(name)) return "radiant-floor";
  if (/attic|ductwork|ventilation|air.distribution|rooftop/.test(name)) return "ductwork-ventilation";
  if (/outdoor|condenser|heat.pump/.test(name)) return "outdoor-hvac";
  if (/heating|heater|hydronic|furnace|water/.test(name)) return "heating-water";
  if (/hvac/.test(name)) return "outdoor-hvac";
  return "other";
}
