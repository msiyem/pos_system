export default function InputText({title,type,formData,handleChange,placeholder,name,required}) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-gray-700 mb-1 text-nowrap w-[15ch]">{title} </span>
      <span className="font-semibold text-gray-700 mb-1 text-nowrap">:</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder || name}
        value={formData[name] || ""}
        onChange={handleChange}
        pattern={name === "phone" ? "[0-9]{11}" : undefined}
        className="border border-gray-300  p-2 py-1 w-full rounded-xl outline-0 hover:shadow"
        required={required}
      />
    </div>
  );
}
