import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";

export default function SpecialProduct() {
  const [data, setData] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [cartQty, setCartQty] = useState(0);

  const navigate = useNavigate();

  // ------------------------------------------------------------
  // LOGIN CHECK → redirect to login on 401
  // ------------------------------------------------------------
  const checkLogin = (err) => {
    if (err?.response?.status === 401) {
      navigate("/login");
      return true;
    }
    return false;
  };

  // ------------------------------------------------------------
  // Fetch special product + wishlist + cart in one go
  // ------------------------------------------------------------
  useEffect(() => {
    const loadSpecial = async () => {
      try {
        const res = await axios.get(
          "https://raadi.onrender.com/api/v1/featuredProduct/active",
          { withCredentials: true }
        );

        const special = res.data.special;
        if (!special || !special.productId) return;

        setData(special);

        const pid = special.productId._id;

        // Fetch wishlist & cart parallel
        fetchWishlist();
        fetchCart(pid);
      } catch (err) {
        console.log("Special fetch error:", err);
      }
    };

    loadSpecial();
  }, []);

  // ------------------------------------------------------------
  // Wishlist
  // ------------------------------------------------------------
  const fetchWishlist = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://raadi.onrender.com/api/v1/wishlist",
        { withCredentials: true }
      );

      setWishlist(res.data.wishlist?.products?.map((p) => p._id) || []);
    } catch (err) {
      if (checkLogin(err)) return;
    }
  }, []);

  const toggleWishlist = useCallback(async () => {
    const pid = data?.productId?._id;
    if (!pid) return;

    try {
      if (wishlist.includes(pid)) {
        const res = await axios.delete(
          "https://raadi.onrender.com/api/v1/wishlist/remove",
          {
            data: { productId: pid },
            withCredentials: true,
          }
        );

        if (!res.data.success) return navigate("/login");

        setWishlist((prev) => prev.filter((id) => id !== pid));
      } else {
        const res = await axios.post(
          "https://raadi.onrender.com/api/v1/wishlist/add",
          { productId: pid },
          { withCredentials: true }
        );

        if (!res.data.success) return navigate("/login");

        setWishlist((prev) => [...prev, pid]);
      }
    } catch (err) {
      if (checkLogin(err)) return;
    }
  }, [data, wishlist]);

  // ------------------------------------------------------------
  // Cart
  // ------------------------------------------------------------
  const fetchCart = useCallback(async (pid) => {
    try {
      const res = await axios.get("https://raadi.onrender.com/api/v1/cart", {
        withCredentials: true,
      });

      const item = res.data.cart?.items?.find((i) => i.product._id === pid);
      setCartQty(item ? item.quantity : 0);
    } catch (err) {
      if (checkLogin(err)) return;
    }
  }, []);

  const addToCart = async () => {
    const pid = data?.productId?._id;
    if (!pid) return;

    try {
      const res = await axios.post(
        "https://raadi.onrender.com/api/v1/cart/add",
        { productId: pid, quantity: 1 },
        { withCredentials: true }
      );

      if (!res.data.success) return navigate("/login");

      setCartQty(1);
    } catch (err) {
      if (checkLogin(err)) return;
    }
  };

  const updateQuantity = async (newQty) => {
    const pid = data?.productId?._id;
    if (!pid) return;

    try {
      if (newQty <= 0) {
        const res = await axios.delete(
          "https://raadi.onrender.com/api/v1/cart/remove",
          {
            data: { productId: pid },
            withCredentials: true,
          }
        );

        if (!res.data.success) return navigate("/login");

        return setCartQty(0);
      }

      const res = await axios.put(
        "https://raadi.onrender.com/api/v1/cart/update",
        { productId: pid, quantity: newQty },
        { withCredentials: true }
      );

      if (!res.data.success) return navigate("/login");

      setCartQty(newQty);
    } catch (err) {
      if (checkLogin(err)) return;
    }
  };

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  if (!data || !data.productId) return null;

  const product = data.productId;
  const pid = product._id;
  const isInWishlist = wishlist.includes(pid);

  return (
    <section className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* IMAGE */}
        <div className="flex justify-center">
          <img
            src={data.image}
            alt={data.title}
            loading="lazy"
            className="w-[450px] object-cover rounded-lg drop-shadow-2xl transition-all duration-300 hover:scale-[1.03]"
          />
        </div>

        {/* DETAILS */}
        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold uppercase tracking-tight">
            {data.title}
          </h1>

          <p className="text-lg text-gray-300 max-w-lg">
            {data.description}
          </p>

          <p className="text-4xl font-bold">
            ₹{data.startingPrice.toLocaleString()}
          </p>

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className="flex items-center gap-3 text-lg hover:text-orange-400 transition"
          >
            {isInWishlist ? (
              <FaHeart size={24} className="text-orange-400" />
            ) : (
              <FiHeart size={24} />
            )}
            {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>

          {/* Cart Controls */}
          {cartQty > 0 ? (
            <div className="flex items-center gap-5">
              <button
                onClick={() => updateQuantity(cartQty - 1)}
                className="text-2xl px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
              >
                –
              </button>

              <span className="text-xl font-semibold">{cartQty}</span>

              <button
                onClick={() => updateQuantity(cartQty + 1)}
                className="text-2xl px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={addToCart}
              className="px-10 py-3 bg-orange-500 rounded-md text-lg font-semibold hover:bg-orange-600 transition"
            >
              Add to Cart
            </button>
          )}

          {/* View Details */}
          <button
            onClick={() => navigate(`/product/${pid}`)}
            className="
              mt-4 px-8 py-3 bg-white/10 border border-white/20 
              text-gray-200 rounded-xl font-medium flex items-center gap-2
              backdrop-blur-md hover:bg-white/20 hover:border-white/40 hover:text-white
              transition-all duration-300
            "
          >
            View Product Details <span className="text-xl">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
