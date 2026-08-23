import { Check } from "lucide-react";

export function StepDot({
  active,
  done,
  label,
}: {
  active: boolean;
  done: boolean;
  label: string;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-bold ${active ? "border-black bg-black text-white" : done ? "border-black bg-[#c9f158] text-black" : "border-black/25 text-black/35"}`}
      >
        {done ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
      </div>
      <span
        className={`hidden sm:inline ${active ? "text-black" : "text-black/35"}`}
      >
        {label}
      </span>
    </div>
  );
}