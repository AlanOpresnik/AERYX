type FormFieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  optional?: boolean;
  className?: string;
  type?: string;
};

export default function FormField({
  label,
  name,
  defaultValue,
  placeholder,
  optional = false,
  className = "",
  type = "text",
}: FormFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-neutral-700 mb-1.5"
      >
        {label}
        {optional && (
          <span className="text-neutral-400 font-normal"> (opcional)</span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-xl border border-neutral-200 bg-neutral-50/60 px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
      />
    </div>
  );
}