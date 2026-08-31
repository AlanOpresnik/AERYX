import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";

export function OrdersEmptyState() {
  return (
    <div className="flex min-h-[500px] items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-black text-white">
          <Package className="h-8 w-8" strokeWidth={1.5} />
        </div>

        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
          Historial de compras
        </p>

        <h1 className="font-display text-5xl tracking-[-0.07em]">
          Todavía no tenés pedidos
        </h1>

        <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-black/50">
          Cuando realices una compra, vas a poder consultar acá todos tus
          pedidos y su estado.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-3 bg-black px-10 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#1a1a1a]"
        >
          Empezar a comprar
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
}