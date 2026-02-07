import { RefreshCw } from "lucide-react";

export default function Loading({size=48}) {
  return (
    <div className=" w-full h-dvh flex flex-col gap-1   ">
        <div className='flex flex-col gap-3 mt-[20vh] justify-center items-center'>
          <div className='flex justify-center items-center bg-blue-50 p-2 rounded-full'>
          <RefreshCw size={size} className="animate-spin text-blue-500" />
        </div>
        <h1 className='text-gray-800'>Loading...</h1>
        <p className='text-sm text-gray-600'>Please wait a moment . . .</p>
        </div>
      </div>
  );
}