export default function FormMessages({
  error,
  success,
}: {
  error: string | null;
  success: boolean;
}) {
  if (!error && !success) return null;

  return (
    <div className="mb-6">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-sm text-emerald-700">
            Tus datos se actualizaron correctamente.
          </p>
        </div>
      )}
    </div>
  );
}