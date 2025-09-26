import { ShoppingBag, ShoppingBagIcon, ShoppingCart } from 'lucide-react';

export default function Product({
  id,
  image,
  title,
  type,
  price,
  quantity,
  onAddToCard,
}) {
  return (
    <div className="flex bg-white flex-col justify-between items-center p-2 ring-0 border-2 border-gray-200 shadow rounded-2xl">
      <div className="h-40 w-full flex justify-center overflow-hidden ">
        <img
          src={image}
          alt="Product image"
          className="h-40 w-40 object-contain"
        />
      </div>
      <div className=" w-full  flex flex-col justify-center ">
        <p className="font-semibold mx-1 text-lg">{title}</p>
        <p className="text-[14px] mx-1 text-gray-600">{type}</p>
        <p className="font-semibold mt-2 mx-1">${price}</p>
        <div className="flex justify-between mt-auto p-1 items-center">
          {quantity > 0 ? (
            <p className="text-sm  text-blue-900/80">{quantity} In Stock</p>
          ) : (
            <p className="text-sm  text-red-500">Out of Stock</p>
          )}
          {quantity>0?(
            <button
            onClick={() => onAddToCard({ id, title, type, price, image })}
            className="bg-red-600 ring-0 rounded-lg cursor-pointer "
          >
            <ShoppingCart className=" h-7 w-7 p-1 text-white m-1 " />
          </button>
        ):(
          <button
            
            className="bg-red-600/30 ring-0 rounded-lg cursor-not-allowed "
          >
            <ShoppingCart className=" h-7 w-7 p-1 text-white m-1 " />
          </button>
        )}
        </div>
      </div>
    </div>
  );
}
