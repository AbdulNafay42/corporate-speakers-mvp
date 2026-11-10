import type { Metadata } from "next";
import { getSpeakers } from "@/lib/strapi";
import { SpeakerCard, EmptyState } from "@/components/cards";
import { PageIntro, ContactCTA } from "@/components/sections";
export const metadata: Metadata = {
  title: "Our speakers",
  description:
    "Meet thoughtful voices in leadership, innovation, communication, and organizational change.",
  alternates: { canonical: "/speakers" },
};
export const dynamic = "force-dynamic";
export default async function Speakers() {
  const speakers = await getSpeakers();
  return (
    <>
      <PageIntro
        eyebrow="EXTRAORDINARY PEOPLE. FRESH PERSPECTIVES."
        title="A voice for your next chapter."
      >
        <p>
          Meet the thinkers, storytellers, and practitioners who bring new
          possibilities into the room. Find the right perspective for your
          people.
        </p>
      </PageIntro>
      <section className="container listing-section" aria-label="All speakers">
        <div className="listing-bar">
          <span>Our speakers</span>
          <span>{speakers.length} perspectives to explore</span>
        </div>
        {speakers.length ? (
          <div className="speaker-grid">
            {speakers.map((s) => (
              <SpeakerCard key={s.documentId} speaker={s} />
            ))}
          </div>
        ) : (
          <EmptyState type="speakers" />
        )}
      </section>
      <ContactCTA />
    </>
  );
}
