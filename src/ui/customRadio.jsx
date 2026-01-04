export default function InputRadio({
  label,
  name,
  options,
  required,
  register,
  error,
}) {
  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        <div>
        <span className="font-semibold">{label}</span>
        {required && <span className="text-red-500 ml-1">*</span>}
      </div>
      <div className="flex w-full justify-around">
        {options.map((opt) => (
          <label
            htmlFor={name}
            key={opt.value}
            className="flex gap-2 items-center"
          >
            <input type="radio" value={opt.value} {...register(name)} />
            {opt.label}
          </label>
        ))}
      </div>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
