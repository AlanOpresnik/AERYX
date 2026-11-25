import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, ShieldCheck, ShoppingBag } from "lucide-react";
import { getAccount, getMyOrders } from "@/lib/account/data";
import { getPresaleConfig } from "@/lib/presale-config";
import { OrderCard } from "./_components/OrderCard";
import { dateLabel, isOngoing } from "./_components/order-view";

export const metadata: Metadata = { title: "Resumen" };

function Tile({
  href,
  icon: Icon,
  title,
  children,
  action,
}: {
  href: string;
  icon: typeof MapPin;
  title: string;
  children: React.ReactNode;
  action: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-border p-5 transition-colors duration-150 hover:border-foreground/25 md:p-6"
    >
      <Icon className="size-5 text-muted-foreground" />
      <h3 className="mt-4 font-medium">{title}</h3>
      <div className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">{children}</div>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm">
        {action}
        <ArrowRight className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export default async function ProfileHome() {
  const [account, { orders, error }, presale] = await Promise.all([getAccount(), getMyOrders(), getPresaleConfig()]);
  const ongoing = orders.filter(isOngoing);
  const featured = ongoing[0] ?? orders[0];
  const a = account.address;

  return (
    <div className="flex flex-col gap-12">
      <section aria-labelledby="pedido-reciente">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 id="pedido-reciente" className="text-xl font-medium tracking-[-0.03em]">
            {ongoing.length > 1
              ? `Tenés ${ongoing.length} pedidos en curso`
              : ongoing.length === 1
                ? "Tu pedido en curso"
                : "Tu último pedido"}
          </h2>
          {orders.length > 1 && (
            <Link href="/profile/pedidos" className="text-sm text-muted-foreground hover:text-foreground">
              Ver todos ({orders.length})
            </Link>
          )}
        </div>

        {error ? (
          <div className="rounded-2xl border border-border p-6 text-sm text-muted-foreground">
            No pudimos cargar tus pedidos en este momento. Probá recargar la página en un rato.
          </div>
        ) : featured ? (
          <OrderCard order={featured} shipsFrom={presale.shipsFrom} />
        ) : (
          <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center">
            <ShoppingBag className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-4 font-medium">Todavía no hiciste pedidos</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Cuando compres, vas a poder seguir cada envío desde acá.
            </p>
            <Link
              href="/catalog"
              className="press mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-transform duration-150"
            >
              Ver productos <ArrowRight className="size-4" />
            </Link>
          </div>
        )}
      </section>

      <section aria-label="Tu cuenta" className="grid gap-3 md:grid-cols-2">
        <Tile
          href="/profile/datos"
          icon={MapPin}
          title="Datos de envío"
          action={account.hasAddress ? "Editar datos" : "Agregar dirección"}
        >
          {account.hasAddress ? (
            <address className="not-italic">
              <span className="text-foreground">
                {a.street} {a.number}
                {a.floorApt ? `, ${a.floorApt}` : ""}
              </span>
              <br />
              {[a.city, a.province, a.postalCode].filter(Boolean).join(", ")}
              {account.phone && (
                <>
                  <br />
                  {account.phone}
                </>
              )}
            </address>
          ) : (
            "Guardá tu dirección y teléfono para tenerlos a mano en tu próxima compra."
          )}
        </Tile>

        <Tile
          href="/profile/seguridad"
          icon={ShieldCheck}
          title="Seguridad"
          action="Administrar"
        >
          {account.twoFactor
            ? "Tenés la verificación en dos pasos activada."
            : "Activá la verificación en dos pasos para proteger tu cuenta."}
          <br />
          Cuenta creada el {dateLabel(account.createdAt)}.
        </Tile>
      </section>
    </div>
  );
}
