import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import api from '../../api/api';
import useToast from '../../toast/useToast';

export default function AddCategory() {
  const [name, setName] = useState('');
  const [is_active, setIsActive] = useState(true);
  const [error, setError] = useState({});
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError({ name: 'Name is required & must be unique!' });
      return;
    }
    try {
      const res = await api.post('/categories', {
        name: name,
        is_active: is_active,
      });
      toast.success(res.data.message);
      setName('');
      setIsActive(true);
      setError({});
    } catch (err) {
      console.error(err.message);
      toast.error(err.message);
    }
  };
  return (
    <div
      className="min-h-svh w-full flex justify-center items-center
  bg-[radial-gradient(circle,rgba(0,0,255,0.5)_1.125px,transparent_1.05px)]
  [background-size:20px_20px] "
    >
      <form
        onSubmit={handleSubmit}
        className="w-[50%] max-w-[400px] min-w-[300px] border-2 backdrop:backdrop-blur-md border-gray-200 rounded-2xl shadow-lg  space-y-3 p-3 from-blue-50 to-cyan-200/70 bg-gradient-to-r"
      >
        <div className="font-semibold text-2xl font-serif text-center">
          Add Category
        </div>
        <div className="">
          <label htmlFor="name" className="font-semibold">
            Category Name
          </label>
          <span className="text-red-500 ">*</span>
          <input
            type="text"
            value={name}
            placeholder="Enter unique name . . ."
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="border-2 px-2 border-gray-300 rounded-lg p-1 w-full mt-2 outline-0 hover:border-gray-500/85 focus:border-gray-500 bg-white"
          />
          {error?.name ? (
            <span className="text-red-500 text-sm">{error.name}</span>
          ) : (
            ''
          )}
        </div>

        <div className="w-full flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1 w-fit p-0.5 border-gray-300 shadow text-white from-blue-600 to-sky-600 bg-gradient-to-r hover:bg-gradient-to-l px-2 border rounded-lg cursor-pointer active:scale-95 "
          >
            <PlusIcon size={16} />
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
