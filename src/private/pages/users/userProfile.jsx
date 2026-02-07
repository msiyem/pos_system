import { useEffect, useState } from 'react';
import api from '../../../api/api';
import useToast from '../../../toast/useToast';
import { Mail, Phone, User, Shield } from 'lucide-react';
import PageLoader from '../../../ui/PageLoader.jsx';
import BackButton from '../../../ui/backButton.jsx';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    async function fetchProfileDetails() {
      try {
        const res = await api.get('/users/me');
        setUser(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
      } finally {
        setLoading(false);
      }
    }
    fetchProfileDetails();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto my-10 px-4">
      <div className="bg-white rounded-2xl shadow-md border border-gray-300 p-6 ">
        {/* Header */}
        <div className="flex flex-col items-center gap-6 border-b pb-8">
          <img
            src={user.image_url || '/default-avatar.png'}
            alt="User Avatar"
            className="w-24 h-24 sm:w-28 sm:h-28 md:32 md:32 rounded-full object-cover border border-gray-200"
          />
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              {user.name}
            </h2>
            {user.username && (<p className="text-gray-500">@{user.username}</p>)}
            
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mt-10 text-gray-700">
          <div>
            <p className="text-sm text-gray-500 flex gap-1 items-center">
              <Mail size={15}/>
              Email</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 flex gap-1 items-center">
              <Phone size={15}/>
              Phone</p>
            <p className="font-medium">{user.phone || 'N/A'}</p>
          </div>

          <div className=''>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <User size={15}/>
              Username</p>
            {user.username ? (<p className="font-medium">{user.username}</p>) : (<p className="font-medium">N/A</p>)}
          </div>

          <div>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Shield size={15}/>
              Role</p>
            <p className="font-medium capitalize">{user.role}</p>
          </div>
        </div>
      </div>
      <div className='mt-10'>
        <BackButton/>
      </div>
    </div>
  );
}
