import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Mail, Phone } from "lucide-react";
import { getOrder, getStoreLinks, PAYMENT_LABEL, SHIPPING_LABEL } from "@/lib/admin/data";
import { ButtonLink, longDate, money, Panel, StagePill } from "../../_components/ui";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  return { title: `Pedido ${(await params).id}` };
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [order, store] = await Promise.all([getOrder(id), getStoreLinks()]);
  if (!order) notFound();

  const units = order.items.reduce((a, i) => a + i.quantity, 0);

  return (
    <>
      <Link
        href="/admin/pedidos"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Pedidos
      </Link>

      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-medium tracking-[-0.04em] tabular-nums md:text-4xl">
              Pedido #{order.number}
            </h1>
            <StagePill stage={order.stage} />
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">{longDate(order.createdAt)}</p>
        </div>
        {store.admin && (
          <ButtonLink href={`${store.admin}/orders/${order.id}`} external>
            Gestionar en Tiendanube <ArrowUpRight className="size-4" />
          </ButtonLink>
        )}
      </header>

      <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-3">
          <Panel title={`Productos (${units})`}>
            <ul className="divide-y divide-border">
              {order.items.map((item, i) => (
                <li key={`${item.productId}-${i}`} className="flex items-center gap-4 px-5 py-4">
                  <div className="size-14 shrink-0 overflow-hidden rounded-xl bg-foreground/5">
                    {item.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt="" className="size-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {item.name}
                      {item.isGift && (
                        <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-medium text-red-200">Regalo</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      {item.quantity} × {money(item.price, order.currency)}
                      {item.sku ? ` · SKU ${item.sku}` : ""}
                    </p>
                  </div>
                  <p className="text-sm font-medium tabular-nums">
                    {item.isGift ? "Regalo" : money(item.price * item.quantity, order.currency)}
                  </p>
                </li>
              ))}
            </ul>
            <dl className="border-t border-border px-5 py-3">
              <Row label="Subtotal">{money(order.subtotal, order.currency)}</Row>
              {order.discount > 0 && <Row label="Descuento">−{money(order.discount, order.currency)}</Row>}
              <Row label="Envío">
                {order.shippingCost > 0 ? money(order.shippingCost, order.currency) : "Sin costo"}
              </Row>
              <div className="mt-1 flex justify-between border-t border-border pt-3 text-base font-medium">
                <dt>Total</dt>
                <dd className="tabular-nums">{money(order.total, order.currency)}</dd>
              </div>
            </dl>
          </Panel>

          {order.note && (
            <Panel title="Nota del cliente">
              <p className="whitespace-pre-line px-5 py-4 text-sm text-muted-foreground">{order.note}</p>
            </Panel>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Panel title="Cliente">
            <div className="flex flex-col gap-2 px-5 py-4 text-sm">
              <p className="font-medium">{order.customer.name}</p>
              {order.customer.email && (
                <a
                  href={`mailto:${order.customer.email}`}
                  className="flex items-center gap-2 break-all text-muted-foreground hover:text-foreground"
                >
                  <Mail className="size-4 shrink-0" /> {order.customer.email}
                </a>
              )}
              {order.customer.phone && (
                <a
                  href={`tel:${order.customer.phone}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Phone className="size-4 shrink-0" /> {order.customer.phone}
                </a>
              )}
            </div>
          </Panel>

          <Panel title="Pago">
            <dl className="px-5 py-2">
              <Row label="Estado">{PAYMENT_LABEL[order.paymentStatus] ?? order.paymentStatus}</Row>
              {order.gateway && <Row label="Medio">{order.gateway}</Row>}
              {order.paidAt && <Row label="Cobrado">{longDate(order.paidAt)}</Row>}
            </dl>
          </Panel>

          <Panel title="Envío">
            <dl className="px-5 py-2">
              <Row label="Estado">{SHIPPING_LABEL[order.shippingStatus] ?? (order.shippingStatus || "—")}</Row>
              {order.shippingOption && <Row label="Método">{order.shippingOption}</Row>}
              {order.tracking && (
                <Row label="Seguimiento">
                  {order.tracking.url ? (
                    <a href={order.tracking.url} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                      {order.tracking.number}
                    </a>
                  ) : (
                    order.tracking.number
                  )}
                </Row>
              )}
            </dl>
            {order.address && (
              <address className="border-t border-border px-5 py-4 text-sm not-italic text-muted-foreground">
                <span className="block text-foreground">{order.address.line}</span>
                {order.address.city && <span className="block">{order.address.city}</span>}
                {order.address.province && <span className="block">{order.address.province}</span>}
              </address>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
