import "server-only";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getCurrentUser, primaryEmail } from "@/lib/auth/superadmin";
import { tiendanube } from "@/lib/tiendanube/client";
import { toAdminOrder, withPresale, type AdminOrder } from "@/lib/tiendanube/orders";
import { getPresaleConfig } from "@/lib/presale-config";

export type ShippingAddress = {
  street: string;
  number: string;
  floorApt: string;
  city: string;
  province: string;
  postalCode: string;
  notes: string;
};

export const EMPTY_ADDRESS: ShippingAddress = {
  street: "",
  number: "",
  floorApt: "",
  city: "",
  province: "",
  postalCode: "",
  notes: "",
};

/** Datos de contacto y envío: viven en la metadata privada de Clerk (solo el servidor la lee). */
type AccountMetadata = { phone?: string; address?: Partial<ShippingAddress> };

/** Cuenta con sesión iniciada. Sin sesión, al login (y vuelve a `returnTo`). */
export const getAccount = cache(async (returnTo = "/profile") => {
  const { userId } = await auth();
  if (!userId) redirect(`/login?redirect_url=${encodeURIComponent(returnTo)}`);
  const user = await getCurrentUser();
  if (!user) redirect(`/login?redirect_url=${encodeURIComponent(returnTo)}`);

  const meta = (user.privateMetadata ?? {}) as AccountMetadata;
  const address = { ...EMPTY_ADDRESS, ...(meta.address ?? {}) };
  const email =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ?? "";

  return {
    id: user.id,
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    email,
    emailVerified: primaryEmail(user) !== null,
    imageUrl: user.hasImage ? user.imageUrl : null,
    createdAt: new Date(user.createdAt).toISOString(),
    phone: meta.phone ?? "",
    address,
    hasAddress: Boolean(address.street && address.city),
    hasPassword: user.passwordEnabled,
    twoFactor: user.twoFactorEnabled,
  };
});

export type Account = Awaited<ReturnType<typeof getAccount>>;

/**
 * Pedidos del usuario: se buscan por el mail verificado de la sesión,
 * con coincidencia exacta (la búsqueda de Tiendanube es parcial).
 */
export const getMyOrders = cache(async (): Promise<{ orders: AdminOrder[]; error: boolean }> => {
  const user = await getCurrentUser();
  const email = user ? primaryEmail(user) : null;
  if (!email) return { orders: [], error: false };

  try {
    const { items: customers } = await tiendanube.getCustomersPage({ q: email, per_page: 50 });
    const customer = customers.find((c) => c.email?.toLowerCase() === email);
    if (!customer) return { orders: [], error: false };

    const { items } = await tiendanube.getOrdersPage({ customer_ids: customer.id, per_page: 200 });
    const orders = items
      .filter((o) => (o.customer?.email || o.contact_email || "").toLowerCase() === email)
      .map(toAdminOrder)
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return { orders: withPresale(orders, await getPresaleConfig()), error: false };
  } catch (error) {
    console.error("[Cuenta] Error trayendo pedidos:", error);
    return { orders: [], error: true };
  }
});
