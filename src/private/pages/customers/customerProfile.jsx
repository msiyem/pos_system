import {
  BadgeDollarSign,
  BookmarkMinus,
  Calendar,
  CalendarCheck,
  Check,
  ChevronDown,
  ChevronUp,
  ClockFading,
  Delete,
  EllipsisVertical,
  Eye,
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
  ShoppingBasket,
  SquarePen,
  Store,
  Trash2,
  User,
} from 'lucide-react';
import { use, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import DateButton from '../../component/dateButton';
import DeleteCustomerButton from './deleteCustomer';
import api from '../../../api/api';
import { format } from 'date-fns';

export default function CustomerHistory({ fetchCustomers, page, search }) {
  const { id } = useParams();
  const [customer, setCustomer] = useState({});
  // const customer = users.find((c) => c.id === parseInt(id));
  const [activeTab, setActiveTab] = useState('info');
  const [type, setType] = useState('All');
  const [openTypes, setOpenType] = useState(false);
  const typeRef = useRef(null);
  const [openElipse, setOpenElipse] = useState(false);
  const navigate = useNavigate();
  const customerId = parseInt(id);

  //transaction states
  const [transactions, setTransactions] = useState([]);
  const [transactionData, setTransactionData] = useState(0);
  const [openTanEntries,setOpenTanEntries] = useState(false);
  const [saleItems, setSaleItems] = useState([]);
  const [selectedSale, setSelectedSale] = useState();
  const [viewMode, setViewMode] = useState('transactions');
  const [tanPage, setTanPage] = useState(1);
  const [tanLimit, setTanLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const entries = [10,25,50,100];
  const entriesRef= useRef(null);

  const [purchasedPage, setPurchasedPage] = useState(1);
  const [purchasedLimit, setPurchasedLimit] = useState(10);
  const [totalPurchasedPages, setTotalPurchasedPage] = useState(1);

  //purchased products states
  const [purchased, setPurchased] = useState([]);
  const [productItems, setProductItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);

  //filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(()=>{

    function handleEntriesRef(e) {
      if (entriesRef.current && !entriesRef.current.contains(e.target)) {
        setOpenTanEntries(false);
      }
    }
    function handleTypeRef(e){
      if(typeRef.current && !typeRef.current.contains(e.target)){
        setOpenType(false);
      }
    }
    document.addEventListener('mousedown', handleEntriesRef);
    document.addEventListener('mousedown', handleTypeRef);
    return () => {
      document.removeEventListener('mousedown', handleEntriesRef);
      document.removeEventListener('mousedown', handleTypeRef);
    };

  },[entriesRef,typeRef])

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

  async function fetchTransactions() {
    try {
      const res = await api.get(`/customers/${customerId}/transactions`, {
        params: {
          fromDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
          toDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
          type: type !== 'All' ? type : undefined,
          page: tanPage,
          limit: tanLimit,
        },
      });
      setTransactions(res.data.data);
      setTransactionData(res.data);
      console.log(res.data);

      setTotalPages(res.data.pagination?.totalPages);
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    fetchTransactions();
  }, [customerId, startDate, endDate, tanPage, tanLimit, type]);

  async function fetchTransactionsSaleItems(saleId) {
    try {
      const res = await api.get(
        `/customers/${customerId}/sales/${saleId}/items`,
        {
          params: {
            sale_id: saleId,
          },
        }
      );
      setSaleItems(res.data.data);
      console.log(res.data.data)
      setViewMode('sale_items');
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchPurchasedProducts() {
    try {
      const res = await api.get(`/customers/${customerId}/purchased_products`, {
        params: {
          fromDate: startDate,
          toDate: endDate,
          page: purchasedPage,
          limit: purchasedLimit,
        },
      });
      setProductItems(res.data.data);
      console.log(res.data.data);
      // setViewMode('sale_items');
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchPurchasedProductsHistory(product_id) {
    try {
      const res = await api.get(
        `/customers/${customerId}/purchased_products/${product_id}`,
        {
          params: {
            fromDate: startDate,
            toDate: endDate,
            page: 1,
            limit: 10,
          },
        }
      );
      console.log(res.data.data);
      setSelectedProduct(res.data.data);
      setViewMode('product_history');
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchPurchasedProducts();
  }, [customerId, startDate, endDate]);

  const summary = useMemo(() => {
    if (!productItems || productItems.length === 0) {
      return {
        totalTimesPurchased: 0,
        totalQuantity: 0,
        totalAmount: 0,
      };
    }

    return productItems.reduce(
      (acc, item) => {
        acc.totalTimesPurchased += Number(item.times_purchased);
        acc.totalQuantity += Number(item.total_quantity);
        acc.totalAmount += Number(item.total_amount);
        return acc;
      },
      {
        totalTimesPurchased: 0,
        totalQuantity: 0,
        totalAmount: 0,
      }
    );
  }, [productItems]);

  if (!customer || Object.keys(customer).length === 0) {
    return <div>Loading customer data...</div>;
  }

  return (
    <div className="min-w-[950px] max-w-[1180px] m-auto shrink-0 flex flex-col gap-5 p-5 bg-amber-50/10">
      {/* Customer Info Card */}
      <div
        className={`flex p-6 border rounded-xl shadow w-full bg-white
        ${customer.status === 'active' && 'border-green-300'}
        ${customer.status === 'inactive' && 'border-purple-300'}
        ${customer.status === 'banned' && 'border-red-300'}
    `}
      >
        {customer.image_url ? (
          <img
            src={customer.image_url}
            alt="customer profile picture"
            className="w-32 h-32 rounded-lg "
          />
        ) : (
          <div className="p-6 rounded-xl bg-[#e51e5a]">
            <User className="h-10 w-10 text-white" />
          </div>
        )}

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
            <div className=" text-[#e51e5a] text-[12px] font-semibold border border-gray-300 flex items-center w-fit rounded-lg px-2 py-1 gap-1 shadow">
              <BookmarkMinus className="h-3 w-3 " />
              <span>Due: {customer.debt}</span>
            </div>
            {/* {customer.status=="active" && (
              <div className='flex items-center gap-1 border rounded-lg px-2 text-green-500  border-gray-300 shadow'>
                status : {customer.status}
              </div>
            )}
            {customer.status=="inactive" && (
              <div className='flex items-center gap-1 border rounded-lg px-2 text-gray-700  border-gray-300 shadow'>
                status : {customer.status}
              </div>
            )}
            {customer.status=="banned" && (
              <div className='flex items-center gap-1 border rounded-lg px-2 text-red-500  border-gray-300 shadow'>
                status : {customer.status}
              </div>
            )} */}

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
              onClick={() => {
                setActiveTab('purchased');
                setViewMode('purchased');
                setStartDate('');
                setEndDate('');
              }}
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
              onClick={() => {
                setActiveTab('transition');
                setViewMode('transactions');
                setStartDate('');
                setEndDate('');
              }}
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
          <div className="w-full  my-10 flex flex-col gap-10 px-2">
            {/* <div className="font-medium text-[18px]">Purchased Products</div> */}

            <div className="grid grid-cols-4 gap-3 w-full ">
              <div className="flex flex-col gap-2 border p-5 rounded-2xl border-gray-300  shadow-blue-100 hover:scale-101">
                <ShoppingBag
                  size={32}
                  className="text-green-500 shadow m-1 p-1  border rounded-lg border-gray-300"
                />
                <span className="font-semibold">Total Types</span>
                <span className="font-bold">{productItems.length || 0}</span>
              </div>
              <div className="flex flex-col gap-2 border p-5 rounded-2xl border-gray-300  shadow-2xs shadow-blue-100 hover:scale-101">
                <Store
                  size={32}
                  className="text-green-500 shadow m-1 p-1  border rounded-lg border-gray-300"
                />
                <span className="font-semibold">Total Quantity</span>
                <span className="font-bold">{summary.totalQuantity}</span>
              </div>
              <div className="flex flex-col gap-2 border p-5 rounded-2xl border-gray-300  shadow-2xs shadow-blue-100 hover:scale-101">
                <ClockFading
                  size={32}
                  className="text-green-500 shadow m-1 p-1  border rounded-lg border-gray-300"
                />
                <span className="font-semibold">Total Times</span>
                <span className="font-bold">{summary.totalTimesPurchased}</span>
              </div>
              <div className="flex flex-col gap-2 border p-5 rounded-2xl border-gray-300  shadow-2xs shadow-blue-100 hover:scale-101">
                <BadgeDollarSign
                  size={32}
                  className="text-green-500 shadow m-1 p-1  border rounded-lg border-gray-300"
                />
                <span className="font-semibold">Total Amount(Tk)</span>
                <span className="font-bold">
                  {summary.totalAmount}{' '}
                  <span className="font-extrabold text-sm">৳</span>
                </span>
              </div>
            </div>

            {/* <div className="border py-0.5 flex items-center gap-1 self-start px-1 rounded-lg border-gray-400 hover:shadow">
              <Search className="h-4.5 w-4.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search transaction..."
                className="outline-none"
              />
            </div> */}
            {viewMode === 'purchased' && (
              <div className="space-y-10">
                <div className="flex gap-16">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="startDate" className="font-semibold">
                      Start Date
                    </label>

                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 py-1"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="endDate" className="font-semibold">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 py-1"
                    />
                  </div>
                </div>

                <div className="w-full border border-gray-300">
                  <div className="max-h-[800px] overflow-auto">
                    <table className="w-full table-fixed border-collapse">
                      <thead className="bg-gray-100 sticky top-0 z-10 w-full">
                        <tr className="border-b border-gray-300 font-medium">
                          <th className="px-4 py-1 border-r border-gray-300 w-[8ch]">
                            NO
                          </th>
                          <th className="border-r border-gray-300">
                            Product Name
                          </th>
                          <th className="border-r border-gray-300">
                            Product Image
                          </th>
                          <th className="border-r border-gray-300">
                            Times Purchased
                          </th>
                          <th className="border-r border-gray-300">
                            Total Amount(TK)
                          </th>

                          <th className="border-r border-gray-300">
                            Total Quantity
                          </th>

                          <th className="w-22">Details</th>
                        </tr>
                      </thead>
                      <tbody className="border-l border-r text-center border-gray-300">
                        {productItems.length ? (
                          productItems.map((pi, index) => (
                            <tr
                              key={`${pi.type}-${pi.ref_id}-${index}`}
                              className="border-b border-gray-300 text-center"
                            >
                              <th className="py-1 border-r border-gray-300">
                                {index + 1}
                              </th>

                              <td className="border-r border-gray-300 px-1">
                                {pi.product_name}
                              </td>
                              <td className="border-r border-gray-300 px-1">
                                <div className="flex items-center justify-center">
                                  <img
                                    src={pi.image}
                                    alt="product picture"
                                    className="h-20 w-20"
                                  />
                                </div>
                              </td>
                              <td className="border-r border-gray-300">
                                {pi.times_purchased}
                              </td>
                              <td className="border-r border-gray-300">
                                {pi.total_amount}৳
                              </td>

                              <td className="border-r border-gray-300">
                                {pi.total_quantity}
                              </td>
                              <td
                                className="border-r border-gray-300"
                                onClick={() => {
                                  // setSelectedSale(pi);
                                  fetchPurchasedProductsHistory(pi.product_id);
                                }}
                              >
                                <div className="flex justify-center items-center h-full ">
                                  <Eye
                                    size={22}
                                    className="text-gray-600 hover:text-black cursor-pointer"
                                  />
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={7}
                              className="text-center text-red-500 py-4 border-b border-gray-300"
                            >
                              No transactions found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* sale items  */}
            {viewMode === 'product_history' && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    Product Name :{' '}
                    <span className="text-green-600 text-base">
                      {selectedProduct?.[0]?.product_name || 'N/A'}
                    </span>
                  </h3>

                  <button
                    onClick={() => {
                      setViewMode('purchased');
                      setSelectedProduct([]);
                    }}
                    className="border px-3 py-1 rounded-lg hover:bg-gray-100"
                  >
                    ← Back
                  </button>
                </div>

                <div className="max-h-[500px] overflow-auto border border-gray-200">
                  <table className="w-full border border-gray-300 text-center table-fixed border-collapse">
                    <thead className="bg-gray-100 sticky top-0 z-10 w-full">
                      <tr className="border-b border-gray-300 font-medium">
                        <th className="px-4 py-1 border-r border-gray-300 w-[8ch]">
                          NO
                        </th>
                        <th className="border-r border-gray-300">Invoice</th>
                        <th className="border-r border-gray-300">Quantity</th>
                        <th className="border-r border-gray-300">Price(Tk)</th>
                        <th className="border-r border-gray-300">Time</th>
                      </tr>
                    </thead>

                    <tbody className="border-l border-r text-center border-gray-300">
                      {selectedProduct.length ? (
                        selectedProduct.map((item, i) => (
                          <tr
                            key={i}
                            className="border-b border-gray-300 text-center"
                          >
                            <td className="py-1 border-r border-gray-300">
                              {i + 1}
                            </td>
                            <td className="py-1 border-r border-gray-300">
                              {item.invoice}
                            </td>
                            <td className="py-1 border-r border-gray-300">
                              {item.quantity}
                            </td>
                            <td className="py-1 border-r border-gray-300">
                              {item.subtotal}
                            </td>
                            <td className="py-1 border-r border-gray-300">
                              {item.created_at}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-4 text-red-500">
                            No Product found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* dropdown  Purchased transition  */}
        {activeTab === 'transition' && (
          <div className="w-full  my-10 flex flex-col gap-10">
            <div className="grid grid-cols-5 gap-3 w-full ">
              <div className="flex flex-col gap-2 border p-5 rounded-2xl border-gray-300  shadow-blue-100 hover:scale-101">
                <ClockFading
                  size={32}
                  className="text-orange-500 shadow m-1 p-1  border rounded-lg border-gray-300"
                />
                <span className="font-semibold">Total Transactions</span>
                <span className="font-bold text-[18px] text-orange-500">
                  {transactionData?.total_transactions || 0}
                </span>
              </div>

              <div className="flex flex-col gap-2 border p-5 rounded-2xl border-gray-300  shadow-2xs shadow-blue-100 hover:scale-101">
                <ClockFading
                  size={32}
                  className="text-blue-500 shadow m-1 p-1  border rounded-lg border-gray-300"
                />
                <span className="font-semibold">Total Purchased</span>
                <span className="font-bold text-[18px] text-blue-500">
                  {transactionData?.purchased_count || 0}
                </span>
              </div>
              <div className="flex flex-col gap-2 border p-5 rounded-2xl border-gray-300  shadow-2xs shadow-blue-100 hover:scale-101">
                <ClockFading
                  size={32}
                  className="text-green-500 shadow m-1 p-1  border rounded-lg border-gray-300"
                />
                <span className="font-semibold">Total Payment</span>
                <span className="font-bold text-[18px] text-green-500">
                  {transactionData.payment_count || 0}
                </span>
              </div>
              <div className="flex flex-col gap-2 border p-5 rounded-2xl border-gray-300  shadow-2xs shadow-blue-100 hover:scale-101">
                <ClockFading
                  size={32}
                  className="text-purple-500 shadow m-1 p-1  border rounded-lg border-gray-300"
                />
                <span className="font-semibold">Total DuePayment</span>
                <span className="font-bold text-[18px] text-purple-500">
                  {transactionData?.duepayment_count || 0}
                </span>
              </div>
              <div className="flex flex-col gap-2 border p-5 rounded-2xl border-gray-300  shadow-2xs shadow-blue-100 hover:scale-101">
                <ClockFading
                  size={32}
                  className="text-rose-500 shadow m-1 p-1  border rounded-lg border-gray-300"
                />
                <span className="font-semibold">Total Refund Payment</span>
                <span className="font-bold text-[18px] text-rose-500">
                  {transactionData?.refund_count || 0}
                </span>
              </div>
            </div>

            {/* <div className="border py-0.5 flex items-center gap-1 self-start px-1 rounded-lg border-gray-400 hover:shadow">
              <Search className="h-4.5 w-4.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search transaction..."
                className="outline-none"
              />
            </div> */}
            {viewMode === 'transactions' && (
              <div className="space-y-10">
                <div className="flex gap-16">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="startDate" className="font-semibold">
                      Start Date
                    </label>

                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 py-1"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="endDate" className="font-semibold">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 py-1"
                    />
                  </div>
                  <div ref={typeRef} className="relative ">
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

                  <div ref={entriesRef} className="relative ml-auto">
                    <div className=" flex gap-1 h-fit">
                      <span>Show</span>
                      <div 
                      onClick={()=>{setOpenTanEntries(!openTanEntries)}}
                      className='flex items-center border gap-1  pl-1'>
                        <span className='w-[3ch]'>{tanLimit}</span>
                        {!openTanEntries?(<ChevronDown size={16} className=''/>):(<ChevronUp size={16} className=''/>)}
                      </div>
                      <span>entries</span>
                    </div>
                    {/* dropdown entries  */}
                    {openTanEntries && (
                      <div
                      className={`absolute z-50 left-10.5 text-center border border-gray-300 bg-white flex flex-col`}
                    >
                      {entries.map((val,idx)=>(
                        <span key={idx} 
                        onClick={()=>setTanLimit(val)}
                        className="hover:bg-blue-300 px-3">{val}</span>
                      ))}
                    </div>)}
                  </div>
                </div>

                <div className="w-full border border-gray-300">
                  <div className="max-h-[800px] overflow-auto">
                    <table className="w-full table-fixed border-collapse">
                      <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr className="border-b border-gray-300 font-medium">
                          <th className="px-4 py-1 border-r border-gray-300">
                            NO
                          </th>
                          <th className="border-r border-gray-300">Date</th>
                          <th className="border-r border-gray-300">Invoice</th>
                          <th className="border-r border-gray-300">Type</th>
                          <th className="border-r border-gray-300">
                            Amount(Tk)
                          </th>
                          <th className="border-r border-gray-300">
                            Debt(Tk)
                          </th>
                          <th className="border-r border-gray-300">Method</th>
                          <th className="border-r border-gray-300">Status</th>
                          <th className="border-r border-gray-300">Seller</th>
                          <th className='w-[8%]'>Details</th>
                        </tr>
                      </thead>
                      <tbody className="border-l border-r text-center border-gray-300">
                        {transactions.length ? (
                          transactions.map((tx, index) => (
                            <tr
                              key={`${tx.type}-${tx.ref_id}-${index}`}
                              className="border-b border-gray-300"
                            >
                              <th className="py-1 border-r border-gray-300">
                                {(tanPage - 1) * tanLimit + (index + 1)}
                              </th>
                              <td className="border-r border-gray-300">
                                {tx.created_at}
                              </td>
                              <td className="border-r border-gray-300">
                                {tx.reference}
                              </td>
                              <td
                                className={`border-r border-gray-300
                                ${tx.type === 'Purchased' && 'text-blue-500'}
                                ${tx.type === 'Payment' && 'text-green-500'}
                                ${tx.type === 'DuePayment' && 'text-purple-500'}
                                ${tx.type === 'Refund' && 'text-rose-600'}`}
                              >
                                {tx.type}
                              </td>
                              <td className="border-r border-gray-300">
                                {tx.amount}৳
                              </td>
                              <td className="border-r border-gray-300 text-rose-500">
                                {tx.due ?(<span>{tx.due}৳</span>):('-')}
                              </td>
                              <td className="border-r border-gray-300">
                                {tx.method}
                              </td>
                              <td
                                className={`border-r border-gray-300
                                ${tx.status === 'completed' && 'text-green-500'}
                                ${tx.status === 'success' && 'text-green-500'}
                                ${tx.status === 'pending' && 'text-purple-500'}
                                ${tx.status === 'cancelled' && 'text-gray-600'}`}
                              >
                                {tx.status}
                              </td>
                              <td className="border-r border-gray-300">
                                {tx.seller_name}
                              </td>
                              {tx.type === 'Purchased' ? (
                                <td
                                  className="flex justify-center mt-1.5 cursor-pointer"
                                  onClick={() => {
                                    setSelectedSale(tx);
                                    fetchTransactionsSaleItems(tx.ref_id);
                                  }}
                                >
                                  <Eye
                                    size={22}
                                    className="text-gray-600 cursor-pointer hover:text-black"
                                  />
                                </td>
                              ) : (
                                <td></td>
                              )}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={7}
                              className="text-center text-red-500 py-4 border-b border-gray-300"
                            >
                              No transactions found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* sale items  */}
            {viewMode === 'sale_items' && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    Invoice No :{' '}
                    <span className="text-gray-500 text-base">
                      {saleItems?.[0]?.invoice || 'N/A'}
                    </span>
                  </h3>

                  <button
                    onClick={() => {
                      setViewMode('transactions');
                      setSaleItems([]);
                      setSelectedSale(null);
                    }}
                    className="border px-3 py-1 rounded-lg hover:bg-gray-100"
                  >
                    ← Back
                  </button>
                </div>

                <table className="w-full border border-gray-300 text-center">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2">Product</th>
                      <th className="border p-2">Image</th>
                      <th className="border p-2">Price(unit)</th>
                      <th className="border p-2">Quantity</th>
                      <th className="border p-2">Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {saleItems.length ? (
                      saleItems.map((item, i) => (
                        <tr key={i} className="border">
                          <td className="border p-2 text-left">
                            {item.product_name}
                          </td>
                          <td className="border p-2 text-left">
                            <div className='flex justify-center'>
                              <img src={item.image} alt="Product picture" 
                              className='w-22 h-20'/>
                            </div>
                          </td>
                          <td className="border p-2">{item.price}</td>
                          <td className="border p-2">{item.quantity}</td>
                          <td className="border p-2">{item.total}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-4 text-red-500">
                          No sale items found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <div className=""></div>
    </div>
  );
}
