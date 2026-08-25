"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Printer,
  ShieldCheck,
  User,
} from "lucide-react";

import { Footer } from "@/components/Footer/Footer";
import { Order } from "@/lib/interface/Order";
import { formatDate, formatPrice } from "@/lib/utils";
import PaymentConfirmed from "./components/PaymentConfirmed";
import ProductsDetails from "./components/ProductsDetails";
import Totals from "./components/Totals";
import TicketFooter from "./components/TicketFooter";
import OrderDataAside from "./components/OrderDataAside";
import ActionsButtons from "./components/ActionsButtons";
type OrderResponse = {
  success: boolean;
  order?: Order;
  message?: string;
};

export default function PaymentSuccessPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    const loadOrder = async () => {
      try {
        const params = new URLSearchParams(window.location.search);

        const externalReference =
          params.get("external_reference") || params.get("externalReference");

        if (!externalReference) {
          setError("No se encontró el número de pedido.");
          return;
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!baseUrl) {
          throw new Error("NEXT_PUBLIC_API_URL no está configurada.");
        }

        const response = await fetch(
          `http://localhost:8080/api/orders/${externalReference}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("No se pudo obtener la información del pedido.");
        }

        const data: OrderResponse = await response.json();

        if (!data.success || !data.order) {
          throw new Error(data.message || "La orden no existe.");
        }

        setOrder(data.order);
      } catch (err: unknown) {
        console.error("ERROR OBTENIENDO ORDER:", err);

        setError(
          err instanceof Error
            ? err.message
            : "No se pudo cargar la información del pedido.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, []);
  const handlePrint = () => {
    window.print();
  };


  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f4f1] text-[#101010]">
        <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
          <div className="mb-10 flex items-start justify-between border-b border-black/60 pb-3">
            <p className="eyebrow">Pago</p>

            <p className="eyebrow hidden sm:block">Compra / Confirmación</p>
          </div>

          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-black" />

              <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-black/45">
                Cargando pedido...
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#f4f4f1] text-[#101010]">
        <div className="mx-auto flex min-h-screen max-w-[1440px] items-center justify-center px-5">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">
              <Package className="h-7 w-7" strokeWidth={1.5} />
            </div>

            <h1 className="font-display text-4xl tracking-[-0.06em] sm:text-5xl">
              No encontramos tu pedido
            </h1>

            <p className="mt-4 text-sm leading-6 text-black/50">
              {error || "No pudimos obtener la información de la compra."}
            </p>

            <Link
              href="/"
              className="mt-8 inline-flex bg-black px-10 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#1a1a1a]"
            >
              Volver al inicio
            </Link>
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  // =====================================================
  // DATA
  // =====================================================

  const items = order.items ?? [];

  const subtotal = order.totals.subtotal;

  const shippingCost = order.totals.shipping;

  const total = order.totals.total;

  const orderNumber = order._id;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="min-h-screen bg-[#f4f4f1] text-[#101010]">
      <div className="mx-auto max-w-[1440px] px-5 py-32 sm:px-8 lg:px-16 lg:py-32">
        {/* =====================================================
            SUCCESS
        ===================================================== */}

        <PaymentConfirmed mounted={mounted} order={order} />

        {/* =====================================================
            MAIN GRID
        ===================================================== */}

        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          {/* =====================================================
              TICKET
          ===================================================== */}

          <section
            id="purchase-ticket"
            className={`relative bg-white transition-all duration-700 delay-300 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="border border-black/15">
              {/* Ticket header */}

              <div className="border-b border-dashed border-black/20 px-6 py-7 sm:px-8">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-3xl tracking-[-0.06em]">
                      AERYX
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-black/40">
                      Comprobante de compra
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-black/40">
                      Pedido
                    </p>

                    <p className="mt-1 max-w-[180px] truncate text-sm font-semibold">
                      #{orderNumber}
                    </p>
                  </div>
                </div>
              </div>
              <ProductsDetails items={items} />

              {/* =====================================================
                  TOTALS
              ===================================================== */}

              <Totals
                order={order}
                shippingCost={shippingCost}
                subtotal={subtotal}
                total={total}
              />

              <TicketFooter />

              {/* =====================================================
                  PRINT BUTTON
              ===================================================== */}

              <div className="border-t border-black/10 bg-[#f4f4f1] p-4 print:hidden">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex w-full items-center justify-center gap-2 bg-black py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#1a1a1a]"
                >
                  <Printer className="h-4 w-4" strokeWidth={1.5} />
                  Imprimir comprobante
                </button>
              </div>
            </div>
          </section>
          <OrderDataAside mounted order={order} orderNumber={orderNumber} />
        </div>

        {/* =====================================================
            ACTIONS
        ===================================================== */}

        <ActionsButtons mounted />
      </div>

      <Footer />

      {/* =====================================================
          PRINT STYLES
      ===================================================== */}<style jsx global>{`
  @media print {
    @page {
      size: A4;
      margin: 10mm;
    }

    html,
    body {
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
    }

    body {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Ocultar absolutamente todo */
    body * {
      visibility: hidden !important;
    }

    /* Mostrar únicamente el ticket */
    #purchase-ticket,
    #purchase-ticket * {
      visibility: visible !important;
    }

    /* Sacar el ticket del layout */
    #purchase-ticket {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;

      width: 100% !important;
      max-width: 700px !important;

      margin: 0 auto !important;

      background: white !important;
      box-shadow: none !important;
    }

    /* Ocultar botón de imprimir */
    #purchase-ticket button {
      display: none !important;
    }

    /* Ocultar Footer */
    footer {
      display: none !important;
    }

    /* Ocultar elementos con print:hidden */
    .print\\:hidden {
      display: none !important;
    }

    /* Evitar que el ticket se corte */
    #purchase-ticket {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

    /* Evitar animaciones durante impresión */
    #purchase-ticket,
    #purchase-ticket * {
      animation: none !important;
      transition: none !important;
    }
  }
`}</style>
    </main>
    
  );
}
