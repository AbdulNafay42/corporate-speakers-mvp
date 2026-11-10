export function Arrow({
  diagonal = false,
  className = "",
}: {
  diagonal?: boolean;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {diagonal ? (
        <path d="M6 18 18 6M6 6h12v12" />
      ) : (
        <path d="M4 12h15m-6-6 6 6-6 6" />
      )}
    </svg>
  );
}
export function Mark() {
  return (
    <svg
      aria-hidden="true"
      width="30"
      height="32"
      viewBox="0 0 30 32"
      fill="none"
    >
      <path
        d="M2 30V2h26v6H9v6h15v6H9v10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path d="M16 26h12" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}
