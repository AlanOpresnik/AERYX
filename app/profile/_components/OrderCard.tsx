import { ChevronDown, ExternalLink, Gift } from "lucide-react";
import { PRESALE_GIFT } from "@/lib/presale";
import Link from "next/link";
import type { AdminOrder } from "@/lib/tiendanube/orders";
import { cn } from "@/lib/utils";
import { CUSTOMER_STAGE, dateLabel, money, progress } from "./order-view";

const TONE = {
  wait: "bg-amber-300",
  active: "bg-accent",
  done: "bg-emerald-300",
  off: "bg-muted-foreground",
};

export function StatusLabel({ order }: { order: AdminOrder }) {
  const stage = CUSTOMER_STAGE[order.stage];
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span aria-hidden="true" className={cn("size-2 rounded-full", TONE[stage.tone])} />
      {stage.label}
    </span>
  );
}

/** Recorrido del pedido: barra en cuatro tramos con el nombre de cada paso. */
export function OrderProgress({ order }: { order: AdminOrder }) {
  const p = progress(order);
  if (!p) return null;
  return (
    <div>
      <ol className="grid grid-cols-4 gap-1.5" aria-label={`Paso ${p.done} de ${p.steps.length}`}>
        {p.steps.map((step, i) => (
          <li key={step} className="flex flex-col gap-2">
            <span
              aria-hidden="true"
              className={cn("h-1 rounded-full", i < p.done ? "bg-foreground" : "bg-foreground/12")}
            />
            <span
              className={cn(
                "text-[11px] leading-tight sm:text-xs",
                i < p.done ? "text-foreground" : "text-muted-foreground",
                i === p.done - 1 && "font-medium",
              )}
            >
              {step}
              {i === p.done - 1 && <span className="sr-only"> (paso actual)</span>}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Thumbs({ order }: { order: AdminOrder }) {
  const shown = order.items.slice(0, 3);
  const rest = order.items.length - shown.length;
  return (
    <div className="flex -space-x-3">
      {shown.map((item, i) => (
        <span
          key={`${item.productId}-${i}`}
          className="size-12 overflow-hidden rounded-xl bg-[#161616] ring-2 ring-background"
        >
          {item.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image} alt="" className="size-full object-cover" />
          )}
        </span>
      ))}
      {rest > 0 && (
        <span className="grid size-12 place-items-center rounded-xl bg-[#161616] text-xs text-muted-foreground ring-2 ring-background tabular-nums">
          +{rest}
        </span>
      )}
    </div>
  );
}

/** Tarjeta de pedido que se despliega para ver el detalle. Funciona sin JavaScript. */
export function OrderCard({
  order,
  open = false,
  shipsFrom = "",
}: {
  order: AdminOrder;
  open?: boolean;
  /** Fecha de despacho de la preventa (YYYY-MM-DD) */
  shipsFrom?: string;
}) {
  const units = order.items.reduce((a, i) => a + i.quantity, 0);
  const stage = CUSTOMER_STAGE[order.stage];

  return (
    <details open={open} className="group rounded-2xl border border-border bg-[#0d0d0d] transition-colors duration-150 open:border-foreground/20 hover:border-foreground/20">
      <summary className="flex cursor-pointer list-none flex-col gap-5 p-5 md:p-6 [&::-webkit-details-marker]:hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <StatusLabel order={order} />
              {order.isPresale && (
                <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">Preventa</span>
              )}
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Pedido #{order.number} · {dateLabel(order.createdAt)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <p className="text-lg font-medium tracking-[-0.02em] tabular-nums">{money(order.total, order.currency)}</p>
            <ChevronDown
              aria-hidden="true"
              className="size-5 text-muted-foreground transition-transform duration-200 ease-out group-open:rotate-180"
            />
          </div>
        </div>

        <OrderProgress order={order} />

        <div className="flex items-center gap-4">
          <Thumbs order={order} />
          <p className="min-w-0 text-sm text-muted-foreground">
            <span className="line-clamp-1 text-foreground">{order.items.map((i) => (i.isGift ? `${PRESALE_GIFT.name} de regalo` : i.name)).join(", ")}</span>
            {units} {units === 1 ? "producto" : "productos"}
          </p>
        </div>
        <span className="sr-only">Ver detalle del pedido</span>
      </summary>

      <div className="border-t border-border px-5 pb-5 pt-4 md:px-6 md:pb-6">
        <p className="mb-4 text-sm text-muted-foreground">{stage.hint}</p>

        {order.items.some((i) => i.isGift) && (
          <p className="mb-4 flex items-center gap-2 rounded-xl bg-accent/10 px-4 py-3 text-sm">
            <Gift className="size-4 shrink-0 text-accent" />
            Tu regalo de preventa viaja con este pedido.
            {shipsFrom ? ` Despachamos desde el ${new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${shipsFrom}T12:00:00Z`))}.` : ""}
          </p>
        )}

        {order.tracking && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-foreground/[0.04] px-4 py-3 text-sm">
            <span>
              <span className="text-muted-foreground">Seguimiento:</span>{" "}
              <span className="font-medium tabular-nums">{order.tracking.number}</span>
            </span>
            {order.tracking.url && (
              <a
                href={order.tracking.url}
                target="_blank"
                rel="noreferrer"
                className="press inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-medium text-background"
              >
                Seguir envío <ExternalLink className="size-3.5" />
              </a>
            )}
          </div>
        )}

        <ul className="divide-y divide-border">
          {order.items.map((item, i) => (
            <li key={`${item.productId}-${i}`} className="flex items-center gap-4 py-3">
              <span className="size-14 shrink-0 overflow-hidden rounded-xl bg-[#161616]">
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt="" className="size-full object-cover" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.isGift ? `${PRESALE_GIFT.name} · regalo de preventa` : item.name}</p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {item.quantity} × {money(item.price, order.currency)}
                </p>
              </div>
              <p className="text-sm tabular-nums">
                {item.isGift ? <span className="font-medium text-red-300">Regalo</span> : money(item.price * item.quantity, order.currency)}
              </p>
            </li>
          ))}
        </ul>

        <dl className="mt-2 space-y-1.5 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="tabular-nums">{money(order.subtotal, order.currency)}</dd>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Descuento</dt>
              <dd className="tabular-nums">−{money(order.discount, order.currency)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Envío{order.shippingOption ? ` · ${order.shippingOption}` : ""}</dt>
            <dd className="tabular-nums">{order.shippingCost > 0 ? money(order.shippingCost, order.currency) : "Sin costo"}</dd>
          </div>
          <div className="flex justify-between pt-1.5 text-base font-medium">
            <dt>Total</dt>
            <dd className="tabular-nums">{money(order.total, order.currency)}</dd>
          </div>
        </dl>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {order.address && (
            <p className="text-muted-foreground">
              Envío a <span className="text-foreground">{order.address.line}</span>
              {order.address.city ? `, ${order.address.city}` : ""}
            </p>
          )}
          <Link
            href={`mailto:hola@aeryx.gg?subject=${encodeURIComponent(`Consulta por el pedido #${order.number}`)}`}
            className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            ¿Algún problema con este pedido?
          </Link>
        </div>
      </div>
    </details>
  );
}
