import { useEffect, useState } from "react";
import axios from "axios";
import { Heart } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function TopProducts() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/products/top-products")
      .then((res) => setProducts(res.data.products))
      .catch((err) => console.log("Top product fetch error:", err));

    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/wishlist", {
        withCredentials: true,
      });

      setWishlist(res.data.wishlist?.products?.map((p) => p._id) || []);
    } catch (err) {
      console.log("Wishlist fetch error:", err);
    }
  };

  const handleWishlist = async (productId) => {
    try {
      if (wishlist.includes(productId)) {
        const res = await axios.delete(
          "http://localhost:8000/api/v1/wishlist/remove",
          {
            data: { productId },
            withCredentials: true,
          }
        );

        if (res.data.success) {
          setWishlist((prev) => prev.filter((id) => id !== productId));
        }
      } else {
        const res = await axios.post(
          "http://localhost:8000/api/v1/wishlist/add",
          { productId },
          { withCredentials: true }
        );

        if (res.data.success) {
          setWishlist((prev) => [...prev, productId]);
        }
      }
    } catch (err) {
      console.log("Wishlist Error:", err);
    }
  };

  const openProductDetails = (id) => navigate(`/product/${id}`);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-center text-4xl font-bold text-[#0b1b3f]">Top Products</h2>
      <p className="text-center text-gray-600 mt-2 mb-10">
        Shop our newest arrivals and crowd favorites.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="group bg-white rounded-2xl shadow-md border border-gray-200 p-5
            hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
          >
            {/* Image Container */}
            <div className="relative bg-[#f2f1f6] rounded-xl h-72 flex items-center justify-center overflow-hidden">
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
              />

              {/* Hover OPEN Button */}
              <button
                onClick={() => openProductDetails(product._id)}
                className="absolute inset-0 m-auto w-32 h-12 opacity-0 group-hover:opacity-100
                transition-all duration-300 bg-orange-500 text-white font-semibold rounded-xl
                flex items-center justify-center text-lg"
              >
                Open
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => handleWishlist(product._id)}
                className="absolute top-4 right-4 z-50"
              >
                {wishlist.includes(product._id) ? (
                  <FaHeart size={30} className="text-orange-500" />
                ) : (
                  <Heart
                    size={30}
                    className="text-gray-700 hover:text-orange-500 transition-all"
                  />
                )}
              </button>
            </div>

            {/* Product Name */}
            <h3
              className="text-xl font-semibold mt-4 text-[#0b1b3f] group-hover:text-orange-600 transition"
              onClick={() => openProductDetails(product._id)}
            >
              {product.name}
            </h3>

            {/* Price Section */}
            <div className="flex items-center gap-3 mt-2">
              <p className="line-through text-gray-400">₹{product.mrp?.toLocaleString("en-IN")}</p>
              <p className="text-xl font-bold text-[#0b1b3f]">
                ₹{product.price?.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
