import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";

import { Footer } from "@/components/Footer/Footer";
import { serverRequest } from "@/lib/api/server-api";
import type { Order } from "@/lib/interface/Order";
import AsideProfile from "../components/Aside/AsideProfile";
import { OrdersErrorState } from "./components/OrdersErrorState";
import { OrdersEmptyState } from "./components/OrderEmptyState";
import { OrdersHeader } from "./components/OrdersHeader";
import { OrderCard } from "./components/OrderCard";

type MyOrdersResponse = {
  success: boolean;
  count: number;
  orders: Order[];
};

export default async function OrdersPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const [data, user] = await Promise.all([
    serverRequest<MyOrdersResponse>("/api/orders/my-orders", {
      cache: "no-store",
    }),
    currentUser(),
  ]);

  return (
    <main className="min-h-screen bg-[#f4f4f1] text-[#101010]">
      <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
        <header className="mb-12 border-b border-black/60 pb-3">
          <div className="flex items-start justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
              Perfil
            </p>
            <p className="hidden text-[10px] font-bold uppercase tracking-[0.2em] sm:block">
              Cuenta / Pedidos
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-8 md:flex-row">
          <AsideProfile
            firstName={user?.firstName ?? undefined}
            
            lastName={user?.lastName ?? undefined}
            createdAt={
              user?.createdAt
                ? new Date(user.createdAt).getFullYear().toString()
                : undefined
            }
          />

          <div className="min-w-0 flex-1">
            {!data || !data.success ? (
              <OrdersErrorState />
            ) : data.orders.length === 0 ? (
              <OrdersEmptyState />
            ) : (
              <>
                <OrdersHeader count={data.orders.length} />
                <section className="space-y-5">
                  {data.orders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                  ))}
                </section>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
