import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
export const metadata: Metadata = {
  title: "Let’s talk",
  description:
    "Tell us about your next corporate event, keynote, or team learning experience.",
  alternates: { canonical: "/contact" },
};
export default async function Contact({
  searchParams,
}: {
  searchParams: Promise<{ interest?: string }>;
}) {
  const { interest } = await searchParams;
  return (
    <section className="container contact-section">
      <div className="contact-copy">
        <p className="eyebrow">LET?S FIND YOUR NEXT GREAT IDEA</p>
        <h1>
          Good things start
          <br />
          with <em>a conversation.</em>
        </h1>
        <p className="large-copy">
          A keynote that opens minds. A workshop that brings people together.
          Let’s explore what?s possible for your team.
        </p>
        <div className="contact-process">
          <span className="status-dot" />
          <p>
            A real conversation, from the start.
            <br />
            <span>Share your goals. We’ll help with the next step.</span>
          </p>
        </div>
      </div>
      <ContactForm
        interest={typeof interest === "string" ? interest.slice(0, 180) : ""}
      />
    </section>
  );
}
