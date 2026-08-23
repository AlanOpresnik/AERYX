"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { api } from "@/lib/api/api";
import { UpdateProfileState } from "@/lib/interface/User";

export async function updateProfile(
  _prevState: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> {
  try {
    // Nota: en Clerk v6 (Next.js 15) auth() es async. Si tu proyecto usa
    // una versión anterior, sacá el "await" de esta línea.
    const { userId, getToken } = await auth();

    if (!userId) {
      return {
        error: "Tu sesión expiró, volvé a iniciar sesión.",
        success: false,
      };
    }

    const token = await getToken();

    if (!token) {
      return {
        error: "No se pudo obtener el token de autenticación.",
        success: false,
      };
    }

    const result = await api.users.update(
      {
        firstName: formData.get("firstName")?.toString() ?? "",
        lastName: formData.get("lastName")?.toString() ?? "",
        phone: formData.get("phone")?.toString() ?? "",
        address: {
          address: formData.get("address")?.toString() ?? "",
          addressNumber: formData.get("addressNumber")?.toString() ?? "",
          betweenStreet1: formData.get("betweenStreet1")?.toString() ?? "",
          betweenStreet2: formData.get("betweenStreet2")?.toString() ?? "",
          floorApt: formData.get("floorApt")?.toString() ?? "",
          city: formData.get("city")?.toString() ?? "",
          postalCode: formData.get("postalCode")?.toString() ?? "",
          province: formData.get("province")?.toString() ?? "",
        },
      },
      token,
    );

    if (!result || !result.success) {
      return {
        error: "No se pudieron guardar los cambios.",
        success: false,
      };
    }

    // Vuelve a pedirle al server la página con los datos ya actualizados.
    revalidatePath("/profile/edit");

    return { error: null, success: true };
  } catch (err) {
    console.error("ERROR ACTUALIZANDO USUARIO:", err);

    return {
      error:
        err instanceof Error ? err.message : "Error guardando los cambios.",
      success: false,
    };
  }
}