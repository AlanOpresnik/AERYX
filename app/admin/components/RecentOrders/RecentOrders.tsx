"use client";

import { useEffect, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  MapPin,
  MoreHorizontal,
  Package,
  CreditCard,
  Truck,
  User,
  MessageCircle,
} from "lucide-react";

import { currency } from "@/lib/utils";
import { StatusBadge } from "../statusBadge/StatusBadge";
import { api } from "@/lib/api/api";
import { Order } from "@/lib/interface/Order";

interface RecentOrdersProps {
  setActive: (value: string) => void;
}

const statusMap: Record<string, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  shipped: "En camino",
  delivered: "Entregado",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

export default function RecentOrders({ setActive }: RecentOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadOrders = async () => {
      try {
        setLoading(true);

        const response = await api.orders.getAll();

        console.log(response);

        if (!cancelled) {
          setOrders(response ?? []);
        }
      } catch (error) {
        console.error("Error obteniendo pedidos:", error);

        if (!cancelled) {
          setOrders([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleOpenOrder = (order: Order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleCloseOrder = (open: boolean) => {
    setModalOpen(open);

    if (!open) {
      setSelectedOrder(null);
    }
  };

  return (
    <>
      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Pedidos recientes</CardTitle>

            <CardDescription>
              {loading
                ? "Cargando pedidos..."
                : `${orders.length} ${
                    orders.length === 1
                      ? "operación encontrada"
                      : "operaciones encontradas"
                  }`}
            </CardDescription>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActive("Pedidos")}
          >
            Ver todos
          </Button>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-sm text-muted-foreground"
                    >
                      Cargando pedidos...
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-sm text-muted-foreground"
                    >
                      No hay pedidos todavía.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => {
                    const firstName = order.customer.firstName ?? "";

                    const lastName = order.customer.lastName ?? "";

                    const initials = `${firstName.charAt(0)}${lastName.charAt(
                      0,
                    )}`.toUpperCase();

                    const customerName = `${firstName} ${lastName}`.trim();

                    const date = new Date(order.createdAt).toLocaleDateString(
                      "es-AR",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      },
                    );

                    const status = statusMap[order.status] ?? order.status;

                    return (
                      <TableRow
                        key={order._id}
                        className="cursor-pointer"
                        onClick={() => handleOpenOrder(order)}
                      >
                        <TableCell className="font-medium">
                          #{order._id.slice(-6).toUpperCase()}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8">
                              <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>

                            <span>{customerName}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <StatusBadge status={status as any} />
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {date}
                        </TableCell>

                        <TableCell className="font-medium">
                          {currency.format(order.totals.total)}
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Acciones para el pedido ${order._id}`}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleOpenOrder(order);
                            }}
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL DEL PEDIDO */}
      <Dialog open={modalOpen} onOpenChange={handleCloseOrder}>
        <DialogContent
          className="
    !w-[95vw]
    !max-w-5xl
    max-h-[92vh]
    overflow-hidden
    bg-background
    p-0
    shadow-2xl
  "
        >
          {selectedOrder && (
            <div className="flex max-h-[92vh] flex-col">
              {/* ========================================= */}
              {/* HEADER */}
              {/* ========================================= */}

              <div className="shrink-0 border-b bg-background px-8 py-6">
                <div className="flex items-start justify-between gap-6 pr-8">
                  <div>
                    <div className="flex items-center gap-3">
                      <DialogTitle className="text-2xl font-bold">
                        Pedido #{selectedOrder._id.slice(-6).toUpperCase()}
                      </DialogTitle>

                      <StatusBadge
                        status={
                          (statusMap[selectedOrder.status] ??
                            selectedOrder.status) as any
                        }
                      />
                    </div>

                    <DialogDescription className="mt-1">
                      Realizado el{" "}
                      {new Date(selectedOrder.createdAt).toLocaleString(
                        "es-AR",
                      )}
                    </DialogDescription>
                  </div>
                </div>
              </div>

              {/* ========================================= */}
              {/* CONTENIDO */}
              {/* ========================================= */}

              <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-muted/20">
                <div className="mx-auto w-full max-w-4xl space-y-6 p-8">
                  {/* ========================================= */}
                  {/* CLIENTE */}
                  {/* ========================================= */}

                  <section>
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <User className="size-4" />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold">
                          Datos del cliente
                        </h3>

                        <p className="text-xs text-muted-foreground">
                          Información del comprador
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 rounded-xl border bg-background p-5 sm:grid-cols-3">
                      <div>
                        <p className="mb-1 text-xs text-muted-foreground">
                          Nombre
                        </p>

                        <p className="break-words text-sm font-medium">
                          {selectedOrder.customer.firstName}{" "}
                          {selectedOrder.customer.lastName}
                        </p>
                      </div>

                      <div>
                        <p className="mb-1 text-xs text-muted-foreground">
                          Email
                        </p>

                        <p className="break-all text-sm font-medium">
                          {selectedOrder.customer.email}
                        </p>
                      </div>

                      <div>
                        <p className="mb-1 text-xs text-muted-foreground">
                          Teléfono
                        </p>

                        <p className="text-sm font-medium">
                          {selectedOrder.customer.phone}
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* ========================================= */}
                  {/* DIRECCIÓN */}
                  {/* ========================================= */}

                  <section>
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <MapPin className="size-4" />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold">
                          Dirección de envío
                        </h3>

                        <p className="text-xs text-muted-foreground">
                          Dirección registrada para el pedido
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border bg-background p-5">
                      <p className="text-sm font-semibold">
                        {selectedOrder.shippingAddress.address}{" "}
                        {selectedOrder.shippingAddress.addressNumber}
                      </p>

                      {(selectedOrder.shippingAddress.betweenStreet1 ||
                        selectedOrder.shippingAddress.betweenStreet2) && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          Entre{" "}
                          {selectedOrder.shippingAddress.betweenStreet1 || "—"}{" "}
                          y{" "}
                          {selectedOrder.shippingAddress.betweenStreet2 || "—"}
                        </p>
                      )}

                      <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-3">
                        <span>
                          Ciudad:{" "}
                          <strong className="font-medium text-foreground">
                            {selectedOrder.shippingAddress.city || "—"}
                          </strong>
                        </span>

                        <span>
                          Provincia:{" "}
                          <strong className="font-medium text-foreground">
                            {selectedOrder.shippingAddress.province || "—"}
                          </strong>
                        </span>

                        <span>
                          Código postal:{" "}
                          <strong className="font-medium text-foreground">
                            {selectedOrder.shippingAddress.postalCode || "—"}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* ========================================= */}
                  {/* PRODUCTOS */}
                  {/* ========================================= */}

                  <section>
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Package className="size-4" />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold">Productos</h3>

                        <p className="text-xs text-muted-foreground">
                          {selectedOrder.items.length}{" "}
                          {selectedOrder.items.length === 1
                            ? "producto"
                            : "productos"}
                        </p>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border bg-background">
                      {selectedOrder.items.map((item, index) => (
                        <div
                          key={`${item.productId}-${index}`}
                          className="
                      flex
                      w-full
                      items-center
                      gap-5
                      border-b
                      p-5
                      last:border-b-0
                    "
                        >
                          {/* IMAGEN */}

                          <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="size-full object-contain"
                              />
                            ) : (
                              <Package className="size-6 text-muted-foreground" />
                            )}
                          </div>

                          {/* INFORMACIÓN */}

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">
                              {item.name}
                            </p>

                            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                              <span>
                                Cantidad:{" "}
                                <strong className="text-foreground">
                                  {item.quantity}
                                </strong>
                              </span>

                              <span>
                                Precio unitario:{" "}
                                <strong className="text-foreground">
                                  {currency.format(item.price)}
                                </strong>
                              </span>
                            </div>
                          </div>

                          {/* SUBTOTAL */}

                          <div className="shrink-0 text-right">
                            <p className="text-sm font-bold">
                              {currency.format(item.subtotal)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* ========================================= */}
                  {/* ENVÍO + PAGO */}
                  {/* ========================================= */}

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* ENVÍO */}

                    <section>
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Truck className="size-4" />
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold">Envío</h3>
                          <p className="text-xs text-muted-foreground">
                            Método de entrega
                          </p>
                        </div>
                      </div>

                      <div className="h-full rounded-xl border bg-background p-5">
                        {selectedOrder.shipping.manual ? (
                          <div className="space-y-3">
                            <p className="text-sm font-semibold">
                              Envío a coordinar
                            </p>

                            <p className="text-xs text-muted-foreground">
                              El costo del envío se coordinará posteriormente.
                            </p>

                            <a
                              href={`https://wa.me/${(
                                selectedOrder.customer.phone ?? ""
                              ).replace(/\D/g, "")}?text=${encodeURIComponent(
                                `Hola ${selectedOrder.customer.firstName}, te escribo por tu pedido #${selectedOrder._id
                                  .slice(-6)
                                  .toUpperCase()} para coordinar el envío.

Productos:
${selectedOrder.items
  .map((item) => `• ${item.quantity}x ${item.name}`)
  .join("\n")}
Quedo atento para coordinar el envío.`,
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800"
                              >
                                <MessageCircle className="size-4" />
                                Contactar por WhatsApp
                              </Button>
                            </a>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold">
                                {selectedOrder.shipping.option?.title ??
                                  selectedOrder.shipping.method ??
                                  "Envío"}
                              </p>

                              {selectedOrder.shipping.option?.description && (
                                <p className="mt-2 text-xs text-muted-foreground">
                                  {selectedOrder.shipping.option.description}
                                </p>
                              )}
                            </div>

                            <p className="shrink-0 text-sm font-bold">
                              {currency.format(selectedOrder.shipping.cost)}
                            </p>
                          </div>
                        )}
                      </div>
                    </section>

                    {/* PAGO */}

                    <section>
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <CreditCard className="size-4" />
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold">Pago</h3>

                          <p className="text-xs text-muted-foreground">
                            Información del pago
                          </p>
                        </div>
                      </div>

                      <div className="rounded-xl border bg-background p-5">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm text-muted-foreground">
                            Método
                          </span>

                          <span className="text-sm font-semibold">
                            {selectedOrder.payment.method}
                          </span>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-4">
                          <span className="text-sm text-muted-foreground">
                            Estado
                          </span>

                          <span className="text-sm font-semibold">
                            {selectedOrder.payment.status}
                          </span>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* ========================================= */}
                  {/* TOTALES */}
                  {/* ========================================= */}

                  <section className="rounded-xl border bg-background p-6">
                    <div className="ml-auto w-full max-w-sm space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>

                        <span className="font-medium">
                          {currency.format(selectedOrder.totals.subtotal)}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Envío</span>

                        <span className="font-medium">
                          {selectedOrder.shipping.manual
                            ? "A coordinar"
                            : currency.format(selectedOrder.totals.shipping)}
                        </span>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-base font-semibold">Total</span>

                          <span className="text-2xl font-bold">
                            {currency.format(selectedOrder.totals.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              {/* ========================================= */}
              {/* FOOTER */}
              {/* ========================================= */}

              <div className="flex shrink-0 justify-end border-t bg-background px-8 py-4">
                <Button
                  variant="outline"
                  onClick={() => handleCloseOrder(false)}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
