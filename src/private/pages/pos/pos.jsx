import { Clock, Printer, TimerIcon, TimerOff } from 'lucide-react';
import PointItems from '../../../ui/point_items';
import { useEffect, useState } from 'react';

export default function Pos() {
  const [items, setItems] = useState([
    {
      id: 1,
      name: 'Iphone 16 Pro Max',
      price: 999,
      count: 1,
    },
    {
      id: 2,
      name: 'AirPod',
      price: 499,
      count: 1,
    },
  ]);
  const newItem = {
    id: 3,
    name: 'MacBood',
    price: 899,
    count: 1,
  };
  const handleUpdate = (id, newCount) => {
    setItems((pre) =>
      pre.map((item) => (item.id === id ? { ...item, count: newCount } : item))
    );
  };
  const handleAddItem = (newItem) => {
    setItems((pre) => [...pre, newItem]);
  };
  useEffect(() => {
    handleAddItem(newItem);
  }, []);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.count,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  return (
    <div className="bg-gray-100 overflow-y-auto w-full min-h-screen flex justify-center ">
      <div className="bg-white m-5 mb-10 p-3 w-full max-w-[1000px] ring-0 rounded-xl">
        <div className="flex justify-between m-2">
          <p className="text-[32px] font-semibold font-serif">Point of Sale</p>
          <span className="border border-gray-300 rounded-md px-1 text-xs font-serif flex items-center h-[20px] ">
            Order #101
          </span>
        </div>
        <div className="my-8">
          <input
            type="text"
            placeholder="Search customer...."
            className="ring-0 border-1 w-full rounded-lg border-gray-300 
            focus:ring-0 focus:outline-none focus:border-gray-400 focus:shadow
            p-1 px-2 shadow"
          />
        </div>
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <PointItems
              id={item.id}
              name={item.name}
              price={item.price}
              count={item.count}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2 my-5 p-3 border-y-1 border-gray-400">
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
          <span className="text-lg font-semibold">Total payable</span>
          <span className="text-lg font-semibold">${total.toFixed()}</span>
        </div>
        <div className="flex flex-col p-3 my-1 gap-2">
          <span className="">Order Notes:</span>
          <textarea
            placeholder="Any special instructions...."
            name=""
            id=""
            className="border-1 w-full border-gray-400 min-h-12 px-3 py-1 ring-0 rounded-lg outline-0"
          ></textarea>
        </div>
        <div className="flex items-center justify-end gap-3 mr-2 mb-5">
          <button className="flex space-x-1 justify-center items-center ring-1 p-2 rounded-xl ring-gray-300 shadow ">
            <Clock className="w-6 h-6 p-1" />
            <span>Save Pending</span>
          </button>
          <button className="flex space-x-1 justify-center items-center ring-1 rounded-xl ring-gray-300 p-2">
            <Printer className="w-6 h-6 p-1" />
            <span>Print</span>
          </button>
          <button className="p-2 px-3 border-1 border-gray-300 bg-gray-400 text-white ring-0 rounded-xl">
            Confirm Sale
          </button>
        </div>
      </div>
    </div>
  );
}
