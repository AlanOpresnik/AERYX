"use client";

import { createContext, useContext } from "react";
import { DEFAULT_PRESALE, type PresaleConfig } from "@/lib/presale";

const PresaleContext = createContext<PresaleConfig>(DEFAULT_PRESALE);

/** Configuración de la preventa para los sellos y avisos del navegador. */
export function PresaleProvider({ value, children }: { value: PresaleConfig; children: React.ReactNode }) {
  return <PresaleContext.Provider value={value}>{children}</PresaleContext.Provider>;
}

export const usePresaleConfig = () => useContext(PresaleContext);
