import { Minus, Plus } from "lucide-react";
import React from "react";

interface Props {
  quantity: number;
  setQuantity: (value: React.SetStateAction<number>) => void;
  max?: number;
}

const stepClass =
  "grid size-11 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground disabled:pointer-events-none disabled:opacity-30";

export default function Quantity({ quantity, setQuantity, max = 8 }: Props) {
  return (
    <div
      role="group"
      aria-label="Cantidad"
      className="flex h-12 shrink-0 items-center rounded-xl border border-border p-0.5"
    >
      <button
        className={stepClass}
        type="button"
        onClick={() => setQuantity((value) => Math.max(1, value - 1))}
        disabled={quantity <= 1}
        aria-label="Reducir cantidad"
      >
        <Minus className="size-4" />
      </button>
      <output className="w-8 text-center text-[15px] font-medium tabular-nums" aria-live="polite">
        {quantity}
      </output>
      <button
        className={stepClass}
        type="button"
        onClick={() => setQuantity((value) => Math.min(max, value + 1))}
        disabled={quantity >= max}
        aria-label="Aumentar cantidad"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
