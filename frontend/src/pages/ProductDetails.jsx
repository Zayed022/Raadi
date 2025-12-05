// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import Footer from "../components/Footer";

/**
 * ProductDetails (responsive, production-like)
 *
 * - Skeleton while loading
 * - Optimistic updates for cart/wishlist
 * - Reviews (fetch + submit) with optimistic UI + server refresh
 * - Accessible controls and ARIA labels
 *
 * NOTE: adjust API_BASE if needed.
 */
const API_BASE = "https://raadi.onrender.com/api/v1";

function SkeletonCard() {
  return (
    <div className="animate-pulse w-full max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-lg p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-gray-100 h-72" />
        <div className="space-y-4">
          <div className="h-8 bg-gray-100 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-6 bg-gray-100 rounded w-1/3" />
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-gray-100 rounded" />
            <div className="h-10 w-24 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // product + UI states
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // cart/wishlist states (UI-driven)
  const [quantity, setQuantity] = useState(1);
  const [inCart, setInCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  // reviews states
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [ratingBreakdown, setRatingBreakdown] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

  // submit review UI
  const [newRating, setNewRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const [relatedProducts, setRelatedProducts] = useState([]);


  // Keep UI snappy - fetch all on mount / id change
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchProduct(), fetchCart(), fetchWishlist(), fetchReviews(), fetchRelatedProducts(),checkLoginStatus()])
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* -------------------- API calls -------------------- */

  // Fetch product details
  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products/${id}`);
      setProduct(res.data.product || null);
    } catch (err) {
      console.error("Product fetch error:", err);
      setProduct(null);
    }
  };

  // Fetch cart to derive quantity/inCart
  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_BASE}/cart`, { withCredentials: true });
      const item = res.data.cart?.items?.find((i) => i.product && (i.product._id === id || i.product === id));
      if (item) {
        setInCart(true);
        setQuantity(item.quantity || 1);
      } else {
        setInCart(false);
        setQuantity(1);
      }
    } catch (err) {
      setInCart(false);
      setQuantity(1);
    }
  };

  // Fetch wishlist to check if in wishlist
  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`${API_BASE}/wishlist`, { withCredentials: true });
      const ids = res.data.wishlist?.products?.map((p) => p._id) || [];
      setInWishlist(ids.includes(id));
    } catch (err) {
      setInWishlist(false);
    }
  };

  // Fetch reviews + compute avg & breakdown
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_BASE}/review/${id}`);
      const list = res.data.reviews || [];
      setReviews(list);

      if (list.length) {
        const avg = list.reduce((s, r) => s + r.rating, 0) / list.length;
        setAvgRating(avg);
      } else setAvgRating(0);

      const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      list.forEach((r) => { if (breakdown[r.rating] !== undefined) breakdown[r.rating]++; });
      setRatingBreakdown(breakdown);
    } catch (err) {
      console.error("Fetch reviews error:", err);
      setReviews([]);
      setAvgRating(0);
      setRatingBreakdown({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
    }
  };

  // Quick check if user logged in (used for enabling review submit)
  const checkLoginStatus = async () => {
    try {
      // prefer profile route, fallback to /users/me if your app uses that
      await axios.get(`${API_BASE}/users/profile`, { withCredentials: true });
      setUserLoggedIn(true);
    } catch {
      try {
        await axios.get(`${API_BASE}/users/me`, { withCredentials: true });
        setUserLoggedIn(true);
      } catch {
        setUserLoggedIn(false);
      }
    }
  };

  const fetchRelatedProducts = async () => {
  try {
    const res = await axios.get(`${API_BASE}/products/recommended/${id}`);
    const list = res.data.recommended || [];
    setRelatedProducts(list.slice(0, 4)); // show only 4 related
  } catch (err) {
    console.log("Related products fetch error:", err);
    setRelatedProducts([]);
  }
};


  /* -------------------- Cart / Wishlist actions (optimistic) -------------------- */

  const addToCart = async () => {
    // optimistic UI
    const prevQty = quantity;
    const prevInCart = inCart;
    setInCart(true);
    setQuantity(prevQty);

    try {
      const res = await axios.post(`${API_BASE}/cart/add`, { productId: id, quantity: Math.max(1, quantity) }, { withCredentials: true });
      // sync with backend (if returned)
      const item = res.data.cart?.items?.find((i) => (i.product.toString && i.product.toString() === id) || i.product === id);
      if (item) setQuantity(item.quantity);
    } catch (err) {
      if (err.response?.status === 401) return navigate("/login");
      console.error("Add to cart error:", err);
      setInCart(prevInCart);
      setQuantity(prevQty);
    }
  };

  const updateCartQuantity = async (newQty) => {
    const prevQty = quantity;
    const prevInCart = inCart;

    if (newQty <= 0) {
      // remove
      setInCart(false);
      setQuantity(1);
      try {
        await axios.delete(`${API_BASE}/cart/remove`, { data: { productId: id }, withCredentials: true });
      } catch (err) {
        console.error("Remove cart error:", err);
        setInCart(prevInCart);
        setQuantity(prevQty);
      }
      return;
    }

    setQuantity(newQty);
    setInCart(true);
    try {
      const res = await axios.put(`${API_BASE}/cart/update`, { productId: id, quantity: newQty }, { withCredentials: true });
      if (!res.data.success) {
        setQuantity(prevQty);
        setInCart(prevInCart);
      }
    } catch (err) {
      if (err.response?.status === 401) return navigate("/login");
      console.error("Update cart quantity error:", err);
      setQuantity(prevQty);
      setInCart(prevInCart);
    }
  };

  const toggleWishlist = async () => {
    const prev = inWishlist;
    setInWishlist(!prev);
    try {
      if (prev) {
        await axios.delete(`${API_BASE}/wishlist/remove`, { data: { productId: id }, withCredentials: true });
      } else {
        await axios.post(`${API_BASE}/wishlist/add`, { productId: id }, { withCredentials: true });
      }
    } catch (err) {
      if (err.response?.status === 401) return navigate("/login");
      console.error("Wishlist toggle error:", err);
      setInWishlist(prev);
    }
  };

  /* -------------------- Reviews submit -------------------- */

  const submitReview = async () => {
    if (!userLoggedIn) return navigate("/login");
    if (!newRating) return alert("Please select star rating");

    setSubmittingReview(true);

    // optimistic local push
    const optimistic = {
      _id: `local-${Date.now()}`,
      user: { name: "You" },
      rating: newRating,
      comment,
      createdAt: new Date().toISOString()
    };
    setReviews((r) => [optimistic, ...r]);
    // recalc average locally
    const updatedList = [optimistic, ...reviews];
    const avg = updatedList.reduce((s, it) => s + it.rating, 0) / updatedList.length;
    setAvgRating(avg);
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    updatedList.forEach((it) => { if (breakdown[it.rating] !== undefined) breakdown[it.rating]++; });
    setRatingBreakdown(breakdown);

    try {
      await axios.post(`${API_BASE}/review/add`, { productId: id, rating: newRating, comment }, { withCredentials: true });
      // refresh canonical list
      await fetchReviews();
      setNewRating(0);
      setComment("");
    } catch (err) {
      console.error("Submit review error:", err);
      // refresh to canonical state if failed
      await fetchReviews();
      alert("Could not submit review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  /* -------------------- Render -------------------- */

  if (loading) return <SkeletonCard />;

  if (!product) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Product not found</h2>
          <button onClick={() => navigate("/shop")} className="mt-4 inline-block px-6 py-2 bg-orange-500 text-white rounded-lg">Go to Shop</button>
        </div>
      </section>
    );
  }

  return (
    <>
    <section className="min-h-screen px-4 py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        {/* PRODUCT CARD */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT: IMAGE */}
          <div className="flex justify-center">
            <div className="bg-[#f7f8fb] rounded-2xl p-6 md:p-10 shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="w-full max-w-[520px] h-auto object-contain rounded-lg"
              />
            </div>
          </div>

          {/* RIGHT: DETAILS */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4">
              {/* show avg rating on product header */}
              <div className="flex items-center gap-2">
                <span className="text-orange-500 font-semibold">{avgRating.toFixed(1)}</span>
                <div className="text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < Math.round(avgRating) ? "text-yellow-400" : "text-gray-200"}>★</span>
                  ))}
                </div>
                <span className="text-sm text-gray-500">({reviews.length})</span>
              </div>
            </div>

            <p className="text-gray-600 text-base md:text-lg max-w-2xl">{product.description || product.shortDescription}</p>

            <div className="flex items-baseline gap-6">
              {product.mrp && <span className="text-gray-400 line-through text-lg md:text-2xl">₹{product.mrp?.toLocaleString("en-IN")}</span>}
              <div className="text-2xl md:text-4xl font-bold text-orange-600">₹{product.price?.toLocaleString("en-IN")}</div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <div className="flex items-center border rounded-lg px-3 md:px-5 py-2 md:py-3 gap-4 bg-white">
                <button aria-label="Decrease" onClick={() => updateCartQuantity(quantity - 1)} className="text-2xl text-gray-700">−</button>
                <div className="min-w-[42px] text-center font-medium">{quantity}</div>
                <button aria-label="Increase" onClick={() => updateCartQuantity(quantity + 1)} className="text-2xl text-gray-700">+</button>
              </div>

              <button
                onClick={addToCart}
                disabled={inCart}
                className={`px-6 py-3 rounded-lg font-semibold transition ${inCart ? "bg-gray-300 text-gray-700 cursor-not-allowed" : "bg-orange-500 text-white hover:bg-orange-600"}`}
                aria-pressed={inCart}
              >
                {inCart ? "Added" : "Add to Cart"}
              </button>

              <button
                onClick={toggleWishlist}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${inWishlist ? "bg-orange-50 text-orange-600 border-orange-200" : "bg-white text-gray-700"}`}
                aria-pressed={inWishlist}
                title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                {inWishlist ? <FaHeart className="text-orange-500" /> : <FiHeart />}
                <span className="text-sm">{inWishlist ? "In Wishlist" : "Wishlist"}</span>
              </button>
            </div>

            {/* small metadata */}
            <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🚚</div>
                <div>
                  <div className="font-semibold">Free Delivery</div>
                  <div className="text-gray-500">5–7 days</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">📦</div>
                <div>
                  <div className="font-semibold">In Stock</div>
                  <div className="text-gray-500">{product.stock > 0 ? "Available" : "Out of stock"}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🛡</div>
                <div>
                  <div className="font-semibold">Guaranteed</div>
                  <div className="text-gray-500">1 year</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="mt-10 bg-white rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="md:flex md:items-start md:gap-8">
            {/* SUMMARY */}
            <div className="md:w-1/4 text-center md:text-left mb-6 md:mb-0">
              <div className="text-4xl md:text-5xl font-extrabold text-orange-500">{avgRating.toFixed(1)}</div>
              <div className="text-gray-600 mt-1">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</div>
              <div className="mt-4 text-yellow-400 text-2xl">
                {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
              </div>
            </div>

            {/* BREAKDOWN + FORM */}
            <div className="md:w-2/4 space-y-4">
              {([5, 4, 3, 2, 1]).map((s) => {
                const total = reviews.length || 1;
                const pct = Math.round((ratingBreakdown[s] / total) * 100);
                return (
                  <div key={s} className="flex items-center gap-4">
                    <div className="w-16 text-sm font-medium">{s} star</div>
                    <div className="flex-1 h-2 bg-gray-200 rounded overflow-hidden">
                      <div className="h-full bg-orange-500" style={{ width: `${pct}%`, transition: "width 400ms ease" }} />
                    </div>
                    <div className="w-10 text-right text-sm text-gray-600">{ratingBreakdown[s]}</div>
                  </div>
                );
              })}
            </div>

            <div className="md:w-1/4">
              <h3 className="text-lg font-semibold mb-2">Write a review</h3>
              {!userLoggedIn ? (
                <div className="text-sm text-gray-600">
                  <button onClick={() => navigate("/login")} className="text-orange-500 underline">Log in</button> to leave a review.
                </div>
              ) : (
                <>
                  <div className="flex gap-2 mb-3 text-2xl">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setNewRating(n)}
                        className={`transition ${n <= newRating ? "text-yellow-400" : "text-gray-300"}`}
                        aria-label={`Rate ${n} stars`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border rounded-lg p-3 text-sm mb-3 resize-none"
                    placeholder="Tell others what you think..."
                  />

                  <button
                    onClick={submitReview}
                    disabled={submittingReview}
                    className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                  >
                    {submittingReview ? "Submitting..." : "Submit"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Individual reviews */}
          <div className="mt-8 space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center text-gray-600 py-6">No reviews yet. Be the first to review!</div>
            ) : (
              reviews.map((r) => (
                <div key={r._id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-semibold">
                        {r.user?.name?.[0] || "U"}
                      </div>
                      <div>
                        <div className="font-semibold">{r.user?.name || "User"}</div>
                        <div className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="text-yellow-500 text-lg">
                      {Array.from({ length: r.rating }).map((_, i) => <span key={i}>★</span>)}
                    </div>
                  </div>
                  {r.comment && <p className="mt-3 text-gray-700">{r.comment}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS SECTION */}
{relatedProducts.length > 0 && (
  <div className="mt-20 max-w-7xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
      Related Products
    </h2>

    <div
      className="
      grid grid-cols-2 
      sm:grid-cols-3 
      md:grid-cols-4 
      gap-6 md:gap-10
    "
    >
      {relatedProducts.map((item) => (
        <div
          key={item._id}
          onClick={() => navigate(`/product/${item._id}`)}
          className="
            bg-white rounded-2xl p-5 shadow-md cursor-pointer
            hover:shadow-xl hover:-translate-y-2 
            transition-all duration-300 group
          "
        >
          {/* IMAGE */}
          <div className="bg-gray-100 rounded-xl h-44 flex items-center justify-center overflow-hidden">
            <img
              src={item.images?.[0]}
              alt={item.name}
              className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
            />
          </div>

          {/* NAME */}
          <h3 className="mt-4 text-lg font-semibold text-gray-900 line-clamp-1">
            {item.name}
          </h3>

          {/* PRICE */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xl font-bold text-orange-600">
              ₹{item.price}
            </span>
            {item.mrp && (
              <span className="text-gray-400 line-through text-sm">
                ₹{item.mrp}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}


    </section>
    <Footer/>
    </>
    
  );
}
