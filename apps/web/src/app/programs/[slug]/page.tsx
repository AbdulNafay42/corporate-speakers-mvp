import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProgram, mediaUrl } from "@/lib/strapi";
import { SpeakerCard } from "@/components/cards";
import { Arrow } from "@/components/icons";
import { ContactCTA } from "@/components/sections";
type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProgram(slug);
  return {
    title: p?.title || "Program not found",
    description: p?.description.slice(0, 160),
    alternates: { canonical: `/programs/${encodeURIComponent(slug)}` },
  };
}
export default async function ProgramDetail({ params }: Props) {
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) notFound();
  const image = mediaUrl(program.image);
  return (
    <>
      <section className="container detail-section">
        <Link href="/programs" className="back-link">
          ← All programs
        </Link>
        <div className="program-detail-heading">
          <p className="eyebrow">A FORUM LEARNING EXPERIENCE</p>
          <h1>{program.title}</h1>
          <span className="duration-label">{program.duration}</span>
        </div>
        {image ? (
          <img
            className="program-detail-image"
            src={image}
            alt={program.image?.alternativeText || program.title}
            width="1200"
            height="600"
          />
        ) : null}
        <div className="program-detail-copy">
          <h2>
            A fresh perspective.
            <br />
            <em>A practical next step.</em>
          </h2>
          <div>
            <div className="prose">
              {program.description
                .split("\n")
                .filter(Boolean)
                .map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
            </div>
            <Link
              href={`/contact?interest=${encodeURIComponent(program.title)}`}
              className="button"
            >
              Enquire about this program <Arrow diagonal />
            </Link>
          </div>
        </div>
        {program.speakers?.length ? (
          <div className="related-speakers">
            <p className="eyebrow">THE PEOPLE BEHIND THE PERSPECTIVE</p>
            <h2>Meet your facilitators.</h2>
            <div className="speaker-grid">
              {program.speakers.map((s) => (
                <SpeakerCard key={s.documentId} speaker={s} />
              ))}
            </div>
          </div>
        ) : null}
      </section>
      <ContactCTA />
    </>
  );
}
