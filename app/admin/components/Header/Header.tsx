import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Menu, Plus, Search } from "lucide-react";
import Link from "next/link";
import React from "react";

interface HeaderProps {
  active: string;
  query: string;
  setQuery: (query: string) => void;
  setMobileNav: (open: boolean) => void;
}

export default function Header({
  active,
  query,
  setQuery,
  setMobileNav,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center border-b border-border bg-background/90 px-4 backdrop-blur-xl md:px-8">
      <Button
        variant="ghost"
        size="icon"
        className="mr-2 lg:hidden"
        onClick={() => setMobileNav(true)}
        aria-label="Abrir navegación"
      >
        <Menu />
      </Button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{active}</p>
        <p className="hidden text-xs text-muted-foreground sm:block">
          Viernes, 7 de agosto de 2026
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="w-64 pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar pedidos o productos..."
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          aria-label="Notificaciones"
          className="relative"
        >
          <Bell />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
        </Button>
        <Button render={<Link href="/productos/nuevo" />} nativeButton={false}>
          <Plus data-icon="inline-start" />
          <span className="hidden sm:inline">Nuevo producto</span>
        </Button>
      </div>
    </header>
  );
}
