export default function InputRadio({formData,name,title,value,handleChange}){
  return(
          <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={name}
                  value={value}
                  checked={formData[name] === value}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#623e8a]/85"
                />
                {title}
              </label>
  );
}