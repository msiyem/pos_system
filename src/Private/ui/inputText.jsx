export default function InputText({title,type,formData,handleChange,placeholder,name,required}) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold mb-1 text-nowrap w-[15ch]">{title} {required && <span className="text-red-500">*</span>}</span>
      <span className="font-semibold mb-1 text-nowrap ">:</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder || name}
        value={type==='number'?parseFloat(formData[name]): formData[name] || ""}
        onChange={handleChange}
        min={0}
        pattern={name === "phone" ? "[0-9]{11}" : undefined}
        className="border  p-2 py-1 w-full rounded-xl outline-0 hover:shadow hover:scale-101 bg-blue-50"
        required={required}
      />
    </div>
  );
}
