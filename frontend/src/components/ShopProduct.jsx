import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { IoFilter, IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

// Stable debounce
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export default function ShopProduct() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState({});

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [ratingFilter, setRatingFilter] = useState(null);
  const [sort, setSort] = useState("");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [search, setSearch] = useState("");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // ---------------- FETCH PRODUCTS ----------------

  const fetchProducts = useCallback(
    debounce(async (filters) => {
      try {
        const res = await axios.get(
          "https://raadi.onrender.com/api/v1/products/",
          { params: filters }
        );
        setProducts(res.data.products);
      } catch (err) {
        console.log("Product Fetch Error", err);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchProducts({
      search,
      category: selectedCategory,
      rating: ratingFilter,
      sort,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  }, [search, selectedCategory, ratingFilter, sort, priceRange]);

  // ---------------- INITIAL LOAD ----------------

  useEffect(() => {
    fetchCategories();
    fetchWishlist();
    fetchCart();
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get(
      "https://raadi.onrender.com/api/v1/category/"
    );
    setCategories(res.data.categories);
  };

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(
        "https://raadi.onrender.com/api/v1/wishlist",
        { withCredentials: true }
      );
      setWishlist(res.data.wishlist?.products?.map((p) => p._id) || []);
    } catch {}
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get(
        "https://raadi.onrender.com/api/v1/cart",
        { withCredentials: true }
      );
      const mapped = {};
      res.data.cart?.items?.forEach((item) => {
        mapped[item.product._id] = item.quantity;
      });
      setCart(mapped);
    } catch {}
  };

  // ---------------- ACTIONS ----------------

  const handleWishlist = async (productId) => {
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
  };

  const addToCart = async (productId) => {
    await axios.post(
      "https://raadi.onrender.com/api/v1/cart/add",
      { productId, quantity: 1 },
      { withCredentials: true }
    );
    setCart((prev) => ({ ...prev, [productId]: 1 }));
  };

  const updateQuantity = async (productId, newQty) => {
    if (newQty <= 0) {
      await axios.delete(
        "https://raadi.onrender.com/api/v1/cart/remove",
        { data: { productId }, withCredentials: true }
      );
      setCart((prev) => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
      return;
    }

    await axios.put(
      "https://raadi.onrender.com/api/v1/cart/update",
      { productId, quantity: newQty },
      { withCredentials: true }
    );

    setCart((prev) => ({ ...prev, [productId]: newQty }));
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setRatingFilter(null);
    setSort("");
    setPriceRange([0, 50000]);
  };

  const openProductDetails = (id) => navigate(`/product/${id}`);

  // ---------------- FILTER CONTENT ----------------

  const FilterContent = (
    <div className="p-6">
      <h2 className="font-semibold text-xl mb-6">Filters</h2>

      {/* CATEGORY */}
      <h3 className="font-medium mb-3">Categories</h3>

      <label className="flex items-center gap-2 mb-2 text-sm">
        <input
          type="radio"
          name="category"
          checked={!selectedCategory}
          onChange={() => setSelectedCategory(null)}
        />
        All
      </label>

      {categories.map((cat) => (
        <label key={cat._id} className="flex items-center gap-2 mb-2 text-sm">
          <input
            type="radio"
            name="category"
            checked={selectedCategory === cat.name}
            onChange={() => setSelectedCategory(cat.name)}
          />
          {cat.name}
        </label>
      ))}

      {/* PRICE */}
      <h3 className="font-medium mt-6 mb-3">Price Range</h3>
      <input
        type="range"
        min="0"
        max="50000"
        value={priceRange[1]}
        onChange={(e) => setPriceRange([0, +e.target.value])}
        className="w-full accent-orange-500"
      />
      <p className="text-sm text-gray-500 mt-1">
        Up to ₹{priceRange[1]}
      </p>

      {/* RATING */}
      <h3 className="font-medium mt-6 mb-3">Rating</h3>
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((stars) => (
          <button
            key={stars}
            onClick={() =>
              setRatingFilter(ratingFilter === stars ? null : stars)
            }
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
              ratingFilter === stars
                ? "bg-orange-50 text-orange-600 font-semibold"
                : "hover:bg-gray-50 text-gray-700"
            }`}
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${
                    i < stars ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span>& up</span>
          </button>
        ))}
      </div>

      <button
        onClick={resetFilters}
        className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm transition"
      >
        Reset Filters
      </button>
    </div>
  );

  // ---------------- UI ----------------

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">

      {/* MOBILE FILTER BUTTON */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="lg:hidden flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg mb-6"
      >
        <IoFilter size={20} />
        Filters
      </button>

      {/* MOBILE DRAWER */}
      {isDrawerOpen && (
        <>
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/40 z-40"
          />
          <div className="fixed top-0 left-0 w-80 h-full bg-white shadow-xl z-50 overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold text-lg">Filters</h2>
              <IoClose
                size={24}
                className="cursor-pointer"
                onClick={() => setIsDrawerOpen(false)}
              />
            </div>
            {FilterContent}
          </div>
        </>
      )}

      <div className="flex gap-10">

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block w-72 bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-24 h-fit">
          {FilterContent}
        </aside>

        {/* PRODUCT GRID */}
        <div className="flex-1">

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-semibold text-gray-800">
              {products.length} Products Found
            </h2>

            <select
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm shadow-sm"
            >
              <option value="">Sort By</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="latest">Newest</option>
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-8">
            {products.map((p) => (
              <div
                key={p._id}
                onClick={() => openProductDetails(p._id)}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col overflow-hidden"
              >
                <div className="relative bg-[#f5f6f8] h-64 flex items-center justify-center p-6">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="max-h-full object-contain group-hover:scale-105 transition"
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWishlist(p._id);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md"
                  >
                    {wishlist.includes(p._id) ? (
                      <FaHeart size={18} className="text-orange-500" />
                    ) : (
                      <FiHeart size={18} className="text-gray-600" />
                    )}
                  </button>
                </div>

                <div className="flex flex-col flex-1 p-5">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px]">
                    {p.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-2">
                    {p.mrp && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{p.mrp}
                      </span>
                    )}
                    <span className="text-lg font-semibold text-gray-900">
                      ₹{p.price}
                    </span>
                  </div>

                  <div className="mt-auto pt-4">
                    {p.stock === 0 ? (
                      <button disabled className="w-full py-2 bg-gray-200 text-gray-600 rounded-lg text-sm">
                        Out of Stock
                      </button>
                    ) : cart[p._id] ? (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-between bg-orange-500 text-white rounded-lg px-4 py-2"
                      >
                        <button onClick={() => updateQuantity(p._id, cart[p._id] - 1)}>–</button>
                        <span>{cart[p._id]}</span>
                        <button onClick={() => updateQuantity(p._id, cart[p._id] + 1)}>+</button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(p._id);
                        }}
                        className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm transition"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}