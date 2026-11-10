import "server-only";
import { cache } from "react";
import samples from "../../../../data/samples.json";
import type { Speaker, Program, Media } from "./types";
export const isDemo = process.env.DEMO_MODE === "true";
const base = (process.env.STRAPI_URL || "http://localhost:1337").replace(
  /\/$/,
  "",
);
async function request<T>(
  collection: string,
  params: URLSearchParams,
): Promise<T[]> {
  const token = process.env.STRAPI_READ_TOKEN;
  if (!token) throw new Error("CMS read token is not configured.");
  params.set("status", "published");
  params.set("pagination[pageSize]", "100");
  const response = await fetch(`${base}/api/${collection}?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) {
    console.error(`CMS ${collection} returned ${response.status}`);
    throw new Error("Content is temporarily unavailable.");
  }
  const body = await response.json();
  return body.data;
}
export const getSpeakers = cache(async (): Promise<Speaker[]> => {
  if (isDemo)
    return samples.speakers.map((s) => ({
      ...s,
      image: {
        url: `/images/${s.slug}.jpg`,
        alternativeText: `Illustrative stock portrait for fictional speaker ${s.name}`,
      },
    }));
  return request(
    "speakers",
    new URLSearchParams({ populate: "image", sort: "name:asc" }),
  );
});
export const getPrograms = cache(async (): Promise<Program[]> => {
  if (isDemo) {
    const speakers = await getSpeakers();
    return samples.programs.map((p) => ({ ...p, speakers }));
  }
  return request(
    "programs",
    new URLSearchParams({
      "populate[image]": "true",
      "populate[speakers][populate]": "image",
      sort: "title:asc",
    }),
  );
});
export const getSpeaker = cache(
  async (slug: string): Promise<Speaker | undefined> => {
    if (isDemo) return (await getSpeakers()).find((s) => s.slug === slug);
    return (
      await request<Speaker>(
        "speakers",
        new URLSearchParams({ "filters[slug][$eq]": slug, populate: "image" }),
      )
    )[0];
  },
);
export const getProgram = cache(
  async (slug: string): Promise<Program | undefined> => {
    if (isDemo) return (await getPrograms()).find((p) => p.slug === slug);
    return (
      await request<Program>(
        "programs",
        new URLSearchParams({
          "filters[slug][$eq]": slug,
          "populate[image]": "true",
          "populate[speakers][populate]": "image",
        }),
      )
    )[0];
  },
);
export function mediaUrl(media: Media | null): string | undefined {
  if (!media?.url) return;
  if (media.url.startsWith("/images/")) return media.url;
  const url = new URL(media.url, base);
  if (!["http:", "https:"].includes(url.protocol)) return;
  return url.toString();
}
