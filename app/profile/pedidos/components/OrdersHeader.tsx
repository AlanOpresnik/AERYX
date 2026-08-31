export function OrdersHeader({ count }: { count: number }) {
  return (
    <section className="mb-12">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
        Historial de compras
      </p>

      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <h1 className="font-display text-6xl tracking-[-0.08em] sm:text-7xl lg:text-8xl">
            Mis pedidos
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-black/50">
            Consultá todas tus compras, estados de pago y seguimiento de tus
            pedidos.
          </p>
        </div>

        <div className="shrink-0 border border-black/15 rounded-xl bg-white px-5 py-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-black/40">
            Total de pedidos
          </p>
          <p className="mt-1 font-display text-3xl tracking-[-0.05em]">
            {count}
          </p>
        </div>
      </div>
    </section>
  );
}