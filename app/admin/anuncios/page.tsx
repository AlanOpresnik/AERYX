import type { Metadata } from "next";
import { readAnnouncements } from "@/lib/announcements";
import { currentAnnouncement } from "@/lib/announcement-utils";
import { requireSuperadmin } from "@/lib/auth/superadmin";
import { listProducts } from "@/lib/admin/data";
import { EmptyState, PageHeader, Panel } from "../_components/ui";
import { AnnouncementForm } from "./AnnouncementForm";
import { AnnouncementRow } from "./AnnouncementRow";

export const metadata: Metadata = { title: "Anuncios" };
export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
  await requireSuperadmin("/admin/anuncios");
  const [list, products] = await Promise.all([readAnnouncements(), listProducts().catch(() => [])]);
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))].sort();
  const showing = currentAnnouncement(list);

  return (
    <>
      <PageHeader
        title="Anuncios"
        description="La barra de arriba de la web. Se muestra uno a la vez: el primero de la lista que esté al aire."
      />

      <div className="grid gap-3 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <Panel title="Nuevo anuncio">
          <div className="p-5">
            <AnnouncementForm categories={categories} />
          </div>
        </Panel>

        <Panel title={`Tus anuncios (${list.length})`}>
          {list.length === 0 ? (
            <EmptyState title="Todavía no hay anuncios">
              Cuando guardes uno, aparece acá y arriba de toda la web.
            </EmptyState>
          ) : (
            <ul className="divide-y divide-border">
              {list.map((a, i) => (
                <AnnouncementRow key={`${a.id}-${a.updatedAt}`} announcement={a} showing={showing?.id === a.id} first={i === 0} categories={categories} />
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
