import {
  Home,
  LucideShoppingCart,
  LucideShoppingBag,
  Users,
  Building,
  ChartColumn,
  BadgeDollarSign,
  ShoppingBasket,
  Store,
  Plus,
  LogOutIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth.jsx';


const menuItems = [
  { to: '/', icon: Home, label: 'Dashboard',roles: ['admin'] },
  { to: '/product', icon: LucideShoppingBag, label: 'Product', roles: ['admin','staff'] },
  { to: '/purchase', icon: Store, label: 'Purchase', roles: ['admin'] },
  { to: '/customers', icon: Users, label: 'Customers', roles: ['admin','staff'] },
  { to: '/supplier', icon: Building, label: 'Supplier', roles: ['admin'] },
  { to: '/users', icon: Users, label: 'Users', roles: ['admin'] },
  // { to: "/pos", icon: LucideShoppingCart, label: "POS" },
  // { to: "/reports", icon: ChartColumn, label: "Reports" },
  // { to: "/selling", icon: BadgeDollarSign, label: "Selling" },
];

const submenuItems = [
  { to: '/product/add', icon: Plus, label: 'Product', roles: ['admin'] },
  { to: '/customers/add', icon: Plus, label: 'Customer', roles: ['admin','staff'] },
  { to: '/supplier/add', icon: Plus, label: 'Supplier', roles: ['admin'] },
  { to: '/user/add', icon: Plus, label: 'User', roles:['admin'] },
];

export default function Sidebar() {
  const { role, logout } = useAuth();
  return (
    <div className="relative flex flex-col  h-full">
      <div>
        {menuItems
        .filter((item)=> item.roles.includes(role))
        .map((item, index) => (
          <Link key={index} to={item.to}>
            <div className="flex gap-2 pl-3 font-medium text-gray-800  rounded-sm p-2 hover:bg-green-50 border border-gray-50 hover:border-green-200  items-center">
              <item.icon className="h-4" /> <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
      <div className="text-xs text-center mt-5 text-gray-500 pr-12 py-1 font-semibold  border-b border-gray-200">Quick Acess</div>
      {/* <div className="border-1 border-gray-300"></div> */}
      <div>
        {submenuItems
        .filter(item=>item.roles.includes(role))
        .map((item, index) => (
          <Link key={index} to={item.to}>
            <div className="flex gap-2 pl-3 font-medium text-gray-800  rounded-sm p-2 hover:bg-green-50 border border-gray-50 hover:text-green-600  items-center">
              <item.icon className="h-4" /> <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
      <div
        onClick={() => logout()}
        className="flex items-center justify-center cursor-pointer hover:bg-rose-500 p-1 rounded 
        mt-auto text-white border border-gray-300 bg-rose-200"
      >
        <LogOutIcon className="h-4 w-4" />
        <p className="mx-2 font-semibold">Logout</p>
      </div>
    </div>
  );
}
