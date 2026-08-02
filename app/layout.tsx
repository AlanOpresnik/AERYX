import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer/Footer";

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="bg-background">
      <body
        className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
