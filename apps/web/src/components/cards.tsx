import Link from "next/link";
import { mediaUrl } from "@/lib/strapi";
import type { Speaker, Program } from "@/lib/types";
import { Arrow } from "./icons";
export function SpeakerCard({ speaker }: { speaker: Speaker }) {
  const image = mediaUrl(speaker.image);
  return (
    <Link className="speaker-card group" href={`/speakers/${speaker.slug}`}>
      <div className="portrait">
        {image ? (
          <img
            src={image}
            alt={speaker.image?.alternativeText || speaker.name}
            width="600"
            height="700"
            loading="lazy"
          />
        ) : (
          <div className="portrait-placeholder" aria-hidden="true">
            <span>
              {speaker.name
                .split(" ")
                .filter((n) => n !== "Dr.")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </span>
            <svg viewBox="0 0 300 350">
              <circle cx="150" cy="120" r="58" />
              <path d="M35 350v-45a115 115 0 0 1 230 0v45" />
            </svg>
          </div>
        )}
        <span className="round-arrow">
          <Arrow diagonal />
        </span>
      </div>
      <p className="eyebrow card-category">
        {speaker.expertise.split(",").slice(0, 2).join(" / ")}
      </p>
      <h3>{speaker.name}</h3>
      <p className="card-description">{speaker.designation}</p>
    </Link>
  );
}
export function ProgramCard({
  program,
  index = 0,
}: {
  program: Program;
  index?: number;
}) {
  const image = mediaUrl(program.image);
  return (
    <Link href={`/programs/${program.slug}`} className="program-card">
      <div className={`program-art art-${index % 3}`}>
        {image ? (
          <img
            src={image}
            alt={program.image?.alternativeText || program.title}
            width="800"
            height="500"
            loading="lazy"
          />
        ) : (
          <>
            <span className="art-orbit orbit-one" />
            <span className="art-orbit orbit-two" />
            <span className="art-orbit orbit-three" />
            <span className="art-label">FORUM / LEARNING EXPERIENCES</span>
            <span className="art-number">0{index + 1}</span>
          </>
        )}
        <span className="program-duration">{program.duration}</span>
      </div>
      <div className="program-card-body">
        <h3>
          {program.title}
          <Arrow diagonal />
        </h3>
        <p>{program.description.split("\n")[0]}</p>
        <span className="text-link">
          Explore program <Arrow />
        </span>
      </div>
    </Link>
  );
}
export function EmptyState({ type }: { type: string }) {
  return (
    <div className="empty-state">
      <h3>Something good is taking shape.</h3>
      <p>
        Our {type} collection is being curated. Tell us what you have in mind
        and we’ll help you find the right fit.
      </p>
      <Link className="text-link" href="/contact">
        Start a conversation <Arrow />
      </Link>
    </div>
  );
}
