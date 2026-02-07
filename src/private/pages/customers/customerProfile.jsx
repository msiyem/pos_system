import {
  BadgeDollarSign,
  BookmarkMinus,
  Building2,
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
  House,
  IdCard,
  Mail,
  MapPinned,
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
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router';
import DateButton from '../../component/dateButton';
import DeleteCustomerButton from './deleteCustomer';
import api from '../../../api/api';
import { format } from 'date-fns';
import useToast from '../../../toast/useToast';
import dayjs from '../../utils/days.js';
import { useAuth } from '../../../context/useAuth.jsx';
import BackButton from '../../../ui/backButton.jsx';
import InfoTable from '../../component/InfoTable.jsx';
import DataTable from '../../component/DataTable.jsx';
import DateRange from '../../component/DateRange.jsx';
import EntriesDropdown from '../../component/EntriesDropdown.jsx';
import SummaryCard from '../../component/SummaryCard.jsx';

export default function CustomerHistory() {
  const {
    fetchCustomers,
    cus_page: page,
    cus_search: search,
  } = useOutletContext();
  const { role } = useAuth();
  const { id } = useParams();
  const toast = useToast();
  const [customer, setCustomer] = useState({});
  // const customer = users.find((c) => c.id === parseInt(id));
  const [activeTab, setActiveTab] = useState('info');
  const [type, setType] = useState('All');
  const [openTypes, setOpenType] = useState(false);
  const typeRef = useRef(null);
  const [openElipse, setOpenElipse] = useState(false);
  const navigate = useNavigate();
  const customerId = parseInt(id);
  const elipseRef = useRef(null);

  //transaction states
  const [transactions, setTransactions] = useState([]);
  const [transactionSummary, setTransactionSummary] = useState(0);
  const [openTanEntries, setOpenTanEntries] = useState(false);
  const [saleItems, setSaleItems] = useState([]);
  const [selectedSale, setSelectedSale] = useState();
  const [viewMode, setViewMode] = useState('transactions');
  const [tanPage, setTanPage] = useState(1);
  const [tanLimit, setTanLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [purchasedPage, setPurchasedPage] = useState(1);
  const [purchasedLimit, setPurchasedLimit] = useState(10);
  const [openPurchasedEntrites, setOpenPurchasedEntrites] = useState(false);
  // const [totalPurchasedPages, setTotalPurchasedPage] = useState(1);
  const [productsSummary, setProductsSummary] = useState({});

  //purchased products states
  const [productItems, setProductItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);

  //filters
  const [startDateTan, setStartDateTan] = useState('');
  const [endDateTan, setEndDateTan] = useState('');
  const [startDatePsh, setStartDatePsh] = useState('');
  const [endDatePsh, setEndDatePsh] = useState('');

    useEffect(()=>{
    function handleElipseClick(e){
      if(elipseRef.current && !elipseRef.current.contains(e.target)){ 
        setOpenElipse(false);
      }
    }
    document.addEventListener('mousedown', handleElipseClick);
    return () => {
      document.removeEventListener('mousedown', handleElipseClick);
    };
  },[openElipse])

  useEffect(() => {
    function handleTypeRef(e) {
      if (typeRef.current && !typeRef.current.contains(e.target)) {
        setOpenType(false);
      }
    }

    document.addEventListener('mousedown', handleTypeRef);
    return () => {
      document.removeEventListener('mousedown', handleTypeRef);
    };
  }, [typeRef]);

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const res = await api.get(`/customers/${customerId}/details`);
        setCustomer(res.data);

        // Optional: backend response ok check
        if (!res.data) {
          toast.error('Customer not found!');
        }
      } catch (err) {
        console.log(err);
        toast.error('Error fetching customer details');
      }
    }

    fetchCustomer();
  }, [customerId]);

  async function fetchTransactions() {
    try {
      const res = await api.get(`/customers/${customerId}/transactions`, {
        params: {
          fromDate: startDateTan
            ? format(startDateTan, 'yyyy-MM-dd')
            : undefined,
          toDate: endDateTan ? format(endDateTan, 'yyyy-MM-dd') : undefined,
          type: type !== 'All' ? type : undefined,
          page: tanPage,
          limit: tanLimit,
        },
      });

      setTransactions(res.data.data);

      setTotalPages(res.data.pagination?.totalPage || 1);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchCustomerTransactionSummary() {
    try {
      const res = await api.get(
        `/customers/${customerId}/transactions/summary`,
        {
          params: {
            fromDate: startDateTan
              ? format(startDateTan, 'yyyy-MM-dd')
              : undefined,
            toDate: endDateTan ? format(endDateTan, 'yyyy-MM-dd') : undefined,
            type: 'All',
            limit: tanLimit,
          },
        }
      );

      setTransactionSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, [customerId, startDateTan, endDateTan, tanPage, tanLimit, type]);

  useEffect(() => {
    fetchCustomerTransactionSummary();
  }, [customerId, startDateTan, endDateTan]);

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
      setViewMode('sale_items');
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchPurchasedProducts() {
    try {
      const res = await api.get(`/customers/${customerId}/purchased_products`, {
        params: {
          fromDate: startDatePsh,
          toDate: endDatePsh,
          page: purchasedPage,
          limit: purchasedLimit,
        },
      });
      setProductItems(res.data.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchPurchasedProductsSummary() {
    try {
      const summary = await api.get(
        `/customers/${customerId}/products_summary`,
        {
          params: {
            fromDate: startDatePsh,
            toDate: endDatePsh,
          },
        }
      );
      setProductsSummary(summary.data.data);

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
            fromDate: startDatePsh,
            toDate: endDatePsh,
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
    fetchPurchasedProductsSummary();
  }, [customerId, startDatePsh, endDatePsh]);
  useEffect(() => {
    fetchPurchasedProducts();
  }, [customerId, startDatePsh, endDatePsh, purchasedLimit]);

  if (!customer || Object.keys(customer).length === 0) {
    return <div>Loading customer data...</div>;
  }

  const contactRows = [
    {
      label: 'Phone:',
      icon: <Phone className="h-3.5 w-3.5" />,
      value: customer.phone,
    },
    {
      label: 'Alternative:',
      icon: <PhoneCall className="h-3.5 w-3.5" />,
      value: customer.alt_phone,
    },
    {
      label: 'WhatsApp:',
      icon: <MessageCircle className="h-3.5 w-3.5" />,
      value: customer.whatsapp,
    },
    {
      label: 'Email:',
      icon: <Mail className="h-3.5 w-3.5" />,
      value: customer.email,
    },
  ];

  const addressRows = [
    {
      label: 'Sector:',
      icon: <Building2 className="h-3.5 w-3.5" />,
      value: customer.sector,
    },
    {
      label: 'Area:',
      icon: <MapPinned className="h-3.5 w-3.5" />,
      value: customer.area,
    },
    {
      label: 'Post Code:',
      icon: <Mail className="h-3.5 w-3.5" />,
      value: customer.post_code,
    },
    {
      label: 'City:',
      icon: <Building2 className="h-3.5 w-3.5" />,
      value: customer.city,
    },
    {
      label: 'District:',
      icon: <Building2 className="h-3.5 w-3.5" />,
      value: customer.district,
    },
    {
      label: 'Division:',
      icon: <Building2 className="h-3.5 w-3.5" />,
      value: customer.division,
    },
    {
      label: 'House:',
      icon: <House className="h-3.5 w-3.5" />,
      value: customer.house,
    },
  ];
  const adminRows = [
    {
      label: 'Created By',
      icon: <User className="h-3.5 w-3.5" />,
      value: customer.created_by,
    },
    {
      label: 'Updated By',
      icon: <User className="h-3.5 w-3.5" />,
      value: customer.updated_by,
    },
    {
      label: 'Updated At',
      icon: <History className="h-3.5 w-3.5" />,
      value: dayjs(customer.updated_at).fromNow(),
      title: customer.updated_at,
    },
  ];

  const transactionColumns = [
    {
      label: 'NO',
      render: (_, index) => (tanPage - 1) * tanLimit + (index + 1),
    },
    {
      label: 'Date',
      render: (tx) =>
        new Date(tx.created_at)
          .toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })
          .replaceAll('/', '-')
          .toUpperCase(),
    },
    {
      label: 'Invoice',
      key: 'reference',
    },
    {
      label: 'Type',
      render: (tx) => (
        <span
          className={`
          ${tx.type === 'Purchased' && 'text-blue-500'}
          ${tx.type === 'Payment' && 'text-green-500'}
          ${tx.type === 'DuePayment' && 'text-purple-500'}
          ${tx.type === 'Refund' && 'text-rose-600'}
        `}
        >
          {tx.type}
        </span>
      ),
    },
    {
      label: 'Amount (Tk)',
      render: (tx) => `${tx.amount}৳`,
    },
    {
      label: 'Debt (Tk)',
      render: (tx) =>
        tx.due ? <span className="text-rose-500">{tx.due}৳</span> : '-',
    },
    {
      label: 'Method',
      key: 'method',
    },
    {
      label: 'Status',
      render: (tx) => (
        <span
          className={`
          ${tx.status === 'completed' && 'text-green-500'}
          ${tx.status === 'success' && 'text-green-500'}
          ${tx.status === 'pending' && 'text-purple-500'}
          ${tx.status === 'cancelled' && 'text-gray-600'}
        `}
        >
          {tx.status}
        </span>
      ),
    },
    {
      label: 'Seller',
      key: 'seller_name',
    },
    {
      label: 'Details',
      render: (tx) =>
        tx.type === 'Purchased' ? (
          <div
            className="flex justify-center cursor-pointer"
            onClick={() => {
              setSelectedSale(tx);
              fetchTransactionsSaleItems(Number(tx.ref_id));
            }}
          >
            <Eye size={22} className="text-gray-600 hover:text-black" />
          </div>
        ) : (
          ''
        ),
    },
  ];

  const saleItemsColumns = [
    {
      label: 'Product',
      key: 'product_name',
    },
    {
      label: 'Image',
      render: (item) => (
        <div className="flex justify-center">
          <img
            src={item.image}
            alt={item.product_name}
            className="w-22 h-20 object-contain"
          />
        </div>
      ),
    },
    {
      label: 'Price (unit)',
      render: (item) => `${item.price}৳`,
    },
    {
      label: 'Quantity',
      key: 'quantity',
    },
    {
      label: 'Total',
      render: (item) => `${item.total}৳`,
    },
  ];

  const productItemsColumns = [
    {
      label: 'NO',
      render: (_, index) => index + 1,
    },
    {
      label: 'Product Name',
      key: 'product_name',
    },
    {
      label: 'Product Image',
      render: (pi) => (
        <div className="flex items-center justify-center">
          <img
            src={pi.image}
            alt={pi.product_name}
            className="h-20 w-20 object-contain"
          />
        </div>
      ),
    },
    {
      label: 'Times Purchased',
      key: 'times_purchased',
    },
    {
      label: 'Total Amount (TK)',
      render: (pi) => `${pi.total_amount}৳`,
    },
    {
      label: 'Total Quantity',
      key: 'total_quantity',
    },
    {
      label: 'Details',
      render: (pi) => (
        <div
          className="flex justify-center items-center h-full cursor-pointer"
          onClick={() => fetchPurchasedProductsHistory(pi.product_id)}
        >
          <Eye size={22} className="text-gray-600 hover:text-black" />
        </div>
      ),
    },
  ];

  const selectedProductColumns = [
    {
      label: 'NO',
      render: (_, index) => index + 1,
    },
    {
      label: 'Invoice',
      key: 'invoice',
    },
    {
      label: 'Quantity',
      key: 'quantity',
    },
    {
      label: 'Price (Tk)',
      key: 'subtotal',
    },
    {
      label: 'Time',
      key: 'created_at',
    },
  ];

  const summaryCards = [
    {
      type: 'All',
      title: 'Total Transactions',
      value: transactionSummary?.total_transactions || 0,
      color: 'text-orange-500',
      icon: ClockFading,
    },
    {
      type: 'Purchased',
      title: 'Total Purchased',
      value: transactionSummary?.purchased_count || 0,
      color: 'text-blue-500',
      icon: ClockFading,
    },
    {
      type: 'Payment',
      title: 'Total Payment',
      value: transactionSummary?.payment_count || 0,
      color: 'text-green-500',
      icon: ClockFading,
    },
    {
      type: 'DuePayment',
      title: 'Total Due Payment',
      value: transactionSummary?.duepayment_count || 0,
      color: 'text-purple-500',
      icon: ClockFading,
    },
    {
      type: 'Refund',
      title: 'Total Refund Payment',
      value: transactionSummary?.refund_count || 0,
      color: 'text-rose-500',
      icon: ClockFading,
    },
  ];

  return (
    <div className="min-w-[1000px] max-w-[1180px] m-auto shrink-0 flex flex-col gap-5 p-5 bg-amber-50/10">
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
                <div className="flex items-center  bg-green-200/80 text-green-600 p-0.5 rounded-xl px-2 pr-3 gap-2 flex-shrink-0 self-center">
                  <ShieldCheck className="h-3 w-3" />
                  <span className="text-[12px] font-medium">Verified</span>
                </div>
              ) : (
                <div className="flex items-center bg-red-200/80 text-red-600 p-0.5 rounded-xl px-2 pr-3 gap-2 flex-shrink-0 self-center">
                  <ShieldCheck className="h-3 w-3" />
                  <span className="text-[12px] font-medium ">Not Verified</span>
                </div>
              )}
              <div className="flex items-center bg-gray-100 shadow text-[14px] rounded-xl px-2 pr-3 gap-2 flex-shrink-0 self-center">
                <span>Gender: {customer.gender} </span>
              </div>
            </div>
            <div className="relative" ref={elipseRef}>
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
            <div title={customer.join_at} className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4" />
              <span>
                Joined:{' '}
                {dayjs(customer.join_at, 'DD-MM-YYYY hh:mm A').fromNow()}
              </span>
            </div>
            <div
              title={customer.last_purchased}
              className="flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              <span>
                Last Purchase:{' '}
                {dayjs(customer.last_purchased, 'DD-MM-YYYY hh:mm A').fromNow()}
              </span>
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
                setStartDatePsh('');
                setEndDatePsh('');
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
                setStartDateTan('');
                setEndDateTan('');
              }}
            >
              <History className="h-4 w-4" />
              <span>Transaction History</span>
            </div>
          )}
        </div>

        {/* dropdown info  */}
        {activeTab === 'info' && (
          <div className="my-10 w-full space-y-6">
            <InfoTable title="Contact Information :" rows={contactRows} />
            <InfoTable title="Address Information :" rows={addressRows} />

            {role === 'admin' && (
              <InfoTable title="Admin Information :" rows={adminRows} />
            )}
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
                <span className="font-bold">
                  {productsSummary?.totalProductsPurchased || 0}
                </span>
              </div>
              <div className="flex flex-col gap-2 border p-5 rounded-2xl border-gray-300  shadow-2xs shadow-blue-100 hover:scale-101">
                <Store
                  size={32}
                  className="text-green-500 shadow m-1 p-1  border rounded-lg border-gray-300"
                />
                <span className="font-semibold">Total Quantity</span>
                <span className="font-bold">
                  {productsSummary?.totalQuantity || 0}
                </span>
              </div>
              <div className="flex flex-col gap-2 border p-5 rounded-2xl border-gray-300  shadow-2xs shadow-blue-100 hover:scale-101">
                <ClockFading
                  size={32}
                  className="text-green-500 shadow m-1 p-1  border rounded-lg border-gray-300"
                />
                <span className="font-semibold">Total Times</span>
                <span className="font-bold">
                  {productsSummary?.totalTimesPurchased || 0}
                </span>
              </div>
              <div className="flex flex-col gap-2 border p-5 rounded-2xl border-gray-300  shadow-2xs shadow-blue-100 hover:scale-101">
                <BadgeDollarSign
                  size={32}
                  className="text-green-500 shadow m-1 p-1  border rounded-lg border-gray-300"
                />
                <span className="font-semibold">Total Amount(Tk)</span>
                <span className="font-bold">
                  {productsSummary?.totalAmount || 0}{' '}
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
                <div className="flex gap-16 items-center">
                  <DateRange
                    startDate={startDatePsh}
                    endDate={endDatePsh}
                    setEndDate={setEndDatePsh}
                    setStartDate={setStartDatePsh}
                  />
                  <EntriesDropdown
                    value={purchasedLimit}
                    onChange={setPurchasedLimit}
                    open={openPurchasedEntrites}
                    setOpen={setOpenPurchasedEntrites}
                  />
                </div>

                <div className="w-full border border-gray-300">
                  <div className="max-h-[800px] overflow-auto">
                    <DataTable
                      columns={productItemsColumns}
                      data={productItems}
                    />
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
                      setTimeout(() => {
                        setViewMode('purchased');
                        setSelectedProduct([]);
                      }, 350);
                    }}
                    className="border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-100 active:scale-95  focus:border-2 focus:border-blue-400 transition-all cursor-pointer"
                  >
                    ← Back
                  </button>
                </div>

                <div className="max-h-[500px] overflow-auto border border-gray-200">
                  <DataTable
                    columns={selectedProductColumns}
                    data={selectedProduct}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* dropdown  Purchased transition  */}
        {activeTab === 'transition' && (
          <div className="w-full  my-10 flex flex-col gap-10">
            <div className="grid grid-cols-5 gap-3 w-full">
              {summaryCards.map((card) => (
                <SummaryCard
                  key={card.type}
                  icon={card.icon}
                  title={card.title}
                  value={card.value}
                  color={card.color}
                  active={type === card.type || type === 'All'}
                  onClick={() => setType(card.type)}
                />
              ))}
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
                  <DateRange
                    startDate={startDateTan}
                    endDate={endDateTan}
                    setStartDate={setStartDateTan}
                    setEndDate={setEndDateTan}
                  />
                  <div className="flex flex-col gap-2">
                    <div className="font-semibold">Selected Type</div>
                    <div ref={typeRef} className="relative ">
                      <div
                        className="cursor-pointer py-0.5 flex items-center gap-2 border border-gray-300 w-fit px-5 rounded-lg shadow hover:bg-gray-50"
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

                  <EntriesDropdown
                    value={tanLimit}
                    onChange={setTanLimit}
                    open={openTanEntries}
                    setOpen={setOpenTanEntries}
                  />
                </div>

                <div className="w-full border border-gray-300">
                  <div className="max-h-[800px] overflow-auto">
                    <DataTable
                      columns={transactionColumns}
                      data={transactions}
                    />
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
                      setTimeout(() => {
                        setViewMode('transactions');
                        setSaleItems([]);
                        setSelectedSale(null);
                      }, 350);
                    }}
                    className="border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-100 active:scale-95  focus:border-2 focus:border-blue-400 transition-all cursor-pointer"
                  >
                    ← Back
                  </button>
                </div>

                <DataTable columns={saleItemsColumns} data={saleItems} />
              </div>
            )}
          </div>
        )}

        <BackButton className="w-fit" />
      </div>
    </div>
  );
}
