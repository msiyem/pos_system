import { Delete, LucideDelete, Minus, Plus, Trash } from 'lucide-react';

export default function PointItems({
  id,
  name,
  price,
  stock,
  count,
  onUpdate,
  onDelete,
}) {
  const handleInputChange = (e) => {
    let newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue > 0 ) {
      newValue = Math.min(stock,newValue);
      onUpdate(id, newValue);
    } else if (e.target.value === '') {
      onUpdate(id, 0);
    }
  };

  const handleBlur = (e) => {
    if (e.target.value === '' || isNaN(parseInt(e.target.value))) {
      onUpdate(id, 1);
    }
  };
  return (
    <div className="relative bg-white w-full ring-gray-300 ring-1 rounded-lg flex justify-between items-center m-0 p-0">
      <div className="flex flex-col p-1 ml-2 my-1 border-r border-gray-200 min-w-25">
        <span className="text-[14px] md:text-[15px] lg:text-[16px] font-light">
          {name}
        </span>
        <span className="text-sm text-gray-500">
          {price} <span className="font-mono text-[12px] mt-[4px]">৳</span>
        </span>
      </div>
      <div className="mb-3 mx-3 flex space-x-1 sm:space-x-2 items-center justify-center sm:mx-4 ">
        <button
          onClick={() => onUpdate(id, Math.max(1, count - 1))}
          className="cursor-pointer px-1 sm:px-2 ring-0  flex justify-center items-center border border-gray-500  rounded-full w-5 sm:w-8 h-6 sm:h-6 hover:bg-gray-50 hover:scale-105 duration-200 transition-all"
        >
          <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>
        <input
          type="text"
          value={count}
          onChange={handleInputChange}
          onBlur={handleBlur}
          min="1"
          className="text-center border border-gray-400 rounded-md text-sm sm:text-base font-mono outline-none"
          style={{
            width: `${String(count).length + 3}ch`,
          }}
        />

        <button
          onClick={() => {
            if (stock > count) {
              onUpdate(id, count + 1);
            }
          }}
          className="cursor-pointer px-1 sm:px-2 ring-0  flex justify-center items-center border border-gray-500 rounded-full w-5 sm:w-8 h-6 sm:h-6 hover:scale-105 hover:bg-gray-50 duration-200 transition-all"
        >
          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>
        <span className="text-sm sm:text-base flex items-center gap-0.5 text-gray-500">
          {price * count}{' '}
          <span className="font-mono text-[12px] mt-[4px]">৳</span>
        </span>
        <button
          onClick={() => onDelete(id)}
          className="absolute right-1 bottom-1.5"
        >
          <Trash className="h-5 w-5 p-1 cursor-pointer border border-gray-300 ring-0 rounded-lg text-red-500/60 hover:text-red-500 hover:shadow" />
        </button>
      </div>
    </div>
  );
}
