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

export default function MyRoute() {
  const customers = [
  {
    id: 1,
    name: 'Rahim Uddin',
    gmail: 'rahim@gmail.com',
    phone: '01711112222',
    altPhone: '01911112222',
    whatsapp: '01711112222',
    address: '15A, Road 2, Mirpur, Dhaka',
    sector: 'Mirpur-10',
    postCode: '1216',
    city: 'Dhaka',
    district: 'Dhaka',
    division: 'Dhaka',
    lastVisit: '20 Jul 2025',
    dues: 500,
  },
  {
    id: 2,
    name: 'Karim Uddin',
    gmail: 'karim@gmail.com',
    phone: '01722223333',
    altPhone: '01922223333',
    whatsapp: '01722223333',
    address: 'Sadar, Mirpur, Dhaka',
    sector: 'Mirpur-12',
    postCode: '1216',
    city: 'Dhaka',
    district: 'Dhaka',
    division: 'Dhaka',
    lastVisit: '25 Jul 2025',
    dues: 0,
  },
  {
    id: 3,
    name: 'Romis Mia',
    gmail: 'romis@gmail.com',
    phone: '01733334444',
    altPhone: '01933334444',
    whatsapp: '01733334444',
    address: '22B, Road 5, Uttara, Dhaka, Bangladesh',
    sector: 'Uttara-2',
    postCode: '1230',
    city: 'Dhaka',
    district: 'Dhaka',
    division: 'Dhaka',
    lastVisit: '18 Jul 2025',
    dues: 300,
  },
  {
    id: 4,
    name: 'Salma Akter',
    gmail: 'salma@gmail.com',
    phone: '01744445555',
    altPhone: '01944445555',
    whatsapp: '01744445555',
    address: 'House 14, Banani, Dhaka',
    sector: 'Banani',
    postCode: '1213',
    city: 'Dhaka',
    district: 'Dhaka',
    division: 'Dhaka',
    lastVisit: '10 Jul 2025',
    dues: 1000,
  },
  {
    id: 5,
    name: 'Jamil Hasan',
    gmail: 'jamil@gmail.com',
    phone: '01755556666',
    altPhone: '01955556666',
    whatsapp: '01755556666',
    address: 'Shahbagh, Dhaka',
    sector: 'Shahbagh',
    postCode: '1000',
    city: 'Dhaka',
    district: 'Dhaka',
    division: 'Dhaka',
    lastVisit: '28 Jul 2025',
    dues: 0,
  },
  {
    id: 6,
    name: 'Nasrin Sultana',
    gmail: 'nasrin@gmail.com',
    phone: '01766667777',
    altPhone: '01966667777',
    whatsapp: '01766667777',
    address: 'Mohammadpur, Dhaka',
    sector: 'Mohammadpur',
    postCode: '1207',
    city: 'Dhaka',
    district: 'Dhaka',
    division: 'Dhaka',
    lastVisit: '15 Jul 2025',
    dues: 200,
  },
  {
    id: 7,
    name: 'Rafiul Islam',
    gmail: 'rafi@gmail.com',
    phone: '01777778888',
    altPhone: '01977778888',
    whatsapp: '01777778888',
    address: 'Rampura, Dhaka',
    sector: 'Rampura',
    postCode: '1219',
    city: 'Dhaka',
    district: 'Dhaka',
    division: 'Dhaka',
    lastVisit: '22 Jul 2025',
    dues: 0,
  },
  {
    id: 8,
    name: 'Mehedi Hasan',
    gmail: 'mehedi@gmail.com',
    phone: '01788889999',
    altPhone: '01988889999',
    whatsapp: '01788889999',
    address: 'Dhanmondi, Dhaka',
    sector: 'Dhanmondi',
    postCode: '1209',
    city: 'Dhaka',
    district: 'Dhaka',
    division: 'Dhaka',
    lastVisit: '12 Jul 2025',
    dues: 150,
  },
  {
    id: 9,
    name: 'Sadia Rahman',
    gmail: 'sadia@gmail.com',
    phone: '01799990000',
    altPhone: '01999990000',
    whatsapp: '01799990000',
    address: 'Mirpur 10, Dhaka',
    sector: 'Mirpur-10',
    postCode: '1216',
    city: 'Dhaka',
    district: 'Dhaka',
    division: 'Dhaka',
    lastVisit: '05 Jul 2025',
    dues: 800,
  },
  {
    id: 10,
    name: 'Tanvir Alam',
    gmail: 'tanvir@gmail.com',
    phone: '01710101010',
    altPhone: '01910101010',
    whatsapp: '01710101010',
    address: 'Gulshan, Dhaka',
    sector: 'Gulshan',
    postCode: '1212',
    city: 'Dhaka',
    district: 'Dhaka',
    division: 'Dhaka',
    lastVisit: '30 Jul 2025',
    dues: 0,
  },
];

  return (
    <Routes>
      <Route path="" element={<Deshboard />} />
      <Route path="/deshboard" element={<Deshboard />} />
      <Route path="/pos" element={<Pos />} />
      <Route path="/product" element={<Product />}/>
      <Route path='/product/add' element={<AddProduct/>} />
      <Route path="/customers" element={<Customers users={customers} />} />
      <Route path='/customer/:id' element={<CustomerHistory users={customers} />} />
      <Route path="/supplier" element={<Supplier />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/selling" element={<Selling />} />
      <Route path="/shopkeeper" element={<Shopkeeper />} />
      <Route path="/*" element={<Error />} />
    </Routes>
  );
}
