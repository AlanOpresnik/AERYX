export function Mark({ className = "" }: { className?: string }) {
  return (
    <span className={`aeryx-mark ${className}`} aria-hidden="true">
      <i />
      <b />
    </span>
  );
}