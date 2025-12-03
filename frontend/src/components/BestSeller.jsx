import { useEffect, useState } from "react";
import axios from "axios";
import { FiHeart, FiMinus, FiPlus } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function BestSeller() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartQuantities, setCartQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/products/best-seller");
      setProducts(res.data.products || []);
    } catch (err) {
      console.log("Best Seller Fetch Error:", err);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/wishlist", {
        withCredentials: true,
      });
      setWishlist(res.data.wishlist?.products?.map((p) => p._id) || []);
    } catch (err) {
      console.log("Wishlist Fetch Error:", err);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/cart", {
        withCredentials: true,
      });
      const map = {};
      res.data.cart?.items?.forEach((i) => (map[i.product._id] = i.quantity));
      setCartQuantities(map);
    } catch (err) {
      console.log("Cart Fetch Error:", err);
    }
  };

  const handleWishlist = async (productId) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/wishlist/add",
        { productId },
        { withCredentials: true }
      );
      if (res.data.success) setWishlist((prev) => [...prev, productId]);
    } catch (err) {
      console.log("Wishlist Error:", err);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await axios.post(
        "http://localhost:8000/api/v1/cart/add",
        { productId, quantity: 1 },
        { withCredentials: true }
      );
      setCartQuantities((prev) => ({ ...prev, [productId]: 1 }));
    } catch (err) {
      console.log("Add Cart Error:", err);
    }
  };

  const updateQuantity = async (productId, qty) => {
    try {
      if (qty <= 0) return removeItem(productId);

      await axios.put(
        "http://localhost:8000/api/v1/cart/update",
        { productId, quantity: qty },
        { withCredentials: true }
      );

      setCartQuantities((prev) => ({ ...prev, [productId]: qty }));
    } catch (err) {
      console.log("Update Qty Error:", err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete("http://localhost:8000/api/v1/cart/remove", {
        data: { productId },
        withCredentials: true,
      });

      setCartQuantities((prev) => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
    } catch (err) {
      console.log("Remove Item Error:", err);
    }
  };

  const openProduct = (id) => navigate(`/product/${id}`);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-center text-4xl md:text-5xl font-extrabold text-[#0b1b3f]">
        Best Sellers
      </h2>
      <p className="text-center text-gray-600 mt-2 mb-12 text-lg">
        Discover our most-loved products trusted by thousands.
      </p>

      {/* Responsive grid */}
      <div className="
        grid grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4 
        gap-10
      ">
        {products.map((item) => {
          const qty = cartQuantities[item._id] || 0;

          return (
            <div
              key={item._id}
              className="
                relative bg-white rounded-3xl p-6 
                shadow-lg border border-gray-200 
                hover:shadow-2xl hover:-translate-y-2
                transition-all duration-300 group
              "
            >
              {/* Wishlist Button */}
              <button
                className="absolute top-4 right-4 z-50"
                onClick={() => handleWishlist(item._id)}
              >
                {wishlist.includes(item._id) ? (
                  <FaHeart className="text-orange-500" size={26} />
                ) : (
                  <FiHeart
                    size={26}
                    className="text-gray-600 hover:text-orange-500 transition-all"
                  />
                )}
              </button>

              {/* Image */}
              <div
                onClick={() => openProduct(item._id)}
                className="
                  bg-gray-100 rounded-2xl px-6 py-8 
                  flex justify-center items-center 
                  h-64 md:h-56 lg:h-60 
                  overflow-hidden cursor-pointer
                "
              >
                <img
                  src={item.images?.[0]}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  alt={item.name}
                />
              </div>

              {/* Name */}
              <h3
                className="
                  mt-4 text-xl font-semibold text-center text-[#0b1b3f]
                  group-hover:text-orange-600 transition cursor-pointer
                "
                onClick={() => openProduct(item._id)}
              >
                {item.name}
              </h3>

              {/* Price */}
              <div className="flex justify-center items-center gap-3 mt-2">
                <p className="line-through text-gray-400 text-md">₹{item.mrp}</p>
                <p className="text-2xl font-bold text-orange-600">₹{item.price}</p>
              </div>

              {/* Add to cart / Quantity UI */}
              {qty > 0 ? (
                <div className="flex justify-center items-center gap-4 mt-4">
                  <button
                    className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    onClick={() => updateQuantity(item._id, qty - 1)}
                  >
                    <FiMinus />
                  </button>

                  <span className="font-semibold text-lg min-w-[24px] text-center">
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
                  className="
                    w-full mt-5 py-3 rounded-xl 
                    bg-orange-500 text-white text-lg font-semibold
                    hover:bg-orange-600 transition
                  "
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
