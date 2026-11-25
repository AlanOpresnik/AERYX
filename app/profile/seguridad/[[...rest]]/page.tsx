import type { Metadata } from "next";
import { UserProfile } from "@clerk/nextjs";

export const metadata: Metadata = { title: "Seguridad" };

/**
 * Contraseña, mail, cuentas vinculadas, verificación en dos pasos y sesiones abiertas.
 * Lo resuelve Clerk, con la misma apariencia del resto del sitio.
 */
export default function SeguridadPage() {
  return (
    <UserProfile
      path="/profile/seguridad"
      routing="path"
      appearance={{
        elements: {
          rootBox: "w-full",
          cardBox: "w-full max-w-none overflow-visible rounded-2xl border border-border bg-[#0d0d0d] shadow-none",
          navbar: "border-r border-border bg-transparent",
          navbarMobileMenuRow: "bg-transparent",
          scrollBox: "rounded-none bg-transparent",
          pageScrollBox: "p-5 md:p-8",
          headerTitle: "text-xl font-medium tracking-[-0.03em]",
          profileSectionTitleText: "text-sm font-medium",
          profileSectionPrimaryButton: "rounded-full",
          badge: "rounded-full",
        },
      }}
    />
  );
}
