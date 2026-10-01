import type { PhotoData } from "@/content/site";

type GallerySeed = {
  id: string;
  number: string;
  title: string;
  description: string;
  photo: PhotoData;
};

const seed = (slug: string, title: string, alt: string): GallerySeed => ({
  id: `seed-${slug}`,
  number: "",
  title,
  description: "Reliable HVAC project photo.",
  photo: {
    id: `seed-${slug}`,
    src: `/gallery/${slug}-1280.webp`,
    srcSet: `/gallery/${slug}-640.webp 640w, /gallery/${slug}-1280.webp 1280w`,
    alt,
  },
});

export const gallerySeed: GallerySeed[] = [
  seed("outdoor-hvac-unit", "Outdoor HVAC Unit", "Outdoor HVAC equipment installed beside a home."),
  seed("outdoor-hvac-installation", "Outdoor HVAC Installation", "An outdoor HVAC unit installed beside home siding."),
  seed("radiant-floor-heating", "Radiant Floor Heating", "Radiant heating tubing laid across a floor during installation."),
  seed("heating-system-manifold", "Heating System Manifold", "A hydronic heating manifold and connected piping."),
  seed("heating-equipment", "Heating Equipment", "Residential heating equipment with connected piping."),
  seed("outdoor-condenser", "Outdoor Condenser", "An outdoor HVAC condenser installed beside a home."),
  seed("heating-water-system", "Heating and Water System", "Heating and water heating equipment in a utility area."),
  seed("outdoor-hvac-system", "Outdoor HVAC System", "Outdoor HVAC equipment installed beside a home."),
  seed("hydronic-heating-system", "Hydronic Heating System", "A hydronic heating and hot water system in a utility space."),
  seed("outdoor-heat-pump", "Outdoor Heat Pump", "An outdoor heat pump beside a home."),
  seed("radiant-floor-installation", "Radiant Floor Installation", "Radiant floor tubing installed across a bright room."),
  seed("outdoor-hvac-equipment", "Outdoor HVAC Equipment", "Two outdoor HVAC units beside a home."),
  seed("attic-hvac-system", "Attic HVAC System", "Air handling equipment and ductwork installed in an attic."),
  seed("outdoor-hvac-project", "Outdoor HVAC Project", "An outdoor HVAC unit installed beside a brick home."),
  seed("heating-system-installation", "Heating System Installation", "Heating equipment and connected venting in a utility room."),
  seed("attic-ductwork", "Attic Ductwork", "Ductwork and air handling equipment installed in an attic."),
  seed("water-heating-equipment", "Water Heating Equipment", "Hot water storage tanks and connected piping."),
  seed("rooftop-ventilation", "Rooftop Ventilation", "Rooftop ventilation pipes and equipment under a clear sky."),
  seed("hvac-system-installation", "HVAC System Installation", "Heating and cooling equipment with connected lines."),
  seed("rooftop-hvac-equipment", "Rooftop HVAC Equipment", "Outdoor HVAC equipment installed on a rooftop."),
  seed("outdoor-hvac-install", "Outdoor HVAC Installation", "An outdoor HVAC condenser beside a wooden fence."),
  seed("heating-equipment-install", "Heating Equipment Installation", "Heating equipment and piping installed in a utility closet."),
  seed("indoor-air-distribution", "Indoor Air Distribution", "Ceiling-mounted air distribution equipment in a finished room."),
  seed("water-heater-installation", "Water Heater Installation", "A water heater installed in a utility area."),
  seed("furnace-installation", "Furnace Installation", "A furnace and connected venting in a utility room."),
  seed("ductless-outdoor-unit", "Ductless Outdoor Unit", "An outdoor ductless HVAC unit beside a home."),
  seed("ductless-indoor-unit", "Ductless Indoor Unit", "A wall-mounted ductless indoor unit."),
  seed("heating-system", "Heating System", "Heating equipment installed in a finished utility closet."),
].map((item, index) => ({ ...item, number: String(index + 1).padStart(2, "0") }));
