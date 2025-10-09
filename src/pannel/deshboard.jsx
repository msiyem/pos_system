
import { Home, Plus } from "lucide-react";
import { Link,Routes,Route } from 'react-router-dom'

export default function Deshboard() {
    
  return (

    <div className="w-full flex flex-col gap-5 m-3">
      <div className="flex flex-col gap-1">
      <span className="text-[18px] font-semibold ">Dashboard</span>
      <span>Welcome!</span>
      </div>
      <div className="grid sm:grid-cols-4 min-w-[1000px] gap-5 mx-1">
        <div className="flex flex-col border-2 border-gray-200 rounded-2xl h-[130px] justify-center items-center px-10 min-w-[200px] bg-white shadow ">
          <span>Total Sales</span>
          <span className="text-[32px] font-bold">$120K</span>
          <span className="text-green-400">+47.5%</span>
        </div>

        <div className="flex flex-col border-2 border-gray-200 rounded-2xl h-[130px] justify-center items-center px-10 min-w-[200px] bg-white shadow ">
          <span>Total Revenue</span>
          <span className="text-[32px] font-bold">$80K</span>
          <span className="text-green-400">+32.1%</span>
        </div>

        <div className="flex flex-col border-2 border-gray-200 rounded-2xl h-[130px] justify-center items-center px-10 min-w-[200px] bg-white shadow ">
          <span>Total Products</span>
          <span className="text-[32px] font-bold">1,024</span>
          <span className="text-red-400">-5.5%</span>
        </div>

        <div className="flex flex-col border-2 border-gray-200 rounded-2xl h-[130px] justify-center items-center px-10 min-w-[200px]  shadow  bg-red-300">
          <span className="p-3 bg-white ring-0 rounded-full">
            <Plus className="h-4 w-4 "/>
          </span>
          <span className="text-white">Add New Product</span>
        </div>
      </div>

      <div>
        <span>Sales Overview</span>


      </div>

      <div>
        <div>
          <span>Top Selling Products</span>
        </div>
      </div>
      
    </div>
  );
}
