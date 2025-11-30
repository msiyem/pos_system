import {
  Delete,
  Ellipsis,
  Mail,
  MapPinHouse,
  MessageCircleMore,
  PhoneCall,
  Trash2,
  UserRound,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import DeleteCustomerButton from './deleteCustomer';

export default function Suppliers({
  id,
  name,
  gmail,
  address,
  phone,
  lastVisit,
  fetchCustomers,
  page,
  search,
}) {
  const profileRef = useRef(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
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
  }, [open]);
  return (
    <div className=" h-[185px]  ring-0 border border-red-500 flex flex-[1_1_300px] rounded-xl p-5 hover:shadow-lg">
      <div className="w-full h-full  flex flex-col gap-1">
        <div className="flex justify-between w-full">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="text-[13px] border mt-[2px] px-1 self-start whitespace-nowrap border-gray-300 rounded-lg shadow">
              ID : {id}
            </div>

            <div
              title={name}
              className="text-lg font-semibold mb-1 font-mono truncate whitespace-nowrap "
            >
              {name}
            </div>
          </div>

          <div ref={profileRef} className="relative">
            <button
              onClick={() => setOpen(!open)}
              className=" hover:shadow shadow-amber-500/40  cursor-pointer ring-0 rounded-md "
            >
              <Ellipsis className="p-0.5" />
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
                  onClick={() => {
                    if (id) navigate(`/supplier/${id}`);
                    else alert('supplier id not found!');
                  }}
                  className="border-b flex gap-2 items-center border-gray-300 m-1 p-1 text-center cursor-pointer hover:bg-gray-50 hover:shadow mt-0"
                >
                  <UserRound className="h-4 w-4" />
                  <span className="">Profile</span>
                </button>
                <button className="border-b flex gap-2 items-center border-gray-300 m-1 p-1 text-center cursor-pointer hover:bg-gray-50 hover:shadow mt-0">
                  <MessageCircleMore className="h-4 w-4" />
                  <span>Message</span>
                </button>
                <DeleteCustomerButton
                  customerId={id}
                  onDeleted={() => fetchCustomers(page, search)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="text-gray-600 flex items-center">
          <Mail className="h-3 w-3 mr-1" />
          <span title={gmail} className="truncate w-[25ch]">
            {gmail}
          </span>
        </div>
        <div className="flex items-center  ">
          <MapPinHouse className="h-4 w-4 mr-1 shrink-0 " />
          <span title={address} className="truncate w-[25ch]">
            {address}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-600 text-[15px]">
          <PhoneCall className="h-3.5 w-3.5" />
          <span>{phone}</span>
        </div>

        <div className="flex mt-auto text-[12px]">
          <div className="border border-gray-300 rounded-md px-1 self-start">
            Last Visit: {lastVisit || null}
          </div>
        </div>
      </div>
    </div>
  );
}
