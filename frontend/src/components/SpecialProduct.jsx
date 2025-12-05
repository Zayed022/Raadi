import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";

export default function SpecialProduct() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [cartQty, setCartQty] = useState(0);

  // Fetch Special Product
  useEffect(() => {
    axios
      .get("https://raadi.onrender.com/api/v1/featuredProduct/active", {
        withCredentials: true,
      })
      .then((res) => {
        const special = res.data.special;
        setData(special);

        const actualProductId = special.productId?._id;
        if (actualProductId) {
          fetchWishlist();
          fetchCart(actualProductId);
        }
      })
      .catch((err) => console.log("Special product fetch error:", err));
  }, []);

  // Fetch Wishlist
  const fetchWishlist = async () => {
    try {
      const res = await axios.get("https://raadi.onrender.com/api/v1/wishlist", {
        withCredentials: true,
      });
      setWishlist(res.data.wishlist?.products?.map((p) => p._id) || []);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch Cart Quantity
  const fetchCart = async (pid) => {
    try {
      const res = await axios.get("https://raadi.onrender.com/api/v1/cart", {
        withCredentials: true,
      });

      const item = res.data.cart?.items?.find((i) => i.product._id === pid);
      setCartQty(item ? item.quantity : 0);
    } catch (err) {
      console.log(err);
    }
  };

  // Toggle Wishlist
  const toggleWishlist = async () => {
    const pid = data.productId?._id;
    if (!pid) return;

    try {
      if (wishlist.includes(pid)) {
        await axios.delete("https://raadi.onrender.com/api/v1/wishlist/remove", {
          data: { productId: pid },
          withCredentials: true,
        });

        setWishlist((prev) => prev.filter((id) => id !== pid));
      } else {
        await axios.post(
          "https://raadi.onrender.com/api/v1/wishlist/add",
          { productId: pid },
          { withCredentials: true }
        );

        setWishlist((prev) => [...prev, pid]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Add to Cart
  const addToCart = async () => {
    const pid = data.productId?._id;
    if (!pid) return;

    try {
      await axios.post(
        "https://raadi.onrender.com/api/v1/cart/add",
        { productId: pid, quantity: 1 },
        { withCredentials: true }
      );

      setCartQty(1);
    } catch (err) {
      console.log(err);
    }
  };

  // Update Quantity
  const updateQuantity = async (newQty) => {
    const pid = data.productId?._id;
    if (!pid) return;

    try {
      if (newQty <= 0) {
        await axios.delete("https://raadi.onrender.com/api/v1/cart/remove", {
          data: { productId: pid },
          withCredentials: true,
        });
        return setCartQty(0);
      }

      await axios.put(
        "https://raadi.onrender.com/api/v1/cart/update",
        { productId: pid, quantity: newQty },
        { withCredentials: true }
      );

      setCartQty(newQty);
    } catch (err) {
      console.log(err);
    }
  };

  if (!data || !data.productId) return null;

  const actualProduct = data.productId; // populated product object
  const productId = actualProduct._id;
  const inWishlist = wishlist.includes(productId);

  return (
    <section className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center px-6">
        
        {/* Image */}
        <div className="flex justify-center">
          <img
            src={data.image}
            alt={data.title}
            className="w-[450px] object-cover rounded-lg drop-shadow-2xl"
          />
        </div>

        {/* Details */}
        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold uppercase">{data.title}</h1>

          <p className="text-lg text-gray-300 max-w-md">{data.description}</p>

          <p className="text-4xl font-bold">
            ₹{data.startingPrice.toLocaleString()}
          </p>

          {/* Wishlist */}
          <button
            onClick={toggleWishlist}
            className="flex items-center gap-3 text-lg"
          >
            {inWishlist ? (
              <FaHeart className="text-orange-400" />
            ) : (
              <FiHeart />
            )}
            {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>

          {/* Add to Cart */}
          {cartQty > 0 ? (
            <div className="flex items-center gap-5">
              <button
                onClick={() => updateQuantity(cartQty - 1)}
                className="text-2xl px-3 py-1 bg-gray-700 rounded"
              >
                –
              </button>

              <span className="text-xl font-semibold">{cartQty}</span>

              <button
                onClick={() => updateQuantity(cartQty + 1)}
                className="text-2xl px-3 py-1 bg-gray-700 rounded"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={addToCart}
              className="px-10 py-3 bg-orange-500 rounded-md text-lg hover:bg-orange-600 transition"
            >
              Add to Cart
            </button>
          )}

          <button
  onClick={() => navigate(`/product/${productId}`)}
  className="
    mt-4 px-8 py-3 
    bg-white/10 backdrop-blur-md 
    border border-white/20 
    text-gray-200 
    rounded-xl 
    font-medium 
    flex items-center gap-2
    hover:bg-white/20 hover:border-white/30 hover:text-white
    transition-all duration-300
  "
>
  View Product Details
  <span className="text-xl">→</span>
</button>

        </div>
      </div>
    </section>
  );
}
