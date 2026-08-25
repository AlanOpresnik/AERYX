import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});



  export const formatPrice = (value: number = 0): string => {
    return `$${Number(value).toLocaleString("es-AR")}`;
  };

  export const formatDate = (date?: string): string => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "es-AR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  };