import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireSuperadmin } from "@/lib/auth/superadmin";
import { listOrders, listProducts } from "@/lib/admin/data";
import { PRESALE_GIFT, presaleStatus } from "@/lib/presale";
import { readPresaleConfig } from "@/lib/presale-config";
import { tiendanube } from "@/lib/tiendanube/client";
import { cn } from "@/lib/utils";
import { money, PageHeader, Panel } from "../_components/ui";
import { PresaleForm } from "./PresaleForm";

export const metadata: Metadata = { title: "Preventa" };
export const dynamic = "force-dynamic";

const STATUS = {
  "al-aire": { label: "Al aire", className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" },
  programada: { label: "Programada", className: "border-sky-400/30 bg-sky-400/10 text-sky-200" },
  terminada: { label: "Terminada", className: "border-border bg-foreground/5 text-muted-foreground" },
  apagada: { label: "Apagada", className: "border-border bg-foreground/5 text-muted-foreground" },
};

const fmt = (d: string) =>
  new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${d}T12:00:00Z`));

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-medium tracking-[-0.04em] tabular-nums">{value}</p>
      {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}

export default async function PresalePage() {
  await requireSuperadmin("/admin/preventa");
  const [config, products, ordersData, gift] = await Promise.all([
    readPresaleConfig(),
    listProducts().catch(() => []),
    listOrders({ presale: true, perPage: 1000 }),
    tiendanube.getProductById(Number(PRESALE_GIFT.productId)).catch(() => null),
  ]);

  const status = STATUS[presaleStatus(config)];
  const categories = [...new Set(products.filter((p) => p.published).map((p) => p.category).filter(Boolean))].sort();
  const giftStock = gift?.variants.find((v) => v.id === PRESALE_GIFT.variantId)?.stock ?? null;

  const active = ordersData.orders.filter((o) => o.stage !== "cancelado" && o.stage !== "reembolsado");
  const paid = active.filter((o) => o.paymentStatus === "paid");
  const giftsGiven = active.reduce((acc, o) => acc + o.items.filter((i) => i.isGift).reduce((a, i) => a + i.quantity, 0), 0);
  const sales = paid.reduce((acc, o) => acc + o.total, 0);

  return (
    <>
      <PageHeader
        title="Preventa"
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", status.className)}>{status.label}</span>
            Del {fmt(config.startsOn)} al {fmt(config.endsOn)}
            {config.shipsFrom ? ` · despacho desde el ${fmt(config.shipsFrom)}` : " · despacho sin definir"}
          </span>
        }
      />

      <section aria-label="Resultados" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Pedidos de preventa" value={String(active.length)} note={`${paid.length} pagados`} />
        <Stat label="Ventas cobradas" value={money(sales)} />
        <Stat label="Mangas regaladas" value={String(giftsGiven)} />
        <Stat
          label="Regalos disponibles"
          value={giftStock === null ? "Sin tope" : String(giftStock)}
          note={giftStock === 0 ? "Se agotaron: el regalo ya no se agrega" : undefined}
        />
      </section>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <Panel title="Configuración">
          <div className="p-5">
            <PresaleForm config={config} categories={categories} giftStock={giftStock} />
          </div>
        </Panel>

        <Panel title="Cómo funciona">
          <ul className="space-y-3 p-5 text-sm leading-relaxed text-muted-foreground">
            <li>
              Durante las fechas, los productos muestran el sello <span className="text-foreground">Preventa</span> y los
              de <span className="text-foreground">{config.qualifyingCategory}</span> avisan que llevan manga de regalo.
            </li>
            <li>
              Al pagar, la tienda suma sola la <span className="text-foreground">{PRESALE_GIFT.name} — Regalo de preventa</span>{" "}
              a $0. Es un producto oculto en Tiendanube: su stock es el tope de regalos.
            </li>
            <li>Si los regalos se agotan, el pedido sigue igual sin regalo y el cliente ve el aviso.</li>
            <li>
              La barra de arriba de la web se maneja aparte, desde{" "}
              <Link href="/admin/anuncios" className="text-foreground underline underline-offset-4">
                Anuncios
              </Link>
              : revisá que sus fechas coincidan con estas.
            </li>
          </ul>
          <div className="border-t border-border p-5">
            <Link
              href="/admin/pedidos?preventa=1"
              className="press inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm hover:bg-foreground/[0.06]"
            >
              Ver pedidos de preventa <ArrowRight className="size-4" />
            </Link>
          </div>
        </Panel>
      </div>
    </>
  );
}
