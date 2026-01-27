import {
  BookmarkMinus,
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
import DeleteCustomerButton from '../customers/deleteCustomer';
import dayjs from '../../utils/days'

export default function Suppliers({
  id,
  name,
  gmail,
  address,
  image,
  phone,
  lastVisit,
  payable,
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
    <div className=" min-h-[185px]  ring-0 border border-red-500 p-3 rounded-xl  hover:shadow-lg space-y-2 gap-2 w-full">
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            title={name}
            className="text-lg font-bold mb-1 text-gray-700 truncate whitespace-nowrap "
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
              <button
                onClick={() => navigate(`/supplier/${id}/due`)}
                className=" flex  gap-2 items-center text-rose-500 border-gray-300 m-1 p-1 text-center cursor-pointer hover:bg-gray-50 hover:shadow mt-0"
              >
                <BookmarkMinus className="h-4 w-4 " />
                <span className="text-nowrap">Due History</span>
              </button>
              {/* <DeleteCustomerButton
                customerId={id}
                onDeleted={() => fetchCustomers(page, search)}
              /> */}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center w-full gap-5">
        {image ? (
          <img
            src={image}
            alt="customer profile picture"
            className="w-32 h-32 rounded-full"
            onClick={() => {
              if (id) navigate(`/supplier/${id}`);
              else alert('supplier id not found!');
            }}
          />
        ) : (
          <div
            onClick={() => {
              if (id) navigate(`/supplier/${id}`);
              else alert('supplier id not found!');
            }}
          >
            <UserRound className="w-32 h-32 text-gray-200 ring ring-gray-200 shadow rounded-full  " />
          </div>
        )}
        <div className="w-full h-full  flex flex-col gap-1">
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
        </div>
      </div>
      <div className="flex mt-auto text-[12px] justify-between ">
        <div title={lastVisit} className="border border-gray-200 rounded-md px-1.5 py-[1px] self-start font-semibold text-gray-500">
          Last Visit: {dayjs(lastVisit, 'DD-MM-YYYY hh:mm A').fromNow()}
        </div>
        <div className='font-semibold'>
          {payable > 0 ? (
            <div
              onClick={() => navigate(`/supplier/${id}/due`)}
              className="ring-0  rounded-lg  border shadow px-1.5 py-[1px] text-red-400 cursor-pointer w-fit"
            >
              <span>Payable:</span> <span>{payable}৳</span>
            </div>
          ) : (
            <div className="ring-0 rounded-lg  border shadow px-1.5 py-[1px] text-blue-400/70 cursor-not-allowed w-fit">
              No Payable
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
