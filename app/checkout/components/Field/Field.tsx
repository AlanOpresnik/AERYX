export function Field({
  label,
  placeholder,
  type = "text",
  full = false,
  value,
  onChange,
  name,
  required = false,
}: {
  label: string;
  placeholder: string;
  type?: string;
  full?: boolean;
  value: string;
  onChange: (value: string) => void;
  name?: string;
  required?: boolean;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-black/55">
        {label}
      </span>

      <input
        name={name}
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-b border-black/25 bg-transparent py-3 text-sm outline-none transition focus:border-black placeholder:text-black/30"
      />
    </label>
  );
}