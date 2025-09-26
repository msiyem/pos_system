import { Plus, Search } from 'lucide-react';
import Customer from '../ui/customerCard';
import { useState } from 'react';

export default function Customers({ users }) {
  const [search, setSearch] = useState('');
  const filterCustomer = users.filter((c) => {
    return c.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="m-4 flex flex-col gap-5">
      <div className="">
        <div className="flex justify-between">
          <span className="text-[32px] font-semibold font-serif">
            Customers
          </span>
          <div className="">
            <button className="flex items-center gap-1 ring-0 border rounded-lg bg-red-600/85 hover:bg-red-600 text-white p-1">
              <Plus className="h-4 w-4" />
              <span>Add Customer</span>
            </button>
          </div>
        </div>
        <div className="ring-0 border rounded-lg border-gray-300 p-1 px-2 shadow w-[30ch] flex items-center gap-1">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Customers Search ..."
            className="outline-0"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch gap-4">
        {filterCustomer.map((user) => (
          <Customer
            key={user.id}
            id={user.id}
            name={user.name}
            gmail={user.gmail}
            address={user.address}
            lastVisit={user.lastVisit}
            dues={user.dues}
          />
        ))}
      </div>
      <div></div>
    </div>
  );
}
