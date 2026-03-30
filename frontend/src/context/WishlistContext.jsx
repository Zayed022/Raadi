// context/WishlistContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { getLocalData, setLocalData } from "../utils/storage";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() =>
    getLocalData("wishlist", [])
  );

  useEffect(() => {
    setLocalData("wishlist", wishlist);
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item._id === product._id);

      if (exists) {
        return prev.filter((item) => item._id !== product._id);
      }

      return [...prev, product];
    });
  };

  const isInWishlist = (id) => {
    return wishlist.some((item) => item._id === id);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);