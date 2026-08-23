import { PropsWithChildren } from "react";

type Tone = "amber" | "emerald" | "neutral";

interface Props {
  tone: Tone;
}

const styles: Record<Tone, string> = {
  amber: "bg-amber-50 text-amber-800",
  emerald: "bg-emerald-50 text-emerald-700",
  neutral: "bg-neutral-100 text-neutral-600",
};

export function StatusPill({
  tone,
  children,
}: PropsWithChildren<Props>) {
  return (
    <span
      className={`inline-block text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${styles[tone]}`}
    >
      {children}
    </span>
  );
}