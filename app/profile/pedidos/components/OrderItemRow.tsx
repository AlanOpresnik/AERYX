import { Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/interface/Order";

export function OrderItemRow({ item }: { item: Order["items"][number] }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden border border-black/10 bg-[#f4f4f1]">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Package className="h-5 w-5 text-black/25" strokeWidth={1.5} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{item.name}</p>
        <p className="mt-1 text-xs text-black/45">
          Cantidad: {item.quantity}
        </p>
      </div>

      <p className="shrink-0 text-sm font-semibold">
        {formatPrice(item.subtotal)}
      </p>
    </div>
  );
}