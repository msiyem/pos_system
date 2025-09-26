import {
  Home,
  LucideShoppingCart,
  LucideShoppingBag,
  Users,
  Building,
  ChartColumn,
  BadgeDollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";

const menuItems = [
  { to: "/", icon: Home, label: "Dashboard" },
  { to: "/pos", icon: LucideShoppingCart, label: "POS" },
  { to: "/product", icon: LucideShoppingBag, label: "Product" },
  { to: "/customers", icon: Users, label: "Customers" },
  { to: "/supplier", icon: Building, label: "Supplier" },
  { to: "/reports", icon: ChartColumn, label: "Reports" },
  { to: "/selling", icon: BadgeDollarSign, label: "Selling" },
  { to: "/shopkeeper", icon: Users, label: "Shopkeepers" },
];

export default function Sidebar() {
  return (
    <div>
      {menuItems.map((item, index) => (
        <Link key={index} to={item.to}>
          <div className="flex gap-2 ml-3 rounded-sm p-2 hover:bg-[rgb(246,245,245)] items-center">
            <item.icon className="h-4" /> <span>{item.label}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
