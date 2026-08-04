import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import userService from '../services/userService';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    setLoading(true);
    try {
      const res = await userService.getWishlist();
      // Backend returns array directly in res.data.data
      const items = res.data?.data || res.data?.wishlist || res.data || [];
      setWishlist(Array.isArray(items) ? items : []);
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isWishlisted = (id) => wishlist.some((n) => n._id === id);

  const toggleWishlist = async (numberId) => {
    if (!isAuthenticated) return { requiresAuth: true };
    try {
      if (isWishlisted(numberId)) {
        const res = await userService.removeFromWishlist(numberId);
        const items = res.data?.data || res.data?.wishlist || res.data || [];
        setWishlist(Array.isArray(items) ? items : []);
        return { removed: true };
      }
      const res = await userService.addToWishlist(numberId);
      const items = res.data?.data || res.data?.wishlist || res.data || [];
      setWishlist(Array.isArray(items) ? items : []);
      return { added: true };
    } catch (err) {
      return { error: true };
    }
  };

  const value = { wishlist, loading, isWishlisted, toggleWishlist, refresh: fetchWishlist };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
