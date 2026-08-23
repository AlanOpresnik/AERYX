"use client";

import {
  ChevronRight,
  Home,
  Mail,
  MapPin,
  Pencil,
  Phone,
  User,
} from "lucide-react";
import Link from "next/link";

interface UserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    number?: string;
    city?: string;
    province?: string;
    postalCode?: string;
  };
}

interface ProfileInfoCardProps {
  user: UserData;
  onEdit?: () => void;
  onAddAddress?: () => void;
}

export default function ProfileInfoCard({
  user,
  onEdit,
  onAddAddress,
}: ProfileInfoCardProps) {
  const hasAddress =
    user.address &&
    (user.address.street || user.address.city || user.address.postalCode);

  return (
    <section className="bg-white border border-neutral-200 rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-neutral-100">
        <div>
          <h2 className="font-display text-lg text-neutral-900">
            Información personal
          </h2>

          <p className="text-sm text-neutral-500 mt-0.5">
            Tus datos y dirección de entrega
          </p>
        </div>

        <Link
          href={"/profile/edit"}
          className="flex items-center gap-2 text-sm font-medium text-neutral-600 border border-neutral-200 rounded-xl px-3.5 py-2 hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
        >
          <Pencil className="w-4 h-4" strokeWidth={1.8} />
          Editar perfil
        </Link>
      </div>

      {/* Personal data */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InfoItem
            icon={User}
            label="Nombre completo"
            value={
              [user.firstName, user.lastName].filter(Boolean).join(" ") ||
              "Sin especificar"
            }
          />

          <InfoItem
            icon={Mail}
            label="Email"
            value={user.email || "Sin especificar"}
          />

          <InfoItem
            icon={Phone}
            label="Teléfono"
            value={user.phone || "Sin especificar"}
          />
        </div>
      </div>

      {/* Address */}
      <div className="border-t border-neutral-100">
        <div className="px-6 pt-5">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-neutral-500" strokeWidth={1.8} />

            <h3 className="text-sm font-semibold text-neutral-900">
              Dirección de casa
            </h3>
          </div>

          <p className="text-xs text-neutral-400 mt-1 ml-6">
            Usaremos esta dirección para tus pedidos.
          </p>
        </div>

        <div className="p-6 pt-4">
          {hasAddress ? (
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-neutral-200 flex items-center justify-center flex-shrink-0">
                  <MapPin
                    className="w-4 h-4 text-neutral-600"
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <p className="">
                    {user.address?.street} {user.address?.number}
                  </p>

                  <p className=" mt-1">
                    {user.address?.city}
                    {user.address?.province && `, ${user.address.province}`}
                    {user.address?.postalCode &&
                      ` · CP ${user.address.postalCode}`}
                  </p>
                </div>
              </div>

              <Link
              href={'/profile/edit'}
                className="flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Editar
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <button
              type="button"
              onClick={onAddAddress}
              className="w-full group flex items-center justify-between gap-4 rounded-2xl border border-dashed border-neutral-300 p-4 text-left hover:border-neutral-400 hover:bg-neutral-50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
                  <MapPin
                    className="w-4 h-4 text-neutral-500"
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    Agregar dirección de casa
                  </p>

                  <p className="text-xs text-neutral-500 mt-0.5">
                    Guardá una dirección para agilizar tus compras.
                  </p>
                </div>
              </div>

              <ChevronRight
                className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition-colors"
                strokeWidth={1.8}
              />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-neutral-500" strokeWidth={1.8} />
      </div>

      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-neutral-400">
          {label}
        </p>

        <p className="text-sm text-neutral-900 mt-1 truncate">{value}</p>
      </div>
    </div>
  );
}
