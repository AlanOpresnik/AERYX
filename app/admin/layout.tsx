import type { Metadata } from "next";
import { requireSuperadmin } from "@/lib/auth/superadmin";
import { countOrdersToShip, getStoreLinks } from "@/lib/admin/data";
import { AdminShell } from "./_components/AdminShell";

export const metadata: Metadata = {
  title: { template: "%s — Admin Aeryx", default: "Admin Aeryx" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Sin sesión → /login. Otra cuenta → 404.
  const user = await requireSuperadmin();
  const [store, toShip] = await Promise.all([getStoreLinks(), countOrdersToShip()]);
  const email = user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ?? "";

  return (
    <AdminShell
      name={[user.firstName, user.lastName].filter(Boolean).join(" ")}
      email={email}
      storeAdmin={store.admin}
      toShip={toShip}
    >
      {children}
    </AdminShell>
  );
}
