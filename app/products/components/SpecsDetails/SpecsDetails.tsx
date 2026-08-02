import React from "react";

export default function SpecsDetails() {
  return (
    <section
      id="especificaciones"
      className="px-5 py-20 md:px-10 md:py-28 lg:px-14"
    >
      <div className="grid gap-16 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Ficha técnica / 03
          </p>
          <h2 className="mt-6 text-5xl font-semibold leading-[0.9] tracking-[-0.055em] md:text-7xl">
            Todo lo que importa.
          </h2>
        </div>
        <dl className="border-t border-border">
          {[
            ["Superficie", "Poliéster microtejido tratado"],
            ["Base", "PORON 2.0 de caucho natural"],
            ["Espesor", "4 mm de densidad uniforme"],
            ["Bordes", "Costura plana anti-fray"],
            ["Compatibilidad", "Sensores ópticos y láser"],
            ["Cuidado", "Lavado manual con agua fría"],
          ].map(([term, detail]) => (
            <div
              key={term}
              className="grid grid-cols-[.7fr_1.3fr] gap-6 border-b border-border py-6"
            >
              <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {term}
              </dt>
              <dd className="text-sm font-medium">{detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
