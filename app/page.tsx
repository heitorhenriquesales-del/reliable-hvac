import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Photo } from "@/components/site/photo";
import { ButtonLink } from "@/components/site/chrome";
import { SectionHeading, Services, Reviews, CTA } from "@/components/site/sections";
import { heroSlides, projects } from "@/content/site";

export default function Home() {
  return (
    <main id="main">
      <section className="hero" id="home">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><span className="small-rule" /> RELIABLE HVAC</p>
            <h1>Comfort that<br /><span>fits your space.</span></h1>
            <p className="hero-description">Dependable heating, cooling, and comfort solutions for your home or business.</p>
            <div className="hero-buttons">
              <ButtonLink href="/about#quote-form">Request a quote</ButtonLink>
              <a href="/services-projects#services" className="text-link">View our services <ArrowUpRight size={18} /></a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-blue" aria-hidden="true" />
            <div className="photo hero-photo hero-carousel" role="region" aria-roledescription="carousel" aria-label="Reliable HVAC project photos" aria-live="off">
              {heroSlides.map((slide, index) => (
                <input key={`selector-${slide.id}`} className="hero-slide-input" type="radio" name="hero-photo" id={`hero-slide-${index + 1}`} aria-label={`Show photo ${index + 1} of ${heroSlides.length}`} />
              ))}
              {heroSlides.map((slide, index) => (
                <Photo key={slide.id} photo={slide} priority={index === 0} className={`hero-slide hero-slide-${index + 1}`} />
              ))}
              {heroSlides.map((slide, index) => {
                const previousId = `hero-slide-${((index + heroSlides.length - 1) % heroSlides.length) + 1}`;
                const nextId = `hero-slide-${((index + 1) % heroSlides.length) + 1}`;
                return (
                  <div key={`controls-${slide.id}`} className={`hero-slide-controls hero-slide-controls-${index + 1}`} aria-hidden="true">
                    <label className="hero-slide-arrow previous" htmlFor={previousId} title="Previous photo"><ChevronLeft size={20} aria-hidden="true" /></label>
                    <label className="hero-slide-arrow next" htmlFor={nextId} title="Next photo"><ChevronRight size={20} aria-hidden="true" /></label>
                  </div>
                );
              })}
              <div className="hero-slide-dots" role="group" aria-label="Choose a project photo">
                {heroSlides.map((slide, index) => (
                  <label key={`dot-${slide.id}`} className="hero-slide-dot" htmlFor={`hero-slide-${index + 1}`} title={`Photo ${index + 1}`} />
                ))}
              </div>
            </div>
            <div className="hero-red" aria-hidden="true"><div className="radial" /></div>
            <span className="visual-caption">COMFORT, BUILT AROUND YOU.</span>
            <span className="visual-index">01–06 — RELIABLE HVAC</span>
          </div>
        </div>
        <div className="wrap hero-bottom">
          <a href="#intro">Explore Reliable HVAC <ArrowDown size={16} /></a>
          <span>RELIABLE SERVICE. QUALITY WORK.</span>
        </div>
      </section>

      <div className="brand-ribbon" aria-hidden="true"><div><span>HEATING & COOLING</span><span className="ribbon-star">✳</span><span>QUALITY WORKMANSHIP</span><span className="ribbon-star">✳</span><span>COMFORT YOU CAN COUNT ON</span><span className="ribbon-star">✳</span><span>HEATING & COOLING</span><span className="ribbon-star">✳</span><span>QUALITY WORKMANSHIP</span></div></div>

      <section className="wrap intro section" id="intro" data-reveal>
        <div className="intro-heading">
          <p className="eyebrow"><span className="small-rule" aria-hidden="true" />BUILT ON RELIABILITY</p>
          <h2>Comfort you<br /><span className="blue-text">can count on.</span></h2>
        </div>
        <div className="intro-bottom">
          <p>A locally owned HVAC company built on quality workmanship, honest recommendations, and dependable service.</p>
          <a href="/about#about" className="text-link">Meet Reliable HVAC <ArrowUpRight size={18} /></a>
        </div>
      </section>

      <section className="service-section section">
        <div className="wrap">
          <SectionHeading eyebrow="WHAT WE DO" title={<>Heating, cooling,<br />and more.</>}>
            <a className="text-link" href="/services-projects#services">All 14 services <ArrowUpRight size={18} /></a>
          </SectionHeading>
          <Services compact />
        </div>
      </section>

      <section className="wrap section">
        <SectionHeading eyebrow="OUR WORK" title={<>A closer look at<br />our HVAC work.</>}>
          <a className="text-link" href="/services-projects#projects">Explore the gallery <ArrowUpRight size={18} /></a>
        </SectionHeading>
        <div className="home-gallery">
          {projects.slice(0, 2).map((project) => <a href="/services-projects#projects" className="project-teaser" data-reveal key={project.id}>
            <Photo photo={project.photo} />
            <span>{project.title} <ArrowUpRight size={20} /></span>
          </a>)}
        </div>
      </section>

      <Reviews />
      <CTA />
    </main>
  );
}
