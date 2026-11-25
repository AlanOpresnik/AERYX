import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getMyOrders } from "@/lib/account/data";
import { getPresaleConfig } from "@/lib/presale-config";
import { cn } from "@/lib/utils";
import { OrderCard } from "../_components/OrderCard";
import { isOngoing } from "../_components/order-view";

export const metadata: Metadata = { title: "Pedidos" };

const FILTERS = [
  { key: undefined, label: "Todos" },
  { key: "en-curso", label: "En curso" },
  { key: "finalizados", label: "Finalizados" },
] as const;

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ ver?: string }> }) {
  const { ver } = await searchParams;
  const [{ orders, error }, presale] = await Promise.all([getMyOrders(), getPresaleConfig()]);
  const filter = ver === "en-curso" || ver === "finalizados" ? ver : undefined;
  const shown = orders.filter((o) =>
    filter === "en-curso" ? isOngoing(o) : filter === "finalizados" ? !isOngoing(o) : true,
  );
  const count = (key?: string) =>
    key === "en-curso" ? orders.filter(isOngoing).length : key === "finalizados" ? orders.filter((o) => !isOngoing(o)).length : orders.length;

  return (
    <section aria-labelledby="titulo-pedidos">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 id="titulo-pedidos" className="text-xl font-medium tracking-[-0.03em]">
          Tus pedidos
        </h2>
        {orders.length > 0 && (
          <nav aria-label="Filtrar pedidos" className="flex gap-1.5">
            {FILTERS.map((f) => {
              const active = f.key === filter;
              return (
                <Link
                  key={f.label}
                  href={f.key ? `/profile/pedidos?ver=${f.key}` : "/profile/pedidos"}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "press flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors duration-150",
                    active ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {f.label}
                  <span className="tabular-nums opacity-60">{count(f.key)}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      {error ? (
        <div className="rounded-2xl border border-border p-6 text-sm text-muted-foreground">
          No pudimos cargar tus pedidos en este momento. Probá recargar la página en un rato.
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center">
          <p className="font-medium">Todavía no hiciste pedidos</p>
          <p className="mt-1 text-sm text-muted-foreground">Cuando compres, vas a poder seguir cada envío desde acá.</p>
          <Link
            href="/catalog"
            className="press mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background"
          >
            Ver productos <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : shown.length === 0 ? (
        <p className="rounded-2xl border border-border p-6 text-sm text-muted-foreground">
          {filter === "en-curso" ? "No tenés pedidos en curso." : "Todavía no tenés pedidos finalizados."}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {shown.map((order, i) => (
            <li key={order.id}>
              <OrderCard order={order} open={i === 0 && isOngoing(order)} shipsFrom={presale.shipsFrom} />
            </li>
          ))}
        </ul>
      )}

      <p className="mt-8 text-sm text-muted-foreground">
        Mostramos los pedidos hechos con <span className="text-foreground">tu mail de esta cuenta</span>. ¿Falta alguno?{" "}
        <a href="mailto:hola@aeryx.gg" className="underline underline-offset-4 hover:text-foreground">
          Escribinos
        </a>
        .
      </p>
    </section>
  );
}
