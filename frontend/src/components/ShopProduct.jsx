import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IoFilter, IoClose } from "react-icons/io5";

// 💡 Debounce helper to avoid multiple rapid API calls
function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

export default function ShopProduct() {
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

  const navigate = useNavigate();

  // --------------------------------------
  //        API CALLS OPTIMIZED
  // --------------------------------------

  const fetchProducts = useCallback(
    debounce(async (filters) => {
      try {
        const res = await axios.get(
          "https://raadi.onrender.com/api/v1/products/",
          {
            params: filters,
          }
        );
        setProducts(res.data.products);
      } catch (err) {
        console.log("Product Fetch Error", err);
      }
    }, 300), // debounce to prevent repeated calls
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

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://raadi.onrender.com/api/v1/category/"
      );
      setCategories(res.data.categories);
    } catch (err) {
      console.log("Category Fetch Error", err);
    }
  }, []);

  const fetchWishlist = useCallback(async () => {
    try {
      const res = await axios.get("https://raadi.onrender.com/api/v1/wishlist", {
        withCredentials: true,
      });

      setWishlist(res.data.wishlist?.products?.map((p) => p._id) || []);
    } catch (err) {
      console.log("Wishlist Fetch Error:", err);
    }
  }, []);

  const fetchCart = useCallback(async () => {
    try {
      const res = await axios.get("https://raadi.onrender.com/api/v1/cart", {
        withCredentials: true,
      });

      const mapped = {};
      res.data.cart?.items?.forEach((item) => {
        mapped[item.product._id] = item.quantity;
      });
      setCart(mapped);
    } catch (err) {
      console.log("Cart fetch error", err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchWishlist();
    fetchCart();
  }, []);

  // --------------------------------------
  //    MEMOIZED HANDLERS (smooth UI)
  // --------------------------------------

  const handleWishlist = useCallback(
    async (productId) => {
      try {
        if (wishlist.includes(productId)) {
          const res = await axios.delete(
            "https://raadi.onrender.com/api/v1/wishlist/remove",
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
            "https://raadi.onrender.com/api/v1/wishlist/add",
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
    },
    [wishlist]
  );

  const addToCart = useCallback(async (productId) => {
    try {
      const res = await axios.post(
        "https://raadi.onrender.com/api/v1/cart/add",
        { productId, quantity: 1 },
        { withCredentials: true }
      );

      if (res.data.success) {
        setCart((prev) => ({ ...prev, [productId]: 1 }));
      }
    } catch (err) {
      console.log("Add to cart error:", err);
    }
  }, []);

  const updateQuantity = useCallback(async (productId, newQty) => {
    try {
      if (newQty <= 0) {
        await axios.delete("https://raadi.onrender.com/api/v1/cart/remove", {
          data: { productId },
          withCredentials: true,
        });

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
    } catch (err) {
      console.log("Update quantity error:", err);
    }
  }, []);

  const openProductDetails = useCallback(
    (id) => navigate(`/product/${id}`),
    []
  );

  // --------------------------------------
  //         FILTER CONTENT MEMOIZED
  // --------------------------------------

  const FilterContent = useMemo(
    () => (
      <div className="p-5">
        <h2 className="font-bold text-2xl mb-4">Filter</h2>

        {/* CATEGORY */}
        <h3 className="font-semibold text-xl mb-2">Categories</h3>
        {categories.map((cat) => (
          <label key={cat._id} className="flex items-center gap-2 mb-2 text-lg">
            <input
              type="checkbox"
              checked={selectedCategory === cat.name}
              onChange={() =>
                setSelectedCategory(
                  selectedCategory === cat.name ? null : cat.name
                )
              }
            />
            {cat.name}
          </label>
        ))}

        {/* PRICE */}
        <h3 className="font-semibold text-xl mt-6 mb-2">Price Range</h3>
        <input
          type="range"
          min="0"
          max="50000"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, +e.target.value])}
          className="w-full"
        />
        <p className="mt-1 text-lg text-gray-600">Upto ₹{priceRange[1]}</p>

        {/* RATING */}
        <h3 className="font-semibold text-xl mt-6 mb-2">Rating</h3>
        {[5, 4, 3, 2].map((r) => (
          <p
            key={r}
            onClick={() => setRatingFilter(ratingFilter === r ? null : r)}
            className={`cursor-pointer mb-2 ${
              ratingFilter === r ? "font-bold text-orange-500" : "text-gray-700"
            }`}
          >
            ⭐ {r} & up
          </p>
        ))}

        <button
          onClick={() => {
            setSelectedCategory(null);
            setRatingFilter(null);
            setSearch("");
            setSort("");
            setPriceRange([0, 50000]);
            setIsDrawerOpen(false);
          }}
          className="mt-6 w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          Show All Products
        </button>
      </div>
    ),
    [categories, selectedCategory, ratingFilter, priceRange]
  );

  // --------------------------------------
  //                UI RENDER
  // --------------------------------------

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">

      {/* MOBILE FILTER BUTTON */}
      <button
        className="lg:hidden flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg mb-4"
        onClick={() => setIsDrawerOpen(true)}
      >
        <IoFilter size={22} />
        Filters
      </button>

      {/* OVERLAY */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
        ></div>
      )}

      {/* DRAWER */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 lg:hidden`}
        style={{
          transform: isDrawerOpen ? "translateX(0)" : "translateX(-100%)",
          willChange: "transform",
        }}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Filters</h2>
          <IoClose
            size={28}
            className="cursor-pointer"
            onClick={() => setIsDrawerOpen(false)}
          />
        </div>

        {FilterContent}
      </div>

      <div className="flex gap-10">

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block w-72 bg-white rounded-2xl p-5 shadow-md h-fit sticky top-24">
          {FilterContent}
        </aside>

        {/* PRODUCT GRID */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-700 text-xl">
              Selected Products: <b>{products.length}</b>
            </p>

            <select
              className="px-4 py-2 border rounded-lg bg-white shadow-sm"
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="price_low">Price (Low → High)</option>
              <option value="price_high">Price (High → Low)</option>
              <option value="rating">Rating</option>
              <option value="latest">Newest First</option>
            </select>
          </div>

          {/* PRODUCTS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6">

            {products.map((p) => (
              <div
                key={p._id}
                onClick={() => openProductDetails(p._id)}
                className="bg-white rounded-xl shadow-md overflow-hidden p-3 hover:-translate-y-1 hover:shadow-lg transition cursor-pointer"
              >
                <div className="relative bg-[#f5f5f7] rounded-lg p-4 flex items-center justify-center h-40 sm:h-48">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-contain transition duration-300"
                    loading="lazy" // 🔥 prevents lag
                  />

                  <button
                    className="absolute top-3 right-3 z-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWishlist(p._id);
                    }}
                  >
                    {wishlist.includes(p._id) ? (
                      <FaHeart size={20} className="text-orange-500" />
                    ) : (
                      <FiHeart size={20} className="text-gray-600 hover:text-orange-500" />
                    )}
                  </button>
                </div>

                <h3 className="mt-3 font-semibold text-base">{p.name}</h3>
                <p className="text-gray-500 line-through text-xs">₹{p.mrp}</p>
                <p className="text-lg font-bold">₹{p.price}</p>

                {cart[p._id] ? (
                  <div
                    className="mt-3 flex items-center justify-between bg-orange-500 text-white rounded-md py-1.5 px-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => updateQuantity(p._id, cart[p._id] - 1)}
                      className="text-lg font-bold"
                    >
                      –
                    </button>
                    <span className="text-base font-semibold">{cart[p._id]}</span>
                    <button
                      onClick={() => updateQuantity(p._id, cart[p._id] + 1)}
                      className="text-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p._id);
                    }}
                    className="w-full mt-3 bg-orange-500 text-white py-1.5 rounded-md hover:bg-orange-600"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}
