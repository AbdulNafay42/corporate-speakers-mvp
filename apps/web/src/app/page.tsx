import Link from "next/link";
import { getSpeakers, getPrograms } from "@/lib/strapi";
import { SpeakerCard, ProgramCard, EmptyState } from "@/components/cards";
import { ContactCTA } from "@/components/sections";
import { Arrow } from "@/components/icons";
export const dynamic = "force-dynamic";
export default async function Home() {
  const [speakers, programs] = await Promise.all([
    getSpeakers(),
    getPrograms(),
  ]);
  const featuredSpeakers = speakers.filter((s) => s.featured).slice(0, 3);
  const featuredPrograms = programs.filter((p) => p.featured).slice(0, 2);
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" />
              EXCEPTIONAL MINDS. MEANINGFUL IMPACT.
            </p>
            <h1>
              Ideas that move
              <br />
              people <em>forward.</em>
            </h1>
            <p className="hero-description">
              Bring a fresh perspective to your organization. Discover
              remarkable speakers and programs that inspire your people to think
              bigger, connect deeper, and do more.
            </p>
            <div className="hero-actions">
              <Link href="/speakers" className="button">
                Discover our speakers <Arrow diagonal />
              </Link>
              <Link href="/programs" className="quiet-link">
                Explore programs <Arrow />
              </Link>
            </div>
            <div className="hero-note">
              <span className="note-line" />
              For the moments that matter.
              <br />
              And the people who make them.
            </div>
          </div>
          <div className="hero-visual">
            <img
              src="/images/conference.jpg"
              alt="A speaker sharing ideas with an audience at a professional event"
              width="1000"
              height="1200"
              fetchPriority="high"
            />
            <div className="hero-image-overlay" />
            <div className="visual-top">
              <span>
                NEW PERSPECTIVES
                <br />
                START WITH A CONVERSATION.
              </span>
              <span className="visual-plus">+</span>
            </div>
            <div className="visual-caption">
              <span className="caption-star">✳</span>
              <p>
                A moment of inspiration.
                <br />
                <strong>A lasting difference.</strong>
              </p>
            </div>
            <span className="visual-index">01 / THE POWER OF PERSPECTIVE</span>
          </div>
        </div>
      </section>
      <section className="purpose-strip">
        <div className="container">
          <p>
            Built around your people.
            <br />
            <strong>Designed for real impact.</strong>
          </p>
          <span>Leadership & culture</span>
          <span>Innovation & change</span>
          <span>Connection & growth</span>
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE RIGHT VOICE CHANGES EVERYTHING</p>
            <h2>
              Meet the minds.
              <br />
              <em>Feel the possibility.</em>
            </h2>
          </div>
          <div className="heading-aside">
            <p>
              Fresh thinking. Human stories. Practical wisdom.
              <br />
              Find a voice that resonates with your people.
            </p>
            <Link href="/speakers" className="text-link">
              Meet all speakers <Arrow />
            </Link>
          </div>
        </div>
        {featuredSpeakers.length ? (
          <div className="speaker-grid">
            {featuredSpeakers.map((s) => (
              <SpeakerCard key={s.documentId} speaker={s} />
            ))}
          </div>
        ) : (
          <EmptyState type="featured speakers" />
        )}
      </section>
      <section className="program-section">
        <div className="container section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">MORE THAN A MOMENT OF INSPIRATION</p>
              <h2>
                Learning that
                <br />
                <em>stays with you.</em>
              </h2>
            </div>
            <div className="heading-aside">
              <p>
                Thoughtfully designed experiences that turn
                <br />
                new perspectives into meaningful action.
              </p>
              <Link href="/programs" className="text-link">
                Explore all programs <Arrow />
              </Link>
            </div>
          </div>
          {featuredPrograms.length ? (
            <div className="program-grid">
              {featuredPrograms.map((p, i) => (
                <ProgramCard key={p.documentId} program={p} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState type="featured programs" />
          )}
        </div>
      </section>
      <section className="section container about-section" id="about">
        <div>
          <p className="eyebrow">A THOUGHTFUL APPROACH. A HUMAN CONNECTION.</p>
          <h2>
            Great events begin
            <br />
            with <em>understanding.</em>
          </h2>
        </div>
        <div className="about-copy">
          <p className="large-copy">
            Your people, your ambitions, your moment. That’s where we start.
          </p>
          <p>
            We connect organizations with speakers and learning experiences that
            speak to what matters. From a single keynote to a team workshop, we
            help you bring the right ideas into the room.
          </p>
          <div className="approach-row">
            <span>01</span>
            <div>
              <h3>We listen first.</h3>
              <p>
                Understand your audience, goals, and the change you want to
                create.
              </p>
            </div>
          </div>
          <div className="approach-row">
            <span>02</span>
            <div>
              <h3>We find the right fit.</h3>
              <p>
                Connect you with a perspective and format that serve your
                people.
              </p>
            </div>
          </div>
          <div className="approach-row">
            <span>03</span>
            <div>
              <h3>We make it meaningful.</h3>
              <p>Shape an experience that carries beyond the room.</p>
            </div>
          </div>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
