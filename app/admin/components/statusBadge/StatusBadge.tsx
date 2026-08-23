import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/lib/interface/OrderInterface";

interface StatusBadgeProps {
  status: OrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<OrderStatus, string> = {
    Pagado:
      "border-green-200 bg-green-50 text-green-700 hover:bg-green-50",

    Pendiente:
      "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-50",

    "En camino":
      "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50",

    Entregado:
      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50",

    Cancelado:
      "border-red-200 bg-red-50 text-red-700 hover:bg-red-50",

    Reembolsado:
      "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-50",
  };

  return (
    <Badge
      variant="outline"
      className={styles[status]}
    >
      {status}
    </Badge>
  );
}