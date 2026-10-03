export type PhotoData = {
  id: string;
  src?: string;
  alt: string;
  srcSet?: string;
  position?: string;
};

const media = (id: string, file: string, alt: string, position?: string): PhotoData => ({
  id,
  src: `/media/${file}-1280.webp`,
  srcSet: `/media/${file}-640.webp 640w, /media/${file}-1280.webp 1280w`,
  alt,
  position,
});

export const site = {
  name: "Reliable HVAC",
  publicUrl: process.env.NEXT_PUBLIC_SITE_URL || "",
  quoteEndpoint: "/api/quote",
  contactEmail: "Reliableconstruct@yahoo.com",
  // Client-provided transparent Reliable HVAC logo, shared by the header, footer, and browser tab.
  logo: "/brand/reliable-construct-cropped.png",
  socials: { instagram: "https://www.instagram.com/reliablehvac_stefan?stkn=MTJwcDZpOTRtMmxxdQ==", facebook: "https://www.facebook.com/share/19WUBDieaG/?mibextid=wwXIfr", google: "https://share.google/YKYpeAJwweiRNP0IJ" },
};

export const photos = {
  hero: media("hero", "outdoor-heat-pump", "Outdoor heat pump beside a home", "55% 50%"),
  about: media("about", "attic-ductwork", "Air handler and insulated ductwork in an attic", "52% 50%"),
  furnace: media("service-furnace", "furnace-install", "Furnace installed in a home utility closet", "45% 36%"),
  cooling: media("service-cooling", "cooling-unit-garden", "Outdoor air conditioning equipment beside a home", "60% 50%"),
  radiant: media("service-radiant", "radiant-floor-room", "Hydronic radiant heating tubing installed beneath a floor", "50% 58%"),
  project1: media("project-1", "condenser-patio", "Two outdoor HVAC condenser units beside a home", "50% 53%"),
  project2: media("project-2", "radiant-floor-room", "Radiant floor heating installed in a bright room", "50% 55%"),
  project3: media("project-3", "attic-ductwork", "Insulated ductwork and HVAC equipment in an attic", "50% 50%"),
  project4: media("project-4", "rooftop-ventilation", "Rooftop ventilation equipment on a clear day", "50% 52%"),
  project5: media("project-5", "water-heater-system", "Two tank-style water heaters and connected venting", "58% 55%"),
  project6: media("project-6", "ductless-mini-split", "Wall-mounted ductless mini-split indoor unit", "50% 30%"),
};

export const heroSlides: PhotoData[] = [
  {
    id: "hero-double-condensers",
    src: "/media/hero-double-condensers-1280.webp",
    srcSet: "/media/hero-double-condensers-640.webp 640w, /media/hero-double-condensers-1280.webp 1280w",
    alt: "Two outdoor air conditioning units installed beside a home",
    position: "50% 50%",
  },
  photos.hero,
  photos.about,
  photos.radiant,
  photos.project4,
  photos.project5,
];

export type Service = {
  id: string;
  number: string;
  title: string;
  description: string;
  summary: string;
  photo?: PhotoData;
  featured?: boolean;
};

