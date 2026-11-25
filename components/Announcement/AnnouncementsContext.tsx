"use client";

import { createContext, useContext } from "react";
import type { Announcement } from "@/lib/announcement-utils";

const AnnouncementsContext = createContext<Announcement[]>([]);

/** Hace llegar los anuncios al carrito sin pasarlos componente por componente. */
export function AnnouncementsProvider({ value, children }: { value: Announcement[]; children: React.ReactNode }) {
  return <AnnouncementsContext.Provider value={value}>{children}</AnnouncementsContext.Provider>;
}

export const useAnnouncements = () => useContext(AnnouncementsContext);
