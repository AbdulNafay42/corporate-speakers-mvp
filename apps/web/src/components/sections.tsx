import Link from "next/link";
import { Arrow } from "./icons";
export function ContactCTA() {
  return (
    <section className="cta-section">
      <div className="container cta-inner">
        <div>
          <p className="eyebrow">YOUR NEXT GREAT CONVERSATION STARTS HERE</p>
          <h2>
            Let’s make something
            <br />
            <em>meaningful happen.</em>
          </h2>
        </div>
        <Link href="/contact" className="button button-cream">
          Plan your next event <Arrow diagonal />
        </Link>
      </div>
    </section>
  );
}
export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="page-intro container">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <div className="intro-copy">{children}</div>
    </section>
  );
}
