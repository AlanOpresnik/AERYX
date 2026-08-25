import { Order } from "@/lib/interface/Order";
import { formatDate } from "@/lib/utils";
import { Check, Clock, CreditCard, MapPin, ShieldCheck, User } from "lucide-react";
import React from "react";

interface Props {
    mounted: boolean;
    order:Order;
    orderNumber:string

}

export default function OrderDataAside({mounted,order,orderNumber}:Props) {
      const getPaymentLabel = (): string => {
    if (!order) {
      return "Mercado Pago";
    }

    switch (order.payment.method) {
      case "mp":
        return "Mercado Pago";

      case "Transferencia_bancaria":
        return "Transferencia bancaria";

      default:
        return order.payment.method;
    }
  };

  // =====================================================
  // PAYMENT STATUS
  // =====================================================

  const getPaymentStatusLabel = (): string => {
    if (!order) {
      return "Pendiente";
    }

    switch (order.payment.status) {
      case "approved":
        return "Aprobado";

      case "pending":
        return "Pendiente";

      case "rejected":
        return "Rechazado";

      case "cancelled":
        return "Cancelado";

      default:
        return "Pendiente";
    }
  };

  // =====================================================
  // ORDER STATUS
  // =====================================================

  const getOrderStatusLabel = (): string => {
    if (!order) {
      return "Pendiente";
    }

    switch (order.status) {
      case "pending":
        return "Pendiente";

      case "paid":
        return "Pagado";

      case "processing":
        return "Preparando pedido";

      case "shipped":
        return "Enviado";

      case "delivered":
        return "Entregado";

      case "cancelled":
        return "Cancelado";

      default:
        return "Pendiente";
    }
  };
  return (
    <aside
      className={`transition-all duration-700 delay-500 ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <div className="border border-black/15 bg-white/40">
        {/* Header */}

        <div className="border-b border-black/15 px-5 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.17em]">
                Datos del pedido
              </p>

              <p className="mt-1 text-xs text-black/40">
                Información de tu compra
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c9f158]">
              <Check className="h-4 w-4" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* =====================================================
                  ORDER NUMBER
              ===================================================== */}

        <div className="border-b border-black/10 px-5 py-5">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-black/40">
            Número de pedido
          </p>

          <p className="mt-1 break-all font-mono text-sm font-semibold">
            #{orderNumber}
          </p>
        </div>

        {/* =====================================================
                  ORDER STATUS
              ===================================================== */}

        <div className="border-b border-black/10 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
              <Check className="h-4 w-4" strokeWidth={2} />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-black/40">
                Estado
              </p>

              <p className="mt-1 text-sm font-semibold">
                {getOrderStatusLabel()}
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
                  CUSTOMER
              ===================================================== */}

        <div className="border-b border-black/10 px-5 py-5">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-4 w-4" strokeWidth={1.5} />

            <p className="text-[10px] font-bold uppercase tracking-[0.15em]">
              Comprador
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="font-semibold">
              {order.customer.firstName} {order.customer.lastName}
            </p>

            <p className="break-all text-xs text-black/50">
              {order.customer.email}
            </p>

            {order.customer.phone && (
              <p className="text-xs text-black/50">{order.customer.phone}</p>
            )}
          </div>
        </div>

        {/* =====================================================
                  SHIPPING
              ===================================================== */}

        <div className="border-b border-black/10 px-5 py-5">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4" strokeWidth={1.5} />

            <p className="text-[10px] font-bold uppercase tracking-[0.15em]">
              Envío
            </p>
          </div>

          <div className="space-y-1 text-sm leading-5">
            <p className="font-semibold">
              {order.shippingAddress.address}{" "}
              {order.shippingAddress.addressNumber}
            </p>

            {(order.shippingAddress.betweenStreet1 ||
              order.shippingAddress.betweenStreet2) && (
              <p className="text-xs text-black/50">
                Entre {order.shippingAddress.betweenStreet1 || ""}
                {order.shippingAddress.betweenStreet2
                  ? ` y ${order.shippingAddress.betweenStreet2}`
                  : ""}
              </p>
            )}

            <p className="text-xs text-black/50">
              {order.shippingAddress.city}
            </p>

            <p className="text-xs text-black/50">
              {order.shippingAddress.province}

              {order.shippingAddress.postalCode
                ? ` · CP ${order.shippingAddress.postalCode}`
                : ""}
            </p>
          </div>

          <div className="mt-4 border-t border-black/10 pt-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-black/40">
              Método
            </p>

            <p className="mt-1 text-xs font-semibold">
              {order.shipping.option?.title ||
                (order.shipping.manual
                  ? "Envío a coordinar"
                  : order.shipping.method || "Envío estándar")}
            </p>

            {order.shipping.option?.description && (
              <p className="mt-2 text-[10px] leading-4 text-black/40">
                {order.shipping.option.description}
              </p>
            )}
          </div>
        </div>

        {/* =====================================================
                  PAYMENT
              ===================================================== */}

        <div className="border-b border-black/10 px-5 py-5">
          <div className="mb-4 flex items-center gap-2">
            <CreditCard className="h-4 w-4" strokeWidth={1.5} />

            <p className="text-[10px] font-bold uppercase tracking-[0.15em]">
              Pago
            </p>
          </div>

          <p className="text-sm font-semibold">{getPaymentLabel()}</p>

          <p className="mt-2 text-xs text-black/50">
            Estado:{" "}
            <span className="font-semibold text-black">
              {getPaymentStatusLabel()}
            </span>
          </p>

          {order.payment.paymentId && (
            <p className="mt-2 break-all text-[10px] text-black/40">
              ID de pago: {order.payment.paymentId}
            </p>
          )}

          {order.payment.preferenceId && (
            <p className="mt-2 break-all text-[10px] text-black/40">
              ID de preferencia: {order.payment.preferenceId}
            </p>
          )}

          {order.payment.mpStatus && (
            <p className="mt-2 break-all text-[10px] text-black/40">
              Estado Mercado Pago: {order.payment.mpStatus}
            </p>
          )}
        </div>

        {/* =====================================================
                  DATE
              ===================================================== */}

        <div className="px-5 py-5">
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-black/50" strokeWidth={1.5} />

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-black/40">
                Fecha de compra
              </p>

              <p className="mt-1 text-xs font-semibold">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
                SECURITY
            ===================================================== */}

      <div className="mt-4 flex items-start gap-3 px-1">
        <ShieldCheck
          className="mt-0.5 h-4 w-4 shrink-0 text-black/40"
          strokeWidth={1.5}
        />

        <p className="text-[9px] uppercase leading-5 tracking-[0.13em] text-black/40">
          Tu compra fue procesada de forma segura. Conservá este comprobante
          para futuras consultas.
        </p>
      </div>
    </aside>
  );
}