export const services: Service[] = [
  {
    id: "furnace-installation",
    number: "01",
    title: "Furnace Installation",
    description: "Stay comfortable through the coldest months with a professionally installed furnace. We install high-efficiency heating systems and make sure your equipment is properly sized and configured for reliable performance, comfort, and energy efficiency.",
    summary: "High-efficiency heating systems, properly sized and configured for reliable comfort.",
    photo: photos.furnace,
    featured: true,
  },
  {
    id: "air-conditioning-installation",
    number: "02",
    title: "Air Conditioning Installation",
    description: "Keep your home cool and comfortable with a properly designed air conditioning system. We install efficient central A/C systems with careful attention to equipment sizing, airflow, ductwork, and overall system performance.",
    summary: "Central A/C systems planned around equipment sizing, airflow, ductwork, and performance.",
    photo: photos.cooling,
    featured: true,
  },
  {
    id: "heat-pump-installation",
    number: "03",
    title: "Heat Pump Installation",
    description: "Heat pumps provide efficient heating and cooling from a single system. We install modern heat pump systems designed to provide year-round comfort while helping reduce energy consumption.",
    summary: "Modern systems that provide heating and cooling from a single setup.",
  },
  {
    id: "boiler-installation",
    number: "04",
    title: "Boiler Installation",
    description: "We install efficient boiler systems for dependable hydronic heating. Whether replacing an older boiler or installing a new system, we focus on proper sizing, piping, controls, efficiency, and even heat distribution.",
    summary: "Hydronic heating systems planned for proper sizing, controls, and even heat distribution.",
  },
  {
    id: "water-heater-installation",
    number: "05",
    title: "Water Heater Installation",
    description: "Reliable hot water is essential to every home. We install traditional tank-style water heaters and help select the right capacity and system for your household’s hot-water needs.",
    summary: "Traditional tank-style water heaters sized around your household’s hot-water needs.",
  },
  {
    id: "tankless-water-heater-installation",
    number: "06",
    title: "Tankless Water Heater Installation",
    description: "Enjoy efficient, on-demand hot water without storing a full tank of heated water. We install tankless water heaters with proper sizing, venting, gas or electrical requirements, and plumbing connections for dependable performance.",
    summary: "On-demand hot water systems with attention to sizing, venting, and connections.",
  },
  {
    id: "radiant-heat-installation",
    number: "07",
    title: "Radiant Heat Installation",
    description: "Radiant heating delivers comfortable, even warmth by circulating heated water through a properly designed system. We design and install radiant heating solutions for new construction, remodeling projects, and system upgrades.",
    summary: "Hydronic radiant heating designed for new construction, remodels, and upgrades.",
    photo: photos.radiant,
    featured: true,
  },
  {
    id: "heated-floor-installation",
    number: "08",
    title: "Heated Floor Installation",
    description: "Experience comfortable warmth directly beneath your feet. Hydronic heated-floor systems distribute heat evenly throughout the room and are an excellent option for bathrooms, kitchens, basements, additions, and whole-home applications.",
    summary: "Even hydronic warmth for bathrooms, kitchens, basements, additions, and more.",
  },
  {
    id: "snow-melt-systems",
    number: "09",
    title: "Snow Melt Systems",
    description: "Forget about constantly shoveling snow and dealing with icy surfaces. Hydronic snow-melt systems can be installed beneath driveways, sidewalks, walkways, patios, and other outdoor surfaces to automatically melt snow and ice.",
    summary: "Hydronic systems for melting snow and ice beneath outdoor surfaces.",
  },
  {
    id: "hvac-maintenance",
    number: "10",
    title: "HVAC Maintenance",
    description: "Protect your investment with routine professional maintenance. We service furnaces, air conditioners, heat pumps, boilers, water heaters, tankless systems, radiant heating, mini-splits, and other HVAC equipment to help improve efficiency, reliability, and equipment life.",
    summary: "Professional maintenance for heating, cooling, water-heating, and radiant systems.",
  },
  {
    id: "bathroom-fan-installation",
    number: "11",
    title: "Bathroom Fan Installation",
    description: "Proper bathroom ventilation helps control humidity, odors, and excess moisture. We install and replace bathroom exhaust fans and properly route exhaust ductwork to the exterior for effective ventilation.",
    summary: "Bathroom exhaust fans and ductwork routed to the exterior for effective ventilation.",
  },
  {
    id: "laundry-exhaust-dryer-vent-installation",
    number: "12",
    title: "Laundry Exhaust / Dryer Vent Installation",
    description: "Proper dryer venting is important for both performance and safety. We install and replace dryer exhaust ductwork with attention to airflow, routing, connections, and proper exterior termination.",
    summary: "Dryer exhaust ductwork installed with attention to airflow and exterior termination.",
  },
  {
    id: "duct-design-installation",
    number: "13",
    title: "Duct Design & Installation",
    description: "Great HVAC equipment needs properly designed ductwork to perform at its best. We design, fabricate, modify, and install duct systems with a focus on proper airflow, balanced comfort, efficiency, and system performance.",
    summary: "Duct systems designed and installed for airflow, balanced comfort, and performance.",
  },
  {
    id: "mini-split-installation",
    number: "14",
    title: "Mini-Split Installation",
    description: "Ductless mini-split systems provide efficient, flexible heating and cooling without traditional ductwork. They are ideal for additions, garages, basements, older homes, individual rooms, and spaces where independent temperature control is desired.",
    summary: "Flexible ductless heating and cooling for additions, garages, basements, and more.",
  },
];

