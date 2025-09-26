import {
  Delete,
  Ellipsis,
  Mail,
  MapPinHouse,
  MessageCircleMore,
  Trash2,
  UserRound,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';

export default function Customer({ id , name, gmail, address, lastVisit, dues }) {
  const profileRef = useRef(null);
  const [open, setOpen] = useState(false);
  const navigate=useNavigate();
  useEffect(() => {
    function handleProfileRef(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleProfileRef);
    return () => {
      document.removeEventListener('mousedown', handleProfileRef);
    };
  });
  return (
    <div className=" h-[180px] ring-0 border border-red-500 flex flex-[1_1_300px] rounded-xl p-5 hover:shadow-lg">
      <div className="w-full h-full  flex flex-col gap-1">
        <div className="flex justify-between">
          <div className="text-lg font-semibold mb-1">{name}</div>
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setOpen(!open)}
              className=" hover:shadow shadow-amber-500/40 p-0.5 cursor-pointer ring-0 rounded-md "
            >
              <Ellipsis className="" />
            </button>
            {/* Dropdown */}
            <div
              className={` absolute right-2
            transform origin-top-right transition-all duration-300 ease-out ${
              open ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            }`}
            >
              <div className="border border-gray-300 rounded-lg flex flex-col space-y-1 z-50 bg-white">
                <button 
                onClick={()=>navigate(`/customer/${id}`)}
                className="border-b flex gap-2 items-center border-gray-300 m-1 p-1 text-center cursor-pointer hover:bg-gray-50 hover:shadow mt-0">
                  <UserRound className="h-4 w-4" />
                  <span className="">Profile</span>
                </button>
                <button className="border-b flex gap-2 items-center border-gray-300 m-1 p-1 text-center cursor-pointerhover:bg-gray-50 hover:shadow mt-0">
                  <MessageCircleMore className="h-4 w-4" />
                  <span>Message</span>
                </button>
                <button className="flex gap-2 items-center border-gray-300 m-1 p-1 text-center cursor-pointer hover:bg-gray-50 hover:shadow mb-0 mt-0">
                  <Trash2 className='h-4 w-4'/>
                  <span>Delete</span>

                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="text-gray-600 flex items-center">
          <Mail className="h-3 w-3 mr-1" />
          <span>{gmail}</span>
        </div>
        <div className="flex items-center  ">
          <MapPinHouse className="h-4 w-4 mr-1 shrink-0 " />
          <span title={address} className="truncate w-[25ch]">
            {address}
          </span>
        </div>
        <div className="flex justify-between mt-auto text-[12px]">
          <div className="border border-gray-300 rounded-md px-2">
            Last Visit: {lastVisit}
          </div>
          {dues > 0 ? (
            <div className="ring-0 rounded-lg  border shadow px-1 text-red-500 cursor-pointer">
              Dues {dues}৳
            </div>
          ) : (
            <div className="ring-0 rounded-lg  border shadow px-1 text-blue-600 cursor-pointer">
              No Dues
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
