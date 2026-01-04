export default function InputText({
  label,
  name,
  register,
  error,
  required,
  type = 'text',
  placeholder = '',
  maxLength,
  onlyNumber = false,
  onlyText = false,
  ...rest
}) {
  const registerProps = register(name, {
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
      if (onlyNumber) value = value.replace(/\D/g, '');
      if (onlyText) value = value.replace(/[^A-Za-z\s]/g, '');
      e.target.value = value;
    },
  });

  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={name} className="font-semibold text-nowrap">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        id={name}
        type={type}
        maxLength={maxLength}
        placeholder={placeholder}
        inputMode={onlyNumber ? 'numeric' : undefined}
        aria-invalid={!!error}
        className={`border p-2 py-1.5 rounded-lg outline-none bg-white/90
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
        {...registerProps}
        {...rest}
      />

      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
