import React from "react";
import Quantity from "../Quantity/Quantity";
import { ArrowRight, Check, Loader2, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddToCartProps {
  productId: string;
  quantity: number;
  setQuantity: (value: React.SetStateAction<number>) => void;
  added: boolean;
  addToCart: () => void;
  disabled?: boolean;
  loading?: boolean;
  maxQuantity?: number;
}

export default function AddToCart({
  quantity,
  setQuantity,
  added,
  addToCart,
  disabled = false,
  loading = false,
  maxQuantity,
}: AddToCartProps) {
  return (
    <div className="flex gap-2">
      <Quantity quantity={quantity} setQuantity={setQuantity} max={maxQuantity} />

      <button
        type="button"
        onClick={addToCart}
        disabled={disabled || loading}
        className={cn(
          "group flex h-14 min-w-0 flex-1 items-center justify-between gap-3 rounded-full px-5 font-mono sm:px-6 text-[11px] font-medium uppercase tracking-[0.14em] transition-all",
          "disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
          added
            ? "bg-[#f4f4f2] text-[#070707] ring-2 ring-red-400/60"
            : "bg-[#f4f4f2] text-[#070707] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(244,244,242,.45)]",
        )}
      >
        <span className="flex items-center gap-3 whitespace-nowrap">
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : added ? (
            <Check className="size-4" />
          ) : (
            <ShoppingBag className="size-4" />
          )}
          {disabled ? "Sin stock" : added ? "Agregado al carrito" : "Agregar al carrito"}
        </span>
        {!disabled && (
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        )}
      </button>
    </div>
  );
}
