import { UserClerk } from "@/lib/interface/User";
import { UserResource } from "@clerk/nextjs/types";
import { User } from "lucide-react";
import React from "react";

interface Props {
  user: UserResource | null | undefined;
}

export default function Avatar({ user }: Props) {
  return (
    <>
      <div className="relative size-9 overflow-hidden rounded-full border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-white/30 group-hover:bg-white/10">
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={user.firstName || user.username || "Usuario"}
            className="size-full object-cover"
          />
        ) : (
          <div className="grid size-full place-items-center">
            <User className="size-4 text-white/70" />
          </div>
        )}
      </div>
    </>
  );
}
