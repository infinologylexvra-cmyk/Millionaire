import { createContext, useEffect, useMemo, useState } from 'react';

export const CartContext = createContext(null);

const STORAGE_KEY = 'mn_cart';

const readCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (number) => {
    setItems((prev) => {
      if (prev.some((i) => i._id === number._id)) return prev;
      return [...prev, number];
    });
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  const clearCart = () => setItems([]);

  const isInCart = (id) => items.some((i) => i._id === id);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + (i.price || 0), 0), [items]);

  const value = {
    items,
    count: items.length,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