export const projects = [
  { id: "project-1", number: "01", title: "Outdoor HVAC Equipment", description: "Outdoor HVAC equipment beside a home.", photo: photos.project1 },
  { id: "project-2", number: "02", title: "Radiant Floor Heating", description: "Hydronic radiant heating tubing installed across a bright room.", photo: photos.project2 },
  { id: "project-3", number: "03", title: "Ductwork & HVAC Equipment", description: "Insulated ductwork and HVAC equipment in an attic.", photo: photos.project3 },
  { id: "project-4", number: "04", title: "Rooftop Ventilation", description: "Ventilation equipment on a rooftop.", photo: photos.project4 },
  { id: "project-5", number: "05", title: "Water Heating System", description: "Tank-style water heaters with connected venting.", photo: photos.project5 },
  { id: "project-6", number: "06", title: "Ductless Mini-Split", description: "A wall-mounted ductless mini-split indoor unit.", photo: photos.project6 },
];

export type Review = { id: string; quote: string; name: string; rating?: number; project?: string };
export const reviews: Review[] = [
  { id: "google-matheus", name: "Matheus Schmidt", rating: 5, quote: "We found Stephan through a referral in a local WhatsApp group when we were looking to install a whole-house humidifier. He showed up right on time, was very respectful, and made sure to keep everything clean during the installation.\n\nThe job ended up being more complex than initially expected, but he took the time to make sure everything was done properly and working perfectly. Even with the extra work he honored the original quote.\n\nI’m very happy with the result and would definitely recommend Stephan for plumbing or HVAC work." },
  { id: "google-cristiane", name: "Cristiane Pimont Mescolin", rating: 5, quote: "Very friendly and knowledgeable technician, and very accommodating to my schedule. Definitely recommend and will have again." },
  { id: "google-priscila", name: "Priscila Salvador", rating: 5, quote: "Great service! Stefan is super professional. My system is working perfectly and I feel super confident to recommend him!" },
  { id: "google-ana", name: "Ana Tereza Formigoni Fleury", rating: 5, quote: "The service was excellent! I completely recommend it." },
  { id: "google-adriana", name: "Adriana Bueno", rating: 5, quote: "Great and reliable service!" },
  { id: "google-foundation", name: "Foundation For learning", rating: 5, quote: "Great price\n\nStefan did an amazing job at my house!\nHe installed all of the heated floor, boilers, everything! Even my garage has heated floors now.\nSuper professional, respectful, on time and honest. Highly recommend!" },
  { id: "google-stefan", name: "stefan bigiu", rating: 5, quote: "" },
];

export const companyStory = [
  "My journey began in 2018 with Reliable Construct, driven by a simple goal: to build a business where I could bring my own ideas to life, maintain high standards, and provide quality work that customers can truly rely on.",
  "As my experience and passion for the HVAC industry continued to grow, the business evolved into Reliable HVAC, allowing me to focus on what I do best—providing dependable heating, cooling, and comfort solutions for my customers.",
  "As the sole owner of Reliable HVAC, I personally stand behind the quality of my work. From the initial conversation to the completion of each project, I believe in honest recommendations, attention to detail, quality workmanship, and doing the job right the first time.",
  "Building my own company has given me the opportunity to set high standards, create solutions based on each customer’s individual needs, and, most importantly, make a difference in the HVAC industry through honest and dependable service.",
  "Every project represents my name and reputation, and I take pride in earning my customers’ trust one job at a time.",
];

export const beforeAfter: { id: string; title: string; before: PhotoData; after: PhotoData }[] = [];
