"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";

import { updateProfile } from "../actions";
import { initialUpdateProfileState } from "@/lib/interface/User";
import FormMessages from "../FormStatus/FormMessages";
import SubmitButton from "../SubmitButton/SubmitButton";

export default function UpdateProfileForm({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Nota: useActionState viene de "react" en React 19 / Next.js 15.
  // En versiones anteriores es useFormState, importado de "react-dom".
  const [state, formAction] = useActionState(
    updateProfile,
    initialUpdateProfileState,
  );

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8"
    >
      <FormMessages error={state.error} success={state.success} />

      {children}

      <div className="flex items-center gap-3 mt-8">
        <SubmitButton />

        <button
          type="button"
          onClick={() => router.push("/profile")}
          className="rounded-full border border-neutral-200 px-6 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:border-neutral-400"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}