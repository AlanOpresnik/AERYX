import "server-only";

import { auth, currentUser, type User } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

import { SUPERADMIN_EMAIL } from "./constants";

// Única cuenta con acceso al panel. La contraseña vive en Clerk, nunca en el código:
// acá solo se compara el mail, y tiene que estar verificado.
export { SUPERADMIN_EMAIL };

export function isSuperadminUser(user: User | null | undefined): boolean {
  if (!user) return false;
  return user.emailAddresses.some(
    (e) =>
      e.emailAddress.toLowerCase() === SUPERADMIN_EMAIL &&
      e.verification?.status === "verified",
  );
}

/** Usuario actual, memorizado por pedido para no consultar Clerk varias veces. */
export const getCurrentUser = cache(async () => currentUser());

export function primaryEmail(user: User): string | null {
  const primary = user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId);
  if (!primary || primary.verification?.status !== "verified") return null;
  return primary.emailAddress.toLowerCase();
}

/**
 * Para páginas del admin: sin sesión manda a /login (y vuelve después);
 * con otra cuenta responde 404 para no revelar que el panel existe.
 */
export async function requireSuperadmin(returnTo = "/admin"): Promise<User> {
  const { userId } = await auth();
  if (!userId) redirect(`/login?redirect_url=${encodeURIComponent(returnTo)}`);
  const user = await getCurrentUser();
  if (!isSuperadminUser(user)) notFound();
  return user!;
}

/** Para server actions y rutas de API: devuelve un error en vez de redirigir. */
export async function checkSuperadmin(): Promise<{ ok: true; user: User } | { ok: false; status: 401 | 403; error: string }> {
  const { userId } = await auth();
  if (!userId) return { ok: false, status: 401, error: "Iniciá sesión con la cuenta de administración." };
  const user = await getCurrentUser();
  if (!isSuperadminUser(user)) {
    return { ok: false, status: 403, error: "Esta cuenta no tiene permiso de administración." };
  }
  return { ok: true, user: user! };
}
