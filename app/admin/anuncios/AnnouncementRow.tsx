"use client";

import { useState, useTransition } from "react";
import { ArrowUpToLine, Pencil, Trash2 } from "lucide-react";
import { announcementStatus, type Announcement } from "@/lib/announcement-utils";
import { cn } from "@/lib/utils";
import { deleteAnnouncement, prioritizeAnnouncement, setAnnouncementActive } from "./actions";
import { AnnouncementForm } from "./AnnouncementForm";

const STATUS = {
  activo: { label: "Al aire", className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" },
  programado: { label: "Programado", className: "border-sky-400/30 bg-sky-400/10 text-sky-200" },
  pausado: { label: "Pausado", className: "border-border bg-foreground/5 text-muted-foreground" },
  vencido: { label: "Terminado", className: "border-border bg-foreground/5 text-muted-foreground" },
};

const fmt = (d: string) =>
  new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${d}T12:00:00Z`));

function range(a: Announcement) {
  if (a.startsOn && a.endsOn) return `Del ${fmt(a.startsOn)} al ${fmt(a.endsOn)}`;
  if (a.endsOn) return `Hasta el ${fmt(a.endsOn)}`;
  if (a.startsOn) return `Desde el ${fmt(a.startsOn)}`;
  return "Sin fechas";
}

export function AnnouncementRow({
  announcement: a,
  showing,
  first,
  categories,
}: {
  announcement: Announcement;
  showing: boolean;
  first: boolean;
  categories: string[];
}) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const status = STATUS[announcementStatus(a)];

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>) =>
    start(async () => {
      setError(null);
      const r = await fn();
      if (!r.ok) setError(r.error ?? "No se pudo completar.");
    });

  if (editing) {
    return (
      <li className="p-5">
        <AnnouncementForm initial={a} categories={categories} onDone={() => setEditing(false)} submitLabel="Guardar cambios" />
      </li>
    );
  }

  return (
    <li className={cn("flex flex-col gap-3 p-5 sm:flex-row sm:items-start", pending && "opacity-60")}>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", status.className)}>
            {status.label}
          </span>
          {showing && <span className="text-xs text-muted-foreground">Es el que se ve ahora en la web</span>}
        </div>
        <p className="mt-2 text-sm">{a.message}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {range(a)}
          {a.linkHref ? ` · Link: ${a.linkLabel} → ${a.linkHref}` : ""}
          {a.cartTrigger ? ` · Carrito: ${a.cartTrigger}` : ""}
        </p>
        {error && (
          <p role="alert" className="mt-2 text-xs text-red-300">
            {error}
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-1">
        {confirming ? (
          <>
            <span className="mr-1 text-xs text-muted-foreground">¿Borrar este anuncio?</span>
            <button
              type="button"
              onClick={() => run(() => deleteAnnouncement(a.id))}
              disabled={pending}
              className="h-8 rounded-full bg-red-400/90 px-3 text-xs font-medium text-[#070707]"
            >
              Sí, borrar
            </button>
            <button type="button" onClick={() => setConfirming(false)} className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground">
              No
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => run(() => setAnnouncementActive(a.id, !a.active))}
              disabled={pending || announcementStatus(a) === "vencido"}
              className="h-8 rounded-full border border-border px-3 text-xs transition-colors hover:border-foreground/30 disabled:opacity-40"
            >
              {a.active ? "Pausar" : "Publicar"}
            </button>
            {!first && (
              <button
                type="button"
                onClick={() => run(() => prioritizeAnnouncement(a.id))}
                disabled={pending}
                title="Mostrar primero"
                aria-label="Mostrar primero"
                className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
              >
                <ArrowUpToLine className="size-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setEditing(true)}
              aria-label="Editar"
              title="Editar"
              className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
            >
              <Pencil className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setConfirming(true)}
              aria-label="Borrar"
              title="Borrar"
              className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-red-400/10 hover:text-red-300"
            >
              <Trash2 className="size-4" />
            </button>
          </>
        )}
      </div>
    </li>
  );
}
