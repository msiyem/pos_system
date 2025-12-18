import {
  BookmarkMinus,
  Calendar,
  CalendarCheck,
  Check,
  Delete,
  EllipsisVertical,
  History,
  IdCard,
  Mail,
  MessageCircle,
  Phone,
  PhoneCall,
  Search,
  Shield,
  ShieldCheck,
  ShieldUser,
  ShoppingBag,
  SquarePen,
  Trash2,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import DateButton from './dateButton';
import DeleteCustomerButton from './deleteCustomer';
import api from '../api/api'; 

export default function CustomerHistory({ fetchCustomers, page, search }) {
  const { id } = useParams();
  const [customer, setCustomer] = useState({});
  // const customer = users.find((c) => c.id === parseInt(id));
  const [activeTab, setActiveTab] = useState('info');
  const [type, setType] = useState('All');
  const [openTypes, setOpenType] = useState(false);
  const [openElipse, setOpenElipse] = useState(false);
  const navigate = useNavigate();
  const customerId = parseInt(id);

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const res = await api.get(`/customers/${customerId}/details`);
        setCustomer(res.data);

        // Optional: backend response ok check
        if (!res.data) {
          alert('Customer not found!');
        }
      } catch (err) {
        console.log(err);
        alert('Error fetching customer details');
      }
    }

    fetchCustomer();
  }, [customerId]);

  if (!customer || Object.keys(customer).length === 0) {
    return <div>Loading customer data...</div>;
  }

  return (
    <div className="min-w-[800px] max-w-[1180px] m-auto shrink-0 flex flex-col gap-5 p-5 bg-amber-50/10">
      {/* Customer Info Card */}
      <div className="flex p-6 border border-gray-300 rounded-xl shadow w-full bg-white">
        <div className="p-6 rounded-xl bg-[#e51e5a]">
          <User className="h-10 w-10 text-white" />
        </div>

        <div className="w-full flex flex-col gap-2 ml-5">
          <div className="flex justify-between w-full">
            <div className="flex gap-3">
              <span className="text-[24px] font-bold">{customer.name}</span>
              {customer.verify ? (
                <div className="flex items-center bg-green-100 rounded-lg px-2 pr-3 gap-2 flex-shrink-0 self-center">
                  <ShieldCheck className="h-3 w-3" />
                  <span className="text-[12px] font-medium text-gray-600">
                    Verified
                  </span>
                </div>
              ) : (
                <div className="flex items-center bg-red-100 rounded-lg px-2 pr-3 gap-2 flex-shrink-0 self-center">
                  <ShieldCheck className="h-3 w-3" />
                  <span className="text-[12px] font-medium text-gray-600">
                    Not Verified
                  </span>
                </div>
              )}
              <div className="flex items-center bg-gray-100 shadow text-[14px] rounded-xl px-2 pr-3 gap-2 flex-shrink-0 self-center">
                <span>Gender: {customer.gender} </span>
              </div>
            </div>
            <div className="relative">
              <button
                className="cursor-pointer p-1"
                onClick={() => setOpenElipse(!openElipse)}
              >
                <EllipsisVertical className="h-5 w-5" />
              </button>
              {/* Dropdown ellipsis  */}
              <div
                className={`absolute mt-0 right-3 z-20
                transform origin-top-right transition-all duration-300 ease-out ${
                  openElipse ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`}
              >
                <div className="bg-white border border-gray-300 shadow rounded-xl flex flex-col p-1">
                  <div
                    onClick={() => navigate('edit')}
                    className="flex items-center gap-2 hover:bg-gray-50 hover:shadow p-2 mx-1 py-1.5 cursor-pointer rounded-0 border-b border-b-gray-300 text-blue-600 "
                  >
                    <SquarePen className="h-4 w-4" />
                    <span className="">Edit</span>
                  </div>
                  <div onClick={() => navigate(-1)} className="text-[#e51e5a]">
                    <DeleteCustomerButton
                      customerId={id}
                      onDeleted={() => fetchCustomers(page, search)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-gray-600 flex gap-6 text-[12px] sm:text-sm">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4" />
              <span>Joined: {customer.join_at}</span>
            </div>
            <div className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span>Last Purchase: {customer.last_purchased}</span>
            </div>
          </div>

          <div className="flex justify-between items-center gap-3">
            <div className=" text-[#e51e5a] text-[12px] font-semibold border border-gray-300 flex items-center w-fit rounded-lg px-2 py-1 gap-1">
              <BookmarkMinus className="h-3 w-3 " />
              <span>Due: {customer.debt}</span>
            </div>
            <div className="text-[12px] font-semibold text-gray-800 border border-[#e51e5a]/15 px-2 py-1   rounded-lg shadow flex items-center gap-[1px]">
              <ShieldUser className="h-3.5 w-3.5" />
              ID : {id}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="w-full border border-gray-300 rounded-lg p-2 py-5 bg-white">
        <div className="bg-gray-100 w-full max-w-150 flex justify-between shrink-0 rounded-lg mx-3 p-3">
          {/* info tab */}
          {activeTab === 'info' ? (
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1 shadow text-[#e51e5a] cursor-pointer">
              <User className="h-4 w-4" />
              <span>Information</span>
            </div>
          ) : (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setActiveTab('info')}
            >
              <User className="h-4 w-4" />
              <span>Information</span>
            </div>
          )}

          {/* Purchased Tab  */}
          {activeTab === 'purchased' ? (
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1 shadow text-[#e51e5a] cursor-pointer">
              <ShoppingBag className="h-4 w-4" />
              <span>Purchased Products</span>
            </div>
          ) : (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setActiveTab('purchased')}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Purchased Products</span>
            </div>
          )}

          {/* Transaction Tab  */}
          {activeTab === 'transition' ? (
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1 shadow text-[#e51e5a] cursor-pointer">
              <History className="h-4 w-4" />
              <span>Transaction History</span>
            </div>
          ) : (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setActiveTab('transition')}
            >
              <History className="h-4 w-4" />
              <span>Transaction History</span>
            </div>
          )}
        </div>

        {/* dropdown info  */}
        {activeTab === 'info' && (
          <div className="my-10 w-full">
            <div className="w-full">
              <p className="text-[18px] my-2 font-medium">
                Contact Information :
              </p>
              <table className="w-full text-gray-700 text-[16px]">
                <tbody>
                  <tr className="p-1 border border-gray-300 ">
                    <th className="flex items-center gap-1.5 p-2">
                      <Phone className="h-3.5 w-3.5" />
                      <span className="font-medium">Phone:</span>
                    </th>
                    <td>{customer.phone}</td>
                  </tr>

                  <tr className="p-1 border border-gray-300 ">
                    <th className="flex items-center gap-1.5 p-2">
                      <PhoneCall className="h-3.5 w-3.5" />
                      <span className="font-medium">Alternative:</span>
                    </th>
                    <td>{customer?.alt_phone}</td>
                  </tr>

                  <tr className="p-1 border border-gray-300 ">
                    <th className="flex items-center gap-1.5 p-2">
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span className="font-medium">WhatsApp:</span>
                    </th>
                    <td>{customer.whatsapp}</td>
                  </tr>

                  <tr className="p-1 border border-gray-300 ">
                    <th className="flex items-center gap-1.5 p-2">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="font-medium">Email:</span>
                    </th>
                    <td>{customer.email}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="w-full">
              <p className="text-[18px] mt-8 my-2 font-medium">
                Address Information :
              </p>
              <table className="w-full text-gray-700 text-[16px]">
                <tbody>
                  <tr className="p-1 border border-gray-300 ">
                    <th className="flex items-center gap-1.5 p-2">
                      <span className="font-medium">Sector:</span>
                    </th>
                    <td>{customer.sector}</td>
                  </tr>

                  <tr className="p-1 border border-gray-300 ">
                    <th className="flex items-center gap-1.5 p-2">
                      <span className="font-medium">Area:</span>
                    </th>
                    <td>{customer.area}</td>
                  </tr>

                  <tr className="p-1 border border-gray-300 ">
                    <th className="flex items-center gap-1.5 p-2">
                      <span className="font-medium">Post Code:</span>
                    </th>
                    <td>{customer.post_code}</td>
                  </tr>

                  <tr className="p-1 border border-gray-300 ">
                    <th className="flex items-center gap-1.5 p-2">
                      <span className="font-medium">City:</span>
                    </th>
                    <td>{customer.city}</td>
                  </tr>

                  <tr className="p-1 border border-gray-300 ">
                    <th className="flex items-center gap-1.5 p-2">
                      <span className="font-medium">District:</span>
                    </th>
                    <td>{customer.district}</td>
                  </tr>

                  <tr className="p-1 border border-gray-300 ">
                    <th className="flex items-center gap-1.5 p-2">
                      <span className="font-medium">Division:</span>
                    </th>
                    <td>{customer.division}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* dropdown  Purchased Products  */}
        {activeTab === 'purchased' && (
          <div className="w-full my-10">
            <table className="w-full text-center border border-gray-300 ">
              <tbody className="">
                <tr className="border-b border-gray-300  ">
                  <th className="p-2 text-left px-4">Product</th>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
                <tr className="border-b border-gray-300  ">
                  <th className="p-2 text-left ">Premium Leather Wallet</th>
                  <td>23 Jul 2025</td>
                  <td>$1,200</td>
                  <td>1</td>
                  <td>$1,200</td>
                </tr>
                <tr className="border-b border-gray-300  ">
                  <th className="p-2 text-left">Wireless Earbuds</th>
                  <td>15 Sep 2025</td>
                  <td>$1,100</td>
                  <td>2</td>
                  <td>$2,200</td>
                </tr>
                <tr className="border-b border-gray-300  ">
                  <th className="p-2 text-left">
                    Stainless Steel Water Bottle
                  </th>
                  <td>10 May 2023</td>
                  <td>$1,500</td>
                  <td>1</td>
                  <td>$1,500</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* dropdown  Purchased transition  */}
        {activeTab === 'transition' && (
          <div className="w-full  my-10 flex flex-col gap-10">
            <div className="font-medium text-[18px]">Transition History</div>
            <div className="flex gap-4">
              <div>
                <DateButton button_text={'Start Date'} />
              </div>
              {/* <div className='cursor-pointer py-0.5 flex items-center gap-2 border border-gray-300 w-fit px-3 rounded-lg shadow bg-blue-500/85 hover:bg-blue-500 text-white'>
                  <Calendar className='h-4 w-4 '/> <span>Start</span>
                </div> */}
              <div>
                <DateButton button_text={'End Date'} />
              </div>
              <div className="relative">
                <div
                  className="cursor-pointer py-0.5 flex items-center gap-2 border border-gray-300 w-fit px-3 rounded-lg shadow hover:bg-gray-50"
                  onClick={() => setOpenType(!openTypes)}
                >
                  {type === 'All' ? 'All Types' : type}
                </div>

                {/* dropdown types  */}
                <div
                  className={`absolute mt-2 z-50 
                  transform origin-top transition-all duration-300 ease-in-out ${
                    openTypes ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`}
                >
                  <div
                    className="flex flex-col border border-gray-200 shadow-xl rounded-xl p-1 bg-white"
                    onClick={() => setOpenType(false)}
                  >
                    <div
                      onClick={() => setType('All')}
                      className="flex items-center gap-2 hover:bg-gray-100 cursor-pointer p-1  border-b border-b-gray-100 rounded-lg"
                    >
                      <Check
                        className={`h-3 w-3  ${type === 'All' ? 'text-black' : 'text-white'}`}
                      />
                      <span>All</span>
                    </div>
                    <div
                      onClick={() => setType('Purchased')}
                      className="flex items-center gap-2 hover:bg-gray-100 cursor-pointer p-1  border-b border-b-gray-100 rounded-lg"
                    >
                      <Check
                        className={`h-3 w-3  ${type === 'Purchased' ? 'text-black' : 'text-white'}`}
                      />
                      <span>Purchased</span>
                    </div>
                    <div
                      onClick={() => setType('Payment')}
                      className="flex items-center gap-2 hover:bg-gray-100 cursor-pointer p-1  border-b border-b-gray-100 rounded-lg"
                    >
                      <Check
                        className={`h-3 w-3  ${type === 'Payment' ? 'text-black' : 'text-white'}`}
                      />
                      <span>Payment</span>
                    </div>
                    <div
                      onClick={() => setType('DuePayment')}
                      className="flex items-center gap-2 hover:bg-gray-100 cursor-pointer p-1  border-b border-b-gray-100 rounded-lg"
                    >
                      <Check
                        className={`h-3 w-3  ${type === 'DuePayment' ? 'text-black' : 'text-white'}`}
                      />
                      <span>DuePayment</span>
                    </div>
                    <div
                      onClick={() => setType('Refund')}
                      className="flex items-center gap-2 hover:bg-gray-100 cursor-pointer p-1  border-b border-b-gray-100 rounded-lg"
                    >
                      <Check
                        className={`h-3 w-3  ${type === 'Refund' ? 'text-black' : 'text-white'}`}
                      />
                      <span>Refund</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border py-0.5 flex items-center gap-1 self-start px-1 rounded-lg border-gray-400 hover:shadow">
              <Search className="h-4.5 w-4.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search transaction..."
                className="outline-none"
              />
            </div>
            <table className="w-full text-center  ">
              <tbody className="ring-1 rounded-lg ring-gray-300">
                <tr className="border-b  border-gray-300 font-medium ">
                  <th className="p-2 text-left px-4 font-medium">Transition</th>
                  <th className="font-medium">Date</th>
                  <th className="font-medium">Invoice</th>
                  <th className="font-medium">Type</th>
                  <th className="font-medium">Amount($)</th>
                  <th className="font-medium">Customer</th>
                  <th className="font-medium">Seller</th>
                </tr>
                <tr className="border-b border-gray-300  ">
                  <th className="p-2 text-left font-medium ">
                    Premium Leather Wallet
                  </th>
                  <td>23 Jul 2025, 2:30 PM</td>
                  <td>$1,200</td>
                  <td>1</td>
                  <td>$1,200</td>
                </tr>
                <tr className="border-b border-gray-300 font-medium ">
                  <th className="p-2 text-left font-medium">
                    Wireless Earbuds
                  </th>
                  <td>15 Sep 2025, 3:30 PM</td>
                  <td>$1,100</td>
                  <td>2</td>
                  <td>$2,200</td>
                </tr>
                <tr className="border-b border-gray-300  ">
                  <th className="p-2 text-left font-medium">
                    Stainless Steel Water Bottle
                  </th>
                  <td>10 May 2023, 5:00 AM</td>
                  <td>$1,500</td>
                  <td>1</td>
                  <td>$1,500</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className=""></div>
    </div>
  );
}
