export function PaymentOption({
  selected,
  onSelect,
  icon,
  title,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <button
      onClick={onSelect}
      className={`flex w-full items-center gap-4 border p-4 text-left transition ${selected ? "border-black bg-black/[0.03]" : "border-black/15 hover:border-black/40"}`}
    >
      <span
        className={`flex h-8 w-12 items-center justify-center border ${selected ? "border-black" : "border-black/20"} text-xs font-bold`}
      >
        {icon}
      </span>
      <span className="flex-1 text-sm font-semibold">{title}</span>
      <div
        className={`flex h-5 w-5 items-center justify-center rounded-full border ${selected ? "border-black bg-black" : "border-black/25"}`}
      >
        {selected && <div className="h-2 w-2 rounded-full bg-white" />}
      </div>
    </button>
  );
}