# Google Ads and Analytics setup

Add these project environment variables in Vercel, then redeploy:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 measurement ID, e.g. `G-XXXXXXXXXX` (optional) |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | Google Ads tag ID, e.g. `AW-123456789` (optional) |
| `NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL` | Conversion label for a successfully submitted quote request (requires Ads ID) |
| `NEXT_PUBLIC_GOOGLE_ADS_PHONE_LABEL` | Conversion label for a telephone link click (requires Ads ID) |

No Google tag loads until at least one of the two IDs is configured. Once configured, GA4 receives `page_view`, `generate_lead` after `/api/quote` confirms success, `phone_click`, and `quote_button_click`. Google Ads receives separate conversion events for successful quote requests and telephone clicks when their labels are configured. A quote button click is an engagement event, not a completed lead. The form fields and customer contact information are never passed to Google by this code.

In Google Ads, create separate Website conversion actions for the quote submission and telephone link click. Copy each conversion label from its event snippet. Enable auto-tagging and link Ads to the GA4 property if campaign analysis in Analytics is desired. Avoid marking an imported GA4 `generate_lead` event as another primary Ads conversion alongside the direct Ads quote conversion, or one lead may be counted twice.

## Admin panel

The existing `/gallery-admin` password also protects its Analytics overview. The panel shows GA4 active users, page views, successful quote requests, phone link clicks, quote button clicks, and leads by campaign for the previous 30 complete days. Google Ads campaign cost and ad spend are not shown. To enable the panel, enable the Google Analytics Data API in a Google Cloud project, create a service account, and grant that service account **Viewer** access to the GA4 property. Add these server-only Vercel variables and redeploy:

| Variable | Value |
| --- | --- |
| `GOOGLE_ANALYTICS_PROPERTY_ID` | Numeric GA4 property ID, distinct from the `G-...` measurement ID |
| `GOOGLE_ANALYTICS_SERVICE_ACCOUNT_JSON` | The entire service account JSON key, stored as a Vercel secret |

Never place the service account JSON in a `NEXT_PUBLIC_` variable or the Git repository. The analytics API returns data only when the existing gallery admin session is valid. Until these credentials are supplied, the panel displays a setup message rather than invented numbers.
