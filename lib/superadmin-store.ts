import "server-only";

import { createClerkClient } from "@clerk/nextjs/server";
import { SUPERADMIN_EMAIL } from "@/lib/auth/constants";

/**
 * Almacén chico de configuración: la metadata privada de la cuenta superadmin de Clerk.
 * Lo usan los anuncios y la preventa. No hace falta base de datos; límite de Clerk: 8 KB.
 *
 * Cliente directo con la clave secreta: no lee headers del pedido, así que funciona
 * dentro de la caché (clerkClient() de Next sí los lee y la caché lo prohíbe).
 */
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function superadminUser() {
  const { data } = await clerk.users.getUserList({ emailAddress: [SUPERADMIN_EMAIL], limit: 1 });
  return data[0] ?? null;
}

export async function readStoreKey(key: string): Promise<unknown> {
  const user = await superadminUser();
  return (user?.privateMetadata as Record<string, unknown> | undefined)?.[key];
}

/** Clerk combina la metadata: escribir una clave no borra las otras. */
export async function writeStoreKey(key: string, value: unknown): Promise<void> {
  const user = await superadminUser();
  if (!user) throw new Error("No existe la cuenta superadmin en Clerk.");
  await clerk.users.updateUserMetadata(user.id, { privateMetadata: { [key]: value } });
}
