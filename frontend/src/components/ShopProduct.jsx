import { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";


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


  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchWishlist();
     // Fetch wishlist to prefill hearts
     fetchCart();
  }, [selectedCategory, ratingFilter, sort, priceRange]);

  const fetchProducts = async () => {
  try {
    const res = await axios.get("http://localhost:8000/api/v1/products/", {
      params: {
        search,
        category: selectedCategory,
        rating: ratingFilter,
        sort,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      },
    });

    setProducts(res.data.products);
  } catch (err) {
    console.log("Product Fetch Error", err);
  }
};


  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/category/");
      setCategories(res.data.categories);
    } catch (err) {
      console.log("Category Fetch Error", err);
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
          setWishlist(wishlist.filter((id) => id !== productId));
        }
      } else {
        const res = await axios.post(
          "http://localhost:8000/api/v1/wishlist/add",
          { productId },
          { withCredentials: true }
        );

        if (res.data.success) {
          setWishlist([...wishlist, productId]);
        }
      }
    } catch (err) {
      console.log("Wishlist Error:", err);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/cart", {
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
  };

  const addToCart = async (productId) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/cart/add",
        { productId, quantity: 1 },
        { withCredentials: true }
      );

      if (res.data.success) {
        setCart({ ...cart, [productId]: 1 });
      }
    } catch (err) {
      console.log("Add to cart error:", err);
    }
  };

  const updateQuantity = async (productId, newQty) => {
    try {
      if (newQty <= 0) {
        await axios.delete("http://localhost:8000/api/v1/cart/remove", {
          data: { productId },
          withCredentials: true,
        });
        const updated = { ...cart };
        delete updated[productId];
        setCart(updated);
        return;
      }

      await axios.put(
        "http://localhost:8000/api/v1/cart/update",
        { productId, quantity: newQty },
        { withCredentials: true }
      );

      setCart({ ...cart, [productId]: newQty });
    } catch (err) {
      console.log("Update quantity error:", err);
    }
  };

  const navigate = useNavigate();

const openProductDetails = (id) => {
  navigate(`/product/${id}`);
};


  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex gap-10">

        {/* LEFT FILTER SIDEBAR */}
        <aside className="w-72 bg-white rounded-2xl p-5 shadow-md h-150 sticky top-24">
          <h2 className="font-bold text-2xl mb-4">Filter</h2>

          {/* Search */}
         


          {/* CATEGORY FILTER */}
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

          {/* PRICE RANGE */}
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

          {/* RATING FILTER */}
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
  }}
  className="mt-6 w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
>
  Show All Products
</button>

        </aside>

        {/* RIGHT CONTENT */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-700 text-2xl">
              Selected Products: <b>{products.length}</b>
            </p>

            <select
              className="px-4 py-2 border rounded-lg bg-white shadow-sm hover:shadow-md transition"
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="price_low">Price (Low → High)</option>
              <option value="price_high">Price (High → Low)</option>
              <option value="rating">Rating</option>
              <option value="latest">Newest First</option>
            </select>
          </div>

          {/* PRODUCT CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p) => (
             <div
  key={p._id}
  onClick={() => openProductDetails(p._id)}
  className="bg-white rounded-xl shadow-md overflow-hidden p-3 
             hover:-translate-y-1 hover:shadow-lg transition-all duration-300 
             cursor-pointer"
>
  <div className="relative bg-[#f5f5f7] rounded-lg p-4 
                  flex items-center justify-center h-48">
    <img
      src={p.images[0]}
      alt={p.name}
      className="w-full h-full object-contain transition-all duration-300"
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
        <FiHeart
          size={20}
          className="text-gray-600 hover:text-orange-500 transition"
        />
      )}
    </button>
  </div>

  <h3 className="mt-3 font-semibold text-base">{p.name}</h3>

  <p className="text-gray-500 line-through text-xs">₹{p.mrp}</p>
  <p className="text-lg font-bold">₹{p.price}</p>

  {cart[p._id] ? (
    <div
      className="mt-3 flex items-center justify-between bg-orange-500 
                 text-white rounded-md py-1.5 px-3"
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
      className="w-full mt-3 bg-orange-500 text-white py-1.5 rounded-md 
                 hover:bg-orange-600 transition"
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
