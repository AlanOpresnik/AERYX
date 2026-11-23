import type { Metadata } from "next";
import { mono, pagePad } from "@/lib/products-mock-data";
import Countdown from "./Countdown";
import { LAUNCH_DATE } from "@/lib/launch";

export const metadata: Metadata = {
  title: "Próximamente | AERYX",
  description:
    "Estamos construyendo todo para la apertura de Aeryx en diciembre. Equipamiento gaming premium.",
};

const progress = [
  { label: "Catálogo y productos", done: true },
  { label: "Pagos y envíos", done: true },
  { label: "Últimos ajustes", done: false },
  { label: "Apertura oficial", done: false },
];

export default function ComingSoonPage() {
  return (
    <main
      className={`relative isolate flex min-h-svh flex-col justify-center overflow-hidden pt-28 pb-16 ${pagePad}`}
    >
      {/* Fondo: grilla sutil + halo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(var(--foreground)_1px,transparent_1px),linear-gradient(90deg,var(--foreground)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 size-[42rem] -translate-x-1/2 rounded-full bg-red-400/10 blur-[140px]"
      />

      <div className="mx-auto w-full max-w-5xl">
        <div className={`${mono} flex flex-wrap items-center justify-between gap-4 text-muted-foreground`}>
          <span className="flex items-center gap-2">
            <span className="relative inline-flex size-2 rounded-full bg-red-400">
              <span className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-60" />
            </span>
            En construcción
          </span>
          <span>Apertura · 01.12.2026</span>
        </div>

        <h1 className="mt-10 text-balance text-[clamp(3.25rem,9vw,8.5rem)] font-normal leading-[.86] tracking-[-.075em]">
          Estamos construyendo
          <br />
          todo para{" "}
          <span className="text-red-400">diciembre.</span>
        </h1>

        <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          El 1 de diciembre abrimos las puertas de Aeryx. Equipamiento diseñado
          para transformar cada movimiento en una ventaja competitiva. Falta
          poco.
        </p>

        <div className="mt-12">
          <Countdown target={LAUNCH_DATE} />
        </div>

        <div className="mt-12 border-t border-border pt-10">
          <ol className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4 sm:gap-6">
            {progress.map((step, i) => (
              <li key={step.label} className="flex flex-col gap-2">
                <span
                  className={`h-1 rounded-full ${step.done ? "bg-foreground" : "bg-border"}`}
                />
                <span className={`${mono} ${step.done ? "text-foreground" : "text-muted-foreground"}`}>
                  0{i + 1} · {step.label}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div
        className={`${mono} absolute inset-x-6 bottom-6 flex justify-between text-muted-foreground md:inset-x-[6vw]`}
      >
        <span>Aeryx — Born to compete</span>
        <span className="hidden sm:inline">Envíos a todo el país</span>
      </div>
    </main>
  );
}
