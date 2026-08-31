import { OrderItemRow } from "./OrderItemRow";
import type { Order } from "@/lib/interface/Order";

export function OrderItemsList({ items }: { items: Order["items"] }) {
  const visible = items.slice(0, 3);
  const remaining = items.length - visible.length;

  return (
    <div className="px-5 py-6 sm:px-7">
      <div className="mb-5 flex items-center justify-between border-b border-black/10 pb-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.17em]">
          Productos
        </p>
        <p className="text-[10px] uppercase tracking-[0.14em] text-black/40">
          {items.length} {items.length === 1 ? "producto" : "productos"}
        </p>
      </div>

      <div className="space-y-4">
        {visible.map((item) => (
          <OrderItemRow key={item.productId} item={item} />
        ))}

        {remaining > 0 && (
          <p className="pt-1 text-xs text-black/40">
            + {remaining} productos más
          </p>
        )}
      </div>
    </div>
  );
}