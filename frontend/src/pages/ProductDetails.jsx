// src/pages/ProductDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";

export default function ProductDetails() {
  const { id } = useParams();                // product id from URL
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [inCart, setInCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchCart();
    fetchWishlist();
  }, [id]);

  // ---------- Fetch product ----------
  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/products/${id}`
      );
      setProduct(res.data.product);
      setLoading(false);
    } catch (err) {
      console.log("Product fetch error:", err);
      setLoading(false);
    }
  };

  // ---------- Fetch cart to know quantity / inCart ----------
  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/cart", {
        withCredentials: true,
      });

      const cart = res.data.cart;
      if (!cart || !cart.items) return;

      const item = cart.items.find(
        (i) => i.product && i.product._id === id
      );

      if (item) {
        setInCart(true);
        setQuantity(item.quantity);
      } else {
        setInCart(false);
        setQuantity(1);
      }
    } catch (err) {
      // not logged in, cart empty, etc.
      console.log("Cart fetch error:", err);
    }
  };

  // ---------- Fetch wishlist to know inWishlist ----------
  const fetchWishlist = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/wishlist", {
        withCredentials: true,
      });

      const ids = res.data.wishlist?.products?.map((p) => p._id) || [];
      setInWishlist(ids.includes(id));
    } catch (err) {
      console.log("Wishlist fetch error:", err);
    }
  };

  // ---------- Cart actions ----------
  const addToCart = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/cart/add",
        { productId: id, quantity },
        { withCredentials: true }
      );

      if (res.data.success) {
        setInCart(true);
        // ensure quantity from backend
        const item = res.data.cart.items.find(
          (i) => i.product.toString() === id
        );
        if (item) setQuantity(item.quantity);
      }
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      console.log("Add to cart error:", err);
    }
  };

  const updateCartQuantity = async (newQty) => {
    try {
      if (newQty <= 0) {
        // remove from cart
        const res = await axios.delete(
          "http://localhost:8000/api/v1/cart/remove",
          {
            data: { productId: id },
            withCredentials: true,
          }
        );

        if (res.data.success) {
          setInCart(false);
          setQuantity(1);
        }
        return;
      }

      const res = await axios.put(
        "http://localhost:8000/api/v1/cart/update",
        { productId: id, quantity: newQty },
        { withCredentials: true }
      );

      if (res.data.success) {
        setQuantity(newQty);
        setInCart(true);
      }
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      console.log("Update cart quantity error:", err);
    }
  };

  const handleDecrease = () => {
    if (!inCart) return;
    updateCartQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    updateCartQuantity(quantity + 1);
  };

  // ---------- Wishlist toggle ----------
  const toggleWishlist = async () => {
    try {
      if (inWishlist) {
        const res = await axios.delete(
          "http://localhost:8000/api/v1/wishlist/remove",
          {
            data: { productId: id },
            withCredentials: true,
          }
        );
        if (res.data.success) setInWishlist(false);
      } else {
        const res = await axios.post(
          "http://localhost:8000/api/v1/wishlist/add",
          { productId: id },
          { withCredentials: true }
        );
        if (res.data.success) setInWishlist(true);
      }
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      console.log("Wishlist toggle error:", err);
    }
  };

  // ---------- UI ----------
  if (loading || !product) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-14">
        <p className="text-center text-lg">Loading product...</p>
      </section>
    );
  }

  return (
  <section className="min-h-screen flex items-center justify-center px-6 py-10 animate-fade-in">
    <div className="max-w-7xl w-full mx-auto bg-white rounded-3xl p-10 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

      {/* IMAGE SECTION */}
      <div className="flex justify-center">
        <div className="bg-[#f2f1f6] rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-[520px] h-[520px] object-contain rounded-xl"
          />
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="space-y-6">
        <h1 className="text-5xl font-extrabold text-[#0b1b3f] leading-tight">
          {product.name}
        </h1>
        <p className="text-gray-600 text-2xl font-semibold leading-relaxed">
          {product.description || product.shortDescription || "Premium product just for you."}
        </p>

        <div className="flex items-baseline gap-4">
          {product.mrp && (
            <span className="text-gray-400 line-through text-2xl">
              ₹{product.mrp.toLocaleString("en-IN")}
            </span>
          )}
          <p className="text-4xl font-bold text-orange-600">
            ₹{product.price?.toLocaleString("en-IN")}
          </p>
        </div>

        {/* QUANTITY + BUTTON */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center border rounded-xl px-6 py-3 gap-6 font-semibold text-2xl">
            <button
              onClick={handleDecrease}
              className="text-3xl px-2 hover:text-orange-500"
            >
              –
            </button>
            <span>{quantity}</span>
            <button
              onClick={handleIncrease}
              className="text-3xl px-2 hover:text-orange-500"
            >
              +
            </button>
          </div>

          <button
            onClick={addToCart}
            disabled={inCart && quantity > 0}
            className={`w-56 py-4 rounded-xl text-xl font-bold transition-all duration-300 
              ${
                inCart
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
          >
            {inCart ? "Added" : "Add to cart"}
          </button>
        </div>

        <button
          onClick={toggleWishlist}
          className="w-56 border border-orange-500 py-4 rounded-xl text-orange-600 font-semibold hover:bg-orange-50 flex items-center gap-3 justify-center text-lg mt-2 transition-all"
        >
          {inWishlist ? <FaHeart size={22} className="text-orange-500" /> : <FiHeart size={22} />}
          {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        </button>

        {/* DELIVERY INFO */}
        <div className="flex flex-wrap gap-10 mt-6 text-center text-xl">
          <div>
            <p className="font-semibold">🚚 Free Delivery</p>
            <p className="text-gray-600">5–7 days</p>
          </div>
          <div>
            <p className="font-semibold">📦 In Stock</p>
            <p className="text-gray-600">Today</p>
          </div>
          <div>
            <p className="font-semibold">🛡 Guaranteed</p>
            <p className="text-gray-600">1 year</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

}
