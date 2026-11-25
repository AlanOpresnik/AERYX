import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { getStoreLinks, listProducts } from "@/lib/admin/data";
import { ButtonLink, EmptyState, money, PageHeader, Panel } from "../_components/ui";
import { PublishToggle } from "./PublishToggle";

export const metadata: Metadata = { title: "Productos" };
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const [products, store] = await Promise.all([listProducts(), getStoreLinks()]);
  const published = products.filter((p) => p.published).length;

  return (
    <>
      <PageHeader
        title="Productos"
        description={`${products.length} en Tiendanube · ${published} publicados`}
        actions={
          <ButtonLink href="/admin/productos/nuevo" variant="primary">
            <Plus className="size-4" />
            Nuevo producto
          </ButtonLink>
        }
      />

      <Panel>
        {products.length === 0 ? (
          <EmptyState title="Todavía no hay productos">
            <Link href="/admin/productos/nuevo" className="underline underline-offset-4 hover:text-foreground">
              Cargá el primero
            </Link>
          </EmptyState>
        ) : (
          <ul className="divide-y divide-border">
            {products.map((p) => (
              <li
                key={p.id}
                className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-3 px-5 py-4 md:grid-cols-[3.5rem_minmax(0,1fr)_8rem_9rem_8rem_auto]"
              >
                <div className="size-14 overflow-hidden rounded-xl bg-foreground/5">
                  {p.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt="" className="size-full object-cover" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {[p.category, `${p.variants.length} ${p.variants.length === 1 ? "variante" : "variantes"}`]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>

                <div className="col-start-2 text-sm tabular-nums md:col-start-auto">
                  <span className="font-medium">{money(p.price)}</span>
                  {p.originalPrice > p.price && (
                    <span className="ml-2 text-xs text-muted-foreground line-through">{money(p.originalPrice)}</span>
                  )}
                </div>

                <div className="col-start-2 text-sm md:col-start-auto">
                  {p.stock === null ? (
                    <span className="text-muted-foreground">Sin límite</span>
                  ) : (
                    <span className={p.stock === 0 ? "text-red-300" : p.stock <= 5 ? "text-amber-200" : ""}>
                      {p.stock === 0 ? "Agotado" : `${p.stock} en stock`}
                    </span>
                  )}
                  {p.variants.length > 1 && (
                    <details className="mt-1 text-xs text-muted-foreground">
                      <summary className="cursor-pointer hover:text-foreground">Por variante</summary>
                      <ul className="mt-1 space-y-0.5 tabular-nums">
                        {p.variants.map((v) => (
                          <li key={v.id} className="flex justify-between gap-3">
                            <span className="truncate">{v.label}</span>
                            <span>{v.stock === null ? "∞" : v.stock}</span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>

                <div className="col-start-2 md:col-start-auto">
                  <PublishToggle id={p.id} published={p.published} name={p.name} />
                </div>

                <div className="col-start-2 flex gap-3 text-sm md:col-start-auto md:justify-end">
                  {p.published && (
                    <Link
                      href={`/products/${p.slug}`}
                      target="_blank"
                      className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      Ver
                    </Link>
                  )}
                  {store.admin && (
                    <a
                      href={`${store.admin}/products/${p.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-0.5 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      Editar <ArrowUpRight className="size-3.5" />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
