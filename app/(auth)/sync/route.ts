import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: Request) {
  try {
      console.log("🔥 AUTH SYNC EJECUTADO");
    // ============================================
    // OBTENER SESIÓN DE CLERK
    // ============================================

    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.redirect(
        new URL("/login", request.url),
      );
    }

    // ============================================
    // OBTENER USUARIO DE CLERK
    // ============================================

    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.redirect(
        new URL("/login", request.url),
      );
    }

    // ============================================
    // TOKEN
    // ============================================

    const token = await getToken();

    if (!token) {
      throw new Error(
        "No se pudo obtener el token de Clerk",
      );
    }

    // ============================================
    // EMAIL
    // ============================================

    const primaryEmail =
      clerkUser.emailAddresses.find(
        (email) =>
          email.id ===
          clerkUser.primaryEmailAddressId,
      );

    // ============================================
    // SYNC CON BACKEND
    // ============================================

    const response = await fetch(
      `${API_URL}/api/users/sync`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          email:
            primaryEmail?.emailAddress || "",

          firstName:
            clerkUser.firstName || "",

          lastName:
            clerkUser.lastName || "",

          username:
            clerkUser.username || null,

          imageUrl:
            clerkUser.imageUrl || null,
        }),

        cache: "no-store",
      },
    );

    const data = await response.json();

    console.log(data)

    // ============================================
    // ERROR DEL BACKEND
    // ============================================

    if (!response.ok) {
      console.error(
        "Error sincronizando usuario:",
        data,
      );

      return NextResponse.redirect(
        new URL(
          "/registro?error=sync",
          request.url,
        ),
      );
    }

    // ============================================
    // OK
    // ============================================

    console.log(
      "Usuario sincronizado:",
      data.user?._id,
    );

    return NextResponse.redirect(
      new URL("/", request.url),
    );
  } catch (error) {
    console.error(
      "ERROR EN AUTH SYNC:",
      error,
    );

    return NextResponse.redirect(
      new URL(
        "/registro?error=sync",
        request.url,
      ),
    );
  }
}