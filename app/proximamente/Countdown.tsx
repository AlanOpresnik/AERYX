"use client";

import { useEffect, useState } from "react";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    done: ms === 0,
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    minutes: Math.floor((ms / 60_000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function Countdown({ target }: { target: string }) {
  const t = new Date(target).getTime();
  const [left, setLeft] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setLeft(diff(t));
    const id = setInterval(() => setLeft(diff(t)), 1000);
    return () => clearInterval(id);
  }, [t]);

  const units = [
    { label: "Días", value: left?.days },
    { label: "Horas", value: left?.hours },
    { label: "Min", value: left?.minutes },
    { label: "Seg", value: left?.seconds },
  ];

  if (left?.done) {
    return (
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-red-400">
        Estamos abiertos — recargá la página
      </p>
    );
  }

  return (
    <div
      className="grid grid-cols-4 gap-2 sm:gap-3"
      role="timer"
      aria-label="Tiempo restante para la apertura"
    >
      {units.map(({ label, value }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card/60 px-2 py-4 backdrop-blur sm:px-6 sm:py-6"
        >
          <span className="text-[clamp(2rem,6vw,4rem)] font-medium leading-none tracking-[-0.05em] tabular-nums">
            {value === undefined ? "--" : pad(value)}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
