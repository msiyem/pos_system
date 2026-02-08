import logo from '../../../assets/logo.png';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import Sidebar from '../../sidebar/Sidebar';
import MiniProfile from './miniprofile';
import ShoppingCard from './shoppingCard';
import { useEffect, useRef, useState } from 'react';
import api from '../../../api/api';
import useToast from '../../../toast/useToast';
import { useAuth } from '../../../context/useAuth';
import PageLoader from '../../../ui/PageLoader';
import { set } from 'zod';
import { se } from 'date-fns/locale/se';

export default function HomePage() {
  const {role,loading} = useAuth();
  const [open, setOpen] = useState(true);
  const [isSmallDevice, setSmallDive] = useState(false);
  const [cart, setCart] = useState([]);
  const homeRef = useRef(null);

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
  const [Pbrand, setPbrand] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

  
  const [users, setUsers] = useState([]);
  const [user_role,setUserRole] = useState('All');
  const [user_page, setUserPage] = useState(1);
  const [user_total, setUserTotal] = useState(0);
  const [user_limit] = useState(9);
  const [user_search, setUserSearch] = useState('');

  const toast = useToast();
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 820) {
        setOpen(false);
        setSmallDive(true);
      } else {
        setOpen(true);
        setSmallDive(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleSideBar = (event) => {
      if (isSmallDevice && open) {
        if (homeRef.current && !homeRef.current.contains(event.target)) {
          setOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleSideBar);
    return () => document.removeEventListener('mousedown', handleSideBar);
  }, [isSmallDevice, open]);
  
  const fetchCustomers = async () => {
    try {
      setApiLoading(true);
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
      toast.error('Error fetching customers data!');
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCustomers();
    }, 350);

    return () => clearTimeout(delayDebounce);
  }, [cus_page, cus_search]);


  const fetchProducts = async () => {
    try {
      setApiLoading(true);
      const res = await api.get('/products', {
        params: {
          page: p_page || 1,
          limit: p_limit || 8,
          search: p_search || '',
          stock: Pstock || 'all',
          category: Pcategory || 'all',
          brand: Pbrand || 'all',
        },
      });

      setProducts(res.data.data);
      setP_page(res.data.page);
      setP_total(res.data.total);
    } catch (err) {
      console.log(err);
      toast.error('Error fetching products data!');
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 350);
    return () => clearTimeout(delayDebounce);
  }, [p_page, p_search, Pstock, Pcategory, Pbrand]);

  const fetchUsers = async () => {
    try {
      setApiLoading(true);
      const res = await api.get('/users', {
        params: {
          page: user_page,
          limit: user_limit,
          search: user_search,
          role: user_role === 'All' ? null : user_role,
        },
      });
      
      setUsers(res.data.data);
      setUserPage(res.data.page);
      setUserTotal(res.data.total);
    } catch (err) {
      console.log(err);
      toast.error('Error fetching users data!');
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(()=>{
    if(!loading && role === "admin"){
      setTimeout(() => {
        fetchUsers();
      }, 450);
    }
  },[role,user_page,user_limit,user_search,user_role])

  if(loading) return  <PageLoader/>;

  return (
    <div>
      <div ref={homeRef} className="flex bg-white h-[100dvh] w-full fixed">
        {/* Sidebar */}
        <div
          className={`bg-[rgb(250,250,250)] h-full flex flex-col  z-20
            transition-all duration-500 ease-in-out
            ${open ? 'w-[220px] opacity-100' : 'w-0 opacity-0 overflow-hidden'}
          `}
        >
          <Link to="/">
            <img src={logo} alt="GadgetBD logo" />
          </Link>
          <Sidebar />
        </div>

        {/* Mobile Overlay */}
        {isSmallDevice && open && (
          <div
            className="fixed inset-0 bg-black/50 z-10"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Main content */}
        <div
          className={`flex flex-col relative transition-all duration-300 ease-in-out
            ${open ? 'w-[calc(100%-220px)]' : 'w-full'}
          `}
          onClick={() => {
            if (isSmallDevice && open) setOpen(false);
          }}
        >
          {/* Top bar */}
          <div className="flex justify-between p-3 border-b border-gray-200/80">
            <button onClick={() => setOpen(!open)}>
              {open ? (
                <ChevronLeft className="cursor-pointer rounded-full h-7 w-7 p-1 m-1 bg-[rgb(248,244,244)]" />
              ) : (
                <ChevronRight className="cursor-pointer rounded-full h-7 w-7 p-1 m-1 bg-[rgb(248,244,244)]" />
              )}
            </button>

            <div className="flex gap-3 items-center">
              <ShoppingCard
                card={cart}
                setCard={setCart}
                customers={customers}
                cus_search={cus_search}
                fetchCustomers={fetchCustomers}
                fetchProducts={fetchProducts}
                setSearch={setSearch}
                cus_total={cus_total}
              />
              <MiniProfile />
            </div>
          </div>

          {/* Page Content */}
          <div className="w-full overflow-auto">
            <Outlet
              context={{
                cart,
                setCart,
                products,
                setProducts,
                p_page,
                setP_page,
                p_total,
                setP_total,
                p_limit,
                p_search,
                setP_search,
                Pstock,
                setPstock,
                Pcategory,
                setPcategory,
                Pbrand,
                setPbrand,
                selectedProduct,
                setSelectedProduct,
                fetchProducts,
                customers,
                setCustomers,
                cus_page,
                setPage,
                cus_total,
                setTotal,
                cus_limit,
                cus_search,
                setSearch,
                selectedCustomer,
                setSelectedCustomer,
                fetchCustomers,
                users,
                setUsers,
                user_page,
                setUserPage,
                user_total,
                setUserTotal,
                user_limit,
                user_search,
                setUserSearch,
                user_role,
                setUserRole,
                fetchUsers,
                role,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
