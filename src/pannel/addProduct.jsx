import { Plus, Search, SearchIcon } from 'lucide-react';
import BackButton from '../ui/backButton';

export default function AddProduct() {
  return (
    <div className="relative bg-gray-100 w-full min-h-screen flex justify-center items-center">
      <div className='absolute top-10 left-3'>
        <BackButton/>
      </div>
      <div className="flex flex-col gap-5 sm:gap-15 bg-white m-3 p-2 ring-0 rounded-lg w-full max-w-[800px] mt-5">
        <div className="flex flex-col gap-2">
          <span className="text-[20px] sm:text-[24px] font-serif font-semibold">
            Add New Product
          </span>
          <span className="text-gray-600 text-sm sm:text-[16px] ">
            A form to add a new product to your inventory.
          </span>
        </div>

        <form action="" className="flex flex-col gap-5 sm:gap-10 ">
          <div className="flex flex-col gap-1 ">
            <span className="font-medium">Product Name</span>
            <div className="w-full ring-0 border rounded-sm border-gray-300 flex items-center gap-1 p-1 hover:shadow ">
              <input
                type="text"
                required
                className="outline-0"
                placeholder="Enter product name..."
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 ">
            <span className="font-medium">Price</span>
            <div className="w-full ring-0 border rounded-sm border-gray-300 flex items-center gap-1 p-1 hover:shadow ">
              <input
                type="number"
                required
                className="outline-0 w-full "
                placeholder="Enter product price..."
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 ">
            <span className="font-medium">Quantity</span>
            <div className="w-full ring-0 border rounded-sm border-gray-300 flex items-center gap-1 p-1 hover:shadow ">
              <input
                type="number"
                required
                className="outline-0 w-full"
                placeholder="Enter product quantity.."
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 ">
            <span className="font-medium">Category</span>
            <div className="w-full ring-0 border rounded-sm border-gray-300 flex items-center gap-1 p-1 hover:shadow ">
              <select type="text" required className="outline-0 w-full">
                <option value="">Select category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="grocery">Grocery</option>
                <option value="others">Others</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="ring-0 rounded-lg bg-red-600/85 hover:bg-red-600 flex items-center p-1 gap-1"
            >
              <Plus className="h-4 w-4 text-white" />
              <span className="text-white">Add Product</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
