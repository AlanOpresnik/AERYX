import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer/Footer";
import { ViewTransition } from "react";
import { SiteHeader } from "@/components/Header/SiteHeader";
import { AnnouncementBar } from "@/components/Announcement/AnnouncementBar";
import { AnnouncementsProvider } from "@/components/Announcement/AnnouncementsContext";
import { getPublicAnnouncements } from "@/lib/announcements";
import { getPresaleConfig } from "@/lib/presale-config";
import { PresaleProvider } from "@/components/Presale/PresaleContext";
import { PendingOrderToast } from "@/components/Presale/PendingOrderToast";
import { CartProvider } from "./context/cartContext";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkAppearance, clerkLocalization } from "@/lib/clerk-appearance";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Aeryx — Equipamiento Gaming Premium",
  description:
    "Mousepads, accesorios y equipamiento de alto rendimiento para jugadores competitivos. Descubrí la colección Aeryx.",
  generator: "v0.app",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#070707",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [announcements, presale] = await Promise.all([getPublicAnnouncements(), getPresaleConfig()]);

  return (
    <html lang="es" className="bg-background">
      <body
        className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ViewTransition>
          <CartProvider>
            <ClerkProvider
              signInUrl="/login"
              signUpUrl="/registro"
              afterSignOutUrl="/"
              appearance={clerkAppearance}
              localization={clerkLocalization}
            >
              <AnnouncementsProvider value={announcements}>
              <PresaleProvider value={presale}>
              <AnnouncementBar announcements={announcements} />
              {/* El header es absoluto: este contenedor lo ubica debajo de la barra de anuncios */}
              <div className="relative">
                <SiteHeader />
              </div>
              {children}
              <PendingOrderToast />
              </PresaleProvider>
              </AnnouncementsProvider>
            </ClerkProvider>
          </CartProvider>
        </ViewTransition>
      </body>
    </html>
  );
}
