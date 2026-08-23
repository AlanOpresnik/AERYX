export function ShippingOption({
  selected,
  onSelect,
  icon,
  title,
  desc,
  price,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
  price: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-4 border p-4 text-left transition ${
        selected
          ? "border-black bg-black/[0.03]"
          : "border-black/15 hover:border-black/40"
      }`}
    >
      <span className={selected ? "text-black" : "text-black/50"}>{icon}</span>

      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>

        <p className="text-xs text-black/45">{desc}</p>
      </div>

      <span className="text-sm font-semibold">{price}</span>

      <div
        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
          selected ? "border-black bg-black" : "border-black/25"
        }`}
      >
        {selected && <div className="h-2 w-2 rounded-full bg-white" />}
      </div>
    </button>
  );
}
