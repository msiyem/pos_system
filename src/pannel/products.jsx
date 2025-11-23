import Product from '../ui/productCard';
import Pagination from '../ui/pagination';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Check } from 'lucide-react';
import ShoppingCard from '../component/shoppingCard';
import API from '../api/api';

export default function Products({
  products,
  page,
  total,
  limit,
  search,
  setPage,
  setsearch,
  fetchProducts,
  customers,
  cus_limit,
  cus_search,
  fetchCustomers,
  setCusSearch,
  cus_total
}) {
  const navigate = useNavigate();
  const totalPages = Math.ceil(total / limit);

  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [openCategory, setOpenCategory] = useState(false);
  const [openStock, setOpenStock] = useState(false);
  const [stockfilter, setStockfilter] = useState('all');
  const [checkCategory, setCheckCategory] = useState('all');

  const categoryRef = useRef(null);
  const stockRef = useRef(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await API.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
    fetchCategories();
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setsearch(val);
    setPage(1);
    fetchProducts(1, val);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target))
        setOpenCategory(false);
      if (stockRef.current && !stockRef.current.contains(e.target))
        setOpenStock(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let query = '';
    if (stockfilter === 'in') query = 'in stock';
    else if (stockfilter === 'out') query = 'out of stock';
    else if (checkCategory !== 'all')
      query = categories[checkCategory]?.name?.toLowerCase();
    else query = search;

    fetchProducts(1, query);
  }, [stockfilter, checkCategory]);

  const handleAddToCard = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((p) => p.id === item.id);
      if (existing) {
        return prevCart.map((p) =>
          p.id === item.id ? { ...p, count: p.count + 1 } : p
        );
      } else {
        return [...prevCart, { ...item, count: 1 }];
      }
    });
  };

  return (
    <div className="bg-gray-50/50 flex flex-col min-h-dvh no-scrollbar overflow-y-auto">
      <ShoppingCard
        customers={customers}
        cus_limit={cus_limit}
        cus_search={cus_search}
        fetchCustomers={fetchCustomers}
        card={cart}
        setCard={setCart}
        setSearch={setCusSearch}
        cus_total={cus_total}
      />

      <div className="flex items-center justify-between my-5 mx-3">
        <div className="flex flex-col">
          <span
            onClick={() => {
              setsearch('');
              setCheckCategory('all');
              setStockfilter('all');
              fetchProducts(1, '');
            }}
            className="text-[32px] font-serif font-semibold cursor-pointer"
          >
            Products
          </span>
          <span className="text-sm text-gray-600">
            Manage your products and inventory
          </span>
        </div>

        <button
          onClick={() => navigate('/product/add')}
          className="mr-8 bg-red-500/90 hover:bg-red-500 rounded-lg flex justify-center items-center text-white p-1 px-2.5"
        >
          + Add Product
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex justify-between items-center m-3 my-5">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={handleSearchChange}
          className="w-[18ch] p-1 px-2 ring-1 ring-gray-300 rounded-lg shadow outline-0 focus:ring-gray-400 cursor-text hover:bg-white"
        />

        <div className="flex gap-5">
          {/* Stock Filter */}
          <div ref={stockRef} className="relative">
            <button
              onClick={() => setOpenStock(!openStock)}
              className="ring-1 ring-gray-300 p-1 px-2 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              Stock Filter
            </button>
            {openStock && (
              <div className="absolute mt-2 right-0 z-50 shadow-2xl bg-white flex flex-col gap-0 rounded-xl border border-gray-300 text-sm p-1 text-nowrap">
                {['in', 'out', 'all'].map((type) => (
                  <div
                    key={type}
                    onClick={() => {
                      setStockfilter(type);
                      setOpenStock(false);
                    }}
                    className="flex items-center gap-2 cursor-pointer border-b border-gray-200 pb-1 m-1 px-1 hover:bg-gray-50"
                  >
                    <Check
                      className={`w-4 h-4 ${
                        stockfilter === type ? 'text-red-500/90' : 'text-white'
                      }`}
                    />
                    {type === 'in'
                      ? 'In Stock'
                      : type === 'out'
                        ? 'Out of Stock'
                        : 'All'}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Filter */}
          <div ref={categoryRef} className="relative">
            <button
              onClick={() => setOpenCategory(!openCategory)}
              className="ring-1 ring-gray-300 p-1 px-2 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              Category
            </button>
            {openCategory && (
              <div className="absolute mt-2 right-0 z-50 shadow-2xl bg-white flex flex-col gap-0 rounded-xl border border-gray-300 text-sm text-nowrap">
                {categories.map((c, idx) => (
                  <span
                    key={c.id}
                    className="flex items-center gap-2 cursor-pointer border-b border-gray-200 pb-1 m-1 px-1 hover:bg-gray-50"
                    onClick={() => {
                      setCheckCategory(idx);
                      setOpenCategory(false);
                    }}
                  >
                    <Check
                      className={`w-4 h-4 ${
                        checkCategory === idx ? 'text-red-500/90' : 'text-white'
                      }`}
                    />
                    {c.name}
                  </span>
                ))}
                <span
                  className="flex items-center gap-2 cursor-pointer pb-1 m-1 px-1 hover:bg-gray-50"
                  onClick={() => {
                    setCheckCategory('all');
                    setOpenCategory(false);
                  }}
                >
                  <Check
                    className={`w-4 h-4 ${
                      checkCategory === 'all' ? 'text-red-500/90' : 'text-white'
                    }`}
                  />
                  All
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="mx-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <Product
            key={product.id}
            id={product.id}
            image={product.image_url}
            title={product.name}
            price={product.price}
            type={product.category_name}
            quantity={product.stock}
            onAddToCard={() => handleAddToCard(product)}
          />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          setPage(newPage);
          fetchProducts(newPage, search);
        }}
      />
    </div>
  );
}
