"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import AsideProfile from "./components/Aside/AsideProfile";
import { OrderCard } from "./components/OrderCard/OrderCard";
import { Order } from "@/lib/interface/OrderInterface";
import ProfileInfoCard from "./components/PersonalInfo/PersonalInfo";
import { UserDataInterface } from "@/lib/interface/User";

const CHIPS = [
  { key: "todos", label: "Todos", count: 0 },
  { key: "revision", label: "En revisión", count: 0 },
  { key: "historial", label: "Historial", count: 0 },
];

export default function Perfil() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  const [userData, setUserData] = useState<UserDataInterface | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [filter, setFilter] = useState("todos");

  const pendingRef = useRef<HTMLElement>(null);
  const ordersRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.replace("/signIn");
      return;
    }

    setUserData({
      _id: user.id,
      clerkId: user.id,
      firstName: user.firstName || "Usuario",
      lastName: user.lastName || "",
      email: user.primaryEmailAddress?.emailAddress || "",
      createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
    });
    setLoadingUser(false);

    const getOrders = async () => {
      try {
        setLoadingOrders(true);
        const email = user.primaryEmailAddress?.emailAddress;
        if (!email) return;

        const res = await fetch(`/api/tiendanube/orders?email=${email}`);
        const data = await res.json();
        
        if (!Array.isArray(data)) return;

        // Map Tiendanube orders to local UI format
        const mappedOrders: Order[] = data.map((o: any) => {
          const isPaid = o.payment?.status === "paid";
          const isShipped = o.status === "closed"; // Tiendanube often closes orders when shipped
          const isCancelled = o.status === "cancelled";

          let localStatus = "Pendiente";
          if (isPaid) localStatus = "Aprobado";
          if (isShipped) localStatus = "Enviado";
          if (isCancelled) localStatus = "Cancelado";

          const timeline = [
            {
              title: "Pedido realizado",
              time: "Realizado",
              state: "done" as const
            },
            {
              title: isCancelled ? "Pago cancelado" : "Pago",
              time: isCancelled ? "Cancelado" : (isPaid ? "Aprobado" : "En revisión"),
              state: isCancelled ? "current" as const : (isPaid ? "done" as const : "current" as const),
              note: isCancelled 
                ? "El pedido fue cancelado." 
                : (isPaid ? "Tu pago se procesó correctamente." : "Estamos verificando el pago."),
            },
            {
              title: "Envío",
              time: isShipped ? "Enviado" : "Preparando",
              state: isCancelled ? "upcoming" as const : (isShipped ? "done" as const : (isPaid ? "current" as const : "upcoming" as const)),
              note: isShipped ? "Tu pedido está en camino." : "Estamos empaquetando tu pedido.",
            }
          ];

          return {
            id: o._id,
            status: localStatus,
            method: o.payment?.method || "Desconocido",
            amount: `$${(o.totals?.total || 0).toLocaleString("es-AR")}`,
            date: new Date(o.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" }),
            timeline
          };
        });

        setOrders(mappedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    getOrders();
  }, [isLoaded, user, router]);

  if (!isLoaded || loadingUser || loadingOrders) {
    return (
      <div className="min-h-screen pt-24 bg-neutral-100 flex items-center justify-center">
        <p className="text-sm text-neutral-400">Cargando perfil...</p>
      </div>
    );
  }

  // Update CHIPS counts dynamically
  const chipsWithCounts = CHIPS.map(chip => {
    if (chip.key === "todos") return { ...chip, count: orders.length };
    if (chip.key === "revision") return { ...chip, count: orders.filter(o => o.status === "Pendiente").length };
    if (chip.key === "historial") return { ...chip, count: orders.filter(o => o.status !== "Pendiente").length };
    return chip;
  });

  const filteredOrders = orders.filter((order) => {
    if (filter === "todos") return true;

    if (filter === "revision") {
      return order.status === "Pendiente";
    }

    return order.status !== "Pendiente";
  });

  return (
    <div className="min-h-screen pt-24 bg-neutral-100 text-neutral-900">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 md:gap-8 p-6 md:p-10">
        {/* SIDEBAR */}
        <AsideProfile
          firstName={userData?.firstName}
          createdAt={userData?.createdAt?.slice(0, 4)}
          lastName={userData?.lastName}
        />

        {/* MAIN */}
        <main className="flex-1 min-w-0">
          {/* HEADER */}
          <div id="resumen" className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">
              Área personal
            </p>

            <h1 className="font-display text-3xl md:text-4xl font-medium tracking-tight text-neutral-900">
              Hola, {userData?.firstName} {userData?.lastName}
            </h1>

            <p className="text-neutral-500 text-sm mt-2 max-w-md">
              Acá podés revisar tus datos y el estado de tus pedidos.
            </p>
          </div>

          {/* ERROR USER */}
          {userError && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">{userError}</p>
            </div>
          )}

          {/* PERSONAL INFO */}
          {userData && (
            <ProfileInfoCard
              user={userData}
              onEdit={() => {
                router.push("/profile/data");
              }}
              onAddAddress={() => {
                router.push("/profile/direction");
              }}
            />
          )}

          {/* ORDERS */}
          <section id="pedidos" ref={ordersRef} className="mt-9 scroll-mt-8">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <h2 className="font-display text-xl font-medium">Pedidos</h2>

              <div className="flex gap-2">
                {chipsWithCounts.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={() => setFilter(chip.key)}
                    className={`flex items-center gap-1.5 text-xs font-medium rounded-full px-3.5 py-1.5 border transition-colors ${
                      filter === chip.key
                        ? "bg-neutral-900 border-neutral-900 text-white"
                        : "bg-white border-neutral-200 text-neutral-500 hover:border-neutral-400"
                    }`}
                  >
                    {chip.label}

                    <span
                      className={`font-plex text-xs rounded-full px-1.5 ${
                        filter === chip.key
                          ? "bg-white/20 text-white"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {chip.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                cardRef={order.status === "Pendiente" ? pendingRef : undefined}
              />
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
