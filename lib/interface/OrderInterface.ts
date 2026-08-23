import { TimelineStepData } from "@/app/profile/components/TimeLineStep/TimeLineStep";

export interface Order {
  id: string;
  status: OrderStatus;
  method: string;
  amount: string;
  date: string;
  timeline?: TimelineStepData[];
}
export type OrderStatus =
  | "Pagado"
  | "Pendiente"
  | "En camino"
  | "Entregado"
  | "Cancelado"
  | "Reembolsado";
