"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export type SaveState =
  | { status: "idle" }
  | { status: "saved"; at: number }
  | { status: "error"; message: string; fields?: Record<string, string> };

const LIMITS: Record<string, number> = {
  firstName: 60,
  lastName: 60,
  phone: 30,
  street: 120,
  number: 20,
  floorApt: 40,
  city: 80,
  province: 60,
  postalCode: 12,
  notes: 200,
};

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim().slice(0, LIMITS[key] ?? 100);

export async function saveProfile(_prev: SaveState, form: FormData): Promise<SaveState> {
  const { userId } = await auth();
  if (!userId) return { status: "error", message: "Tu sesión venció. Volvé a iniciar sesión." };

  const data = Object.fromEntries(Object.keys(LIMITS).map((k) => [k, text(form, k)]));

  const fields: Record<string, string> = {};
  if (!data.firstName) fields.firstName = "Escribí tu nombre.";
  if (data.phone && !/^[+\d][\d\s()-]{5,}$/.test(data.phone)) {
    fields.phone = "Usá solo números, espacios o guiones. Ej: 11 5555 1234";
  }
  if (data.postalCode && !/^[A-Za-z]?\d{4}[A-Za-z]{0,3}$/.test(data.postalCode)) {
    fields.postalCode = "El código postal tiene 4 números (o el formato nuevo, ej. C1425ABC).";
  }
  const anyAddress = ["street", "number", "city", "province", "postalCode"].some((k) => data[k]);
  if (anyAddress) {
    if (!data.street) fields.street = "Falta la calle.";
    if (!data.number) fields.number = "Falta la altura.";
    if (!data.city) fields.city = "Falta la ciudad.";
    if (!data.province) fields.province = "Elegí la provincia.";
  }
  if (Object.keys(fields).length) {
    return { status: "error", message: "Revisá los campos marcados.", fields };
  }

  try {
    const client = await clerkClient();
    await client.users.updateUser(userId, { firstName: data.firstName, lastName: data.lastName });
    await client.users.updateUserMetadata(userId, {
      privateMetadata: {
        phone: data.phone,
        address: {
          street: data.street,
          number: data.number,
          floorApt: data.floorApt,
          city: data.city,
          province: data.province,
          postalCode: data.postalCode.toUpperCase(),
          notes: data.notes,
        },
      },
    });
    revalidatePath("/profile", "layout");
    return { status: "saved", at: Date.now() };
  } catch (error) {
    console.error("[Cuenta] Error guardando datos:", error);
    return { status: "error", message: "No pudimos guardar los cambios. Probá de nuevo en un momento." };
  }
}
