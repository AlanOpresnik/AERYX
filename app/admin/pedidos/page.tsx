import type { Metadata } from "next";
import Link from "next/link";
import { listOrders, STAGE_LABEL, type OrderStage } from "@/lib/admin/data";
import { cn } from "@/lib/utils";
import { EmptyState, money, PageHeader, Pagination, Panel, SearchForm, shortDate, StagePill } from "../_components/ui";

export const metadata: Metadata = { title: "Pedidos" };
export const dynamic = "force-dynamic";

const STAGES = Object.keys(STAGE_LABEL) as OrderStage[];

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; q?: string; page?: string; preventa?: string }>;
}) {
  const sp = await searchParams;
  const estado = STAGES.includes(sp.estado as OrderStage) ? (sp.estado as OrderStage) : undefined;
  const presale = sp.preventa === "1";
  const data = await listOrders({ stage: estado, q: sp.q, page: Number(sp.page) || 1, presale });

  const tabHref = (stage?: OrderStage) => {
    const qs = new URLSearchParams();
    if (stage) qs.set("estado", stage);
    if (sp.q) qs.set("q", sp.q);
    if (presale) qs.set("preventa", "1");
    const s = qs.toString();
    return s ? `/admin/pedidos?${s}` : "/admin/pedidos";
  };

  return (
    <>
      <PageHeader title="Pedidos" description={`${data.all} pedidos en Tiendanube.`} />

      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav
          aria-label="Filtrar por estado"
          className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0"
        >
          {[undefined, ...STAGES].map((stage) => {
            const active = stage === estado;
            const count = stage ? data.counts[stage] : data.all;
            return (
              <Link
                key={stage ?? "todos"}
                href={tabHref(stage)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "press flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors duration-150",
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {stage ? STAGE_LABEL[stage] : "Todos"}
                <span className="tabular-nums opacity-60">{count}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-1 items-center gap-2 sm:justify-end">
          {data.presaleCount > 0 && (
            <Link
              href={(() => {
                const qs = new URLSearchParams();
                if (estado) qs.set("estado", estado);
                if (sp.q) qs.set("q", sp.q);
                if (!presale) qs.set("preventa", "1");
                const s = qs.toString();
                return s ? `/admin/pedidos?${s}` : "/admin/pedidos";
              })()}
              aria-pressed={presale}
              className={cn(
                "press flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors duration-150",
                presale ? "border-accent/50 bg-accent/10 text-red-200" : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              Preventa <span className="tabular-nums opacity-60">{data.presaleCount}</span>
            </Link>
          )}
          <SearchForm
            action="/admin/pedidos"
            defaultValue={sp.q}
            placeholder="Buscar por número, nombre o mail"
            hidden={{ estado, preventa: presale ? "1" : undefined }}
          />
        </div>
      </div>

      <Panel>
        {data.orders.length === 0 ? (
          <EmptyState title={sp.q ? `Sin resultados para “${sp.q}”` : "No hay pedidos en este estado"}>
            {(sp.q || estado) && (
              <Link href="/admin/pedidos" className="underline underline-offset-4 hover:text-foreground">
                Ver todos los pedidos
              </Link>
            )}
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-left text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-5 py-3 font-normal">Pedido</th>
                  <th className="px-3 py-3 font-normal">Cliente</th>
                  <th className="px-3 py-3 font-normal">Fecha</th>
                  <th className="px-3 py-3 font-normal">Estado</th>
                  <th className="px-3 py-3 text-right font-normal">Unidades</th>
                  <th className="px-5 py-3 text-right font-normal">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.orders.map((o) => (
                  <tr key={o.id} className="relative transition-colors duration-150 hover:bg-foreground/[0.03]">
                    <td className="px-5 py-3.5 tabular-nums">
                      {/* El link cubre toda la fila */}
                      <Link href={`/admin/pedidos/${o.id}`} className="font-medium after:absolute after:inset-0">
                        #{o.number}
                      </Link>
                      {o.items.some((i) => i.isGift) && (
                        <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-medium text-red-200">Regalo</span>
                      )}
                    </td>
                    <td className="max-w-[14rem] px-3 py-3.5">
                      <span className="block truncate">{o.customer.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">{o.customer.email}</span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-muted-foreground">{shortDate(o.createdAt)}</td>
                    <td className="px-3 py-3.5">
                      <StagePill stage={o.stage} />
                    </td>
                    <td className="px-3 py-3.5 text-right tabular-nums text-muted-foreground">
                      {o.items.reduce((acc, i) => acc + i.quantity, 0)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-right font-medium tabular-nums">
                      {money(o.total, o.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={data.page} pages={data.pages} basePath="/admin/pedidos" params={{ estado, q: sp.q, preventa: presale ? "1" : undefined }} />
      </Panel>
    </>
  );
}
