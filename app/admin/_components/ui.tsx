import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { STAGE_LABEL, type OrderStage } from "@/lib/admin/data";

export const money = (value: number, currency = "ARS") =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);

export const shortDate = (iso: string) =>
  new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short", timeZone: "America/Argentina/Buenos_Aires" }).format(new Date(iso));

export const longDate = (iso: string) =>
  new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date(iso));

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-3xl font-medium tracking-[-0.04em] md:text-4xl">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card", className)}>
      {title && (
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <h2 className="text-sm font-medium">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

const STAGE_STYLE: Record<OrderStage, string> = {
  "por-cobrar": "border-amber-400/30 bg-amber-400/10 text-amber-200",
  "por-enviar": "border-accent/40 bg-accent/10 text-red-200",
  enviado: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  entregado: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  cancelado: "border-border bg-foreground/5 text-muted-foreground",
  reembolsado: "border-border bg-foreground/5 text-muted-foreground",
};

export function StagePill({ stage }: { stage: OrderStage }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STAGE_STYLE[stage],
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {STAGE_LABEL[stage]}
    </span>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "secondary",
  external,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean;
}) {
  const className = cn(
    "press inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-[background-color,transform] duration-150",
    variant === "primary"
      ? "bg-foreground text-background hover:bg-white"
      : "border border-border hover:bg-foreground/[0.06]",
  );
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="px-5 py-14 text-center">
      <p className="font-medium">{title}</p>
      {children && <div className="mt-1 text-sm text-muted-foreground">{children}</div>}
    </div>
  );
}

/** Paginación con links: mantiene el resto de los filtros de la URL. */
export function Pagination({
  page,
  pages,
  basePath,
  params,
}: {
  page: number;
  pages: number;
  basePath: string;
  params: Record<string, string | undefined>;
}) {
  if (pages <= 1) return null;
  const href = (p: number) => {
    const qs = new URLSearchParams(
      Object.entries({ ...params, page: p > 1 ? String(p) : undefined }).filter(
        (e): e is [string, string] => Boolean(e[1]),
      ),
    ).toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };
  const link = "press grid size-9 place-items-center rounded-full border border-border transition-colors hover:bg-foreground/[0.06]";
  const off = "grid size-9 place-items-center rounded-full border border-border opacity-30";
  return (
    <nav aria-label="Paginación" className="flex items-center justify-between gap-3 border-t border-border px-5 py-3 text-sm">
      <span className="text-muted-foreground tabular-nums">
        Página {page} de {pages}
      </span>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link href={href(page - 1)} className={link} aria-label="Página anterior">
            <ChevronLeft className="size-4" />
          </Link>
        ) : (
          <span className={off} aria-hidden="true">
            <ChevronLeft className="size-4" />
          </span>
        )}
        {page < pages ? (
          <Link href={href(page + 1)} className={link} aria-label="Página siguiente">
            <ChevronRight className="size-4" />
          </Link>
        ) : (
          <span className={off} aria-hidden="true">
            <ChevronRight className="size-4" />
          </span>
        )}
      </div>
    </nav>
  );
}

/** Buscador simple con GET: funciona sin JavaScript y deja la búsqueda en la URL. */
export function SearchForm({
  action,
  defaultValue,
  placeholder,
  hidden,
}: {
  action: string;
  defaultValue?: string;
  placeholder: string;
  hidden?: Record<string, string | undefined>;
}) {
  return (
    <form action={action} role="search" className="flex-1 sm:max-w-xs">
      {Object.entries(hidden ?? {}).map(([k, v]) => v && <input key={k} type="hidden" name={k} value={v} />)}
      <label className="sr-only" htmlFor="admin-search">
        {placeholder}
      </label>
      <input
        id="admin-search"
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-10 w-full rounded-full border border-border bg-transparent px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/40"
      />
    </form>
  );
}
