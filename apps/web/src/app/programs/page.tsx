import type { Metadata } from "next";
import { getPrograms } from "@/lib/strapi";
import { ProgramCard, EmptyState } from "@/components/cards";
import { PageIntro, ContactCTA } from "@/components/sections";
export const metadata: Metadata = {
  title: "Our programs",
  description:
    "Explore corporate keynotes, leadership workshops, and team learning experiences.",
  alternates: { canonical: "/programs" },
};
export const dynamic = "force-dynamic";
export default async function Programs() {
  const programs = await getPrograms();
  return (
    <>
      <PageIntro
        eyebrow="PERSPECTIVE INTO PRACTICE"
        title="Make inspiration go further."
      >
        <p>
          From a powerful keynote to an immersive workshop, discover experiences
          that help your people learn, connect, and move forward together.
        </p>
      </PageIntro>
      <section className="container listing-section" aria-label="All programs">
        <div className="listing-bar">
          <span>Our programs</span>
          <span>Designed around your people</span>
        </div>
        {programs.length ? (
          <div className="program-grid">
            {programs.map((p, i) => (
              <ProgramCard key={p.documentId} program={p} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState type="programs" />
        )}
      </section>
      <ContactCTA />
    </>
  );
}
