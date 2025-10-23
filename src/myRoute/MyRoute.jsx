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
  const [cus_page, setPage] = useState(1);
  const [cus_total, setTotal] = useState(0);
  const [cus_limit] = useState(9);
  const [cus_search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [p_page, setP_page] = useState(1);
  const [p_total, setP_total] = useState(0);
  const [p_limit] = useState(8);
  const [p_search, setP_search] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchCustomers = (pageNumber = 1, searchTerm = '') => {
    fetch(
      `http://localhost:3000/customers?page=${pageNumber}&limit=${cus_limit}&search=${searchTerm}`
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
      fetchCustomers(cus_page, cus_search);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [cus_page, cus_search]);

  const fetchProducts = (pageNumber = 1, searchTerm = '') => {
    fetch(
      `http://localhost:3000/products?page=${pageNumber || 1}&limit=${p_limit}&search=${searchTerm}`
    )
      .then((res) => res.json())
      .then((res) => {
        setProducts(res.data);
        setP_total(res.total);
        setP_page(res.page);
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to load product. please try again later.');
      });
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts(p_page, p_search);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [p_page, p_search]);

  return (
    <Routes>
      <Route path="" element={<Deshboard />} />
      <Route path="/deshboard" element={<Deshboard />} />
      <Route path="/pos" element={<Pos />} />
      <Route
        path="/product"
        element={
          <Product
            products={products}
            page={p_page}
            total={p_total}
            limit={p_limit}
            search={p_search}
            selectedProduct={selectedProduct}
            setPage={setP_page}
            setsearch={setP_search}
            setSelectedProduct={setSelectedProduct}
            fetchProducts={fetchProducts}
          />
        }
      />
      <Route path="/product/add" element={<AddProduct />} />
      <Route
        path="/customers"
        element={
          <Customers
            users={customers}
            page={cus_page}
            total={cus_total}
            limit={cus_limit}
            search={cus_search}
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
            page={cus_page}
            search={cus_search}
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
