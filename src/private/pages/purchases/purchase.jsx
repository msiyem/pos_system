import {
  ArrowBigDown,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  Plus,
  Search,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import API from '../../../api/api.js';
import BackButton from '../../../ui/backButton.jsx';

export default function Purchase() {
  const [suppliers, setSuppliers] = useState(null);
  const [sup_page, setSupPage] = useState(1);
  const [sup_total, setSupTotal] = useState(0);
  const [sup_limit, setSupLimit] = useState(9);
  const [sup_search, setSupSearch] = useState('');

  const [supId, setSupId] = useState();
  const [supName, setSupName] = useState('');
  const [supPhn, setSupPhn] = useState('');
  const [supAddr, setSupAddr] = useState('');
  const [openSup, setOpenSup] = useState(false);

  const [products, setProducts] = useState([]);
  const [pd_page, setPdPage] = useState(1);
  const [pd_total, setPdTotal] = useState(0);
  const [pd_limit, setPdLimit] = useState(9);
  const [pd_search, setPbSearch] = useState('');
  const [items, setItems] = useState([]);

  const [total_amount, setTotalAmount] = useState(0);
  const [openPd, setOpenPd] = useState(false);

  const supRef = useRef(null);
  const PdRef = useRef(null);

  const navigate = useNavigate();

  async function fetchProducts() {
    try {
      const res = await API.get('/products', {
        params: {
          page: pd_page,
          limit: pd_limit,
          search: pd_search,
        },
      });
      setProducts(res.data.data);
      setPdPage(res.data.page);
      setPdTotal(res.data.total);
    } catch (err) {
      console.log(err);
      alert('Error fetching products data.');
    }
  }

  async function fetchSupplier() {
    try {
      const res = await API.get(`/suppliers`, {
        params: {
          page: sup_page,
          limit: sup_limit,
          search: sup_search,
        },
      });
      setSupTotal(res.data.total);
      setSupPage(res.data.page);
      setSuppliers(res.data.data);
    } catch (err) {
      console.log(err);
      alert('Error fetching supplier data');
    }
  }

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSupplier();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [sup_page, sup_search, sup_limit]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [pd_search, pd_page, pd_limit]);

  const handleSupSearch = (e) => {
    setSupSearch(e.target.value);
    setSupPage(1);
    setOpenSup(true);
  };
  const handleProductSearch = (e) => {
    setPbSearch(e.target.value);
    setPdPage(1);
    setOpenPd(true);
  };

  const handleAddProduct = (item) => {
    const newItem = {
      product_id: item.id,
      name: item.name,
      sku: item.sku,
      price: item.price,
      quantity: 1,
      image_url: item.image_url,
    };
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((p) => p.product_id == item.id);
      if (existingIndex !== -1) {
        return prevItems.map((p, index) =>
          index == existingIndex
            ? {
                ...p,
                quantity: p.quantity + 1,
              }
            : p
        );
      } else {
        return [...prevItems, newItem];
      }
    });
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (PdRef.current && !PdRef.current.contains(e.target)) {
        setOpenPd(false);
      }
      if (supRef.current && !supRef.current.contains(e.target)) {
        setOpenSup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const total = items.reduce((sum, item) => {
      return (
        sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)
      );
    }, 0);
    setTotalAmount(total);
  }, [items]);

  async function handleSubmitPurchase(e) {
    e.preventDefault();

    if (!supId) {
      alert('Please Select Supplier!');
      return;
    }
    if (items.length === 0) {
      alert('Please Select Product!');
      return;
    }
    try {
      const res = await API.post('/purchase', {
        supplier_id: supId,
        items: items,
        total_amount: total_amount,
      });
      alert('Purchase Completed! Invoice N0: ' + res.data.purchase_id);
      setItems([]);
      setSupId(null);
    } catch (err) {
      console.log(err);
      alert('Purchase Failed!');
    }
  }
  const handleRemoveItem = (index) => {
    const updateItems = items.filter((_, i) => i !== index);
    setItems(updateItems);
  };

  return (
    <div className=" bg-gray-50 w-full min-h-dvh px-[3%] overflow-auto">
      <div className="w-full px-3  min-w-[820px] from-sky-100 to-cyan-100 bg-gradient-to-r  min-h-dvh rounded-xl flex flex-col border  border-gray-300 ">
        <div className="text-center text-[32px] font-serif font-semibold my-10 mt-5">
          Purchase Product & Stock Update
        </div>
        <form
          className="w-full flex flex-col gap-5"
          onSubmit={handleSubmitPurchase}
        >
          <div className=" w-full flex gap-2 justify-between font-semibold text-[16px]">
            <div className=" text-[18px] mt-1 flex gap-2 ">
              Supplier <span className="text-red-500"> * </span>:{' '}
            </div>
            <div className="w-[70%] relative ">
              {/* supplier select  */}
              <div className="flex items-center font-normal gap-2 border rounded-xl border-gray-300 hover:border-gray-400 p-1.5 px-3 bg-white">
                <Search className="w-4.5 h-4.5 text-gray-400" />
                <input
                  type="text"
                  onChange={handleSupSearch}
                  onClick={() => setOpenSup(true)}
                  value={sup_search}
                  placeholder="Search Supplier name or phone..."
                  className=" w-full border-gray-300 outline-0"
                />
                {openSup ? (
                  <ChevronUp
                    onClick={() => setOpenSup(false)}
                    className=" w-6 h-6 cursor-pointer font-normal"
                  />
                ) : (
                  <ChevronDown
                    onClick={() => setOpenSup(true)}
                    className=" w-6 h-6 cursor-pointer font-normal"
                  />
                )}
              </div>
              {/* dropdown supplier */}
              {sup_search.length > 0 && suppliers && openSup && (
                <div
                  ref={supRef}
                  className="absolute z-50 mt-3 bg-white w-full max-h-[400px] p-1 sm:p-2 ring-0 rounded-xl text-sm sm:text-base"
                >
                  <div className="px-2 bg-blue-200 border flex">
                    <span className="w-[40%]">Name</span>
                    <span className="w-[30%]">Mobile</span>
                    <span className="w- pl-1">Address</span>
                  </div>

                  {suppliers.length > 0 ? (
                    suppliers.map((sup) => (
                      <div
                        key={sup.id}
                        onClick={() => {
                          setSupName(sup.name);
                          setSupId(parseInt(sup.id));
                          setSupPhn(sup.phone);
                          setSupAddr(sup.district);
                          setSupSearch('');
                          setOpenSup(false);
                        }}
                        className="flex w-full px-2 hover:bg-blue-200 border-b border-x cursor-pointer"
                      >
                        <span className="w-[35%]">{sup.name}</span>
                        <span className="w-[30%]">{sup.phone}</span>
                        <span className="pl-2">{sup.district}</span>
                      </div>
                    ))
                  ) : (
                    <div className="px-2 py-2 text-center text-red-500">
                      No Supplier Found
                    </div>
                  )}
                </div>
              )}
            </div>
            <span className=" mt-1 font-semibold">OR</span>
            <button
              type="button"
              className="border w-[20%] flex items-center justify-center  rounded-lg shadow from-blue-500 to-blue-800 bg-gradient-to-r hover:bg-gradient-to-b text-white cursor-pointer"
              onClick={() => navigate('/supplier/add')}
            >
              <Plus className="w-4 h-4" />
              <span className="px-1">Add Supplier</span>
            </button>
          </div>
          {supName ? (
            <div className="font-semibold flex justify-between">
              <div className="flex gap-2 items-center ">
                <span className="flex gap-2">
                  Name <span className="text-red-500">*</span>
                  :
                </span>
                <span className="font-normal border-gray-200 bg-white/60  border p-1 px-2 rounded-xl">
                  {supName}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="flex gap-2">
                  Address <span className="text-red-500">*</span>:
                </span>
                <span className="font-normal  border-gray-200 bg-white/60 border p-1 pz-2 rounded-xl">
                  {supAddr}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="flex gap-2">
                  Phone <span className="text-red-500">*</span>:
                </span>
                <span className="font-normal  border-gray-200 bg-white/60  border p-1 px- rounded-xl">
                  {supPhn}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-red-400 px-5 text-center ">
              Please Select Supplier first *
            </div>
          )}

          {/* product items  */}
          <div className=" w-full flex gap-2 justify-between font-semibold text-[16px]">
            <div className=" text-[18px] mt-1 flex gap-2 ">
              Product <span className="text-red-500"> * </span>:{' '}
            </div>
            <div className="w-[70%] relative ">
              {/* supplier select  */}
              <div className="flex items-center gap-2 border rounded-xl bg-white border-gray-200 hover:border-gray-400  p-1.5 px-2">
                <Search className="w-4.5 h-4.5 text-gray-400" />
                <input
                  type="text"
                  onChange={handleProductSearch}
                  onClick={() => setOpenPd(true)}
                  value={pd_search}
                  placeholder="Search products name or sku . . ."
                  className=" w-full border-gray-300 outline-0  text-base font-normal"
                />
                {openPd ? (
                  <ChevronUp
                    onClick={() => setOpenPd(false)}
                    className=" w-10 h-6 cursor-pointer hover:text-red-600"
                  />
                ) : (
                  <ChevronDown
                    onClick={() => setOpenPd(true)}
                    className=" w-10 h-6 cursor-pointer hover:text-blue-700"
                  />
                )}
              </div>
              {/* dropdown product items   */}
              {pd_search.length > 0 && products && openPd && (
                <div
                  ref={PdRef}
                  className="absolute z-50 mt-3 bg-white w-full max-h-[450px] p-1 sm:p-2 ring-1 ring-gray-300 rounded-xl text-sm sm:text-base overflow-auto"
                >
                  <div className="px-2 bg-blue-200 border flex">
                    <span className="w-[50%] border-r text-center">Name</span>
                    <span className="w-[15%] text-center border-r">SKU</span>
                    <span className="w-[35%] text-center">Image</span>
                  </div>

                  {products.length > 0 ? (
                    products.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          handleAddProduct(item);
                          // setPbSearch('');
                          // setOpenPd(false);
                        }}
                        className="flex justify-between w-full px-2 hover:bg-blue-200 border-b border-x cursor-pointer"
                      >
                        <span className="w-[50%] border-r text-center">
                          {item.name}
                        </span>
                        <span className="w-[15%] border-r text-center">
                          {item.sku}
                        </span>
                        {/* <span className="pl-2">{item.address}</span> */}
                        <span className="w-[35%] flex justify-center items-center">
                          <img
                            src={item.image_url}
                            alt="product image"
                            className="ring-1 ring-gray-300 shadow-2xl rounded-full w-25 h-25 m-2"
                          />
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="px-2 py-2 text-center text-red-500">
                      No Products Found
                    </div>
                  )}
                </div>
              )}
            </div>
            <span className="text-gray-700 mt-1 font-semibold">OR</span>
            <button
              type="button"
              className="border w-[20%] flex items-center justify-center rounded-lg shadow from-blue-500 to-blue-800 bg-gradient-to-r hover:bg-gradient-to-b text-white cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                navigate('/product/add');
              }}
            >
              <Plus className="w-4 h-4" />
              <span className="px-1">Add Product</span>
            </button>
          </div>

          {items.length ? (
            <div className="font-semibold w-full ">
              <div className="text-[20px]  my-3 text-center">
                <span className="border from-gray-50  bg-gradient-to-t border-black rounded-2xl px-2">
                  - - - Purchase Products List - - -
                </span>
              </div>
              <div className="px-2 bg-blue-200 border flex full">
                <span className="w-[8%] border-r text-center">Serial NO</span>
                <span className="w-[30%] border-r  flex justify-center items-center">
                  Name
                </span>
                <span className="w-[10%] flex justify-center items-center border-r">
                  SKU
                </span>
                <span className="w-[15%] border-r text-center">
                  Purchase Price (unit)
                </span>
                <span className="w-[15%] border-r flex justify-center items-center">
                  Quantity
                </span>
                <span className="w-[22%] flex justify-center items-center">
                  Image
                </span>
              </div>
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between w-full px-2  border-b border-x "
                >
                  <span className="w-[8%] border-r flex justify-center items-center">
                    {index + 1}
                  </span>
                  <span className="w-[30%] border-r pl-1  flex justify-center items-center">
                    {item.name}
                  </span>
                  <span className="w-[10%] pl-1 flex justify-center items-center border-r">
                    {item.sku}
                  </span>
                  <span className="w-[15%] border-r flex justify-center items-center">
                    <input
                      type="text"
                      min={0}
                      value={parseFloat(item.price) || 0.0}
                      onChange={(e) =>
                        handleItemChange(index, 'price', e.target.value)
                      }
                      className="border w-full outline-0 mx-2 rounded-lg border-gray-300 bg-white text-center"
                    />
                  </span>
                  <span className="w-[15%] border-r flex justify-center items-center">
                    <input
                      type="text"
                      min={1}
                      value={parseInt(item.quantity) || 0}
                      onChange={(e) =>
                        handleItemChange(index, 'quantity', e.target.value)
                      }
                      className="border w-full outline-0 mx-2 border-gray-300 bg-white rounded-lg text-center"
                    />
                  </span>
                  <span className="w-[22%] flex justify-around items-center">
                    <img
                      src={item.image_url}
                      alt="product image"
                      className="ring-1 ring-gray-300 shadow-2xl rounded-full w-20 h-20 m-2"
                    />
                    <X
                      className="text-red-600 h-7 w-7 cursor-pointer ring rounded-full bg-white"
                      onClick={() => handleRemoveItem(index)}
                    />
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-red-400  px-5 text-center ">
              Please Select Products first *
            </div>
          )}
          <div className="flex gap-2 items-baseline">
            <span className="text-[20px] font-semibold">
              Total Purchase Amount :
            </span>{' '}
            <span>
              {total_amount}
              <span className="ml-1 font-mono text-[12px]">৳</span>
            </span>
          </div>
          <div className="w-full flex justify-between px-2 ">
            <div
              onClick={(e) => e.preventDefault()}
              className="text-blue-700/80 hover:text-blue-700 hover:scale-105"
            >
              <BackButton />
            </div>
            <button
              type="submit"
              className="rounded-lg shadow from-blue-500 px-4 py-2 to-blue-800 bg-gradient-to-r hover:bg-gradient-to-b text-white mt-5 cursor-pointer"
            >
              Confirm Purchase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
