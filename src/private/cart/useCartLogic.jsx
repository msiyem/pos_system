import { useEffect, useState } from 'react';
import useToast from '../../toast/useToast';

export default function useCartLogic() {
  const toast = useToast();
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('pos_cart');
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem('pos_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    if (product.stock <= 0 && product.stock !== undefined) {
    toast.error("Product is out of stock");
    return;
  }
    setCart((prevCart) => {
      const existing = prevCart.find((p) => p.id === product.id);
      if (existing) {
        if (existing.count >= product.stock && product.stock !== undefined) {
        toast.error("No more stock available");
        return prevCart;
      }
        return prevCart.map((p) =>
          p.id === product.id ? { ...p, count: p.count + 1 } : p
        );
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            count: 1,
          },
        ];
      }
    });
  };

  const clearCart = () => {
    localStorage.removeItem('pos_cart');
    setCart([]);
  };
  return { cart, setCart,addToCart, clearCart };
}
