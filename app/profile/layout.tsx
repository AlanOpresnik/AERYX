import type { Metadata } from "next";
import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { Footer } from "@/components/Footer/Footer";
import { getAccount, getMyOrders } from "@/lib/account/data";
import { isOngoing } from "./_components/order-view";
import { ProfileNav } from "./_components/ProfileNav";

export const metadata: Metadata = {
  title: { template: "%s — Mi cuenta · Aeryx", default: "Mi cuenta · Aeryx" },
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const [account, { orders }] = await Promise.all([getAccount(), getMyOrders()]);
  const name = [account.firstName, account.lastName].filter(Boolean).join(" ");
  const initials = (account.firstName[0] ?? account.email[0] ?? "?") + (account.lastName[0] ?? "");

  return (
    <>
      <main className="min-h-svh bg-background text-foreground">
        <div className="mx-auto w-full max-w-5xl px-6 pb-20 pt-28 md:px-8 md:pt-36">
          <header className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="flex items-center gap-5">
              {account.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={account.imageUrl} alt="" className="size-16 rounded-full object-cover md:size-20" />
              ) : (
                <span
                  aria-hidden="true"
                  className="grid size-16 place-items-center rounded-full bg-foreground text-xl font-medium uppercase tracking-[-0.02em] text-background md:size-20 md:text-2xl"
                >
                  {initials}
                </span>
              )}
              <div className="min-w-0">
                <h1 className="text-[clamp(2rem,5vw,3.25rem)] font-medium leading-[1] tracking-[-0.045em] text-balance">
                  {account.firstName ? `Hola, ${account.firstName}` : "Tu cuenta"}
                </h1>
                <p className="mt-2 truncate text-sm text-muted-foreground">
                  {name && name !== account.firstName ? `${name} · ` : ""}
                  {account.email}
                </p>
              </div>
            </div>

            <SignOutButton redirectUrl="/">
              <button
                type="button"
                className="press flex h-10 w-fit items-center gap-2 rounded-full border border-border px-4 text-sm text-muted-foreground transition-[color,border-color,transform] duration-150 hover:border-foreground/30 hover:text-foreground"
              >
                <LogOut className="size-4" />
                Cerrar sesión
              </button>
            </SignOutButton>
          </header>

          <div className="mt-10">
            <ProfileNav ongoing={orders.filter(isOngoing).length} />
          </div>

          <div className="mt-10">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
