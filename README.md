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
4. Configure `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in Vercel. The sender address must be verified with Resend; quote requests are delivered to `Reliableconstruct@yahoo.com`.

The quote form posts directly to the server-side `/api/quote` endpoint. On success, the visitor sees an on-page confirmation; no email app is opened. If email delivery is not configured or fails, the form reports that it was not sent and keeps the entered details.

## Client photo gallery

- `/gallery` starts with a curated set of real Reliable HVAC photos supplied in the project archives. Images are optimized WebP sizes and loaded lazily. Later uploads appear alongside the initial photos.
- `/gallery-admin` is the private client photo manager. The discreet **Client Access** link on `/gallery` leads to it.
- In Vercel, create a **public** Blob store from the project's **Storage** tab and connect it to Production. Vercel then supplies `BLOB_READ_WRITE_TOKEN` to the project; do not add a token to the source or commit it. Public access is needed so visitors can view uploaded project photos.
- Set `GALLERY_ADMIN_PASSWORD` in the Vercel Production environment to a unique password with at least 20 characters. Redeploy after setting environment values, then share the password privately with the client.
- The client can upload multiple JPG, JPEG, PNG, WebP, or AVIF photos up to 15 MB each, preview all public photos, and remove uploaded photos or hide initial photos from the public gallery. Uploads are resized without cropping into 640 px and 1280 px WebP images; the original is also kept in Blob and removed with its public versions.
- Upload authorization is checked server-side; a short-lived upload token is issued only after the client signs in. The session expires after 12 hours.
- `RESEND_API_KEY` and `RESEND_FROM_EMAIL` remain separate server-only settings for quote requests. They are not used by Gallery.

## Google reviews

- The homepage review carousel requests `/api/google-reviews`, which reads the verified Google Business Profile reviews and follows every page so all reviews can rotate through the carousel.
- To connect it in Vercel, enable the Google Business Profile API for an OAuth app and authorize an account that manages the verified Reliable HVAC listing with the `business.manage` scope. Add `GOOGLE_BUSINESS_ACCOUNT_ID`, `GOOGLE_BUSINESS_LOCATION_ID`, `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, and `GOOGLE_OAUTH_REFRESH_TOKEN` as server-only Production environment variables.
- Keep the OAuth client secret and refresh token out of GitHub and source files. Until these variables are set, the site shows the two review excerpts already verified in the source content.
- The carousel changes review every 6.5 seconds, has previous/next controls, and refreshes its Google data every 30 minutes. The server route caches successful API responses for 30 minutes.
