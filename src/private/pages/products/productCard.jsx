import {
  EllipsisVertical,
  ShoppingBag,
  ShoppingBagIcon,
  ShoppingCart,
  SquarePen,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../context/useAuth';

export default function Product({
  id,
  image,
  title,
  type,
  price,
  // sku,
  quantity,
  onAddToCart,
}) {
  const [openElipse, setOpenElipse] = useState(false);
  const elipseRef = useRef(null);
  const navigate = useNavigate(null);
  const {role} = useAuth();
  useEffect(() => {
    function handleElipseClick(e) {
      if (elipseRef.current && !elipseRef.current.contains(e.target)) {
        setOpenElipse(false);
      }
    }
    document.addEventListener('mousedown', handleElipseClick);
    return () => {
      document.removeEventListener('mousedown', handleElipseClick);
    };
  }, [openElipse]);
  return (
    <div className="flex relative bg-white flex-col justify-between items-center p-2 ring-0 border-2 border-gray-200 shadow hover:shadow-lg rounded-2xl transition-all duration-200">
      {/* <span className='absolute left-3 top-2 border text-gray-500 text-[14px] border-gray-300 px-2 rounded-xl shadow'>ID: {sku}</span> */}
      <div className="relative h-40 w-full flex items-center justify-center overflow-hidden">
        <img
          src={image}
          alt="Product image"
          className="h-40 w-40 object-contain"
        />
        {role === "admin" && (
          <div className="absolute right-2 top-2" ref={elipseRef}>
          <button
            className="cursor-pointer p-1"
            onClick={() => setOpenElipse(!openElipse)}
          >
            <EllipsisVertical className="h-5 w-5" />
          </button>
          {/* Dropdown ellipsis  */}
          <div
            className={`absolute mt-0 right-3 z-20
                transform origin-top-right transition-all duration-300 ease-out ${
                  openElipse ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`}
          >
            <div className="bg-white border border-gray-300 shadow rounded-xl flex flex-col p-1">
              <div
                onClick={() => navigate(`/products/${id}/edit`)}
                className="flex items-center gap-2 hover:bg-gray-50 hover:shadow p-2 mx-1 py-1.5 cursor-pointer rounded-0  text-blue-600 "
              >
                <SquarePen className="h-4 w-4" />
                <span className="">Edit</span>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
      <div className=" w-full  flex flex-col justify-center ">
        <p className="font-semibold mx-1 text-lg">{title}</p>
        <p className="text-[14px] mx-1 text-gray-600">{type}</p>
        <p className="font-semibold mt-2 mx-1">
          {price} <span className="font-bold">৳</span>{' '}
        </p>
        <div className="flex justify-between mt-auto p-1 items-center">
          {quantity > 0 ? (
            <p className="text-sm  text-blue-900/80">{quantity} In Stock</p>
          ) : (
            <p className="text-sm  text-red-500">Out of Stock</p>
          )}
          {quantity > 0 ? (
            <button
              onClick={() =>
                onAddToCart({
                  id,
                  name: title,
                  type,
                  price,
                  stock: quantity,
                  image,
                })
              }
              className="bg-red-600 flex items-center py-1.5 px-1 pl-2 text-white ring-0 rounded-lg cursor-pointer hover:scale-105"
            >
              <span>Add Card</span>
              <ShoppingCart className=" h-7 w-7 p-1 text-white m-1 " />
            </button>
          ) : (
            <button className="bg-red-600/30 ring-0 rounded-lg cursor-not-allowed ">
              <ShoppingCart className=" h-7 w-7 p-1 text-white m-1 " />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
