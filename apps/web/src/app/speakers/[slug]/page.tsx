import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSpeaker, mediaUrl } from "@/lib/strapi";
import { Arrow } from "@/components/icons";
import { ContactCTA } from "@/components/sections";
type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = await getSpeaker(slug);
  return {
    title: s?.name || "Speaker not found",
    description: s?.bio.slice(0, 160),
    alternates: { canonical: `/speakers/${encodeURIComponent(slug)}` },
  };
}
export default async function SpeakerDetail({ params }: Props) {
  const { slug } = await params;
  const speaker = await getSpeaker(slug);
  if (!speaker) notFound();
  const image = mediaUrl(speaker.image);
  return (
    <>
      <section className="container detail-section">
        <Link href="/speakers" className="back-link">
          ← All speakers
        </Link>
        <div className="detail-grid">
          <div className="detail-image">
            {image ? (
              <img
                src={image}
                alt={speaker.image?.alternativeText || speaker.name}
                width="700"
                height="850"
              />
            ) : (
              <div className="detail-monogram" aria-hidden="true">
                {speaker.name
                  .split(" ")
                  .filter((s) => s !== "Dr.")
                  .map((s) => s[0])
                  .slice(0, 2)
                  .join("")}
              </div>
            )}
          </div>
          <div className="detail-copy">
            <p className="eyebrow">MEET YOUR NEXT SPEAKER</p>
            <h1>{speaker.name}</h1>
            <p className="large-copy">{speaker.designation}</p>
            <div className="expertise-tags">
              {speaker.expertise.split(",").map((e) => (
                <span key={e}>{e.trim()}</span>
              ))}
            </div>
            <div className="prose">
              {speaker.bio
                .split("\n")
                .filter(Boolean)
                .map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
            </div>
            <Link
              href={`/contact?interest=${encodeURIComponent(speaker.name)}`}
              className="button"
            >
              Enquire about {speaker.name.replace("Dr. ", "").split(" ")[0]}{" "}
              <Arrow diagonal />
            </Link>
          </div>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
