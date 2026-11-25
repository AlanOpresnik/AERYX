"use client";

import { ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { currentAnnouncement, daysLeft, type Announcement } from "@/lib/announcement-utils";

const HIDDEN_ON = ["/admin", "/login", "/registro", "/proximamente"];
const DISMISS_KEY = "aeryx:anuncio-cerrado";

function countdown(days: number | null): string | null {
  if (days === null || days > 14) return null;
  if (days === 0) return "Último día";
  if (days === 1) return "Queda 1 día";
  return `Quedan ${days} días`;
}

/** La barra en sí. Sin lógica: también la usa la vista previa del admin. */
export function AnnouncementBarView({
  announcement,
  onDismiss,
  preview = false,
}: {
  announcement: Announcement;
  onDismiss?: () => void;
  preview?: boolean;
}) {
  const left = countdown(daysLeft(announcement));
  const external = announcement.linkHref.startsWith("http");
  const linkClass =
    "group inline-flex shrink-0 items-center gap-1 font-semibold underline decoration-[#070707]/30 underline-offset-4 transition-colors hover:decoration-[#070707]";

  return (
    <div
      role="region"
      aria-label="Anuncio"
      className="relative z-[55] bg-accent text-[#070707]"
    >
      <div className="mx-auto flex min-h-10 max-w-[1600px] items-center justify-center gap-x-3 gap-y-0.5 px-12 py-2 text-center text-[13px] font-medium leading-snug sm:text-sm">
        <p className="text-pretty">
          {announcement.message}
          {left && (
            <span className="ml-2 inline-block rounded-full bg-[#070707]/10 px-2 py-px text-xs font-semibold tabular-nums">
              {left}
            </span>
          )}
          {announcement.linkHref && announcement.linkLabel && (
            <>
              {" "}
              {preview ? (
                <span className={linkClass}>
                  {announcement.linkLabel} <ArrowRight className="size-3.5" />
                </span>
              ) : external ? (
                <a href={announcement.linkHref} target="_blank" rel="noreferrer" className={linkClass}>
                  {announcement.linkLabel}
                  <ArrowRight className="size-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                </a>
              ) : (
                <Link href={announcement.linkHref} className={linkClass}>
                  {announcement.linkLabel}
                  <ArrowRight className="size-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                </Link>
              )}
            </>
          )}
        </p>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Cerrar anuncio"
            className="press absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full transition-[background-color,transform] duration-150 hover:bg-[#070707]/10"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Barra de anuncios arriba de toda la web. Elige en el navegador cuál mostrar,
 * según la hora real, y recuerda si el visitante la cerró.
 */
export function AnnouncementBar({ announcements }: { announcements: Announcement[] }) {
  const pathname = usePathname();
  const [current, setCurrent] = useState<Announcement | null>(null);

  useEffect(() => {
    const pick = currentAnnouncement(announcements);
    if (!pick) return setCurrent(null);
    let closed = false;
    try {
      closed = localStorage.getItem(DISMISS_KEY) === `${pick.id}:${pick.updatedAt}`;
    } catch {}
    setCurrent(closed ? null : pick);
  }, [announcements]);

  if (!current || HIDDEN_ON.some((p) => pathname === p || pathname?.startsWith(`${p}/`))) return null;

  return (
    <div className="announcement-enter">
      <AnnouncementBarView
        announcement={current}
        onDismiss={() => {
          try {
            // Si el anuncio se edita, vuelve a aparecer
            localStorage.setItem(DISMISS_KEY, `${current.id}:${current.updatedAt}`);
          } catch {}
          setCurrent(null);
        }}
      />
    </div>
  );
}
