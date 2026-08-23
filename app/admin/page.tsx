"use client";

import {useState } from "react";

import {
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sidebar } from "./components/SideBar/SideBar";
import Metrics from "./components/Metrics/Metrics";
import RecentOrders from "./components/RecentOrders/RecentOrders";
import LowStockAlert from "./components/LowStockAlert/LowStockAlert";


export default function AdminDashboard() {
  const [active, setActive] = useState("Resumen");
  const [mobileNav, setMobileNav] = useState(false);
  const [query, setQuery] = useState("");



  return (
    <main className="min-h-screen mt-24 bg-background font-sans text-foreground">
      <div className="fixed inset-y-0 left-0 hidden w-64 border-r border-sidebar-border lg:block">
        <Sidebar active={active} onNavigate={setActive} />
      </div>
      {mobileNav && (
        <div
          className="fixed inset-0 z-40 bg-background/75 backdrop-blur-sm lg:hidden"
          onMouseDown={() => setMobileNav(false)}
        >
          <div
            className="h-full w-72 border-r border-sidebar-border"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Sidebar
              active={active}
              onNavigate={setActive}
              onClose={() => setMobileNav(false)}
            />
          </div>
        </div>
      )}
      <div className="lg:pl-64">

        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 p-4 md:p-8">
          
          <div className="relative md:hidden">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar..."
            />
          </div>

          <Metrics />

          <section className="grid gap-4 xl:grid-cols-[1.65fr_1fr]">
            <RecentOrders
              setActive={setActive}
            />
            <LowStockAlert />
          </section>
        </div>
      </div>
    </main>
  );
}
