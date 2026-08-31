import { Check, Clock, Package, Truck, X } from "lucide-react";
import type { Order } from "@/lib/interface/Order";

type PaymentMethod = "mp" | "Transferencia_bancaria" | string | undefined;

export const formatPaymentMethod = (method?: PaymentMethod) => {
  switch (method) {
    case "mp":
      return "Mercado Pago";
    case "Transferencia_bancaria":
      return "Transferencia bancaria";
    default:
      return "No especificado";
  }
};

export const formatPaymentStatus = (status?: Order["payment"]["status"]) => {
  switch (status) {
    case "approved":
      return "Pago aprobado";
    case "pending":
      return "Pago pendiente";
    case "rejected":
      return "Pago rechazado";
    case "cancelled":
      return "Pago cancelado";
    default:
      return "Estado no disponible";
  }
};

export const getOrderStatus = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return {
        label: "Pendiente",
        description: "Esperando confirmación del pago",
        icon: Clock,
        className: "bg-amber-100 text-amber-900 border-amber-200",
      };
    case "paid":
      return {
        label: "Pago confirmado",
        description: "Tu compra fue confirmada",
        icon: Check,
        className: "bg-[#c9f158] text-black border-[#b7df40]",
      };
    case "processing":
      return {
        label: "Preparando pedido",
        description: "Estamos preparando tu compra",
        icon: Package,
        className: "bg-blue-100 text-blue-900 border-blue-200",
      };
    case "shipped":
      return {
        label: "Enviado",
        description: "Tu pedido está en camino",
        icon: Truck,
        className: "bg-purple-100 text-purple-900 border-purple-200",
      };
    case "delivered":
      return {
        label: "Entregado",
        description: "Pedido entregado correctamente",
        icon: Check,
        className: "bg-emerald-100 text-emerald-900 border-emerald-200",
      };
    case "cancelled":
      return {
        label: "Cancelado",
        description: "Este pedido fue cancelado",
        icon: X,
        className: "bg-red-100 text-red-900 border-red-200",
      };
    default:
      return {
        label: "Pendiente",
        description: "Estado desconocido",
        icon: Clock,
        className: "bg-gray-100 text-gray-900 border-gray-200",
      };
  }
};

export type OrderStatusInfo = ReturnType<typeof getOrderStatus>;