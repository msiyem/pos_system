export default function InputTextarea({
  label,
  name,
  register,
  error,
  required,
  placeholder = '',
  maxLength,
  rows = 4,
  onlyNumber = false,
  onlyText = false,
  ...rest
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={name} className="font-semibold text-nowrap">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <textarea
        id={name}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        inputMode={onlyNumber ? 'numeric' : undefined}
        aria-invalid={!!error}
        className={`border min-h-12 max-h-60 p-2 rounded-lg outline-none resize-y bg-white/90 overflow-auto
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
        {...register(name, {
          required: required && `${label} is required`,

          ...(onlyNumber && {
            pattern: {
              value: /^[0-9]+$/,
              message: 'Only numbers allowed',
            },
            maxLength: {
              value: maxLength,
              message: `Maximum ${maxLength} digits allowed`,
            },
          }),

          ...(onlyText && {
            pattern: {
              value: /^[A-Za-z\s]+$/,
              message: 'Only letters allowed',
            },
          }),

          onChange: (e) => {
            let value = e.target.value;

            if (onlyNumber) {
              value = value.replace(/\D/g, '');
            }

            if (onlyText) {
              value = value.replace(/[^A-Za-z\s]/g, '');
            }

            e.target.value = value;
          },
        })}
        {...rest}
      />

      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
