import { History, ShoppingCart, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import api from '../../../api/api';
import useToast from '../../../toast/useToast';
import PointItems from '../../../ui/point_items';
import {useCart} from '../../cart/useCart.jsx';

export default function ShoppingCard({
  customers = [],
  cus_search = '',
  fetchCustomers = () => {},
  fetchProducts = () => {},
  setSearch = () => {},
  cus_total = 0,
}) {
  const [openShoppingCart, setOpenShoppingCart] = useState(false);
  const shoppingCartRef = useRef(null);
  const cusRef = useRef(null);

  const [openCus, setOpenCus] = useState(true);
  const [cusName, setcusName] = useState('');
  const [cusDebt, setCusDebt] = useState(0.0);
  const [cusId, setCusId] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [paid_amount, setPaidAmount] = useState(0);

  const [paymentMethod, setPaymentMethod] = useState('cash');
  const toast = useToast();
  const { cart, setCart, clearCart } = useCart();

  const updateQty = (id, newCount) => {
    if (newCount < 0) return;
    setCart((pre) =>
      pre.map((item) => (item.id === id ? { ...item, count: newCount } : item))
    );
  };

  const removeItem = (id) => {
    setCart((pre) => pre.filter((item) => item.id !== id));
  };

  const handleSearchChange = (e) => {
    setOpenCus(true);
    setSearch(e.target.value);
    fetchCustomers(1, e.target.value);
  };

  // Total calculation
  const subtotal = Number(
    cart.reduce((sum, item) => sum + Number(item.price) * Number(item.count), 0)
  );

  const handleDiscountChange = (e) => {
    let count = parseFloat(e.target.value) || 0;
    if (count > subtotal) count = subtotal;
    setDiscount(count);
  };

  useEffect(() => {
    function handleShoppingCard(e) {
      if (
        shoppingCartRef.current &&
        !shoppingCartRef.current.contains(e.target)
      ) {
        setOpenShoppingCart(false);
      }
    }
    document.addEventListener('mousedown', handleShoppingCard);
    return () => document.removeEventListener('mousedown', handleShoppingCard);
  }, [openShoppingCart]);

  // Convert cart items for API request
  const itemsData = cart.map((item) => ({
    product_id: item.id,
    quantity: item.count,
    price: item.price,
  }));

  const total = Number(subtotal) - Number(discount);

  const handlePaidChange = (e) => {
    let value = Number(e.target.value) || 0;
    if (paymentMethod === 'due') value = 0;
    const paymentlimit = total;
    if (value > paymentlimit) value = paymentlimit;
    setPaidAmount(value);
  };

  // const handleSavePending = async () => {
  //   if (cart.length === 0) return toast.error('Cart Empty!');

  //   try {
  //     await api.post('/sales/pending', {
  //       customer_id: cusId,
  //       items: itemsData,
  //       subtotal,
  //       discount,
  //       total_amount: total,
  //     });

  //     toast.success('Saved as pending');
  //     clearCart();
  //   } catch (err) {
  //     console.error(err);
  //     toast.error('pending save failed!');
  //   }
  // };

  // Confirm Sale (Submit data to backend)
  const handleCheckout = async () => {
    if (!cusId && paid_amount < total) {
      return toast.error('Guest must pay full amount!', 3500);
    }

    if (cart.length === 0 && paid_amount > 0) {
      return toast.error('Cart in Empty', 3500);
    }

    try {
      const res = await api.post('/sales/checkout', {
        customer_id: cusId,
        items: itemsData,
        subtotal,
        tax: 0,
        discount,
        total_amount: total,
        paid_amount: paid_amount,
        payment_method: paymentMethod,
      });

      toast.success(res.data.message, 4000);
      clearCart();
      setcusName('');
      setPaidAmount(0);
      setCusDebt(0);
      setDiscount(0);
      fetchProducts();
    } catch (err) {
      console.error(err);
      console.error('ERR ===>', err.response?.data);
      toast.error('Checkout failed!');
    }
  };

  // const totalItems = cart.reduce((s, i) => s + i.count, 0);

  return (
    <div ref={shoppingCartRef}>
      <div className="relative rounded-xl flex items-center justify-center border border-gray-200 bg-gray-50 shadow-white">
        <button
          onClick={() => setOpenShoppingCart(!openShoppingCart)}
          className="relative flex h-10 w-10  right-0 rounded-full justify-center items-center cursor-pointer"
        >
          <ShoppingCart className="h-5 w-5  cursor-pointer text-red-500" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-0 bg-red-600/75 hover:bg-red-600 text-white text-[10px] ring-0 rounded-full flex items-center justify-center px-1">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      <div
        className={`fixed right-0 z-50 shadow-2xl min-h-150  transform transition-transform duration-300 ease-out ${
          openShoppingCart ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '4.00rem', height: 'calc(100vh - 4.26rem)' }}
      >
        <div className="bg-rose-50 p-3 w-[350px] sm:w-[400px] flex flex-col gap-5 h-full  border border-gray-300 shadow overflow-auto">
          {/* Header */}
          <div className="flex justify-between w-full">
            <p className="text-[24px] sm:text-[28px] font-semibold">
              Shopping Cart
            </p>
            <button
              onClick={() => setOpenShoppingCart(false)}
              className="flex items-center h-[25px] w-[25px] cursor-pointer"
            >
              <X />
            </button>
          </div>

          {/* Customer Search */}
          <div className="relative w-full">
            <div className="my-4">
              <input
                type="text"
                value={cus_search}
                onChange={handleSearchChange}
                placeholder="Search customer..."
                className=" border w-full rounded-lg border-gray-300 outline-0 focus:border-gray-400  p-1 px-2 hover:shadow"
              />
            </div>

            {/* Customer dropdown */}
            {cus_search.length > 0 && cus_total && openCus ? (
              <div
                ref={cusRef}
                className="absolute z-50 bg-white w-full max-h-[400px] p-1 sm:p-2 border rounded-lg overflow-y-scroll text-sm sm:text-base"
              >
                <div className="px-2 bg-blue-200 border flex ">
                  <span className="w-[40%]">Name</span>
                  <span className="w-[30%]">Mobile</span>
                  <span className="w- pl-1">Address</span>
                </div>
                {customers.map((cus) => (
                  <div
                    key={cus.id}
                    onClick={() => {
                      setcusName(cus.name);
                      setCusDebt(parseFloat(cus.debt));
                      setCusId(parseInt(cus.id));
                      setSearch('');
                      setOpenCus(false);
                    }}
                    className="flex px-2 hover:bg-blue-200 border-b cursor-pointer"
                  >
                    <span className="w-[40%]">{cus.name}</span>
                    <span className="w-fit">{cus.phone}</span>
                    <span className="w-fit pl-2 ">{cus.city}</span>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {cusName ? (
                  <div className="px-2 flex justify-between border-b py-2">
                    <span>Name: {cusName}</span>
                    <span>
                      Debt: {cusDebt}{' '}
                      <span className="font-mono text-[12px]">৳</span>
                    </span>
                  </div>
                ) : (
                  <div className="px-2 border text-red-500 text-center">
                    Guest Sale (No previous due)
                  </div>
                )}
              </>
            )}
          </div>

          {/* Items */}
          {cart.length != 0 && (
            <div className="flex flex-col gap-2 py-2 px-1 min-h-[300px] max-h-[500px] w-full overflow-auto">
              {cart.map((item) => (
                <PointItems
                  key={item.id}
                  id={item.id}
                  stock={item.stock}
                  name={item.name}
                  price={item.price}
                  count={item.count}
                  onUpdate={updateQty}
                  onDelete={removeItem}
                />
              ))}
            </div>
          )}

          {/* Totals */}
          <div className="m-auto w-full">
            <div className="flex justify-between p-3 border-t border-gray-400">
              <span className="sm:text-lg font-semibold">Subtotal</span>
              <span className="sm:text-lg font-semibold">
                {subtotal.toFixed(2)} <span className="text-sm">৳</span>
              </span>
            </div>

            {/* discount method  */}
            {cart.length != 0 && (
              <div className="flex justify-between px-3 border-t border-gray-400 py-3 p">
                <span className="sm:text-lg font-semibold ">Discount</span>
                <div className="w-fit">
                  <input
                    value={discount}
                    onChange={handleDiscountChange}
                    type="text"
                    min="0"
                    className="outline-0 pl-5 border border-gray-400 rounded-lg"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between p-3 border-t border-gray-400">
              <span className="sm:text-lg font-semibold">Total</span>
              <span className="sm:text-lg font-semibold">
                {total.toFixed(2)} <span className="text-sm">৳</span>
              </span>
            </div>

            {/* Payment Method */}
            <div className="flex justify-between p-3 border-b">
              <span>Payment Method</span>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="border px-2 rounded-md"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="bkash">Bkash</option>
                <option value="nagad">Nagad</option>
                <option value="due">Due</option>
              </select>
            </div>

            {paymentMethod !== 'due' && (
              <div className="flex justify-between px-3 border-t border-gray-400 py-3 p">
                <span className="sm:text-lg font-semibold ">Amount Paid </span>
                <div className="w-fit">
                  <input
                    value={paid_amount}
                    onChange={handlePaidChange}
                    type="text"
                    min="0"
                    className="outline-0 pl-5 border border-gray-400 rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Confirm Button */}
            <div className="flex justify-end p-3">
              {/* <button
                onClick={handleSavePending}
                className="flex items-center gap-2 p-2 px-4 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              >
                <History size={16}/>
                Hold
              </button> */}

              <button
                onClick={handleCheckout}
                className="p-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
