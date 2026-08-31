import { OrderStatusInfo } from "@/lib/interface/order-helper";

export function OrderStatusBadge({ status }: { status: OrderStatusInfo }) {
  const Icon = status.icon;

  return (
    <div
      className={`inline-flex w-fit items-center gap-2 border rounded-xl px-3 py-2 ${status.className}`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      <p className="text-[9px] font-bold uppercase tracking-[0.12em]">
        {status.label}
      </p>
    </div>
  );
}