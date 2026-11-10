import Link from "next/link";
export default function NotFound() {
  return (
    <section className="container state-page">
      <p className="eyebrow">404 / A DIFFERENT DIRECTION</p>
      <h1>Let’s get you back on track.</h1>
      <p>This page may have moved, or this profile is no longer published.</p>
      <Link className="button" href="/">
        Back to Forum →
      </Link>
    </section>
  );
}
