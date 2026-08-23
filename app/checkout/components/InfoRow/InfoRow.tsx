
export function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-black/10 pb-3 last:border-b-0">
      <span className="text-xs text-black/50">{label}</span>

      <span
        className={`text-sm font-medium text-black ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}