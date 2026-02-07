import { LogOutIcon, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import api from '../../../api/api';
import { useAuth } from '../../../context/useAuth';
import { useNavigate } from 'react-router';

export default function MiniProfile() {
  const [openProfile, setOpenProfile] = useState(false);
  const miniprofileRef = useRef(null);
  const [user,setUser] =useState(null);
  const { userId, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
  if (!userId) return;

  async function fetchUser() {
    try {
      const res = await api.get('/users/me');
      setUser(res.data.data);
    } catch (err) {
      console.error(err);
      // logout(); // optional
    }
  }

  fetchUser();
}, [userId, logout]);

  const initials = user
  ? user.name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0].toUpperCase())
      .join('')
  : 'U';


  useEffect(() => {
    function handleClickOutSide(event) {
      if (
        miniprofileRef.current &&
        !miniprofileRef.current.contains(event.target)
      ) {
        setOpenProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutSide);
    return () => {
      document.removeEventListener('mousedown', handleClickOutSide);
    };
  }, [openProfile]);

  return (
    <div ref={miniprofileRef} className="relative">
      <button
        onClick={() => setOpenProfile(!openProfile)}
        className="cursor-pointer relative"
      >
        <p className="flex ring-0 rounded-full bg-[rgb(88,50,138)] h-10 w-10 text-center items-center justify-center font-semibold text-blue-200">
          {user?.image_url ? (<img src={user.image_url} alt="User Avatar" className="h-10 w-10 rounded-full" />) : initials}
        </p>
      </button>

      {/* Dropdown with Tailwind animation */}
      <div
        className={`
          absolute right-10 mt-2 w-[200px] bg-white flex flex-col p-1 
          border border-gray-200 rounded-lg shadow z-50 transform origin-top-right transition-all duration-250 ease-out
          ${openProfile ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}
        `}
      >
        <div className="flex flex-col p-2 border-b">
          <p>{user?.name}</p>
          <p className="text-[12px] text-gray-600">{user?.email}</p>
        </div>
        <div className="m-2 flex flex-col space-y-1">
          <div 
          onClick={()=>{
            setOpenProfile(false);
            navigate("/user/me");
          }}
          className="flex items-center cursor-pointer hover:bg-gray-100 p-1 rounded">
            <User className="h-4 w-4" />
            <p className="mx-2">Profile</p>
          </div>
          <div
            onClick={() => logout()}
            className="flex items-center cursor-pointer hover:bg-gray-100 p-1 rounded"
          >
            <LogOutIcon className="h-4 w-4" />
            <p className="mx-2">Logout</p>
          </div>
        </div>
      </div>
    </div>
  );
}
