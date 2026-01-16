import useToast from "../../../toast/useToast";

export default function Reports() {
  const toast = useToast();
  return (
    <div className='w-full h-svh flex justify-center items-center gap-5'>
      <button 
      onClick={()=>{toast.success('Operation successfull !',10000)}}
      className="border p-2 border-gray-300 rounded-2xl bg-green-600 cursor-pointer text-white">
        success
      </button>
      <button 
      onClick={()=>{toast.error("Something went wrong !",6000)}}
      className="border p-2 border-gray-300 rounded-2xl bg-red-600 cursor-pointer text-white">
        error
      </button>
      <button 
      onClick={()=>{toast.info("Some info for you !",10000)}}
      className="border p-2 border-gray-300 rounded-2xl bg-blue-600 cursor-pointer text-white">
        info
      </button>
    </div>
  );
}
