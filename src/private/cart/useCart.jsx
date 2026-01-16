import { createContext, useContext } from "react";
import useCartLogic from "./useCartLogic";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const cartData = useCartLogic();

  return (
    <CartContext.Provider value={cartData}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};
