import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FiHeart, FiMinus, FiPlus } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function BestSeller() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartQuantities, setCartQuantities] = useState({});
  const navigate = useNavigate();

  // ------------------------------------------------------------
  // SIMPLE LOGIN CHECK → REDIRECT IF NOT LOGGED IN
  // ------------------------------------------------------------
  const redirectIfNotLoggedIn = (err) => {
    if (err?.response?.status === 401) {
      navigate("/login");
      return true;
    }
    return false;
  };

  // ------------------------------------------------------------
  // FETCH PRODUCTS / WISHLIST / CART
  // ------------------------------------------------------------
  useEffect(() => {
    fetchProducts();
    fetchWishlist();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "https://raadi.onrender.com/api/v1/products/best-seller"
      );
      setProducts(res.data.products || []);
    } catch (err) {
      console.log("Best Seller Fetch Error:", err);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(
        "https://raadi.onrender.com/api/v1/wishlist",
        { withCredentials: true }
      );
      setWishlist(res.data.wishlist?.products?.map((p) => p._id) || []);
    } catch (err) {
      if (redirectIfNotLoggedIn(err)) return;
      console.log("Wishlist Fetch Error:", err);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get("https://raadi.onrender.com/api/v1/cart", {
        withCredentials: true,
      });
      const map = {};
      res.data.cart?.items?.forEach((i) => (map[i.product._id] = i.quantity));
      setCartQuantities(map);
    } catch (err) {
      if (redirectIfNotLoggedIn(err)) return;
      console.log("Cart Fetch Error:", err);
    }
  };

  // ------------------------------------------------------------
  // WISHLIST HANDLER
  // ------------------------------------------------------------
  const handleWishlist = useCallback(async (productId) => {
    try {
      const res = await axios.post(
        "https://raadi.onrender.com/api/v1/wishlist/add",
        { productId },
        { withCredentials: true }
      );

      if (!res.data.success) {
        navigate("/login");
        return;
      }

      setWishlist((prev) => [...prev, productId]);
    } catch (err) {
      if (redirectIfNotLoggedIn(err)) return;
      console.log("Wishlist Error:", err);
    }
  }, []);

  // ------------------------------------------------------------
  // ADD TO CART
  // ------------------------------------------------------------
  const handleAddToCart = useCallback(async (productId) => {
    try {
      const res = await axios.post(
        "https://raadi.onrender.com/api/v1/cart/add",
        { productId, quantity: 1 },
        { withCredentials: true }
      );

      if (!res.data.success) {
        navigate("/login");
        return;
      }

      setCartQuantities((prev) => ({ ...prev, [productId]: 1 }));
    } catch (err) {
      if (redirectIfNotLoggedIn(err)) return;
      console.log("Add Cart Error:", err);
    }
  }, []);

  // ------------------------------------------------------------
  // UPDATE CART QUANTITY
  // ------------------------------------------------------------
  const updateQuantity = async (productId, qty) => {
    try {
      if (qty <= 0) return removeItem(productId);

      const res = await axios.put(
        "https://raadi.onrender.com/api/v1/cart/update",
        { productId, quantity: qty },
        { withCredentials: true }
      );

      if (!res.data.success) {
        navigate("/login");
        return;
      }

      setCartQuantities((prev) => ({ ...prev, [productId]: qty }));
    } catch (err) {
      if (redirectIfNotLoggedIn(err)) return;
      console.log("Update Qty Error:", err);
    }
  };

  // ------------------------------------------------------------
  // REMOVE ITEM
  // ------------------------------------------------------------
  const removeItem = async (productId) => {
    try {
      const res = await axios.delete(
        "https://raadi.onrender.com/api/v1/cart/remove",
        {
          data: { productId },
          withCredentials: true,
        }
      );

      if (!res.data.success) {
        navigate("/login");
        return;
      }

      setCartQuantities((prev) => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
    } catch (err) {
      if (redirectIfNotLoggedIn(err)) return;
      console.log("Remove Item Error:", err);
    }
  };

  const openProduct = (id) => navigate(`/product/${id}`);

  // ------------------------------------------------------------
  // UI RENDER
  // ------------------------------------------------------------
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-14">
      <h2 className="text-center text-3xl md:text-4xl font-extrabold text-[#0b1b3f]">
        Best Sellers
      </h2>
      <p className="text-center text-gray-600 mt-2 mb-10 text-base md:text-lg">
        Discover our most-loved products trusted by thousands.
      </p>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {products.map((item) => {
          const qty = cartQuantities[item._id] || 0;

          return (
            <div
              key={item._id}
              className="relative bg-white rounded-2xl p-4 shadow-md border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Wishlist Button */}
              <button
                className="absolute top-3 right-3 z-50"
                onClick={() => handleWishlist(item._id)}
              >
                {wishlist.includes(item._id) ? (
                  <FaHeart className="text-orange-500" size={22} />
                ) : (
                  <FiHeart
                    size={22}
                    className="text-gray-600 hover:text-orange-500 transition"
                  />
                )}
              </button>

              {/* Image */}
              <div
                onClick={() => openProduct(item._id)}
                className="bg-gray-100 rounded-xl px-4 py-6 flex justify-center items-center h-40 md:h-44 lg:h-48 cursor-pointer overflow-hidden"
              >
                <img
                  src={item.images?.[0]}
                  className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                  alt={item.name}
                  loading="lazy"
                />
              </div>

              {/* Name */}
              <h3
                className="mt-3 text-lg font-semibold text-center text-[#0b1b3f] group-hover:text-orange-600 transition cursor-pointer"
                onClick={() => openProduct(item._id)}
              >
                {item.name}
              </h3>

              {/* Price */}
              <div className="flex justify-center items-center gap-2 mt-1">
                <p className="line-through text-gray-400 text-sm">₹{item.mrp}</p>
                <p className="text-lg font-bold text-orange-600">₹{item.price}</p>
              </div>

              {/* STOCK + CART CONTROLS */}
              {item.stock === 0 ? (
                <button
                  disabled
                  className="w-full mt-4 py-2 rounded-lg bg-gray-300 text-gray-600 text-base font-semibold cursor-not-allowed"
                >
                  Out of Stock
                </button>
              ) : qty > 0 ? (
                <div className="flex justify-center items-center gap-3 mt-3">
                  <button
                    className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    onClick={() => updateQuantity(item._id, qty - 1)}
                  >
                    <FiMinus />
                  </button>

                  <span className="font-semibold text-base min-w-[28px] text-center">
                    {qty}
                  </span>

                  <button
                    className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    onClick={() => updateQuantity(item._id, qty + 1)}
                  >
                    <FiPlus />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleAddToCart(item._id)}
                  className="w-full mt-4 py-2 rounded-lg bg-orange-500 text-white text-base font-semibold hover:bg-orange-600 transition"
                >
                  Add to Cart
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
