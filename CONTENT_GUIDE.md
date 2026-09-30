# Reliable Construct — content and launch guide

## Editing
All content records and integration settings live in `content/site.ts`.
Routes: /, /services-projects, /about; contact anchor: /about#contact.
Reusable components live in components/site.

## Official logo
public/brand/reliable-construct.png is the unchanged supplied asset. Preserve its proportions and colors. The header and footer use this same file.

## Photos
Replace each photo's empty src in content/site.ts with /photos/filename.webp (place files in public/photos). Supply an accurate English alt, optional srcSet and position. Stable containers preserve layout, masks, hover and mobile behavior. Hero is eager; remaining photos are lazy. Use WebP/AVIF where suitable. Slot IDs are printed on temporary placeholders.
Hero: landscape; about: nearly square; service 1–3: landscape; project 1–6: landscape/portrait editorial crops.
Before/after section stays hidden until complete pairs are added.

## Content pending
Replace neutral service entries with confirmed names and descriptions. Add genuine project titles and details. Add the company biography to companyStory. Add only approved real reviews to reviews. Do not fabricate credentials, project counts, guarantees or experience.
Add verified HTTPS links to site.socials. Empty links render noninteractive labeled placeholders.

## Quote integration
site.quoteEndpoint is intentionally empty. The form validates input but does not send or claim success.
Configure a same-origin API endpoint or trusted HTTPS form provider. It must accept JSON {name,email,phone,project} and return HTTP 2xx with {"success":true} only after a real acceptance.
Implement server validation, request size limits, spam protection/rate limits, safe mail header handling and logging without full personal payloads. Store provider secrets only in server environment variables, never in content/site.ts.
Client supports loading, success, timeout and error states. Data is not saved to localStorage. Confirm data handling/privacy copy with the company before activation. Test actual delivery after destination is provided.

## SEO and production
Private review version deliberately uses noindex and robots disallow. Once real content, contact and domain are approved, set site.publicUrl to the canonical HTTPS URL; update metadataBase/canonical in layout and per-page metadata, switch robots to index/follow and robots rules to allow. sitemap reads publicUrl. Do not index placeholder content.
Favicon currently uses the exact official asset; a dedicated official small icon can be supplied later.

## Domain
Domain remains with GoDaddy. No DNS changes were made.
First obtain the exact existing domain and inspect existing DNS, especially MX/TXT mail entries.
Present a record-by-record proposal (action, type, host, destination, TTL, reason), based on hosting-provided values, for approval BEFORE changing or connecting anything.
Then configure apex + www, HTTPS, canonical redirects and verify both variants.
Do not buy or transfer a domain.

## Launch checklist
- Approved logo, real photos, services, company biography, reviews, social/contact information.
- Verified form delivery and spam protection.
- Privacy/data handling information appropriate to confirmed jurisdiction.
- Canonical URL, indexing and sitemap after final approval.
- Explicit approval of exact DNS record plan.
