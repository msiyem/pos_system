import { ShoppingCart, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import PointItems from '../ui/point_items';

export default function ShoppingCard({ card, setCard }) {
  const [openShoppingCart, setOpenShoppingCart] = useState(false);
  const shoppingCartRef = useRef(null);

  const handleUpdate = (id, newCount) => {
    setCard((pre) =>
      pre.map((item) => (item.id === id ? { ...item, count: newCount } : item))
    );
  };

  const handleDelete = (id) => {
    setCard((pre) => pre.filter((item) => item.id !== id));
  };

  useEffect(() => {
    function handleShoppingCard(e) {
      if (
        shoppingCartRef.current &&
        !shoppingCartRef.current.contains(e.target)
      ) {
        setOpenShoppingCart(false);
      }
    }
    document.addEventListener('mousedown', handleShoppingCard);
    return () => document.removeEventListener('mousedown', handleShoppingCard);
  }, [openShoppingCart]);

  const subtotal = card.reduce((sum, item) => sum + item.price * item.count, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div ref={shoppingCartRef} className="cursor-pointer">
      <div className="fixed top-16 right-5 ring-0 rounded-full flex items-center justify-center border p-0.5 hover:p-1 bg-red-600/30 hover:bg-red-600 text-white">
        <button onClick={() => setOpenShoppingCart(!openShoppingCart)}>
          <ShoppingCart className="h-5 w-5 p-1 m-0.5 cursor-pointer " />
          {card.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600/70 hover:bg-red-600 text-white text-[10px] ring-0 rounded-full flex items-center justify-center px-1">
              {card.length}
            </span>
          )}
        </button>
      </div>

      {/* Dropdown */}
      <div
          className={`absolute right-[15px] top-[110px] max-h-[500px] z-40 shadow-2xl 
          transform origin-top-right transition-all duration-300 ease-out ${
            openShoppingCart ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        >
          <div className="bg-white p-3 w-[300px] sm:w-[400px] flex flex-col rounded-xl border border-gray-300 shadow outline-0">
            {/* Header */}
            <div className="flex justify-between">
              <p className="text-[24px] sm:text-[28px] font-semibold mx-1 font-serif">
                Shopping Cart
              </p>
              <button
                onClick={() => setOpenShoppingCart(false)}
                className="flex items-center h-[25px] w-[25px] cursor-pointer"
              >
                <X />
              </button>
            </div>

            {/* Search */}
            <div className="my-4">
              <input
                type="text"
                placeholder="Search customer..."
                className="ring-0 border-1 w-full rounded-lg border-gray-300 
                focus:ring-0 focus:outline-none focus:border-gray-400 focus:shadow
                p-1 px-2 shadow"
              />
            </div>

            {/* Items */}
            <div className="flex flex-col gap-2 p-1 max-h-[200px] sm:max-h-[250px] overflow-y-auto">
              {card.map((item) => (
                <PointItems
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  count={item.count}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Totals */}
            <div className="flex flex-col gap-1 my-2 p-3 border-y-1 border-gray-400 text-sm sm:text-lg">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between p-3">
              <span className="sm:text-lg font-semibold">Total payable</span>
              <span className="sm:text-lg font-semibold">
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mr-2 mb-5">
              <button className="text-sm p-1 sm:p-2 px-2 sm:px-3 border-1 border-gray-300 bg-gray-400 text-white ring-0 rounded-xl">
                Confirm Sale
              </button>
            </div>
          </div>
        </div>
    </div>
  );
}
