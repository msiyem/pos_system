import { Delete, LucideDelete, Minus, Plus, Trash } from 'lucide-react';

export default function PointItems({
  id,
  name,
  price,
  count,
  onUpdate,
  onDelete,
}) {
  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue > 0) {
      onUpdate(id, newValue);
    } else if (e.target.value === '') {
      onUpdate(id, '0');
    }
  };

  const handleBlur = (e) => {
    if (e.target.value === '' || isNaN(parseInt(e.target.value))) {
      onUpdate(id, 1);
    }
  };
  return (
    <div className="relative w-full ring-gray-300 ring-1 rounded-lg flex justify-between items-center m-0 p-0">
      <div className="flex flex-col p-1 ml-2 my-1 border-r border-gray-200 min-w-25">
        <span className="text-[14px] md:text-[15px] lg:text-[16px] font-light">
          {name}
        </span>
        <span className="text-sm text-gray-500">${price}</span>
      </div>
      <div className="mb-3 mx-3 flex space-x-1 sm:space-x-2 items-center justify-center sm:mx-4 ">
        <button
          onClick={() => onUpdate(id, Math.max(1, count - 1))}
          className="px-1 sm:px-2 ring-0  flex justify-center items-center border border-gray-500  rounded-lg w-5 sm:w-8 h-6 sm:h-8 "
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
          onClick={() => onUpdate(id, count + 1)}
          className="px-1 sm:px-2 ring-0  flex justify-center items-center border border-gray-500 rounded-lg w-5 sm:w-8 h-6 sm:h-8 "
        >
          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>
        <span className="text-sm sm:text-base text-gray-500">
          ${price * count}
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
