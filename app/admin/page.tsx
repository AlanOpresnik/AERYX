import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { getDashboard } from "@/lib/admin/data";
import { ButtonLink, EmptyState, money, PageHeader, Panel, shortDate, StagePill } from "./_components/ui";
import { SalesChart } from "./_components/SalesChart";

export const metadata: Metadata = { title: "Resumen" };
export const dynamic = "force-dynamic";

function Delta({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) {
    return <span className="text-xs text-muted-foreground">Sin datos del período anterior</span>;
  }
  const change = Math.round(((current - previous) / previous) * 100);
  return (
    <span className="text-xs text-muted-foreground tabular-nums">
      <span className={change >= 0 ? "text-emerald-300" : "text-red-300"}>
        {change >= 0 ? "▲" : "▼"} {Math.abs(change)}%
      </span>{" "}
      vs. 30 días anteriores
    </span>
  );
}

function Stat({ label, value, footer, href }: { label: string; value: string; footer: React.ReactNode; href?: string }) {
  const body = (
    <>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-medium tracking-[-0.04em] tabular-nums">{value}</p>
      <div className="mt-2">{footer}</div>
    </>
  );
  const cls = "rounded-2xl border border-border bg-card p-5";
  return href ? (
    <Link href={href} className={`${cls} transition-colors duration-150 hover:border-foreground/25`}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export default async function AdminHome() {
  const data = await getDashboard();

  return (
    <>
      <PageHeader
        title="Resumen"
        description="Ventas cobradas y pedidos de los últimos 30 días, en vivo desde Tiendanube."
        actions={
          <ButtonLink href="/admin/productos/nuevo" variant="primary">
            <Plus className="size-4" />
            Nuevo producto
          </ButtonLink>
        }
      />

      <section aria-label="Indicadores" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Ventas cobradas"
          value={money(data.sales.current)}
          footer={<Delta current={data.sales.current} previous={data.sales.previous} />}
        />
        <Stat
          label="Pedidos pagados"
          value={String(data.paidOrders.current)}
          footer={<Delta current={data.paidOrders.current} previous={data.paidOrders.previous} />}
        />
        <Stat
          label="Ticket promedio"
          value={money(data.averageTicket)}
          footer={<span className="text-xs text-muted-foreground">{data.totalOrders} pedidos en total</span>}
        />
        <Stat
          label="Por enviar"
          value={String(data.toShip.length)}
          href="/admin/pedidos?estado=por-enviar"
          footer={
            <span className="text-xs text-muted-foreground">
              {data.toCollect} {data.toCollect === 1 ? "pedido espera" : "pedidos esperan"} el pago
            </span>
          }
        />
      </section>

      <Panel title="Ventas cobradas por día" className="mt-3">
        <SalesChart days={data.days} />
      </Panel>

      <div className="mt-3 grid gap-3 xl:grid-cols-[1.6fr_1fr]">
        <Panel
          title="Últimos pedidos"
          action={
            <Link href="/admin/pedidos" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              Ver todos <ArrowRight className="size-3.5" />
            </Link>
          }
        >
          {data.recent.length === 0 ? (
            <EmptyState title="Todavía no hay pedidos" />
          ) : (
            <ul className="divide-y divide-border">
              {data.recent.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/admin/pedidos/${o.id}`}
                    className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 px-5 py-3.5 transition-colors duration-150 hover:bg-foreground/[0.03] sm:grid-cols-[4rem_minmax(0,1fr)_auto_6.5rem]"
                  >
                    <span className="text-sm text-muted-foreground tabular-nums">#{o.number}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{o.customer.name}</span>
                      <span className="block text-xs text-muted-foreground">{shortDate(o.createdAt)}</span>
                    </span>
                    <span className="hidden sm:block">
                      <StagePill stage={o.stage} />
                    </span>
                    <span className="text-right text-sm font-medium tabular-nums">{money(o.total, o.currency)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Stock bajo"
          action={
            <Link href="/admin/productos" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              Productos <ArrowRight className="size-3.5" />
            </Link>
          }
        >
          {data.lowStock.length === 0 ? (
            <EmptyState title="Todo en orden">
              Ninguna variante tiene 5 unidades o menos.
            </EmptyState>
          ) : (
            <ul className="divide-y divide-border">
              {data.lowStock.slice(0, 8).map(({ product, variant }) => (
                <li key={variant.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{variant.label}</p>
                  </div>
                  <span
                    className={`shrink-0 text-sm tabular-nums ${variant.stock === 0 ? "text-red-300" : "text-amber-200"}`}
                  >
                    {variant.stock === 0 ? "Agotado" : `${variant.stock} u.`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
