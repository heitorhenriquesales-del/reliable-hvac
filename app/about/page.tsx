import type { Metadata } from "next";
import { Photo } from "@/components/site/photo";
import { Reviews } from "@/components/site/sections";
import { Principles } from "@/components/site/principles";
import { Socials } from "@/components/site/chrome";
import { QuoteForm } from "@/components/site/quote-form";
import { photos, companyStory, site } from "@/content/site";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About & Contact",
  description: "Learn about Reliable HVAC and request dependable heating, cooling, and comfort solutions for your home or business.",
  openGraph: {
    title: "About & Contact | Reliable HVAC",
    description: "A locally owned HVAC company built on quality workmanship, honest recommendations, and dependable service.",
  },
};

export default function About() {
  return (
    <main id="main">
      <section className="page-hero about-hero">
        <div className="wrap">
          <p className="eyebrow">ABOUT RELIABLE HVAC</p>
          <h1>Built on reliability.<br /><span className="blue-text">Focused on comfort.</span></h1>
        </div>
      </section>

      <section className="wrap about-story" id="about">
        <Photo photo={photos.about} className="about-photo" />
        <div data-reveal>
          <p className="eyebrow">OUR STORY</p>
          <h2>A locally owned<br />HVAC company.</h2>
          {companyStory.map((paragraph, index) => <p key={paragraph} className={index === companyStory.length - 1 ? "story-final" : undefined}>{paragraph}</p>)}
          <p className="story-signoff">Reliable HVAC — Reliable service. Quality work. Comfort you can count on.</p>
          <a href="#contact" className="text-link">Let’s start a conversation ↗</a>
        </div>
      </section>

      <section className="wrap section">
        <p className="eyebrow">WHY CHOOSE US</p>
        <h2>What matters<br />in every project.</h2>
        <Principles />
      </section>

      <Reviews full />

      <section className="wrap social-section">
        <div>
          <p className="eyebrow">STAY CONNECTED</p>
          <h2>More of Reliable HVAC.</h2>
          <p>Follow Reliable HVAC on Instagram and Facebook or read our customer reviews on Google.</p>
        </div>
        <div>
          <Socials />
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="wrap contact-grid">
          <div className="contact-copy">
            <p className="eyebrow">LET’S GET STARTED</p>
            <h2>Let’s talk<br />about your<br /><span>comfort.</span></h2>
            <p>Have a question or a project in mind? Tell us a little about it.</p>
            <p><a className="text-link" href="tel:+17737267560">+1 (773) 726-7560</a><br /><a className="text-link" href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a><br />Mundelein, Illinois<br />Serving the greater Chicago area.</p>
            <div className="contact-line" aria-hidden="true" />
          </div>
          <QuoteForm />
        </div>
      </section>
    </main>
  );
}
