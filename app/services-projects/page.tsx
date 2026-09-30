import type { Metadata } from "next";
import { Services, SectionHeading, CTA } from "@/components/site/sections";
import { Gallery, BeforeAfter } from "@/components/site/gallery";

export const metadata: Metadata = {
  alternates: { canonical: "/services-projects" },
  title: "Services & Projects",
  description: "Explore Reliable HVAC’s heating, cooling, ventilation, radiant heating, and water-heating services, along with selected work photos.",
  openGraph: {
    title: "Services & Projects | Reliable HVAC",
    description: "Dependable HVAC solutions for your home or business, from installations to custom ductwork and radiant heating.",
  },
};

export default function ServicesPage() {
  return (
    <main id="main">
      <section className="page-hero blue-hero">
        <div className="wrap">
          <p className="eyebrow">RELIABLE HVAC SERVICES</p>
          <h1>Comfort for every<br />season and space.</h1>
          <div className="page-hero-bottom">
            <p>Heating, cooling, ventilation, and hydronic solutions for your home or business.</p>
            <nav aria-label="On this page"><a href="#services">Our services ↓</a><a href="#projects">Selected work ↓</a></nav>
          </div>
        </div>
        <div className="page-orbit" aria-hidden="true" />
      </section>

      <section className="wrap section services-page-section" id="services">
        <SectionHeading eyebrow="OUR HVAC SERVICES" title={<>Solutions built<br />around your space.</>} />
        <p className="services-intro">From heating and cooling installations to custom ductwork and radiant heating, we provide dependable HVAC solutions designed around your home or business. Our goal is simple: comfort, efficiency, quality workmanship, and systems built to last.</p>
        <Services />
      </section>

      <section className="gallery-section section" id="projects">
        <div className="wrap">
          <SectionHeading eyebrow="SELECTED WORK" title={<>A closer look.</>}>
            <p className="heading-note">Browse photos of HVAC equipment and installations.</p>
          </SectionHeading>
          <Gallery />
        </div>
      </section>
      <BeforeAfter />
      <CTA />
    </main>
  );
}
