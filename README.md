# Reliable HVAC

Current Reliable HVAC site source, prepared for GitHub and Vercel. The page content, styling, images, and interactions are carried over from the latest ChatGPT Sites publication.

## Run locally

Requires Node.js 22.13 or newer and pnpm 11.25.0.

```sh
pnpm install
pnpm dev
```

## Build

```sh
pnpm build
pnpm start
```

## Deploy on Vercel

1. Create a GitHub repository and upload the contents of this ZIP to its root.
2. Import that repository in Vercel. The framework is configured as Next.js, and Vercel can use the included pnpm lockfile.
3. Set `NEXT_PUBLIC_SITE_URL` in Vercel to the final public URL (for example, the Vercel URL or the approved preview domain).

The quote form currently displays the site's existing phone fallback because no quote endpoint is configured in the current version.
