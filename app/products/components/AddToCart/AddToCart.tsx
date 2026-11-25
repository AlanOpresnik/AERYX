import React from "react";
import Quantity from "../Quantity/Quantity";
import { Check, Loader2 } from "lucide-react";
import { cn, currency } from "@/lib/utils";

interface AddToCartProps {
  productId: string;
  quantity: number;
  setQuantity: (value: React.SetStateAction<number>) => void;
  added: boolean;
  addToCart: () => void;
  unitPrice: number;
  disabled?: boolean;
  loading?: boolean;
  maxQuantity?: number;
  /** Estado de stock que se muestra junto al selector de cantidad */
  status?: React.ReactNode;
}

export default function AddToCart({
  quantity,
  setQuantity,
  added,
  addToCart,
  unitPrice,
  disabled = false,
  loading = false,
  maxQuantity,
  status,
}: AddToCartProps) {
  const label = disabled
    ? "Sin stock"
    : loading
      ? "Agregando…"
      : added
        ? "Agregado al carrito"
        : "Agregar al carrito";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <Quantity quantity={quantity} setQuantity={setQuantity} max={maxQuantity} />
        {status}
      </div>

      <button
        type="button"
        onClick={addToCart}
        disabled={disabled || loading}
        aria-live="polite"
        className={cn(
          "group relative flex h-14 w-full items-center justify-between overflow-hidden rounded-xl px-5 text-[15px] font-medium transition-[background-color,transform,box-shadow] duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed",
          disabled
            ? "bg-muted text-muted-foreground"
            : "bg-foreground text-background hover:bg-white active:scale-[0.99]",
        )}
      >
        <span className="flex items-center gap-2.5">
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : added ? (
            <Check className="size-4" />
          ) : null}
          {label}
        </span>
        {!disabled && (
          <span className="flex items-center gap-4 tabular-nums">
            <span aria-hidden="true" className="h-5 w-px bg-background/15" />
            {currency.format(unitPrice * quantity)}
          </span>
        )}
      </button>
    </div>
  );
}
