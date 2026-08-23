"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import AsideProfile from "./components/Aside/AsideProfile";
import { OrderCard } from "./components/OrderCard/OrderCard";
import { Order } from "@/lib/interface/OrderInterface";
import ProfileInfoCard from "./components/PersonalInfo/PersonalInfo";
import { UserDataInterface } from "@/lib/interface/User";

const orders: Order[] = [
  {
    id: "123",
    status: "revision",
    method: "Transferencia bancaria",
    amount: "$125.000",
    date: "20 Ago 2026",
    timeline: [
      {
        title: "Pedido realizado",
        time: "14:32",
        state: "done",
      },
      {
        title: "En revisión",
        time: "Ahora",
        state: "done",
        note: "Estamos verificando tu transferencia bancaria.",
      },
      {
        title: "Transferencia Aprobada",
        time: "Ahora",
        state: "done",
        note: "Tu pago se realizó correctamente.",
      },
      {
        title: "Preparando tu pedido para ser entregado",
        time: "Ahora",
        state: "current",
        note: "Estamos empaquetando tu pedido para que llegue lo antes posible.",
      },
      {
        title: "Enviado",
        time: "Pendiente",
        state: "upcoming",
      },
    ],
  },
];

const CHIPS = [
  { key: "todos", label: "Todos", count: 3 },
  { key: "revision", label: "En revisión", count: 1 },
  { key: "historial", label: "Historial", count: 2 },
];

export default function Perfil() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  const [userData, setUserData] = useState<UserDataInterface | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  const [filter, setFilter] = useState("todos");

  const pendingRef = useRef<HTMLElement>(null);
  const ordersRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.replace("/signIn");
      return;
    }

    const getUserData = async () => {
      try {
        setLoadingUser(true);
        setUserError(null);

        const token = await getToken();

        if (!token) {
          throw new Error("No se pudo obtener el token de autenticación.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "No se pudo obtener la información del usuario.",
          );
        }

        setUserData(data.user);
      } catch (error) {
        console.error("ERROR OBTENIENDO USUARIO:", error);

        setUserError(
          error instanceof Error
            ? error.message
            : "Error obteniendo la información del usuario.",
        );
      } finally {
        setLoadingUser(false);
      }
    };

    getUserData();
  }, [isLoaded, user, getToken, router]);

  if (!isLoaded || loadingUser) {
    return (
      <div className="min-h-screen pt-24 bg-neutral-100 flex items-center justify-center">
        <p className="text-sm text-neutral-400">Cargando perfil...</p>
      </div>
    );
  }

  const filteredOrders = orders.filter((order) => {
    if (filter === "todos") return true;

    if (filter === "revision") {
      return order.status === "revision";
    }

    return order.status !== "revision";
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
                {CHIPS.map((chip) => (
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
                cardRef={order.status === "revision" ? pendingRef : undefined}
              />
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
