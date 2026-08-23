import { Button } from "@/components/ui/button";
import { ChevronDown, CircleHelp, ClipboardList, LayoutDashboard, Package, Settings, TrendingUp, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  { label: "Resumen", icon: LayoutDashboard },
  { label: "Pedidos", icon: ClipboardList },
  { label: "Productos", icon: Package },
  { label: "Clientes", icon: Users },
  { label: "Analíticas", icon: TrendingUp },
];


export  function Sidebar({
  active,
  onNavigate,
  onClose,
}: {
  active: string;
  onNavigate: (item: string) => void;
  onClose?: () => void;
}) {
  return (
    <aside className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-20 items-center justify-between px-5">
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Cerrar navegación"
          >
            <X />
          </Button>
        )}
      </div>
      <nav
        className="flex flex-1 flex-col gap-1 px-3"
        aria-label="Navegación principal"
      >
        <p className="px-3 pb-2 pt-5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Workspace
        </p>
        {navItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => {
              onNavigate(label);
              onClose?.();
            }}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              active === label
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
            {label === "Pedidos" && (
              <span className="ml-auto rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                12
              </span>
            )}
          </button>
        ))}
        <p className="px-3 pb-2 pt-7 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Sistema
        </p>
        <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground">
          <Settings className="size-4" />
          Configuración
        </button>
        <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground">
          <CircleHelp className="size-4" />
          Centro de ayuda
        </button>
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <button className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-sidebar-accent">
          <Avatar>
            <AvatarFallback>MV</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Marco Vidal</p>
            <p className="truncate text-xs text-muted-foreground">
              Administrador
            </p>
          </div>
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
      </div>
    </aside>
  );
}