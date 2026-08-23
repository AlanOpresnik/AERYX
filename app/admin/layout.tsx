import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});
export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="bg-background">
      <ClerkProvider>
        <body
          className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}
        >
          {children}
        </body>
      </ClerkProvider>
    </html>
  );
}
