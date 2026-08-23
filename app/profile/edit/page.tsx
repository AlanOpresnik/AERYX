import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import AsideProfile from "../components/Aside/AsideProfile";
import { UserDataInterface } from "@/lib/interface/User";
import UpdateProfileForm from "./updateProfileForm/UpdateProfileForm";
import PersonalInfoSection from "./FormStatus/PersonalInfoSection";
import AddressSection from "./FormStatus/AddressSection";

async function getUserData(token: string): Promise<UserDataInterface> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || "No se pudo obtener la información del usuario.",
    );
  }

  return data.user;
}

export default async function ActualizarDatosPage() {
  // Nota: en Clerk v6 (Next.js 15) auth() es async. Si tu proyecto usa
  // una versión anterior, sacá el "await" de esta línea.
  const { userId, getToken } = await auth();

  if (!userId) {
    redirect("/signIn");
  }

  const token = await getToken();

  if (!token) {
    redirect("/signIn");
  }

  let userData: UserDataInterface | null = null;
  let loadError: string | null = null;

  try {
    userData = await getUserData(token);
  } catch (err) {
    loadError =
      err instanceof Error
        ? err.message
        : "Error obteniendo la información del usuario.";
  }

  return (
    <div className="min-h-screen pt-24 bg-neutral-100 text-neutral-900">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 md:gap-8 p-6 md:p-10">
        {/* SIDEBAR */}
        <AsideProfile
          firstName={userData?.firstName}
          lastName={userData?.lastName}
        />

        {/* MAIN */}
        <main className="flex-1 min-w-0">
          {/* HEADER */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">
              Área personal
            </p>

            <h1 className="font-display text-3xl md:text-4xl font-medium tracking-tight text-neutral-900">
              Actualizar mis datos
            </h1>

            <p className="text-neutral-500 text-sm mt-2 max-w-md">
              Mantené actualizados tus datos personales y tu dirección de
              entrega.
            </p>
          </div>

          {/* ERROR AL CARGAR */}
          {loadError && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">{loadError}</p>
            </div>
          )}

          {/* FORM */}
          {userData && (
            <UpdateProfileForm>
              <PersonalInfoSection data={userData} />
              <AddressSection data={userData.address ?? {}} />
            </UpdateProfileForm>
          )}
        </main>
      </div>
    </div>
  );
}