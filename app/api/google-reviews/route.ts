import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GoogleReview = {
  reviewId?: string;
  comment?: string;
  starRating?: string;
  createTime?: string;
  updateTime?: string;
  reviewer?: { displayName?: string; isAnonymous?: boolean };
};

function missingConfiguration() {
  return !process.env.GOOGLE_BUSINESS_ACCOUNT_ID ||
    !process.env.GOOGLE_BUSINESS_LOCATION_ID ||
    !process.env.GOOGLE_OAUTH_CLIENT_ID ||
    !process.env.GOOGLE_OAUTH_CLIENT_SECRET ||
    !process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
}

async function getAccessToken() {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Google OAuth token refresh failed");
  const payload = await response.json() as { access_token?: string };
  if (!payload.access_token) throw new Error("Google OAuth did not return an access token");
  return payload.access_token;
}

export async function GET() {
  if (missingConfiguration()) {
    return NextResponse.json({ error: "google_reviews_not_configured" }, { status: 503 });
  }

  try {
    const accessToken = await getAccessToken();
    const parent = `accounts/${encodeURIComponent(process.env.GOOGLE_BUSINESS_ACCOUNT_ID!)}/locations/${encodeURIComponent(process.env.GOOGLE_BUSINESS_LOCATION_ID!)}`;
    const reviews: GoogleReview[] = [];
    let pageToken = "";
    let totalReviewCount = 0;
    let averageRating: number | null = null;

    // Google returns at most 50 reviews per page. Follow every page token so
    // the client carousel can rotate through the complete verified listing.
    for (let page = 0; page < 100; page += 1) {
      const url = new URL(`https://mybusiness.googleapis.com/v4/${parent}/reviews`);
      url.searchParams.set("pageSize", "50");
      url.searchParams.set("orderBy", "updateTime desc");
      if (pageToken) url.searchParams.set("pageToken", pageToken);

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`Google Business Profile returned ${response.status}`);
      const payload = await response.json() as {
        reviews?: GoogleReview[];
        totalReviewCount?: number;
        averageRating?: number;
        nextPageToken?: string;
      };
      reviews.push(...(payload.reviews ?? []));
      totalReviewCount = payload.totalReviewCount ?? totalReviewCount;
      averageRating = payload.averageRating ?? averageRating;
      if (!payload.nextPageToken) break;
      pageToken = payload.nextPageToken;
    }

    const items = reviews.map((review, index) => {
      const rating = Number(review.starRating?.replace("STAR_RATING_", "")) || undefined;
      return {
        id: review.reviewId || `google-review-${index}`,
        name: review.reviewer?.isAnonymous ? "Google customer" : review.reviewer?.displayName || "Google customer",
        quote: review.comment?.trim() || (rating ? `Left a ${rating}-star rating on Google.` : "Left a Google review."),
        rating,
        updatedAt: review.updateTime || review.createTime,
      };
    });

    return NextResponse.json({ reviews: items, totalReviewCount, averageRating }, {
      headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
    });
  } catch (error) {
    console.error("Unable to load Google Business Profile reviews:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "google_reviews_unavailable" }, { status: 502 });
  }
}
