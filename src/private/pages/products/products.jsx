import Product from './productCard';
import Pagination from '../../../ui/pagination';
import { useEffect, useRef, useState } from 'react';
import {  useNavigate, useOutletContext } from 'react-router';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import API from '../../../api/api';
import {useCart} from '../../cart/useCart.jsx';
import { useAuth } from '../../../context/useAuth.jsx';
import PageLoader from '../../../ui/PageLoader.jsx';

export default function Products() {
  const {
  products,
  P_page:page,
  p_total:total,
  p_limit:limit,
  p_search:search,
  setP_page:setPage,
  setP_search:setsearch,
  fetchProducts,
  Pstock:stock,
  Pcategory:category,
  Pbrand:brand,
  setPcategory:setcategory,
  setPstock:setstock,
  setPbrand:setbrand,
}=useOutletContext();
  const {role} = useAuth();
  const navigate = useNavigate();
  const totalPages = Math.ceil(total / limit);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const { addToCart } = useCart();
  const [openCategory, setOpenCategory] = useState(false);
  const [openStock, setOpenStock] = useState(false);
  const [openBrands, setOpenBrands] = useState(false);

  const categoryRef = useRef(null);
  const stockRef = useRef(null);
  const brandsRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const res = await API.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);
  useEffect(() => {
    async function fetchBrands() {
      try {
        setLoading(true);
        const res = await API.get('/brands');
        setBrands(res.data);
      } catch (err) {
        console.error('Error fetching brands', err);
      }finally{
        setLoading(false);
      }
    }
    fetchBrands();
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setsearch(val);
    setPage(1);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target))
        setOpenCategory(false);
      if (stockRef.current && !stockRef.current.contains(e.target))
        setOpenStock(false);
      if (brandsRef.current && !brandsRef.current.contains(e.target))
        setOpenBrands(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if(loading) return <PageLoader/>;

  return (
    <div className="@container bg-gray-50/50 flex flex-col min-h-dvh w-full">
      <div className="flex items-center justify-between w-full my-5 mx-3">
        <div className="flex flex-col ">
          <span
            onClick={() => {
              setsearch('');
              setcategory('all');
              setstock('all');
              setbrand('all');
            }}
            className="text-[32px] font-serif font-semibold cursor-pointer"
          >
            Products
          </span>
          <span className="text-sm text-gray-600">
            Manage your products and inventory
          </span>
        </div>

        {role === 'admin' && (
          <button
          onClick={() => navigate('/product/add')}
          className="mr-8 bg-red-500/90 hover:bg-red-500 rounded-lg flex justify-center items-center text-white p-1 px-2.5 cursor-pointer"
        >
          + Add Product
        </button>
        )}
      </div>

      {/* Search + Filters */}
      <div className="flex gap-[2%] justify-between items-center m-3 my-5 px-2 ">
        <input
          type="text"
          placeholder="Search Products....."
          value={search}
          onChange={handleSearchChange}
          className="w-[30vw]  p-1 px-2 ring-1 ring-gray-300 rounded-lg shadow outline-0 focus:ring-gray-400 cursor-text hover:bg-white"
        />

        <div className="flex gap-[2%]">
          {/* Stock Filter */}
          <div ref={stockRef} className="relative sm:w-[15vw]">
            <button
              onClick={() => setOpenStock(!openStock)}
              className="ring-1 flex items-center justify-between w-full ring-gray-300 p-1 px-2 cursor-pointer rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              <span>Stock</span>
              {openStock ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            {openStock && (
              <div className="absolute w-full mt-2 right-0 z-50  shadow-2xl bg-white flex flex-col gap-0 rounded-xl border border-gray-300 text-sm p-1 text-nowrap">
                {['in', 'out', 'all'].map((type) => (
                  <div
                    key={type}
                    onClick={() => {
                      setstock(type);
                      setOpenStock(false);
                    }}
                    className="flex items-center gap-2 cursor-pointer border-b border-gray-200 pb-1 m-1 px-1 hover:bg-gray-50"
                  >
                    <Check
                      className={`w-4 h-4 ${
                        stock === type ? 'text-red-500/90' : 'text-white'
                      }`}
                    />
                    {type === 'in'
                      ? 'In Stock'
                      : type === 'out'
                        ? 'Out Stock'
                        : 'All'}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Filter */}
          <div ref={categoryRef} className="relative sm:w-[15vw]">
            <button
              onClick={() => setOpenCategory(!openCategory)}
              className="ring-1 flex items-center justify-between w-full ring-gray-300 p-1 px-2 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              <span>Category</span>
              {openCategory ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            {openCategory && (
              <div className="absolute w-full mt-2 right-0 z-50 shadow-2xl bg-white flex flex-col gap-0 rounded-xl border border-gray-300 text-sm text-nowrap">
                {categories.map((c) => (
                  <span
                    key={c.id}
                    className="flex items-center gap-2 cursor-pointer border-b border-gray-200 pb-1 m-1 px-1 hover:bg-blue-50"
                    onClick={() => {
                      setcategory(c.id);
                      setOpenCategory(false);
                    }}
                  >
                    <Check
                      className={`w-3.5 h-3.5 ${
                        category === c.id ? 'text-red-500/90 ' : 'text-white'
                      }`}
                    />
                    {c.name}
                  </span>
                ))}
                <span
                  className="flex items-center gap-2 cursor-pointer pb-1 m-1 px-1 hover:bg-blue-50"
                  onClick={() => {
                    setcategory('all');
                    setOpenCategory(false);
                  }}
                >
                  <Check
                    className={`w-3.5 h-3.5 ${
                      category === 'all' ? 'text-red-500/90' : 'text-white'
                    }`}
                  />
                  All
                </span>
              </div>
            )}
          </div>

          {/* Brands Filter */}
          <div ref={brandsRef} className="relative sm:w-[15vw]">
            <button
              onClick={() => setOpenBrands(!openBrands)}
              className="ring-1 flex items-center justify-between w-full ring-gray-300 p-1 px-2 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              <span>Brand</span>
              {openBrands ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            {openBrands && (
              <div className="absolute w-full mt-2 right-0 z-50 shadow-2xl bg-white flex flex-col gap-0 rounded-xl border border-gray-300 text-sm text-nowrap">
                {brands.map((b) => (
                  <span
                    key={b.id}
                    className="flex items-center gap-2 cursor-pointer border-b border-gray-200 pb-1 m-1 px-1 hover:bg-blue-50"
                    onClick={() => {
                      setbrand(b.id);
                      setOpenBrands(false);
                    }}
                  >
                    <Check
                      className={`w-4 h-4 ${
                        brand === b.id ? 'text-red-500/90' : 'text-white'
                      }`}
                    />
                    {b.name}
                  </span>
                ))}
                <span
                  className="flex items-center gap-2 cursor-pointer pb-1 m-1 px-1 hover:bg-blue-50"
                  onClick={() => {
                    setbrand('all');
                    setOpenBrands(false);
                  }}
                >
                  <Check
                    className={`w-4 h-4 ${
                      brand === 'all' ? 'text-red-500/90' : 'text-white'
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
            sku={product.sku}
            quantity={product.stock}
            onAddToCart={addToCart}
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
