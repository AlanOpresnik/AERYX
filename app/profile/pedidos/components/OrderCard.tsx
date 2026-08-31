import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { OrderInfoGrid } from "./OrderInfoGrid";
import type { Order } from "@/lib/interface/Order";
import { OrderStatusBadge } from "./OrderBadge";
import { OrderItemsList } from "./OrderItemList";
import { getOrderStatus } from "@/lib/interface/order-helper";

export function OrderCard({ order }: { order: Order }) {
  const status = getOrderStatus(order.status);

  return (
    <article className="border border-black/10 bg-white transition hover:border-black/25">
      {/* HEADER */}
      <div className="border-b border-black/10 px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white">
              <Package className="h-5 w-5" strokeWidth={1.5} />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-black/40">
                Pedido
              </p>
              <p className="mt-1 break-all font-mono text-sm font-semibold">
                #{order._id}
              </p>
              <p className="mt-1 text-xs text-black/40">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          <OrderStatusBadge status={status} />
        </div>
      </div>

      <OrderItemsList items={order.items} />
      <OrderInfoGrid order={order} />

      {/* FOOTER */}
      <div className="flex flex-col gap-4 border-t border-black/10 bg-[#fafaf8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-black/40">
            Estado del pedido
          </p>
          <p className="mt-1 text-xs text-black/60">{status.description}</p>
        </div>

        <Link
          href={`/checkout/payment/success?external_reference=${order._id}`}
          className="group inline-flex items-center !text-white justify-center gap-3 bg-black px-6 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#1a1a1a]"
        >
          Ver pedido
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={1.5}
          />
        </Link>
      </div>
    </article>
  );
}