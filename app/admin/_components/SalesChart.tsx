"use client";

import { useState } from "react";

type Day = { date: string; total: number; orders: number };

const fmtMoney = (v: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(v);
const fmtDay = (iso: string) =>
  new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short" }).format(new Date(iso));

/** Ventas cobradas por día: una sola serie, barras finas, detalle al pasar el mouse o con el teclado. */
export function SalesChart({ days }: { days: Day[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);
  const max = Math.max(...days.map((d) => d.total), 1);
  const shown = active !== null ? days[active] : null;
  const hasSales = days.some((d) => d.total > 0);

  return (
    <div className="px-5 pb-5 pt-4">
      <div className="mb-4 flex min-h-10 items-end justify-between gap-4">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {shown ? (
            <>
              <span className="text-foreground">{fmtDay(shown.date)}</span> ·{" "}
              <span className="text-foreground tabular-nums">{fmtMoney(shown.total)}</span> ·{" "}
              {shown.orders} {shown.orders === 1 ? "pedido" : "pedidos"}
            </>
          ) : hasSales ? (
            "Pasá el mouse por una barra para ver el día."
          ) : (
            "Sin ventas cobradas en los últimos 30 días."
          )}
        </p>
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          className="shrink-0 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          {showTable ? "Ver gráfico" : "Ver tabla"}
        </button>
      </div>

      {showTable ? (
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Ventas cobradas por día</caption>
            <thead className="text-left text-xs text-muted-foreground">
              <tr>
                <th className="py-1.5 font-normal">Día</th>
                <th className="py-1.5 text-right font-normal">Pedidos</th>
                <th className="py-1.5 text-right font-normal">Ventas</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {days.map((d) => (
                <tr key={d.date} className="border-t border-border">
                  <td className="py-1.5">{fmtDay(d.date)}</td>
                  <td className="py-1.5 text-right">{d.orders}</td>
                  <td className="py-1.5 text-right">{fmtMoney(d.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <div
            className="relative flex h-40 items-end gap-[2px]"
            onMouseLeave={() => setActive(null)}
            role="group"
            aria-label="Ventas cobradas por día, últimos 30 días"
          >
            {/* Línea base */}
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-border" />
            {days.map((d, i) => (
              <button
                key={d.date}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                aria-label={`${fmtDay(d.date)}: ${fmtMoney(d.total)}, ${d.orders} pedidos`}
                className="group relative flex h-full flex-1 items-end focus-visible:outline-offset-2"
              >
                <span
                  className={`w-full rounded-t-[4px] transition-colors duration-100 ${
                    active === i ? "bg-accent" : "bg-foreground/70 group-hover:bg-foreground"
                  }`}
                  style={{ height: d.total > 0 ? `${Math.max(3, (d.total / max) * 100)}%` : 0 }}
                />
              </button>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground tabular-nums">
            <span>{fmtDay(days[0].date)}</span>
            <span>Hoy</span>
          </div>
        </>
      )}
    </div>
  );
}
