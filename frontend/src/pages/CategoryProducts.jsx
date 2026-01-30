import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import SEO from "../components/SEO";

const CATEGORY_SEO = {
  perfumes: {
    title: "Luxury Perfumes in India | Long Lasting Fragrances – Raadi",
    description:
      "Shop luxury perfumes in India by Raadi. Discover long-lasting fragrances crafted for elegance, confidence and everyday luxury.",
    intro:
      "Explore Raadi’s collection of luxury perfumes designed for long-lasting fragrance and refined elegance. Our perfumes are crafted to suit every mood, occasion and personality.",
  },
  soaps: {
    title: "Handcrafted Luxury Soaps | Natural Bath Soaps – Raadi",
    description:
      "Buy handcrafted luxury soaps by Raadi. Gentle on skin, rich in fragrance and made for a premium bathing experience.",
    intro:
      "Discover Raadi’s handcrafted luxury soaps made with skin-friendly ingredients and premium fragrances for everyday indulgence.",
  },
};

export default function CategoryProducts() {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const seo = CATEGORY_SEO[categoryName] || {
    title: "Shop Products | Raadi",
    description:
      "Explore premium products by Raadi including perfumes, soaps and home fragrances.",
    intro:
      "Explore premium products by Raadi crafted with quality, fragrance and elegance.",
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, [categoryName]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://raadi.onrender.com/api/v1/products/category/${categoryName}`
      );
      setProducts(res.data.products || []);
    } catch (err) {
      console.log("Category products fetch error:", err);
    } finally {
      setLoading(false);
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
      console.log("Wishlist Fetch Error:", err);
    }
  };

  const toggleWishlist = async (productId) => {
    try {
      if (wishlist.includes(productId)) {
        await axios.delete(
          "https://raadi.onrender.com/api/v1/wishlist/remove",
          { data: { productId }, withCredentials: true }
        );
        setWishlist((prev) => prev.filter((id) => id !== productId));
      } else {
        await axios.post(
          "https://raadi.onrender.com/api/v1/wishlist/add",
          { productId },
          { withCredentials: true }
        );
        setWishlist((prev) => [...prev, productId]);
      }
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
    }
  };

  const openProduct = (id) => navigate(`/product/${id}`);

  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow-md p-5 animate-pulse">
      <div className="bg-gray-200 rounded-xl h-64 w-full mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-5 bg-gray-200 rounded w-1/3"></div>
    </div>
  );

  return (
    <>
      {/* 🔥 Dynamic SEO */}
      <SEO
        title={seo.title}
        description={seo.description}
        url={`https://raadii.in/category/${categoryName}`}
      />

      <section className="max-w-7xl mx-auto px-6 py-14">
        {/* H1 (Ranking Critical) */}
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-6 capitalize">
          {categoryName} by Raadi
        </h1>

        {/* Category Intro Content (SEO GOLD) */}
        <p className="max-w-3xl mx-auto text-center text-gray-600 mb-12">
          {seo.intro}
        </p>

        {/* LOADING */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {Array(8)
              .fill(0)
              .map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-lg text-gray-500">
            No products found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                onClick={() => openProduct(p._id)}
              >
                <div className="relative bg-gray-100 rounded-xl p-5 h-64 flex items-center justify-center">
                  <img
                    src={p.images[0]}
                    alt={`${p.name} by Raadi`}
                    loading="lazy"
                    className="w-full h-full object-contain"
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(p._id);
                    }}
                    className="absolute top-4 right-4"
                  >
                    {wishlist.includes(p._id) ? (
                      <FaHeart size={26} className="text-orange-600" />
                    ) : (
                      <FiHeart size={26} className="text-gray-600 hover:text-orange-500" />
                    )}
                  </button>
                </div>

                <h3 className="font-semibold text-lg mt-4">{p.name}</h3>
                <p className="text-gray-400 line-through">₹{p.mrp}</p>
                <p className="text-xl font-bold text-orange-600">₹{p.price}</p>
              </div>
            ))}
          </div>
        )}

        {/* Internal Linking Block */}
        <section className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Explore More from Raadi
          </h2>
          <div className="flex justify-center gap-6 text-blue-600 underline">
            <Link to="/shop">Shop All Products</Link>
            <Link to="/category/perfumes">Perfumes</Link>
            <Link to="/category/soaps">Soaps</Link>
          </div>
        </section>
      </section>
    </>
  );
}
