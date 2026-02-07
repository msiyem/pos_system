import {
  BadgeDollarSign,
  BookmarkMinus,
  Building2,
  Calendar,
  CalendarCheck,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  ChevronUp,
  ClockFading,
  CreditCard,
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
  TrendingUp,
  User,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router';
import api from '../../../api/api';
import { format } from 'date-fns';
import useToast from '../../../toast/useToast';
import dayjs from '../../utils/days.js';
import { useAuth } from '../../../context/useAuth.jsx';
import BackButton from '../../../ui/backButton.jsx';
import InfoTable from '../../component/InfoTable.jsx';
import PageLoader from '../../../ui/PageLoader.jsx';
import DateRange from '../../component/DateRange.jsx';
import SummaryCard from '../../component/SummaryCard.jsx';
import DataTable from '../../component/DataTable.jsx';
import EntriesDropdown from '../../component/EntriesDropdown.jsx';
import {
  DailyPerformanceChart,
  OrdersTrendChart,
} from '../../component/charts/PerformanceChart.jsx';
import { se } from 'date-fns/locale/se';
import { fa } from 'zod/v4/locales';

export default function UserHistory() {
  const { role } = useAuth();
  const { id } = useParams();
  const toast = useToast();
  const [user, setUser] = useState({});
  const [activeTab, setActiveTab] = useState('info');
  const navigate = useNavigate();
  const userId = parseInt(id);
  const [loading, setLoading] = useState(true);
  const [openElipse, setOpenElipse] = useState(false);
  const elipseRef = useRef(null);

  // Performance state
  const [performanceData, setPerformanceData] = useState(null);
  const [performanceLoading, setPerformanceLoading] = useState(false);
  const [startDatePerf, setStartDatePerf] = useState('');
  const [endDatePerf, setEndDatePerf] = useState('');

  // Transaction state
  const [transactions, setTransactions] = useState([]);
  const [transactionSummary, setTransactionSummary] = useState({});
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [transactionType, setTransactionType] = useState('All');
  const [tanPage, setTanPage] = useState(1);
  const [tanLimit, setTanLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [openTanEntries, setOpenTanEntries] = useState(false);
  const [startDateTan, setStartDateTan] = useState('');
  const [endDateTan, setEndDateTan] = useState('');

  // sale_items view state
  const [viewMode, setViewMode] = useState('transactions');
  const [saleItems, setSaleItems] = useState([]);


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
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/users/${userId}`);
        console.log('User data fetched:', res.data);

        if (res.data?.data) {
          setUser(res.data.data);
        } else if (res.data) {
          setUser(res.data);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || 'Failed to fetch user data'
        );
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // Fetch performance data
  async function fetchPerformanceData() {
    try {
      setPerformanceLoading(true);
      const params = {};
      if (startDatePerf) params.fromDate = format(startDatePerf, 'yyyy-MM-dd');
      if (endDatePerf) params.toDate = format(endDatePerf, 'yyyy-MM-dd');

      const res = await api.get(`/users/${userId}/performance`, { params });
      console.log('Performance data:', res.data);

      if (res.data?.data) {
        setPerformanceData(res.data.data);
      } else if (res.data) {
        setPerformanceData(res.data);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to fetch performance data'
      );
      console.error('Error fetching performance:', error);
    } finally {
      setPerformanceLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === 'performance') {
      fetchPerformanceData();
    }
  }, [activeTab, startDatePerf, endDatePerf]);

  // Fetch user transactions
  async function fetchUserTransactions() {
    try {
      setTransactionLoading(true);
      const params = {
        page: tanPage,
        limit: tanLimit,
      };
      if (startDateTan) params.fromDate = format(startDateTan, 'yyyy-MM-dd');
      if (endDateTan) params.toDate = format(endDateTan, 'yyyy-MM-dd');
      if (transactionType !== 'All') params.type = transactionType;

      const res = await api.get(`/users/${userId}/transactions`, { params });
      console.log('Transactions fetched:', res.data);

      if (res.data?.data) {
        setTransactions(res.data.data);
        setTotalPages(res.data.pagination?.totalPage || 1);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to fetch transactions'
      );
      console.error('Error fetching transactions:', error);
    } finally {
      setTransactionLoading(false);
    }
  }

  // Fetch transaction summary
  async function fetchTransactionSummary() {
    try {
      const params = {};
      if (startDateTan) params.fromDate = format(startDateTan, 'yyyy-MM-dd');
      if (endDateTan) params.toDate = format(endDateTan, 'yyyy-MM-dd');

      const res = await api.get(`/users/${userId}/summary`, { params });
      console.log('Transaction summary:', res.data);

      if (res.data?.data) {
        setTransactionSummary(res.data.data);
      } else if (res.data) {
        setTransactionSummary(res.data);
      }
    } catch (error) {
      console.error('Error fetching transaction summary:', error);
    }
  }

  useEffect(() => {
    if (activeTab === 'transaction') {
      fetchUserTransactions();
      fetchTransactionSummary();
    }
  }, [activeTab, tanPage, tanLimit, transactionType, startDateTan, endDateTan]);

  async function fetchTransactionsSaleItems(saleId, customer_id) {
    try {
      const res = await api.get(
        `/customers/${customer_id}/sales/${saleId}/items`,
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

  const contactRows = [
    {
      label: 'Username:',
      icon: <IdCard className="h-3.5 w-3.5" />,
      value: user.username || '-',
    },
    {
      label: 'Email:',
      icon: <Mail className="h-3.5 w-3.5" />,
      value: user.email || '-',
    },
    {
      label: 'Phone:',
      icon: <Phone className="h-3.5 w-3.5" />,
      value: user.phone || '-',
    },
    {
      label: 'Alt Phone:',
      icon: <PhoneCall className="h-3.5 w-3.5" />,
      value: user.alt_phone || '-',
    },
    {
      label: 'WhatsApp:',
      icon: <MessageCircle className="h-3.5 w-3.5" />,
      value: user.whatsapp || '-',
    },
    {
      label: 'Gender:',
      icon: <User className="h-3.5 w-3.5" />,
      value: user.gender || '-',
    },
    {
      label: 'Birthday:',
      icon: <Calendar className="h-3.5 w-3.5" />,
      value: user.birthday
        ? format(new Date(user.birthday), 'dd-MMM-yyyy')
        : '-',
    },
  ];

  const addressRows = [
    {
      label: 'Road:',
      icon: <MapPinned className="h-3.5 w-3.5" />,
      value: user.road || '-',
    },
    {
      label: 'Area:',
      icon: <MapPinned className="h-3.5 w-3.5" />,
      value: user.area || '-',
    },
    {
      label: 'Post Code:',
      icon: <MapPinned className="h-3.5 w-3.5" />,
      value: user.post_code || '-',
    },
    {
      label: 'City:',
      icon: <Building2 className="h-3.5 w-3.5" />,
      value: user.city || '-',
    },
    {
      label: 'District:',
      icon: <Building2 className="h-3.5 w-3.5" />,
      value: user.district || '-',
    },
    {
      label: 'Division:',
      icon: <Building2 className="h-3.5 w-3.5" />,
      value: user.division || '-',
    },
    {
      label: 'House:',
      icon: <House className="h-3.5 w-3.5" />,
      value: user.house || '-',
    },
  ];

  const adminRows = [
    {
      label: 'Role:',
      icon: <ShieldUser className="h-3.5 w-3.5" />,
      value: user.role || '-',
    },
    {
      label: 'Status:',
      icon: <Check className="h-3.5 w-3.5" />,
      value: user.status || '-',
    },
    {
      label: 'Verified:',
      icon: <ShieldCheck className="h-3.5 w-3.5" />,
      value: user.verify ? 'Yes' : 'No',
    },
    {
      label: 'Created By',
      icon: <User className="h-3.5 w-3.5" />,
      value: user.created_by_name || user.created_by,
    },
    {
      label: 'Updated By',
      icon: <User className="h-3.5 w-3.5" />,
      value: user.updated_by_name || user.updated_by,
    },
    {
      label: 'Created At',
      icon: <Calendar className="h-3.5 w-3.5" />,
      value: dayjs(user.created_at).fromNow(),
      title: user.created_at || '-',
    },
    {
      label: 'Updated At',
      icon: <History className="h-3.5 w-3.5" />,
      value: dayjs(user.updated_at).fromNow(),
      title: user.updated_at || '-',
    },
  ];

  // DataTable columns for Daily Performance
  const dailyPerformanceColumns = [
    {
      label: 'Date',
      render: (day) => format(new Date(day.day), 'dd-MMM-yyyy'),
    },
    {
      label: 'Orders',
      key: 'orders',
    },
    {
      label: 'Revenue (Tk)',
      render: (day) => (
        <span className="text-green-600 font-medium">{day.revenue}৳</span>
      ),
    },
    {
      label: 'Paid (Tk)',
      render: (day) => (
        <span className="text-blue-600 font-medium">{day.paid}৳</span>
      ),
    },
    {
      label: 'Due (Tk)',
      render: (day) => (
        <span className="text-red-600 font-medium">{day.due}৳</span>
      ),
    },
  ];

  // DataTable columns for Payment Methods
  const paymentMethodColumns = [
    {
      label: 'Payment Method',
      render: (method) => (
        <div className="flex items-center gap-2 capitalize">
          {method.payment_method === 'cash' && <ShoppingBag size={16} />}
          {method.payment_method === 'card' && <CreditCard size={16} />}
          {method.payment_method === 'due' && <BookmarkMinus size={16} />}
          <span>{method.payment_method}</span>
        </div>
      ),
    },
    {
      label: 'Orders',
      key: 'orders',
    },
    {
      label: 'Revenue (Tk)',
      render: (method) => (
        <span className="text-green-600 font-medium">{method.revenue}৳</span>
      ),
    },
  ];

  // Transaction columns
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
          className={`font-medium ${tx.type === 'Sale' && 'text-blue-500'} ${
            tx.type === 'Payment' && 'text-green-500'
          } ${tx.type === 'DuePayment' && 'text-purple-500'} ${
            tx.type === 'Refund' && 'text-rose-600'
          }`}
        >
          {tx.type}
        </span>
      ),
    },
    {
      label: 'Customer',
      key: 'customer_name',
    },
    {
      label: 'Method',
      render: (tx) => (
        <span className="capitalize font-medium">{tx.method || 'N/A'}</span>
      ),
    },
    {
      label: 'Amount (Tk)',
      render: (tx) => (
        <span className={tx.amount < 0 ? 'text-red-600' : 'text-green-600'}>
          {tx.amount}৳
        </span>
      ),
    },
    {
      label: 'Status',
      render: (tx) => (
        <span
          className={`font-medium ${
            (tx.status === 'completed' || tx.status === 'payment') &&
            'text-green-500'
          } ${tx.status === 'due_payment' && 'text-purple-500'} ${
            !tx.status && 'text-gray-500'
          }`}
        >
          {tx.status ? tx.status.replace('_', ' ') : '-'}
        </span>
      ),
    },
    {
      label: 'Details',
      render: (tx) =>
        tx.type === 'Sale' ? (
          <div
            className="flex justify-center cursor-pointer"
            onClick={() => {
              fetchTransactionsSaleItems(
                Number(tx.ref_id),
                Number(tx.customer_id)
              );
            }}
          >
            <Eye size={22} className="text-gray-600 hover:text-black" />
          </div>
        ) : (
          ''
        ),
    },
  ];

  // Transaction summary cards
  const transactionSummaryCards = [
    {
      type: 'All',
      title: 'Total Transactions',
      value: transactionSummary?.total_transactions || 0,
      color: 'text-orange-500',
      icon: ClockFading,
    },
    {
      type: 'Sale',
      title: 'Total Sales',
      value: transactionSummary?.sale_count || 0,
      color: 'text-blue-500',
      icon: ShoppingBag,
    },
    {
      type: 'Payment',
      title: 'Total Payments',
      value: transactionSummary?.payment_count || 0,
      color: 'text-green-500',
      icon: Check,
    },
    {
      type: 'DuePayment',
      title: 'Due Payments',
      value: transactionSummary?.duepayment_count || 0,
      color: 'text-purple-500',
      icon: BookmarkMinus,
    },
    {
      type: 'Refund',
      title: 'Total Refunds',
      value: transactionSummary?.refund_count || 0,
      color: 'text-rose-500',
      icon: Trash2,
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

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-w-[1000px] max-w-[1180px] m-auto shrink-0 flex flex-col gap-5 p-5 bg-amber-50/10">
      {/* User Info Card */}
      <div
        className={`flex p-6 border rounded-xl shadow w-full bg-white
        ${user.status === 'active' && 'border-green-300'}
        ${user.status === 'inactive' && 'border-purple-300'}
        ${user.status === 'banned' && 'border-red-300'}
    `}
      >
        {user.image_url ? (
          <img
            src={user.image_url}
            alt="user profile picture"
            className="w-32 h-32 rounded-lg object-cover"
          />
        ) : (
          <div className="w-32 h-32 flex items-center justify-center p-6 rounded-xl bg-[#e51e5a]">
            <User className="h-14 w-14 text-white" />
          </div>
        )}

        <div className="w-full flex flex-col gap-2 ml-5">
          <div className="flex justify-between w-full">
            <div className="flex gap-3">
              <span className="text-[24px] font-bold">{user.name}</span>
              {user.verify ? (
                <div className="flex items-center bg-green-200/80 text-green-600 p-0.5 rounded-xl px-2 pr-3 gap-2 flex-shrink-0 self-center">
                  <ShieldCheck className="h-3 w-3" />
                  <span className="text-[12px] font-medium">Verified</span>
                </div>
              ) : (
                <div className="flex items-center bg-red-200/70 text-red-600 p-0.5 rounded-xl px-2 pr-3 gap-2 flex-shrink-0 self-center">
                  <Shield className="h-3 w-3 " />
                  <span className="text-[12px] font-medium">Not Verified</span>
                </div>
              )}
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
                              openElipse
                                ? 'scale-100 opacity-100'
                                : 'scale-0 opacity-0'
                            }`}
              >
                <div className="bg-white border border-gray-300 shadow rounded-xl flex flex-col p-1">
                  <div
                    onClick={() => navigate('edit')}
                    className="flex items-center gap-2 hover:bg-gray-50 hover:shadow p-2 mx-1 py-1.5 cursor-pointer rounded-0  text-blue-600 "
                  >
                    <SquarePen className="h-4 w-4" />
                    <span className="">Edit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-10 text-gray-600 text-sm ">
            <div className="flex items-center gap-1">
              <CalendarCheck className="h-4 w-4" />
              <span>Joined: {dayjs(user.created_at).fromNow()}</span>
            </div>
            <div className="flex items-center gap-1">
              <History className="h-4 w-4" />
              <span>
                Last Login:{' '}
                {user.last_login ? dayjs(user.last_login).fromNow() : 'Never'}
              </span>
            </div>
          </div>

          <div className="">
            <span className="flex items-center gap-1 text-gray-500 text-sm">
              <ShieldUser size={16} /> Role: {user.role}
            </span>
          </div>
          <div
            className={`flex items-center p-0.5 rounded-xl mt-auto px-2 pr-3 gap-2 flex-shrink-0 self-start capitalize ${
              user.status === 'active'
                ? 'bg-green-200/80 text-green-600'
                : user.status === 'inactive'
                  ? 'bg-purple-200/80 text-purple-600'
                  : 'bg-red-200/80 text-red-600'
            }`}
          >
            <Check className="h-3 w-3" />
            <span className="text-[12px] font-medium">{user.status}</span>
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

          {/* Performance Tab */}
          {activeTab === 'performance' ? (
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1 shadow text-[#e51e5a] cursor-pointer">
              <ChartNoAxesCombined className="h-4 w-4" />
              <span>Performance</span>
            </div>
          ) : (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setActiveTab('performance')}
            >
              <ChartNoAxesCombined className="h-4 w-4" />
              <span>Performance</span>
            </div>
          )}

          {/* Transaction Tab */}
          {activeTab === 'transaction' ? (
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1 shadow text-[#e51e5a] cursor-pointer">
              <History className="h-4 w-4" />
              <span>Transaction</span>
            </div>
          ) : (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                setActiveTab('transaction');
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
              <InfoTable title="User Information :" rows={adminRows} />
            )}
          </div>
        )}

        {/* dropdown Performance  */}
        {activeTab === 'performance' && (
          <div className="my-10 w-full space-y-10 px-2">
            {/* Summary Cards */}
            {performanceData?.summary && (
              <>
                <div className="grid grid-cols-4 gap-3 w-full">
                  <SummaryCard
                    icon={ShoppingBag}
                    title="Total Orders"
                    value={performanceData.summary.orders || 0}
                    color="text-blue-500"
                  />
                  <SummaryCard
                    icon={BadgeDollarSign}
                    title="Total Revenue"
                    value={`${performanceData.summary.totalAmount || 0}৳`}
                    color="text-green-500"
                  />
                  <SummaryCard
                    icon={TrendingUp}
                    title="Avg Order Value"
                    value={`${parseFloat(performanceData.summary.avgOrderValue || 0).toFixed(2)}৳`}
                    color="text-purple-500"
                  />
                  <SummaryCard
                    icon={Store}
                    title="Items Sold"
                    value={performanceData.summary.itemsSold || 0}
                    color="text-orange-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 w-full">
                  <SummaryCard
                    icon={Check}
                    title="Total Paid"
                    value={`${performanceData.summary.totalPaid || 0}৳`}
                    color="text-green-600"
                  />
                  <SummaryCard
                    icon={BookmarkMinus}
                    title="Total Due"
                    value={`${performanceData.summary.totalDue || 0}৳`}
                    color="text-red-500"
                  />
                  <SummaryCard
                    icon={User}
                    title="Unique Customers"
                    value={performanceData.summary.uniqueCustomers || 0}
                    color="text-indigo-500"
                  />
                </div>
              </>
            )}

            {/* Date Range Filter */}
            <div className="flex gap-16">
              <DateRange
                startDate={startDatePerf}
                endDate={endDatePerf}
                setStartDate={setStartDatePerf}
                setEndDate={setEndDatePerf}
              />
            </div>

            {performanceLoading ? (
              <PageLoader />
            ) : (
              <>
                {/* Charts Section */}
                <div className="space-y-6">
                  {/* Daily Performance Chart */}
                  {performanceData?.byDay &&
                    performanceData.byDay.length > 0 && (
                      <DailyPerformanceChart data={performanceData.byDay} />
                    )}

                  {/* Orders Trend Chart */}
                  {performanceData?.byDay &&
                    performanceData.byDay.length > 0 && (
                      <OrdersTrendChart data={performanceData.byDay} />
                    )}
                </div>

                {/* Tables Section */}
                <div className="space-y-6 mt-8">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Detailed Reports
                  </h3>

                  {/* Daily Performance Table */}
                  {performanceData?.byDay &&
                    performanceData.byDay.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold">
                          Daily Performance
                        </h4>
                        <div className="w-full border border-gray-300">
                          <div className="max-h-[500px] overflow-auto">
                            <DataTable
                              columns={dailyPerformanceColumns}
                              data={performanceData.byDay}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Payment Method Table */}
                  {performanceData?.byPaymentMethod &&
                    performanceData.byPaymentMethod.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold">
                          Payment Methods
                        </h4>
                        <div className="w-full border border-gray-300">
                          <DataTable
                            columns={paymentMethodColumns}
                            data={performanceData.byPaymentMethod}
                          />
                        </div>
                      </div>
                    )}
                </div>
              </>
            )}
          </div>
        )}

        {/* dropdown Transaction  */}
        {activeTab === 'transaction' && (
          <div className="my-10 w-full space-y-10 px-2">
            {/* Summary Cards */}
            {transactionSummaryCards && (
              <div className="grid grid-cols-5 gap-3 w-full">
                {transactionSummaryCards.map((card) => (
                  <SummaryCard
                    key={card.type}
                    icon={card.icon}
                    title={card.title}
                    value={card.value}
                    color={card.color}
                    active={transactionType === card.type}
                    onClick={() => setTransactionType(card.type)}
                  />
                ))}
              </div>
            )}

            {viewMode === 'transactions' && (
              <div className="space-y-10">
                <div className="flex gap-10 items-center">
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

                {/* Transactions Table */}
                {transactionLoading ? (
                  <PageLoader />
                ) : (
                  <>
                    <div className="w-full border border-gray-300">
                      <div className="max-h-[600px] overflow-auto">
                        <DataTable
                          columns={transactionColumns}
                          data={transactions}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
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
      </div>

      <BackButton className="w-fit" />
    </div>
  );
}
