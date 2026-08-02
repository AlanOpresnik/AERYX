export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "wordmark wordmark-compact" : "wordmark"}>
      aery<span className="wordmark-x">x</span>
    </span>
  );
}
