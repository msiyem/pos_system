import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import api from '../../api/api';
import useToast from '../../toast/useToast';


export default function AddBrand() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState({});
  const toast = useToast();

  const handleSubmit = async(e)=>{
    e.preventDefault();

    if(!name.trim()){
      setError({name: "Name is required & must be unique!"});
      return;
    }
    try {
      const res=await api.post('/brands',{
        name:name,
        description:description,
      });
      toast.success(res.data.message);
      setName('');
      setDescription('');
      setError({});
      
    } catch (err) {
      console.error(err.message);
      toast.error(err.message);
    }
  }
  return (
    <div className="min-h-svh w-full flex justify-center items-center
  bg-[radial-gradient(circle,rgba(255,0,0,0.5)_1.12px,transparent_1px)]
  [background-size:20px_20px] ">
      <form
        onSubmit={handleSubmit}
        className="w-[50%] max-w-[400px] min-w-[300px] border-2 backdrop:backdrop-blur-md border-gray-200 rounded-2xl shadow-lg  space-y-3 p-3 from-lime-50 to-cyan-100 bg-gradient-to-r"
      >
        <div className="font-semibold text-2xl font-serif text-center">
          Add Brand
        </div>
        <div className="">
          <label htmlFor="name" className="font-semibold">
            Brand Name
          </label>
          <span className="text-red-500 ">*</span>
          <input
            type="text"
            value={name}
            placeholder='Enter unique name . . .'
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="border px-2 border-gray-300 rounded-lg p-1 w-full mt-2 outline-0 hover:border-gray-500/85 focus:border-gray-500 bg-white"
          />
          {error?.name?<span className='text-red-500 text-xs'>{error.name}</span>:""}
        </div>
        <div className="">
          <label htmlFor="name" className="font-semibold">
            Description
          </label>
          {/* <span className="text-red-500 ">*</span> */}
          <textarea
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            
            className="border px-2 border-gray-300 rounded-lg p-1 w-full mt-2 outline-0 hover:border-gray-500 bg-white min-h-10 max-h-80 overflow-auto"
          />
        </div>

        <div className="w-full flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 w-fit p-0.5 border-gray-300 shadow text-white from-blue-600 to-sky-600 bg-gradient-to-r hover:bg-gradient-to-l px-2 border rounded-lg cursor-pointer active:scale-95 "
          >
            <PlusIcon size={16} />
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
