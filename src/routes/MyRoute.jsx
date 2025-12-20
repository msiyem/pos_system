import { useEffect, useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';

import HomePage from '../private/pages/home/homePage.jsx';
import Deshboard from '../private/pages/deshboard/deshboard.jsx';
import Pos from '../private/pages/pos/pos.jsx';
import Product from '../private/pages/products/products.jsx';
import Customers from '../private/pages/customers/customers.jsx';
// import Supplier from '../pannel/sellingHestory';
import Reports from '../private/pages/reports/reports.jsx';
import Selling from '../private/pages/sellings/selling.jsx';
import Shopkeeper from '../private/pages/users/shopkeepers.jsx';
import Error from '../error';
import AddProduct from '../private/pages/products/addProduct';
import CustomerHistory from '../private/pages/customers/customerProfile';
import AddCustomer from '../private/pages/customers/addCustomer';
import EditCustomer from '../private/pages/customers/editCustomer';
import EditProduct from '../private/pages/products/editProduct';
import Purchase from '../private/pages/purchases/purchase';
import AddSupplier from '../private/pages/suppliers/addSupplier';
import Suppliers from '../private/pages/suppliers/suppliers';
import SupplierHistory from '../private/pages/suppliers/supplierProfile';
import api from '../api/api.js';
import Login from '../public/login.jsx';

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
  const [Pstock, setPstock] = useState('all');
  const [Pcategory, setPcategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers', {
        params: {
          page: cus_page,
          limit: cus_limit,
          search: cus_search,
        },
      });
      setCustomers(res.data.data);
      setPage(res.data.page);
      setTotal(res.data.total);
    } catch (err) {
      console.log(err);
      alert('Error fetching customers data.');
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCustomers(cus_page, cus_search);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [cus_page, cus_search]);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products', {
        params: {
          page: p_page,
          limit: p_limit,
          search: p_search,
          stock: Pstock,
          category: Pcategory,
        },
      });

      setProducts(res.data.data);
      setP_page(res.data.page);
      setP_total(res.data.total);
    } catch (err) {
      console.log(err);
      alert('Error fetching products data.');
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts(p_page, p_search, Pstock, Pcategory);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [p_page, p_search, Pstock, Pcategory]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />}>
        <Route path="/" element={<Deshboard />} />
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
              stock={Pstock}
              category={Pcategory}
              setcategory={setPcategory}
              setstock={setPstock}
              setSelectedProduct={setSelectedProduct}
              fetchProducts={fetchProducts}
              customers={customers}
              cus_limit={cus_limit}
              cus_search={cus_search}
              cus_total={cus_total}
              fetchCustomers={fetchCustomers}
              setCusSearch={setSearch}
            />
          }
        />
        <Route path="/products/:id/edit" element={<EditProduct />} />
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

        <Route
          path="/supplier"
          element={
            <Suppliers
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
        <Route path="/supplier/:id" element={<SupplierHistory />} />
        <Route path="/supplier/add" element={<AddSupplier />} />
        <Route path="/reports" element={<Reports />} />
        <Route
          path="/selling"
          element={
            <Selling
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
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/shopkeeper" element={<Shopkeeper />} />
        <Route path="/*" element={<Error />} />
      </Route>
    </Routes>
  );
}
