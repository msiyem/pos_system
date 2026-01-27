import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import useToast from '../../../toast/useToast';
import api from '../../../api/api';

export default function Customers() {
  const toast = useToast();
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(9);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers', {
        params: {
          page: page,
          limit: limit,
          search: search,
        },
      });
      setCustomers(res.data.data);
      setPage(res.data.page);
      setTotal(res.data.total);
    } catch (err) {
      console.log(err);
      toast.error('Error fetching customers data!');
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCustomers();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [page, search]);

  return (
    <div>
      <Outlet
        context={{
          customers,
          page,
          limit,
          total,
          search,
          selectedCustomer,
          setSelectedCustomer,
          setSearch,
          setPage,
          fetchCustomers,
        }}
      />
    </div>
  );
}