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
  ChevronDown,
  ChevronRight,
  Users2,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth.jsx';
import { useEffect, useState } from 'react';

const menuItems = [
  {
    to: '/',
    icon: Home,
    label: 'Dashboard',
    roles: ['admin'],
    Children: [
      {
        to: '/deshboard/product-analysis',
        icon: LucideShoppingBag,
        label: 'Product Analysis',
      },
      {
        to: '/deshboard/inventory-analysis',
        icon: BadgeDollarSign,
        label: 'Inventory Analysis',
      },
      {
        to: '/deshboard/financial-analysis',
        icon: ChartColumn,
        label: 'Financial Analysis',
      },
      {
        to: 'deshboard/customer-analysis',
        icon: Users2,
        label: 'Customer Analysis',
      },
    ],
  },
  {
    to: '/product',
    icon: LucideShoppingBag,
    label: 'Product',
    roles: ['admin', 'staff'],
  },
  { to: '/purchase', icon: Store, label: 'Purchase', roles: ['admin'] },
  {
    to: '/customers',
    icon: Users,
    label: 'Customers',
    roles: ['admin', 'staff'],
  },
  { to: '/supplier', icon: Building, label: 'Supplier', roles: ['admin'] },
  { to: '/users', icon: Users, label: 'Users', roles: ['admin'] },

];

const submenuItems = [
  { to: '/product/add', icon: Plus, label: 'Product', roles: ['admin'] },
  {
    to: '/customers/add',
    icon: Plus,
    label: 'Customer',
    roles: ['admin', 'staff'],
  },
  { to: '/supplier/add', icon: Plus, label: 'Supplier', roles: ['admin'] },
  { to: '/user/add', icon: Plus, label: 'User', roles: ['admin'] },
];

function RenderSidebar(menuItems) {
  const { role } = useAuth();
  return menuItems
    .filter((item) => item.roles.includes(role))
    .map((item, index) => (
      <Link key={index} to={item.to}>
        <div className="flex gap-2 pl-3 font-medium text-gray-800  rounded-sm p-2 hover:bg-green-50 border border-gray-50 hover:border-green-200  items-center">
          <item.icon className="h-4" /> <span>{item.label}</span>
        </div>
      </Link>
    ));
}

export default function Sidebar() {
  const { role, logout } = useAuth();
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();

  // Close dropdown when route changes
  useEffect(() => {
    setOpenDropdown(null);
  }, [location.pathname]);

  const toggleDropdown = (index, isMainMenu) => {
    if (isMainMenu) {
      // For Dashboard menu, navigate directly and close dropdown
      setOpenDropdown(null);
    } else {
      setOpenDropdown(openDropdown === index ? null : index);
    }
  };

  return (
    <div className="relative flex flex-col  h-full">
      <div>
        {menuItems
          .filter((item) => item.roles.includes(role))
          .map((item, index) => (
            <div key={index}>
              {item.Children && item.Children.length > 0 ? (
                <div>
                  <div
                    onClick={() => toggleDropdown(index, false)}
                    className="flex gap-2 pl-3 font-medium text-gray-800 rounded-sm p-2 hover:bg-green-50 border border-gray-50 hover:border-green-200 items-center cursor-pointer justify-between"
                  >
                    <div className="flex gap-2 items-center flex-1">
                      <item.icon className="h-4" />
                      <Link to={item.to} className="flex-1">
                        <span>{item.label}</span>
                      </Link>
                    </div>
                    {openDropdown === index ? (
                      <ChevronDown className="h-4" />
                    ) : (
                      <ChevronRight className="h-4" />
                    )}
                  </div>
                  {openDropdown === index && (
                    <div className="ml-4 mt-1">
                      {item.Children.map((child, childIndex) => (
                        <Link key={childIndex} to={child.to}>
                          <div className="flex gap-2 pl-3 font-medium text-gray-700 text-sm rounded-sm p-2 hover:bg-green-50 border border-gray-50 hover:border-green-200 items-center">
                            <child.icon className="h-3.5" />
                            <span>{child.label}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link to={item.to}>
                  <div className="flex gap-2 pl-3 font-medium text-gray-800 rounded-sm p-2 hover:bg-green-50 border border-gray-50 hover:border-green-200 items-center">
                    <item.icon className="h-4" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              )}
            </div>
          ))}
      </div>
      <div className="text-xs text-center mt-5 text-gray-500 pr-12 py-1 font-semibold  border-b border-gray-200">
        Quick Acess
      </div>
      {/* <div className="border-1 border-gray-300"></div> */}
      <div>
        {submenuItems
          .filter((item) => item.roles.includes(role))
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
