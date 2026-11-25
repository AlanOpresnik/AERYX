import type { Metadata } from "next";
import Link from "next/link";
import { timingSafeEqual } from "crypto";
import { ArrowRight, Gift, Mail, Package, UserRound } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { Footer } from "@/components/Footer/Footer";
import { tiendanube } from "@/lib/tiendanube/client";
import { toAdminOrder, withPresale } from "@/lib/tiendanube/orders";
import type { TiendanubeOrderFull } from "@/lib/tiendanube/types";
import { getPresaleConfig } from "@/lib/presale-config";
import { currency } from "@/lib/utils";
import { AfterPurchase, PendingOrderResolver } from "./AfterPurchase";

export const metadata: Metadata = { title: "¡Gracias por tu compra! — Aeryx", robots: { index: false } };
export const dynamic = "force-dynamic";

function sameToken(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

const maskEmail = (email: string) => {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  return `${user.slice(0, 2)}${"•".repeat(Math.max(1, user.length - 2))}@${domain}`;
};

const longDate = (d: string) =>
  new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${d}T12:00:00Z`));

async function loadOrder(id: number, token: string) {
  try {
    const raw = (await tiendanube.getOrderById(id)) as TiendanubeOrderFull & { token?: string };
    if (!raw?.token || !sameToken(raw.token, token)) return null;
    const order = toAdminOrder(raw);
    // Sin pagar: el link para retomar el pago está en el pedido borrador
    let checkoutUrl: string | null = null;
    if (order.number === "0") {
      const draft = await tiendanube.getDraftOrder(id).catch(() => null);
      checkoutUrl = draft?.checkout_url || draft?.abandoned_checkout_url || null;
    }
    return { order, checkoutUrl };
  } catch {
    return null;
  }
}

function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-6 pb-28 pt-40 text-center">
      <h1 className="text-3xl font-medium tracking-[-0.04em]">No encontramos tu compra</h1>
      <p className="mt-3 text-muted-foreground">
        Si ya pagaste, te llega la confirmación por mail. También podés ver tus pedidos en tu cuenta.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/profile/pedidos" className="press inline-flex h-11 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background">
          Ver mis pedidos
        </Link>
        <Link href="/catalog" className="press inline-flex h-11 items-center rounded-full border border-border px-5 text-sm">
          Seguir comprando
        </Link>
      </div>
    </section>
  );
}

export default async function ThanksPage({ searchParams }: { searchParams: Promise<{ orden?: string; t?: string }> }) {
  const { orden, t } = await searchParams;
  const id = Number(orden);

  // Sin datos en la URL: se buscan en el navegador (el pedido que se fue a pagar)
  if (!orden || !t) {
    return (
      <>
        <PendingOrderResolver fallback={<NotFound />} />
        <Footer />
      </>
    );
  }

  const [found, { userId }, presale] = await Promise.all([
    Number.isInteger(id) ? loadOrder(id, t) : Promise.resolve(null),
    auth(),
    getPresaleConfig(),
  ]);

  if (!found) {
    return (
      <>
        <NotFound />
        <Footer />
      </>
    );
  }

  const { checkoutUrl } = found;
  const order = withPresale([found.order], presale)[0];
  const completed = order.number !== "0";
  const paid = order.paymentStatus === "paid" || order.paymentStatus === "authorized";
  const cancelled = order.stage === "cancelado";
  const giftItem = order.items.find((i) => i.isGift);
  const products = order.items.filter((i) => !i.isGift);
  const firstName = order.customer.name.split(" ")[0];

  const title = cancelled
    ? "Este pedido fue cancelado"
    : !completed
      ? "Todavía no terminaste el pago"
      : paid
        ? `¡Listo${firstName && firstName !== "Sin" ? `, ${firstName}` : ""}! Tu compra está confirmada`
        : "Recibimos tu pedido";
  const subtitle = cancelled
    ? "Si fue un error, escribinos y lo resolvemos."
    : !completed
      ? "Tu carrito te espera: podés retomar el pago donde lo dejaste."
      : paid
        ? `Pedido #${order.number}. Ya lo estamos preparando.`
        : `Pedido #${order.number}. Apenas se acredite el pago lo empezamos a preparar.`;

  return (
    <>
      <AfterPurchase completed={completed} />
      <main className="bg-background text-foreground">
        <section className="mx-auto max-w-3xl px-6 pb-20 pt-36 md:pt-44">
          <div className="thanks-enter">
            {completed && !cancelled && (
              <svg viewBox="0 0 52 52" className="thanks-check mb-8 size-14 text-accent" aria-hidden="true">
                <circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M15 27 l7 7 l15 -16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            <h1 className="text-[clamp(2.25rem,6vw,4rem)] font-medium leading-[1] tracking-[-0.045em] text-balance">{title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>

            {!completed && !cancelled && checkoutUrl && (
              <a
                href={checkoutUrl}
                className="press mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-[15px] font-medium text-background"
              >
                Volver al pago <ArrowRight className="size-4" />
              </a>
            )}
          </div>

          {giftItem && !cancelled && (
            <div className="thanks-gift mt-12 flex items-center gap-5 rounded-3xl border border-accent/40 bg-accent/10 p-4 md:p-5">
              <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-[#161616] md:size-28">
                {giftItem.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={giftItem.image} alt="" className="size-full object-cover" />
                )}
              </div>
              <div className="min-w-0">
                <p className="inline-flex items-center gap-2 text-sm font-medium text-red-200">
                  <Gift className="size-4" /> Regalo de preventa
                </p>
                <p className="mt-1.5 text-xl font-medium tracking-[-0.02em]">
                  {completed ? "Tu manga de compresión ya está reservada" : "Tu manga de regalo te espera"}
                  {giftItem.quantity > 1 ? ` (× ${giftItem.quantity})` : ""}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Viaja en el mismo paquete, sin costo.
                  {presale.shipsFrom ? ` Despachamos desde el ${longDate(presale.shipsFrom)}.` : ""}
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 rounded-3xl border border-border">
            <ul className="divide-y divide-border">
              {products.map((item, i) => (
                <li key={`${item.productId}-${i}`} className="flex items-center gap-4 p-4 md:px-5">
                  <span className="size-14 shrink-0 overflow-hidden rounded-xl bg-[#161616]">
                    {item.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt="" className="size-full object-cover" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground tabular-nums">× {item.quantity}</p>
                  </div>
                  <p className="text-sm tabular-nums">{currency.format(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>
            <dl className="space-y-1.5 border-t border-border p-4 text-sm md:px-5">
              {order.shippingCost > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Envío</dt>
                  <dd className="tabular-nums">{currency.format(order.shippingCost)}</dd>
                </div>
              )}
              <div className="flex justify-between text-base font-medium">
                <dt>Total</dt>
                <dd className="tabular-nums">{currency.format(order.total)}</dd>
              </div>
            </dl>
          </div>

          {completed && !cancelled && (
            <section aria-labelledby="que-sigue" className="mt-12">
              <h2 id="que-sigue" className="text-xl font-medium tracking-[-0.03em]">
                Qué sigue
              </h2>
              <ol className="mt-5 grid gap-3 md:grid-cols-3">
                <li className="rounded-2xl border border-border p-5">
                  <Mail className="size-5 text-muted-foreground" />
                  <p className="mt-4 font-medium">Te llega el mail</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Con el detalle del pedido{order.customer.email ? ` a ${maskEmail(order.customer.email)}` : ""}.
                  </p>
                </li>
                <li className="rounded-2xl border border-border p-5">
                  <Package className="size-5 text-muted-foreground" />
                  <p className="mt-4 font-medium">Lo preparamos</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {order.isPresale && presale.shipsFrom
                      ? `Los pedidos de preventa salen desde el ${longDate(presale.shipsFrom)}.`
                      : "Te avisamos por mail cuando sale, con el número de seguimiento."}
                  </p>
                </li>
                <li className="rounded-2xl border border-border p-5">
                  <UserRound className="size-5 text-muted-foreground" />
                  <p className="mt-4 font-medium">Seguilo desde tu cuenta</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {userId ? (
                      <Link href="/profile/pedidos" className="underline underline-offset-4 hover:text-foreground">
                        Ver mis pedidos
                      </Link>
                    ) : (
                      <>
                        <Link href="/registro" className="underline underline-offset-4 hover:text-foreground">
                          Creá tu cuenta
                        </Link>{" "}
                        con el mismo mail y lo ves ahí.
                      </>
                    )}
                  </p>
                </li>
              </ol>
            </section>
          )}

          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <Link href="/catalog" className="press inline-flex h-11 items-center gap-2 rounded-full border border-border px-5">
              Seguir comprando
            </Link>
            <a href={`mailto:hola@aeryx.gg?subject=${encodeURIComponent(`Consulta por el pedido #${order.number}`)}`} className="text-muted-foreground underline underline-offset-4 hover:text-foreground">
              ¿Alguna duda? Escribinos
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
