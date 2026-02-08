import { Plus, Search } from 'lucide-react';
import Supplier from './supplierCard';
import { useNavigate } from 'react-router';
import Pagination from '../../../ui/pagination';
import API from '../../../api/api';
import { useCallback, useEffect, useState } from 'react';
import useToast from '../../../toast/useToast';
import PageLoader from '../../../ui/PageLoader';

export default function Suppliers() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [page, setPage] = useState(1);
  // const [limit,setLimit]=useState(9);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const toast = useToast();
  const [loading, setLoading] = useState(true);  


  const totalPages = Math.ceil(total / 9);

  const fetchSuppliersData = useCallback(async () => {
    try {
      const res = await API.get('suppliers', {
        params: {
          page,
          limit: 9,
          search,
        },
      });

      setSuppliers(res.data.data);
      setPage(res.data.page);
      setTotal(res.data.total);
    } catch (err) {
      console.log(err);
      toast.error('Error fetching suppliers data!', 3500);
    } finally {
      setLoading(false);
    }
  }, [page, search, toast]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSuppliersData();
    }, 350);

    return () => clearTimeout(delayDebounce);
  }, [fetchSuppliersData]);


  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };
if (loading) return <PageLoader/>;
  return (
    <div className="@container m-4 flex flex-col gap-5">
      {/* Header  */}
      <div className="">
        <div className="flex justify-between">
          <span
            onClick={() => navigate(0)}
            className="text-[32px] font-semibold font-serif cursor-pointer"
          >
            Supplier
          </span>
          <div className="">
            <button
              onClick={() => navigate('/supplier/add')}
              className="flex items-center gap-1 ring-0 border rounded-lg bg-red-600/85 hover:bg-red-600 text-white p-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Supplier</span>
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
              placeholder="Supplier Search ..."
              className="outline-0 flex-1"
            />
          </div>
          <div className="border border-gray-300 px-2 rounded-lg shadow text-gray-700 text-[15px] font-mono py-1">
            Total Supplier:{' '}
            <span className="border px-1 border-gray-200/80  rounded-lg shadow">
              {total}
            </span>
          </div>
        </div>
      </div>

      {/* Customer List  */}
      <div className="grid grid-cols-1 @min-[740px]:grid-cols-2 @min-[1200px]:grid-cols-3  items-stretch gap-4">
        {suppliers.map((user) => (
          <Supplier
            key={user.id}
            id={user.id}
            name={user.name}
            gmail={user.email}
            address={user.district}
            image={user.image_url}
            phone={user.phone}
            lastVisit={user.last_transition}
            fetchCustomers={fetchSuppliersData}
            page={page}
            search={search}
            payable={user.payable}
          />
        ))}
      </div>

      <div>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => {
            setPage(newPage);
          }}
        />
      </div>
    </div>
  );
}
