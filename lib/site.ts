// Absolute origin of the deployed site, used for canonical URLs, the
// sitemap, and robots.txt. Set NEXT_PUBLIC_SITE_URL to the production
// domain (e.g. https://example.co.il) once it exists.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
