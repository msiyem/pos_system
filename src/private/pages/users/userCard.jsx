import {
  BookmarkMinus,
  Circle,
  Delete,
  Ellipsis,
  History,
  Mail,
  MapPinHouse,
  MessageCircleMore,
  PhoneCall,
  ShieldEllipsis,
  SquareUser,
  Trash2,
  UserRound,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import useToast from '../../../toast/useToast';
import dayjs from '../../utils/days.js';

export default function UserCard({
  id,
  name,
  gmail,
  address,
  phone,
  status,
  image,
  lastVisit,
  role,
}) {
  const profileRef = useRef(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
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
    <div
      className={`min-h-[185px]  ring-0 border p-3 rounded-xl hover:shadow-lg space-y-2  gap-2 w-full overflow-hidden
    ${status === 'active' && 'border-green-300'}
    ${status === 'inactive' && 'border-purple-300'}
    ${status === 'banned' && 'border-red-300'}
    `}
    >
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            title={name}
            className="text-lg font-bold text-gray-700 mb-1 truncate  "
          >
            {name}
            {/* <Circle size={8} className={` border-0
                ${status === 'active'? 'text-green-300 fill-green-400':''}`}/> */}
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
                  if (id) navigate(`/user/${id}`);
                  else toast.error('user id not found!');
                }}
                className="border-b flex gap-2 items-center border-gray-300 m-1 p-1 text-center cursor-pointer hover:bg-gray-50 hover:shadow mt-0"
              >
                <UserRound className="h-4 w-4" />
                <span className="">Profile</span>
              </button>
              
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center w-full gap-5 ">
        {image ? (
          <img
            onClick={() => {
              if (id) navigate(`/user/${id}`);
              else toast.error('user id not found!');
            }}
            src={image}
            alt="customer profile picture"
            className="w-32 h-32 rounded-full cursor-pointer"
          />
        ) : (
          <div
            onClick={() => {
              if (id) navigate(`/user/${id}`);
              else toast.error('user id not found!');
            }}
            className="cursor-pointer"
          >
            <UserRound className="w-32 h-32 text-gray-200 ring ring-gray-200 shadow rounded-full  " />
          </div>
        )}
        <div className="w-full h-full  flex flex-col gap-1 ">
          <div className="text-gray-600 flex items-center min-w-0 w-full">
            <Mail className="h-3 w-3 mr-1 shrink-0" />
            <span title={gmail} className="truncate block">
              {gmail}
            </span>
          </div>
          <div className="flex items-center  min-w-0">
            <MapPinHouse className="h-4 w-4 mr-1 shrink-0 " />
            <span title={address} className="truncate block">
              {address}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600 text-[15px]">
            <PhoneCall className="h-3.5 w-3.5" />
            <span>{phone}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between px-2">
        <div
          title={lastVisit}
          className="flex items-center gap-1 rounded-md py-[1px] w-fit text-gray-500 mt-auto text-sm"
        >
          <History size={16} />
          Last visit: {dayjs(lastVisit, 'DD-MM-YYYY hh:mm A').fromNow()}
        </div>
        <div className='flex items-center gap-1 py-[1px] w-fit text-gray-500 mt-auto text-sm'>
          <ShieldEllipsis size={16} className='' />
          <div>Role: {role}</div>
        </div>
      </div>
    </div>
  );
}
