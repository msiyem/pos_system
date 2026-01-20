import { CircleDollarSign, ClockFading, Eye, User } from 'lucide-react';
import { useParams } from 'react-router';
import api from '../../../api/api';
import { useEffect, useState } from 'react';
import useToast from '../../../toast/useToast';
import BackButton from '../../../ui/backButton';

export default function SupplierPayable() {
  const { id } = useParams();
  const supplier_id = Number(id);
  const toast = useToast();

  const [dueData, setDueData] = useState([]);
  const [totalTimes, setTotalTimes] = useState(0);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [viewMode, setViewMode] = useState('due_details');
  const [paid, setPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [supplier, setSupplier] = useState(null);

  /* ---------------- Supplier Info ---------------- */
  useEffect(() => {
    async function fetchSupplier() {
      try {
        const res = await api.get(`/suppliers/${id}/details`);
        setSupplier(res.data.data);

        if (!res.data) {
          toast.error('Supplier not found!');
        }
      } catch (err) {
        console.log(err);
        toast.error('Error fetching supplier details');
      }
    }

    fetchSupplier();
  }, [id]);

  /* ---------------- Due Details ---------------- */
  const fetchSupplierDueDetails = async () => {
    try {
      const res = await api.get(`/suppliers/${supplier_id}/dues`);
      setDueData(res.data.data);
      setTotalTimes(res.data.total);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSupplierDueDetails();
  }, [supplier_id]);

  /* ---------------- Purchase Items ---------------- */
  async function fetchPurchaseItems(purchase_id) {
    try {
      const res = await api.get(
        `/suppliers/${supplier_id}/purchases/${purchase_id}/items`
      );
      console.log(res.data.data);
      setPurchaseItems(res.data.data);
      setViewMode('purchase_items');
    } catch (err) {
      console.error(err);
    }
  }

  /* ---------------- Pay Due ---------------- */
  const handleDuePayment = async () => {
    if (!paid || Number(paid) <= 0) {
      return toast.error('Enter valid payment amount');
    }

    if (Number(paid) > Number(dueData[0]?.total_due || 0)) {
      return toast.error('Payment exceeds total due');
    }

    try {
      const result = await api.post(`/suppliers/${supplier_id}/due-payment`, {
        method: paymentMethod,
        amount: Number(paid),
      });

      toast.success(result.data.message);
      setPaid('');
      fetchSupplierDueDetails();
    } catch (err) {
      console.error(err);
      toast.error('Payment failed');
    }
  };

  return (
    <div className="flex justify-center h-dvh w-full min-w-[900px] overflow-auto bg-gray-50 p-4">
      <div className="@container h-full w-full border rounded-2xl border-gray-300 p-4 space-y-10 max-w-[1120px] bg-blue-50/50">
        <h1 className="font-serif text-center text-[24px] font-semibold">
          Supplier Payable History & Payment
        </h1>

        {/* Summary */}
        <div className="flex gap-10  w-full ">
          <div className="flex flex-col gap-2 border border-gray-200 rounded-xl p-3 w-[30%] bg-white shadow">
            <User size={22} className="text-green-500 ring rounded-full" />
            <span className="font-medium text-[16px]">Supplier</span>
            <span className="text-green-800 font-bold text-[18px]">
              {supplier?.name}
            </span>
          </div>
          <div className="flex flex-col gap-2 border border-gray-200 rounded-xl p-3 w-[30%] bg-white shadow">
            <CircleDollarSign size={24} className="text-rose-400" />
            <span className="font-medium text-[16px]">Total Payable(Tk)</span>
            <span className="text-rose-500 font-bold text-[18px]">
              {dueData[0]?.total_due || 0}
              <span className="font-extrabold text-sm"> ৳</span>
            </span>
          </div>
          <div className="flex flex-col gap-2 border border-gray-200 rounded-xl p-3 w-[30%] bg-white shadow">
            <ClockFading size={24} className="text-purple-400" />
            <span className="font-medium text-[16px]">Total Times</span>
            <span className="text-purple-500 font-bold text-[18px]">
              {totalTimes || 0}
            </span>
          </div>
        </div>

        {/* Payment */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="due_payment" className="font-semibold">
              Payment Amount (Tk)
            </label>
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*"
              min="0"
              value={paid}
              placeholder="Enter amount"
              className="border rounded-lg px-3 py-2 text-base outline-0"
              onChange={(e) => {
                const v = e.target.value;
                if (!/^\d*\.?\d*$/.test(v)) return;
                const max = Number(dueData[0]?.total_due || 0);
                setPaid(Number(v) > max ? String(max) : v);
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-semibold">Payment Method</span>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="border p-2 rounded-md outline-0"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="bkash">Bkash</option>
              <option value="nagad">Nagad</option>
            </select>
          </div>

          <button
            onClick={handleDuePayment}
            className="bg-green-600
            text-white mt-8
            px-5 py-2
            rounded-lg
            hover:bg-green-700
            active:scale-95
            transition"
          >
            Save
          </button>
        </div>

        {/* Due List */}
        {viewMode === 'due_details' && (
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-50 sticky top-0 w-full border border-gray-300">
              <tr className="border-b border-gray-300 font-medium">
                <th className="px-4 py-2 border-r border-gray-300 ">NO</th>
                <th className="border-r border-gray-300">Invoice</th>
                <th className="border-r border-gray-300">Total(Tk)</th>
                <th className="border-r border-gray-300">Paid(Tk)</th>
                <th className="border-r border-gray-300">Due(TK)</th>
                <th className="border-r border-gray-300">Method</th>
                <th className="border-r border-gray-300">Seller</th>
                <th className="border-r border-gray-300">Time</th>

                <th>Details</th>
              </tr>
            </thead>
            <tbody className="border-l border-r text-center border-gray-300 bg-white">
              {dueData.length ? (
                dueData.map((d, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-300 text-center"
                  >
                    <th className="py-2 border-r border-gray-300">
                      {index + 1}
                    </th>

                    <td className="border-r border-gray-300 px-1">
                      {d?.invoice}
                    </td>
                    <td className="border-r border-gray-300">
                      {d.total_amount}৳
                    </td>
                    <td className="border-r border-gray-300">
                      {d.paid_amount}৳
                    </td>

                    <td className="border-r border-gray-300 text-rose-500">
                      {d.due_amount > 0 ? `${d.due_amount}৳` : '-'}
                    </td>
                    <td className="border-r border-gray-300">{d.method}</td>
                    <td className="border-r border-gray-300">{d.seller}</td>
                    <td className="border-r border-gray-300">{d.created_at}</td>
                    <td
                      className="border-r border-gray-300"
                      onClick={() => {
                        fetchPurchaseItems(d.purchase_id);
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
                    colSpan={9}
                    className="text-center text-red-500 py-4 border-b border-gray-300"
                  >
                    No dues found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Purchase Items */}
        {viewMode === 'purchase_items' && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Invoice No :{' '}
                <span className="text-gray-500 text-base">
                  {purchaseItems[0]?.invoice || 'N/A'}
                </span>
              </h3>

              <button
                onClick={() => {
                  setViewMode('due_details');
                  setPurchaseItems([]);
                }}
                className="border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-100 active:ring-2 ring-blue-500 cursor-pointer hover:scale-105"
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
                {purchaseItems.length ? (
                  purchaseItems.map((item, i) => (
                    <tr key={i} className="border">
                      <td className="border p-2 text-left">
                        {item.product_name}
                      </td>
                      <td className="border p-2 text-left">
                        <div className="flex justify-center">
                          <img
                            src={item.image}
                            alt="Product picture"
                            className="w-22 h-20"
                          />
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
                      No purchase items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <BackButton />
      </div>
    </div>
  );
}
