import { CheckoutItem } from "@/lib/interface/cart";
import { Product } from "@/lib/interface/ProductInterface";
import { Minus, Plus } from "lucide-react";
import React from "react";

interface Props {
  items: CheckoutItem[];
  handleUpdateQuantity: (productId: string, delta: number) => void;
  cartLoading: boolean;
}

export default function AsideProducts({
  items,
  handleUpdateQuantity,
  cartLoading,
}: Props) {
  return (
    <div className="divide-y divide-black/10">
      {items.map((item) => (
        <div key={item.productId} className="flex gap-4 px-5 py-4">
          <div className="relative h-20 w-16 shrink-0 overflow-hidden">
            <img
              src={item.image || ''}
              alt={item.name}
              className="h-full w-full object-cover"
            />

            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-bold text-white">
              {item.quantity}
            </span>
          </div>

          <div className="flex flex-1 flex-col justify-between">
            <div>
              <h3 className="font-display text-base tracking-[-0.03em]">
                {item.name}
              </h3>

              <p className="mt-0.5 text-[11px] text-black/45">{item.name}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center border border-black/20">
                <button
                  onClick={() => handleUpdateQuantity(item.productId, -1)}
                  disabled={cartLoading}
                  className="p-1.5 transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Restar"
                >
                  <Minus className="h-3 w-3" />
                </button>

                <span className="px-2 text-xs font-semibold">
                  {item.quantity}
                </span>

                <button
                  onClick={() => handleUpdateQuantity(item.productId, 1)}
                  disabled={cartLoading}
                  className="p-1.5 transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Sumar"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              <p className="text-sm font-semibold">
                €{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
