import { Footer } from "@/components/Footer/Footer";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f4f4f1] text-[#101010]">
      <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
        <header className="mb-12 border-b border-black/60 pb-3">
          <div className="flex items-start justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
              Perfil
            </p>

            <p className="hidden text-[10px] font-bold uppercase tracking-[0.2em] sm:block">
              Mis pedidos
            </p>
          </div>
        </header>

        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-black" />

            <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-black/45">
              Cargando pedidos...
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}