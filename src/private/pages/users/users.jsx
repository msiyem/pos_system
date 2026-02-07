import { Plus, Search } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router';
import Pagination from '../../../ui/pagination';
import UserCard from './userCard';

export default function Customers() {
  const {
  users,
  user_page:page,
  user_total:total,
  user_limit:limit,
  user_search:search,
  role,
  setUserPage,
  setUserSearch,
}=useOutletContext();
  const navigate = useNavigate();
  const totalPages = Math.ceil(total / limit);

  const handleSearchChange = (e) => {
    setUserSearch(e.target.value);
    setUserPage(1);
  };

  return (
    <div className="@container m-4 flex flex-col gap-5">
      {/* Header  */}
      <div className="">
        <div className="flex justify-between">
          <span
            onClick={() => navigate(0)}
            className="text-[32px] font-semibold font-serif cursor-pointer"
          >
            Users
          </span>
          <div className="">
            <button
              onClick={() => navigate('/user/add')}
              className="flex items-center gap-1 ring-0 border rounded-lg bg-red-600/85 hover:bg-red-600 text-white p-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center self-start">
          <div className="ring-0 border rounded-lg border-gray-300 p-1 px-2 shadow w-[30ch] flex items-center gap-1">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Customers Search ..."
              className="outline-0 flex-1"
            />
          </div>
          <div className="border border-gray-300 px-2 rounded-lg shadow text-gray-700 text-[15px] font-mono py-1">
            Total Users:{' '}
            <span className="border px-1 border-gray-200/80 rounded-lg shadow">
              {total}
            </span>
          </div>
        </div>
      </div>
      

      {/* Customer List  */}
      <div className="grid grid-cols-1 @min-[740px]:grid-cols-2 @min-[1200px]:grid-cols-3  items-stretch gap-4">
        {users.map((user) => (
          <UserCard
            key={user.id}
            id={user.id}
            name={user.name}
            gmail={user.email}
            address={user.district}
            phone={user.phone}
            lastVisit={user.last_purchased}
            status={user.status}
            image={user.image_url}
            page={page}
            search={search}
            role = {role}

          />
        ))}
      </div>

      <div>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => {
            setUserPage(newPage);
          }}
        />
      </div>
    </div>
  );
}
