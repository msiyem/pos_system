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
  SquarePen,
  Store,
  Trash2,
  User,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import DateButton from '../../component/dateButton';
import DeleteCustomerButton from '../customers/deleteCustomer';
import api from '../../../api/api';
import { format } from 'date-fns';
import BackButton from '../../../ui/backButton';
import dayjs from '../../utils/days';
import InfoTable from '../../component/InfoTable';
import SummaryCard from '../../component/SummaryCard';
import DateRange from '../../component/DateRange';
import DataTable from '../../component/DataTable';
import EntriesDropdown from '../../component/EntriesDropdown';
import { set } from 'zod';
import PageLoader from '../../../ui/PageLoader';

export default function SupplierHistory() {
  const { id } = useParams();
  const [supplier, setSupplier] = useState({});
  // const customer = users.find((c) => c.id === parseInt(id));
  const [activeTab, setActiveTab] = useState('info');
  const [type, setType] = useState('All');
  const [openTypes, setOpenType] = useState(false);
  const typeRef = useRef(null);
  const [openElipse, setOpenElipse] = useState(false);
  const navigate = useNavigate();
  const supplierId = parseInt(id);

  const [viewMode, setViewMode] = useState('transactions');
  // const [specificProducts, setSpecificProducts] = useState([]);
  const [spLimit, setSpLimit] = useState(10);
  const [spPage, setSpPage] = useState(1);
  const [openSPEntries, setOpenSPEntries] = useState(false);
  const [productItems, setProductItems] = useState([]);
  const [productSummary, setProductSummary] = useState({});
  const [selectedProduct, setSelectedProduct] = useState([]);

  //transaction states
  const [transactions, setTransactions] = useState([]);
  const [transactionSummary, setTransactionSummary] = useState({});
  const [openTanEntries, setOpenTanEntries] = useState(false);
  const [tanPage, setTanPage] = useState(1);
  const [tanLimit, setTanLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const entries = [10, 25, 50, 100];
  const entriesRef = useRef(null);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [loading, setLoading] = useState(true);

  //filters
  const [startDateTan, setStartDateTan] = useState('');
  const [endDateTan, setEndDateTan] = useState('');
  const [startDateSup, setStartDateSup] = useState('');
  const [endDateSup, setEndDateSup] = useState('');

  useEffect(() => {
    function handleEntriesRef(e) {
      if (entriesRef.current && !entriesRef.current.contains(e.target)) {
        setOpenTanEntries(false);
        setOpenSPEntries(false);
      }
    }
    function handleTypeRef(e) {
      if (typeRef.current && !typeRef.current.contains(e.target)) {
        setOpenType(false);
      }
    }
    document.addEventListener('mousedown', handleEntriesRef);
    document.addEventListener('mousedown', handleTypeRef);
    return () => {
      document.removeEventListener('mousedown', handleEntriesRef);
      document.removeEventListener('mousedown', handleTypeRef);
    };
  }, [entriesRef, typeRef]);

  async function fetchSupplier() {
    try {
      const res = await api.get(`/suppliers/${supplierId}/details`);

      setSupplier(res.data.data);
      if (!res.data.success) {
        alert('Supplier not found!');
      }
    } catch (err) {
      console.log(err);
      alert('Error fetching customer details');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSupplier();
  }, [supplierId]);

  async function fetchTransactions() {
    try {
      const res = await api.get(`/suppliers/${supplierId}/transactions`, {
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

  async function fetchTransactionSummary() {
    try {
      setLoading(true);
      const res = await api.get(
        `/suppliers/${supplierId}/transactions/summary`,
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
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, [supplierId, startDateTan, endDateTan, tanPage, tanLimit, type]);

  useEffect(() => {
    fetchTransactionSummary();
  }, [supplierId, startDateTan, endDateTan]);

  async function fetchSuppliedProducts() {
    try {
      setLoading(true);
      const res = await api.get(`/suppliers/${supplierId}/products`, {
        params: {
          fromDate: startDateSup,
          toDate: endDateSup,
          page: spPage,
          limit: spLimit,
        },
      });
      setProductItems(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  async function fetchSuppliedProductsSummary() {
    try {
      setLoading(true);
      const summary = await api.get(
        `/suppliers/${supplierId}/products_summary`,
        {
          params: {
            fromDate: startDateSup,
            toDate: endDateSup,
          },
        }
      );
      setProductSummary(summary.data.data);
      // setViewMode('sale_items');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchSuppliedProducts();
  }, [supplierId, startDateSup, endDateSup, spLimit]);

    useEffect(() => {
    fetchSuppliedProductsSummary();
  }, [supplierId, startDateSup, endDateSup]);

  // if (!supplier || Object.keys(supplier).length === 0) {
  //   return <div>Loading customer data...</div>;
  // }
  async function fetchSuppliedSpecificProductHistory(product_id) {
    try {
      setLoading(true);
      const res = await api.get(
        `/suppliers/${supplierId}/supplied/${product_id}`,
        {
          params: {
            fromDate: startDateSup,
            toDate: endDateSup,
            page: 1,
            limit: 10,
          },
        }
      );
      setSelectedProduct(res.data.data);
      setViewMode('product_history');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTransactionsPurchaseItems(purchaseId) {
    try {
      setLoading(true);
      const res = await api.get(
        `/suppliers/${supplierId}/purchases/${purchaseId}/items`
      );
      setPurchaseItems(res.data.data);
      setViewMode('purchase_items');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const supplierContactRows = [
    {
      label: 'Phone:',
      icon: <Phone className="h-3.5 w-3.5" />,
      value: supplier.phone,
    },
    {
      label: 'Alternative:',
      icon: <PhoneCall className="h-3.5 w-3.5" />,
      value: supplier.alt_phone,
    },
    {
      label: 'WhatsApp:',
      icon: <MessageCircle className="h-3.5 w-3.5" />,
      value: supplier.whatsapp,
    },
    {
      label: 'Email:',
      icon: <Mail className="h-3.5 w-3.5" />,
      value: supplier.email,
    },
  ];

  const supplierAddressRows = [
    {
      label: 'Sector:',
      icon: <Building2 className="h-3.5 w-3.5" />,
      value: supplier.sector,
    },
    {
      label: 'Area:',
      icon: <MapPinned className="h-3.5 w-3.5" />,
      value: supplier.area,
    },
    {
      label: 'Post Code:',
      icon: <Mail className="h-3.5 w-3.5" />,
      value: supplier.post_code,
    },
    {
      label: 'City:',
      icon: <Building2 className="h-3.5 w-3.5" />,
      value: supplier.city,
    },
    {
      label: 'District:',
      icon: <Building2 className="h-3.5 w-3.5" />,
      value: supplier.district,
    },
    {
      label: 'Division:',
      icon: <Building2 className="h-3.5 w-3.5" />,
      value: supplier.division,
    },
  ];

  const suppliedSummary = [
    {
      title: 'Total Types',
      value: productSummary?.totalProductsSupplied || 0,
      icon: ShoppingBag,
    },
    {
      title: 'Total Quantity',
      value: productSummary?.totalQuantity || 0,
      icon: Store,
    },
    {
      title: 'Total Times',
      value: productSummary?.totalTimesPurchased || 0,
      icon: ClockFading,
    },
    {
      title: 'Total Amount (৳)',
      value: productSummary?.totalAmount || 0,
      icon: BadgeDollarSign,
    },
  ];

  const productHistoryColumns = [
    {
      label: 'NO',
      render: (_, index) => index + 1,
      width: 'w-[8ch]',
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
      key: 'price',
    },
    {
      label: 'Time',
      render: (row) => row.created_at,
    },
  ];

  const productColumns = [
    { label: 'NO', render: (_, i) => i + 1 },
    { label: 'Product', key: 'product_name' },
    {
      label: 'Product Image',
      render: (row) => <img src={row.image} className="h-16 mx-auto" />,
    },
    { label: 'Times Purchased', key: 'times_supplied' },
    { label: 'Total Quantity', key: 'total_quantity' },
    { label: 'Total Amount(Tk)', key: 'total_amount' },
    {
      label: 'Details',
      render: (row) => (
        <Eye
          className="cursor-pointer"
          onClick={() => fetchSuppliedSpecificProductHistory(row.product_id)}
        />
      ),
    },
  ];

  const summaryCards = [
    {
      title: 'Total Transactions',
      value: transactionSummary?.total_transactions,
      color: 'text-orange-500',
      type: 'All',
    },
    {
      title: 'Total Purchased',
      value: transactionSummary?.purchase_count,
      color: 'text-blue-500',
      type: 'Purchase',
    },
    {
      title: 'Total Payment',
      value: transactionSummary?.payment_count,
      color: 'text-green-500',
      type: 'Payment',
    },
    {
      title: 'Total Due Payment',
      value: transactionSummary?.duepayment_count,
      color: 'text-purple-500',
      type: 'DuePayment',
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
          ${tx.type === 'Purchase' && 'text-blue-500'}
          ${tx.type === 'Payment' && 'text-green-500'}
          ${tx.type === 'DuePayment' && 'text-purple-500'}
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
      key: 'status',
    },
    {
      label: 'Seller',
      key: 'created_by',
    },
    {
      label: 'Details',
      render: (tx) =>
        tx.type === 'Purchase' ? (
          <Eye
            size={22}
            className="text-gray-600 cursor-pointer hover:text-black"
            onClick={() => fetchTransactionsPurchaseItems(tx.ref_id)}
          />
        ) : (
          '-'
        ),
    },
  ];

  const purchaseItemsColumns = [
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
  if(loading){
    return <PageLoader/>;
  }
  return (
    <div className="min-w-[950px] max-w-[1180px] m-auto shrink-0 flex flex-col gap-5 p-5 bg-amber-50/10">
      {/* Customer Info Card */}
      <div className="flex p-6 border border-gray-300 rounded-xl shadow w-full bg-white">
        {supplier.image_url ? (
          <img
            src={supplier.image_url}
            alt="supplier profile picture"
            className="w-32 h-32 rounded-lg"
          />
        ) : (
          <div className="p-6 rounded-xl bg-[#3639e9]">
            <User className="h-10 w-10 text-white" />
          </div>
        )}

        <div className="w-full flex flex-col gap-2 ml-5">
          <div className="flex justify-between w-full">
            <div className="flex gap-3">
              <span className="text-[24px] font-bold">{supplier.name}</span>
              {supplier.verify ? (
                <div className="flex items-center bg-green-200/80 text-green-600 p-0.5 rounded-xl px-2 pr-3 gap-2 flex-shrink-0 self-center">
                  <ShieldCheck className="h-3 w-3" />
                  <span className="text-[12px] font-medium ">Verified</span>
                </div>
              ) : (
                <div className="flex items-center bg-red-200/80 text-red-600 p-0.5 rounded-xl px-2 pr-3 gap-2 flex-shrink-0 self-center">
                  <ShieldCheck className="h-3.25 w-3.25 " />
                  <span className="text-[12px] font-semibold">
                    Not Verified
                  </span>
                </div>
              )}
              <div className="flex items-center bg-gray-100 shadow text-[14px] rounded-xl px-2 pr-3 gap-2 flex-shrink-0 self-center">
                <span>Gender: {supplier.gender} </span>
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
                  <button
                    onClick={() => navigate(`/supplier/${id}/due`)}
                    className=" flex  gap-2 items-center text-rose-500 border-gray-300 m-1 p-1 text-center cursor-pointer hover:bg-gray-50 hover:shadow mt-0"
                  >
                    <BookmarkMinus className="h-4 w-4 " />
                    <span className="text-nowrap">Payable History</span>
                  </button>
                  {/* <div onClick={() => navigate(-1)} className="text-[#e51e5a]">
                    <DeleteCustomerButton
                      customerId={id}
                      onDeleted={() => fetchSupplier()}
                    />
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          <div className="text-gray-600 flex gap-6 text-[12px] sm:text-sm">
            <div
              title={supplier.created_at}
              className="flex items-center gap-2"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>
                Joined:{' '}
                {dayjs(supplier.created_at, 'DD-MM-YYYY hh:mm A').fromNow()}
              </span>
            </div>
            <div
              title={supplier.last_transition}
              className="flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              <span>
                Last Supplies:{' '}
                {dayjs(
                  supplier.last_transition,
                  'DD-MM-YYYY hh:mm A'
                ).fromNow()}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center gap-3">
            <div
              onClick={() => navigate(`/supplier/${id}/due`)}
              className=" text-[#3639e9] text-[12px] font-semibold border border-gray-300 flex items-center w-fit rounded-lg px-2 py-1 gap-1 cursor-pointer"
            >
              <BookmarkMinus className="h-3 w-3 " />
              <span>Payable: {supplier.payable}</span>
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
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1 shadow text-[#3639e9] cursor-pointer">
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

          {/* Supplied Product Tab  */}
          {activeTab === 'supplied_product' ? (
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1 shadow text-[#3639e9] cursor-pointer">
              <ShoppingBag className="h-4 w-4" />
              <span>Supplied Products</span>
            </div>
          ) : (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                setActiveTab('supplied_product');
                setViewMode('supplied');
                setStartDateSup('');
                setEndDateSup('');
              }}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Supplied Products</span>
            </div>
          )}

          {/* Transaction Tab  */}
          {activeTab === 'transition' ? (
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1 shadow text-[#3639e9] cursor-pointer">
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
            <InfoTable
              title="Contact Information :"
              rows={supplierContactRows}
            />

            <InfoTable
              title="Address Information :"
              rows={supplierAddressRows}
            />
          </div>
        )}

        {/* dropdown  Purchased Products  */}
        {activeTab === 'supplied_product' && (
          <div className="w-full  my-10 flex flex-col gap-10 px-2">
            <div className="grid grid-cols-4 gap-3 w-full ">
              {suppliedSummary.map((item, i) => (
                <SummaryCard key={i} {...item} />
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
            {viewMode === 'supplied' && (
              <div className="space-y-10">
                <div className='flex items-center'>

                  <DateRange
                  startDate={startDateSup}
                  endDate={endDateSup}
                  setStartDate={setStartDateSup}
                  setEndDate={setEndDateSup}
                />

                <EntriesDropdown 
                value={spLimit}
                onChange={setSpLimit}
                open={openSPEntries}
                setOpen={setOpenSPEntries}
                />
                </div>

                <div className="w-full border border-gray-300">
                  <div className="max-h-[800px] overflow-auto">
                    <DataTable columns={productColumns} data={productItems} />
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
                        setViewMode('supplied');
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
                    columns={productHistoryColumns}
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
            <div className="grid grid-cols-4 gap-3 w-full ">
              {summaryCards.map((card) => (
                <SummaryCard
                  key={card.type}
                  icon={ClockFading}
                  title={card.title}
                  value={card.value}
                  color={card.color}
                  active={type === card.type}
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
                <div className='flex'>
                <DateRange
                  startDate={startDateTan}
                  endDate={endDateTan}
                  setStartDate={setStartDateTan}
                  setEndDate={setEndDateTan}
                />
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
            {viewMode === 'purchase_items' && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    Invoice No :{' '}
                    <span className="text-gray-500 text-base">
                      {purchaseItems?.[0]?.invoice || 'N/A'}
                    </span>
                  </h3>

                  <button
                    onClick={() => {
                      setTimeout(() => {
                        setViewMode('transactions');
                        setPurchaseItems([]);
                      }, 350);
                    }}
                    className="border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-100 active:scale-95  focus:border-2 focus:border-blue-400 transition-all cursor-pointer"
                  >
                    ← Back
                  </button>
                </div>

                <DataTable
                  columns={purchaseItemsColumns}
                  data={purchaseItems}
                />
              </div>
            )}
          </div>
        )}

        <div className="">
          <BackButton className="cursor-pointer hover:scale-95" />
        </div>
      </div>
    </div>
  );
}
