"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="container state-page">
      <p className="eyebrow">A BRIEF PAUSE</p>
      <h1>We couldn’t load this page.</h1>
      <p>
        Our content service is temporarily unavailable. Please try again in a
        moment.
      </p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
