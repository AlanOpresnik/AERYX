import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/Auth/AuthShell";

export const metadata: Metadata = { title: "Iniciar sesión — Aeryx" };

export default function LoginPage() {
  return (
    <AuthShell
      image="/banner/Banner2.jpeg"
      focus="50% 18%"
      statement={
        <>
          Born to
          <br />
          compete.
        </>
      }
      caption="Equipamiento diseñado para transformar cada movimiento en una ventaja competitiva."
    >
      <SignIn
        path="/login"
        routing="path"
        signUpUrl="/registro"
        // Vuelve a la página que pidió el login (redirect_url); si no hay, al inicio
        fallbackRedirectUrl="/"
      />
    </AuthShell>
  );
}
