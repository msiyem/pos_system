import HomePage from '../private/pages/home/homePage.jsx';
import Deshboard from '../private/pages/deshboard/deshboard.jsx';
import Product from '../private/pages/products/products.jsx';
import Customers from '../private/pages/customers/customers.jsx';
import CustomerHistory from '../private/pages/customers/customerProfile';
import AddCustomer from '../private/pages/customers/addCustomer';
import EditCustomer from '../private/pages/customers/editCustomer';
import CustomerDue from '../private/pages/customers/customerDue.jsx';

import AddProduct from '../private/pages/products/addProduct';
import EditProduct from '../private/pages/products/editProduct';

import Suppliers from '../private/pages/suppliers/suppliers.jsx';
import SupplierHistory from '../private/pages/suppliers/supplierProfile';
import AddSupplier from '../private/pages/suppliers/addSupplier.jsx';
import EditSupplier from '../private/pages/suppliers/editSupplier.jsx';
import SupplierPayable from '../private/pages/suppliers/supplierPayable.jsx';

import Reports from '../private/pages/reports/reports.jsx';
import Selling from '../private/pages/sellings/selling.jsx';
import Purchase from '../private/pages/purchases/purchase';

import Users from '../private/pages/users/users.jsx';
import AddUser from '../private/pages/users/addUser.jsx';
import EditUser from '../private/pages/users/editUser.jsx';
import UserProfile from '../private/pages/users/userProfile.jsx';

import AddBrand from '../private/component/addBrand.jsx';
import AddCategory from '../private/component/addCategory.jsx';
import IndexRedirect from './IndexRedirect.jsx';
import Unauthorized from '../private/pages/unauthorized.jsx';
import Error from '../error.jsx';
import UserHistory from '../private/pages/users/userHistory.jsx';
import FinancialAnalysis from '../private/pages/deshboard/financialAnalysis.jsx';
import ProductAnalysis from '../private/pages/deshboard/productAnalysis.jsx';
import InventoryAnalysis from '../private/pages/deshboard/inventoryAnaysis.jsx';
import CustomersAnalysis from '../private/pages/deshboard/customersAnalysis.jsx';

const ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
};

export const routes = [
  {
    path: '/',
    element: HomePage,
    roles: [ROLES.ADMIN, ROLES.STAFF],
    children: [
      {
        index: true,
        element: IndexRedirect,
        roles: [ROLES.ADMIN, ROLES.STAFF],
      },
      {
        path: 'deshboard',
        element: Deshboard,
        roles: [ROLES.ADMIN],
      },
      {
        path: 'deshboard/financial-analysis',
        element: FinancialAnalysis,
        roles: [ROLES.ADMIN],
      },
      {
        path: 'deshboard/customer-analysis',
        element: CustomersAnalysis,
        roles: [ROLES.ADMIN],
      },
      {
        path: 'deshboard/product-analysis',
        element: ProductAnalysis,
        roles: [ROLES.ADMIN],
      },
      {
        path: 'deshboard/inventory-analysis',
        element: InventoryAnalysis,
        roles: [ROLES.ADMIN],
      },

      // -------- Products --------
      {
        path: 'product',
        element: Product,
        roles: [ROLES.ADMIN, ROLES.STAFF],
      },
      {
        path: 'product/add',
        element: AddProduct,
        roles: [ROLES.ADMIN],
      },
      {
        path: 'products/:id/edit',
        element: EditProduct,
        roles: [ROLES.ADMIN],
      },

      // -------- Customers --------
      {
        path: 'customers',
        element: Customers,
        roles: [ROLES.ADMIN, ROLES.STAFF],
      },
      {
        path: 'customers/add',
        element: AddCustomer,
        roles: [ROLES.ADMIN, ROLES.STAFF],
      },
      {
        path: 'customer/:id',
        element: CustomerHistory,
        roles: [ROLES.ADMIN, ROLES.STAFF],
      },
      {
        path: 'customer/:id/edit',
        element: EditCustomer,
        roles: [ROLES.ADMIN, ROLES.STAFF],
      },
      {
        path: 'customers/:id/due',
        element: CustomerDue,
        roles: [ROLES.ADMIN, ROLES.STAFF],
      },

      // -------- Suppliers (Admin only) --------
      {
        path: 'supplier',
        element: Suppliers,
        roles: [ROLES.ADMIN],
      },
      {
        path: 'supplier/add',
        element: AddSupplier,
        roles: [ROLES.ADMIN],
      },
      {
        path: 'supplier/:id',
        element: SupplierHistory,
        roles: [ROLES.ADMIN],
      },
      {
        path: 'supplier/:id/edit',
        element: EditSupplier,
        roles: [ROLES.ADMIN],
      },
      {
        path: 'supplier/:id/due',
        element: SupplierPayable,
        roles: [ROLES.ADMIN],
      },

      // -------- Users --------
      {
        path: 'users',
        element: Users,
        roles: [ROLES.ADMIN],
      },
      {
        path: 'user/:id',
        element: UserHistory,
        roles: [ROLES.ADMIN],
      },
      {
        path: 'user/add',
        element: AddUser,
        roles: [ROLES.ADMIN],
      },
      {
        path: 'user/:id/edit',
        element: EditUser,
        roles: [ROLES.ADMIN],
      },
      {
        path: 'user/me',
        element: UserProfile,
        roles: [ROLES.ADMIN, ROLES.STAFF],
      },

      // -------- Others --------
      {
        path: 'brand/add',
        element: AddBrand,
        roles: [ROLES.ADMIN],
      },
      {
        path: 'category/add',
        element: AddCategory,
        roles: [ROLES.ADMIN],
      },
      {
        path: 'reports',
        element: Reports,
        roles: [ROLES.ADMIN, ROLES.STAFF],
      },
      {
        path: 'selling',
        element: Selling,
        roles: [ROLES.ADMIN, ROLES.STAFF],
      },
      {
        path: 'purchase',
        element: Purchase,
        roles: [ROLES.ADMIN],
      },
      {
        path: 'unauthorized',
        element: Unauthorized,
        roles: [],
      },
      {
        path: '*',
        element: Error,
        roles: [],
      },
    ],
  },
];
