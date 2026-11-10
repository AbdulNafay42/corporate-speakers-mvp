import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const site = process.env.SITE_URL || "http://localhost:3000";
  return {
    rules: {
      userAgent: "*",
      allow: process.env.DEMO_MODE === "true" ? undefined : "/",
      disallow: process.env.DEMO_MODE === "true" ? "/" : ["/api/"],
    },
    sitemap: `${site}/sitemap.xml`,
  };
}
