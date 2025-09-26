import Product from '../ui/productCard';
import Nano from '../assets/products/Anker-Nano-30W-USB-C-Adapter-iPhone-15-Series-A2337-1.webp';
import GoPlay1 from '../assets/products/Baseus-GoPlay-1-Max-3.5mm-Jack-Gaming-Wired-Headphone-1.png';
import EQ17 from '../assets/products/Hoco-EQ17-ANCENC-TWS-1.png';
import J101B from '../assets/products/Hoco-J101B-22.5W-30000mAh-Fast-Charging-Power-Bank-600x600.webp';
import Q39 from '../assets/products/Hoco-Q39-Eminete-22.5WPD20W-20000mAh-Power-Bank-600x600.webp';
import Y31 from '../assets/products/Hoco-Y31-Bluetooth-Calling-Smart-Watch-1-250x250.webp';
import M196 from '../assets/products/Logitech-M196-Bluetooth-Mouse-1-250x250.png';
import OSW from '../assets/products/Oraimo-Watch-5R-OSW-820-Smart-Watch-1-250x250.webp';
import Planet from '../assets/products/Planet-Wireless-Smart-Charger-Alarm-Clock-Bluetooth-Speaker-1-500x500.jpg';
import C500 from '../assets/products/Xiaomi-C500-Pro-Smart-Camera-600x600.webp';
import Pagination from '../ui/pagination';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { ShoppingCart } from 'lucide-react';
import ShoppingCard from '../component/shoppingCard';

