import { SignIn, SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <SignUp path="/registro" routing="path" forceRedirectUrl="/sync" />
    </main>
  );
}
