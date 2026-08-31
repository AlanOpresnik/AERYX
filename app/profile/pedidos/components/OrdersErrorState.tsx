import { Package } from "lucide-react";
import { RefreshButton } from "@/app/profile/pedidos/RefresButton";

export function OrdersErrorState() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">
          <Package className="h-7 w-7" strokeWidth={1.5} />
        </div>

        <h1 className="font-display text-4xl tracking-[-0.06em]">
          No pudimos cargar tus pedidos
        </h1>

        <p className="mt-4 text-sm leading-6 text-black/50">
          Ocurrió un error obteniendo tus pedidos.
        </p>

        <RefreshButton />
      </div>
    </div>
  );
}