export default function Products() {
  const navigate = useNavigate();
  const items = [
    {
      id: 1,
      image: Nano,
      title: 'Anker Nano 30W USB-C Adapter',
      type: 'Charger',
      price: 299,
      quantity: 25,
    },
    {
      id: 2,
      image: GoPlay1,
      title: 'Baseus GoPlay-1 Max-3.5mm Jack Gaming Wired Headphone',
      type: 'HeadPhone',
      price: 399,
      quantity: 0,
    },
    {
      id: 3,
      image: EQ17,
      title: 'Hoco EQ17 ANCENC TWS',
      type: 'TWS',
      price: 499,
      quantity: 30,
    },
    {
      id: 4,
      image: J101B,
      title: 'Hoco J101B 22.5W 30000mAh Fast Charging Power Bank',
      type: 'Power Bank',
      price: 399,
      quantity: 10,
    },
    {
      id: 5,
      image: Q39,
      title: 'Hoco Q39 Eminete 22.5WPD20W 20000mAh Power Bank',
      type: 'Power Bank',
      price: 349,
      quantity: 18,
    },
    {
      id: 6,
      image: Y31,
      title: 'Hoco Y31 Bluetooth Calling Smart Watch',
      type: 'Smart Watch',
      price: 399,
      quantity: 22,
    },
    {
      id: 7,
      image: M196,
      title: 'Logitech M196 Bluetooth Mouse',
      type: 'Bluetooth Mouse',
      price: 399,
      quantity: 12,
    },
    {
      id: 8,
      image: OSW,
      title: 'Oraimo Watch 5R OSW-820 Smart Watch',
      type: 'Smart Watch',
      price: 399,
      quantity: 17,
    },
    {
      id: 9,
      image: Planet,
      title: 'Planet Wireless Smart Charger Alarm Clock Bluetooth Speaker',
      type: 'Bluetooth Speaker',
      price: 399,
      quantity: 14,
    },
    {
      id: 10,
      image: C500,
      title: 'Xiaomi C500 Pro Smart Camera',
      type: 'Smart Camera',
      price: 399,
      quantity: 20,
    },
  ];
  const category = [
    'Charger',
    'HeadPhone',
    'TWS',
    'Smart Watch',
    'Camera',
    'Mouse',
  ];

  const [search, setsearch] = useState('');
  const [card, setCart] = useState([]);
  const [openCategory, setOpenCategory] = useState(false);
  const [openStock, setOpenStock] = useState(false);
  const [stockfilter, setStockfilter] = useState('');
  const useCategoryRef = useRef(null);
  const useStockRef = useRef(null);

  useEffect(() => {
    const funCategory = (e) => {
      if (
        useCategoryRef.current &&
        !useCategoryRef.current.contains(e.target)
      ) {
        setOpenCategory(false);
      }
    };
    document.addEventListener('mousedown', funCategory);
    return () => document.removeEventListener('mousedown', funCategory);
  }, [openCategory]);

  useEffect(() => {
    const funStock = (e) => {
      if (useStockRef.current && !useStockRef.current.contains(e.target)) {
        setOpenStock(false);
      }
    };
    document.addEventListener('mousedown', funStock);
    return () => document.removeEventListener('mousedown', funStock);
  }, [openStock]);

  const filterItems = items.filter((item) => {
    if (stockfilter === 'in' && !item.quantity) return false;
    if (stockfilter === 'out' && item.quantity) return false;

    if (search == 'other') {
      return !category
        .map((c) => c.toLowerCase())
        .includes(item.type.toLowerCase());
    }
    if (category.map((c) => c.toLowerCase()).includes(search.toLowerCase())) {
      return item.type.toLowerCase().includes(search.toLowerCase());
    }

    return (
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleAddToCard = (item) => {
    setCart((prevCard) => {
      const existing = prevCard.find((p) => p.id == item.id); // age thekei ace ki na check
      if (existing) {
        return prevCard.map((p) =>
          p.id == item.id ? { ...p, count: p.count + 1 } : p
        );
      } else {
        return [...prevCard, { ...item, count: 1 }]; // count add kora hoice
      }
    });
  };

  return (
    <div className="bg-gray-50/50 flex flex-col">
      <div className="">
        <ShoppingCard card={card} setCard={setCart} />
      </div>
      <div>
        <div className="flex items-center justify-between my-5 mx-3">
          <div className="flex flex-col">
            <span
              onClick={() => navigate(0)}
              className="text-[32px] font-serif font-semibold cursor-pointer"
            >
              Products
            </span>
            <span className="text-sm text-gray-600">
              Manage your products and inventory
            </span>
          </div>

          <div className="flex gap-1 items-center">
            <button
              onClick={() => navigate('/product/add')}
              className="mr-8 bg-red-500/90 hover:bg-red-500 ring-0 rounded-lg flex justify-center items-center text-white p-1 px-2.5 cursor-pointer"
            >
              + Add Product
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center m-3 my-5 ">
          <div className="">
            <input
              type="text"
              placeholder="Search products...."
              value={search}
              onChange={(e) => setsearch(e.target.value)}
              className="w-[18ch] p-1 px-2 ring-1 hover:bg-white ring-gray-300 rounded-lg shadow outline-0  focus:ring-gray-400 cursor-text "
            />
          </div>
          <div className="flex gap-5">
            <div ref={useStockRef} className="relative">
              <button
                onClick={() => setOpenStock(!openStock)}
                className="cursor-pointer ring-1 ring-gray-300 p-1 px-2 rounded-lg bg-gray-50 hover:bg-gray-100 "
              >
                Stock Filter
              </button>
              {/* Dropdown Stock */}
              <div
                className={`absolute mt-2 left-0 shadow-2xl
                transform origin-top-right transition-all duration-300 ease-in-out ${
                  openStock ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`}
              >
                <div className="bg-white flex flex-col gap-0 rounded-xl border border-gray-300 text-sm sm:text-base p-1">
                  <div
                    onClick={() => {
                      setStockfilter('in');
                      setOpenCategory(false);
                    }}
                    className="cursor-pointer border-b border-gray-300 pb-1 m-1 px-1 hover:bg-gray-50 hover:shadow"
                  >
                    In Stock
                  </div>
                  <div
                    onClick={() => {
                      setStockfilter('out');
                      setOpenCategory(false);
                    }}
                    className="cursor-pointer m-1 border-b border-gray-300 pb-1  px-1 hover:bg-gray-50 hover:shadow"
                  >
                    Out of Stock
                  </div>
                  <span
                    className="cursor-pointer  pb-1 m-1  px-1 hover:bg-gray-50 hover:shadow"
                    onClick={() => navigate(0)}
                  >
                    All
                  </span>
                </div>
              </div>
            </div>

            <div ref={useCategoryRef} className="relative">
              <button
                onClick={() => setOpenCategory(!openCategory)}
                className="cursor-pointer ring-1 ring-gray-300 p-1 px-2 rounded-lg bg-gray-50 hover:bg-gray-100 "
              >
                Category
              </button>
              {/* Dropdown category */}
              <div
                className={`absolute mt-2 right-0 shadow-2xl
            transform origin-top-right transition-all duration-300 ease-in-out ${
              openCategory ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            }`}
              >
                <div className="bg-white flex flex-col gap-0 rounded-xl border border-gray-300 text-sm sm:text-base ">
                  {category.map((c) => (
                    <span
                      key={c}
                      className="cursor-pointer border-b border-gray-300 pb-1 m-1 px-1 hover:bg-gray-50 hover:shadow"
                      onClick={() => setsearch(c.toLowerCase())}
                    >
                      {c}
                    </span>
                  ))}
                  <span
                    className="cursor-pointer border-b border-gray-300 pb-1 m-1 px-1 hover:bg-gray-50"
                    onClick={() => setsearch('other')}
                  >
                    Other
                  </span>
                  <span
                    className="cursor-pointer  pb-1 m-1 px-1 hover:bg-gray-50"
                    onClick={() => navigate(0)}
                  >
                    All
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filterItems.map((item) => (
          <Product
            id={item.id}
            image={item.image}
            title={item.title}
            price={item.price}
            type={item.type}
            quantity={item.quantity}
            onAddToCard={() => handleAddToCard(item)}
          />
        ))}
      </div>
      <div className="mb-3">
        <Pagination totalPages={15} />
      </div>
    </div>
  );
}
