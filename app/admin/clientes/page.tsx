import type { Metadata } from "next";
import Link from "next/link";
import { listCustomers } from "@/lib/admin/data";
import { EmptyState, money, PageHeader, Pagination, Panel, SearchForm, shortDate } from "../_components/ui";

export const metadata: Metadata = { title: "Clientes" };
export const dynamic = "force-dynamic";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const data = await listCustomers({ q: sp.q, page: Number(sp.page) || 1 });

  return (
    <>
      <PageHeader title="Clientes" description={`${data.total} ${data.total === 1 ? "cliente" : "clientes"} en Tiendanube.`} />

      <div className="mb-3 flex">
        <SearchForm action="/admin/clientes" defaultValue={sp.q} placeholder="Buscar por nombre o mail" />
      </div>

      <Panel>
        {data.customers.length === 0 ? (
          <EmptyState title={sp.q ? `Sin resultados para “${sp.q}”` : "Todavía no hay clientes"}>
            {sp.q && (
              <Link href="/admin/clientes" className="underline underline-offset-4 hover:text-foreground">
                Ver todos
              </Link>
            )}
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-left text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-5 py-3 font-normal">Cliente</th>
                  <th className="px-3 py-3 font-normal">Teléfono</th>
                  <th className="px-3 py-3 font-normal">Ubicación</th>
                  <th className="px-3 py-3 font-normal">Alta</th>
                  <th className="px-3 py-3 text-right font-normal">Total gastado</th>
                  <th className="px-5 py-3 text-right font-normal">Último pedido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.customers.map((c) => (
                  <tr key={c.id} className="transition-colors duration-150 hover:bg-foreground/[0.03]">
                    <td className="max-w-[16rem] px-5 py-3.5">
                      <span className="block truncate font-medium">{c.name}</span>
                      <a
                        href={`mailto:${c.email}`}
                        className="block truncate text-xs text-muted-foreground hover:text-foreground"
                      >
                        {c.email}
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-muted-foreground">
                      {c.phone ? (
                        <a href={`tel:${c.phone}`} className="hover:text-foreground">
                          {c.phone}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-3 py-3.5 text-muted-foreground">{c.city || "—"}</td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-muted-foreground">{shortDate(c.createdAt)}</td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-right tabular-nums">{money(c.totalSpent)}</td>
                    <td className="px-5 py-3.5 text-right">
                      {c.lastOrderId ? (
                        <Link
                          href={`/admin/pedidos/${c.lastOrderId}`}
                          className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                        >
                          Ver pedido
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={data.page} pages={data.pages} basePath="/admin/clientes" params={{ q: sp.q }} />
      </Panel>
    </>
  );
}
