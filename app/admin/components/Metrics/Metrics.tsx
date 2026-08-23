"use client";

import { useEffect, useState } from "react";
import { Boxes, CreditCard, ShoppingBag, TrendingUp } from "lucide-react";

import { MetricCard } from "./MetricCard/MetricCard";
import { api } from "@/lib/api/api";

interface DashboardMetrics {
  netSales: number;
  orders: number;
  averageTicket: number;
  totalOrders: number;
}

export default function Metrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    netSales: 0,
    orders: 0,
    averageTicket: 0,
    totalOrders: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadMetrics = async () => {
      try {
        setLoading(true);

        const response = await api.orders.dashboard.getMetrics();

        console.log("DASHBOARD METRICS:", response);

        if (!cancelled && response?.success) {
          setMetrics(response.metrics);
        }
      } catch (error) {
        console.error("ERROR OBTENIENDO MÉTRICAS:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadMetrics();

    return () => {
      cancelled = true;
    };
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("es-AR").format(value);
  };

  return (
    <section
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Métricas principales"
    >
      <MetricCard
        title="Ventas netas"
        value={loading ? "..." : formatCurrency(metrics.netSales)}
        change=""
        icon={CreditCard}
      />

      <MetricCard
        title="Pedidos"
        value={loading ? "..." : formatNumber(metrics.orders)}
        change=""
        icon={ShoppingBag}
      />

      <MetricCard
        title="Ticket promedio"
        value={loading ? "..." : formatCurrency(metrics.averageTicket)}
        change=""
        icon={Boxes}
      />

      <MetricCard
        title="Ordenes totales"
        value={loading ? "..." : Number(metrics.totalOrders)}
        change=""
        icon={Boxes}
      />
    </section>
  );
}
