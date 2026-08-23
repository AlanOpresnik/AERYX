import { Landmark } from "lucide-react";
import { StatusPill } from "../StatusPill/StatusPill";
import TimelineStep, {
  type TimelineStepData,
} from "../TimeLineStep/TimeLineStep";
import { Order, OrderStatus } from "@/lib/interface/OrderInterface";



interface OrderCardProps {
  order: Order;
  cardRef?: React.Ref<HTMLElement>;
  highlighted?: boolean;
}

const STATUS_META: Record<
  OrderStatus,
  {
    label: string;
    tone: "amber" | "emerald" | "neutral";
  }
> = {
  revision: {
    label: "En revisión",
    tone: "amber",
  },
  shipped: {
    label: "Enviado",
    tone: "emerald",
  },
  delivered: {
    label: "Entregado",
    tone: "neutral",
  },
};

export function OrderCard({
  order,
  cardRef,
  highlighted = false,
}: OrderCardProps) {
  const meta = STATUS_META[order.status];

  return (
    <article
      ref={cardRef}
      className={`bg-white border rounded-2xl p-6 mb-4 transition-shadow duration-300 border-neutral-200 ${
        highlighted ? "ring-2 ring-amber-200" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <StatusPill tone={meta.tone}>
            {meta.label}
          </StatusPill>

          <h3 className="font-display text-lg mt-2 text-neutral-900">
            Pedido{" "}
            <span className="font-plex text-sm text-neutral-500">
              #{order.id}
            </span>
          </h3>

          <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1.5">
            {order.method === "Transferencia bancaria" && (
              <Landmark className="w-3.5 h-3.5" />
            )}

            {order.method} ·{" "}
            <span className="font-plex">{order.amount}</span> ·{" "}
            {order.date}
          </p>
        </div>

        {order.status !== "revision" && (
          <button
            type="button"
            className="text-xs font-medium text-neutral-500 border border-neutral-200 rounded-full px-3 py-1.5 hover:border-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Ver detalle
          </button>
        )}
      </div>

      {order.timeline && (
        <div className="mt-6">
          {order.timeline.map((step, i) => (
            <TimelineStep
              key={step.title}
              step={step}
              isLast={i === order.timeline!.length - 1}
            />
          ))}
        </div>
      )}
    </article>
  );
}