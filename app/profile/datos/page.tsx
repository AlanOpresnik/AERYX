import type { Metadata } from "next";
import { getAccount } from "@/lib/account/data";
import { ProfileForm } from "./ProfileForm";

export const metadata: Metadata = { title: "Mis datos" };

export default async function DatosPage() {
  const account = await getAccount("/profile/datos");
  return (
    <ProfileForm
      email={account.email}
      initial={{
        firstName: account.firstName,
        lastName: account.lastName,
        phone: account.phone,
        ...account.address,
      }}
    />
  );
}
