

export function CatalogSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Imagen */}
      <div className="relative aspect-square w-full overflow-hidden bg-black/10">
        {/* Badge */}
        <div className="absolute left-3 top-3 h-6 w-20 rounded-full bg-black/10" />

        {/* Heart */}
        <div className="absolute right-3 top-3 h-8 w-8 rounded-full bg-black/10" />
      </div>

      {/* Información */}
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="h-5 w-32 rounded bg-black/10" />

          <div className="mt-2 h-3 w-44 rounded bg-black/10" />
        </div>

        <div className="h-5 w-16 rounded bg-black/10" />
      </div>
    </div>
  );
}