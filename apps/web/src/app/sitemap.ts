import type { MetadataRoute } from "next";
import { getSpeakers, getPrograms } from "@/lib/strapi";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL || "http://localhost:3000";
  const [speakers, programs] = await Promise.all([
    getSpeakers(),
    getPrograms(),
  ]);
  return [
    "",
    "/speakers",
    "/programs",
    "/contact",
    ...speakers.map((s) => `/speakers/${s.slug}`),
    ...programs.map((p) => `/programs/${p.slug}`),
  ].map((path) => ({ url: `${base}${path}` }));
}
