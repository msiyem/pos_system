import { Route, Routes, Link } from 'react-router-dom';
import Deshboard from '../pannel/deshboard';
import Pos from '../pannel/pos';
import Product from '../pannel/products';
import Customers from '../pannel/customers';
import Supplier from '../pannel/sellingHestory';
import Reports from '../pannel/reports';
import Selling from '../pannel/selling';
import Shopkeeper from '../pannel/supplier';
import Error from '../error';
import AddProduct from '../pannel/addProduct';
import CustomerHistory from '../component/customerProfile';
import { useEffect, useState } from 'react';
import AddCustomer from '../component/addCustomer';
import EditCustomer from '../component/editCustomer';

export default function MyRoute() {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(9);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = (pageNumber = 1, searchTerm = '') => {
    fetch(
      `http://localhost:3000/customers?page=${pageNumber}&limit=${limit}&search=${searchTerm}`
    )
      .then((res) => res.json())
      .then((res) => {
        setCustomers(res.data);
        setTotal(res.total);
        setPage(res.page);
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to load customers.Please try again later.');
      });
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCustomers(page, search);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [page, search]);

  return (
    <Routes>
      <Route path="" element={<Deshboard />} />
      <Route path="/deshboard" element={<Deshboard />} />
      <Route path="/pos" element={<Pos />} />
      <Route path="/product" element={<Product />} />
      <Route path="/product/add" element={<AddProduct />} />
      <Route
        path="/customers"
        element={
          <Customers
            users={customers}
            page={page}
            total={total}
            limit={limit}
            search={search}
            selectedCustomer={selectedCustomer}
            setPage={setPage}
            setSearch={setSearch}
            setSelectedCustomer={setSelectedCustomer}
            fetchCustomers={fetchCustomers}
          />
        }
      />
      <Route
        path="/customer/:id"
        element={
          <CustomerHistory
            users={customers}
            fetchCustomers={fetchCustomers}
            page={page}
            search={search}
          />
        }
      />
      <Route path="/customers/add" element={<AddCustomer />} />
      <Route path="/customer/:id/edit" element={<EditCustomer />} />

      <Route path="/supplier" element={<Supplier />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/selling" element={<Selling />} />
      <Route path="/shopkeeper" element={<Shopkeeper />} />
      <Route path="/*" element={<Error />} />
    </Routes>
  );
}
