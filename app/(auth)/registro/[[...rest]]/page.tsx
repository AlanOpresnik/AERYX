import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/Auth/AuthShell";

export const metadata: Metadata = { title: "Crear cuenta — Aeryx" };

export default function RegisterPage() {
  return (
    <AuthShell
      image="/banner/Banner.png"
      focus="50% 22%"
      statement={
        <>
          Tu setup,
          <br />
          tu ventaja.
        </>
      }
      caption="Guardá tus datos de envío y seguí cada pedido desde tu cuenta."
    >
      <SignUp path="/registro" routing="path" signInUrl="/login" forceRedirectUrl="/sync" />
    </AuthShell>
  );
}
