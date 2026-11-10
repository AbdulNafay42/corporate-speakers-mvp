export default function Loading() {
  return (
    <div className="container loading-state" role="status">
      <p className="eyebrow">A FRESH PERSPECTIVE IS ON ITS WAY</p>
      <div className="skeleton skeleton-title" />
      <div className="speaker-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton skeleton-card" />
        ))}
      </div>
      <span className="sr-only">Loading content…</span>
    </div>
  );
}
