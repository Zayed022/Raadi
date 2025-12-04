import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiSearch,
  FiHeart,
  FiUser,
  FiShoppingBag,
  FiMenu,
  FiX,
} from "react-icons/fi";

import Raadi from "../../public/Raadi.png"

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search UI State
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  let typingTimer;

  useEffect(() => {
    fetchWishlistCount();
    fetchCartCount();

    const update = () => {
      fetchWishlistCount();
      fetchCartCount();
    };

    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);

  // Fetch Wishlist Count
  const fetchWishlistCount = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/wishlist", {
        withCredentials: true,
      });
      setWishlistCount(res.data.wishlist?.products?.length || 0);
    } catch {
      setWishlistCount(0);
    }
  };

  // Fetch Cart Count
  const fetchCartCount = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/cart", {
        withCredentials: true,
      });
      const qty =
        res.data.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ||
        0;

      setCartCount(qty);
    } catch {
      setCartCount(0);
    }
  };

  // Search Handler
  const handleSearch = (value) => {
    setSearchQuery(value);
    clearTimeout(typingTimer);

    typingTimer = setTimeout(() => {
      fetchSearchResults(value);
    }, 350);
  };

  const fetchSearchResults = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setSearchLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/products?search=${query}`
      );

      setSearchResults(res.data.products || []);
      setShowDropdown(true);
    } catch (err) {
      console.log("Search Error:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Shop", path: "/shop" },
    { name: "Contact", path: "/contact" },
    { name: "My Orders", path: "/my-orders" },
  ];

  const isActive = (path) =>
    location.pathname === path ? "text-orange-500" : "text-gray-800";

  return (
    <>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg shadow-md border-b border-white/20">
        <div className="max-w-7xl mx-auto h-16 px-6 lg:px-10 flex items-center justify-between">

         {/* LOGO */}
<Link
  to="/"
  className="flex items-center gap-2 select-none"
>
  <img
    src={Raadi}
    alt="RAADI Logo"
    className="
      h-10 
      md:h-12
      w-40 
      object-contain 
      drop-shadow-sm 
      hover:scale-105 
      transition-transform 
      duration-300
    "
  />

  
</Link>


          {/* DESKTOP LINKS */}
          <div className="hidden md:flex gap-12 text-lg font-medium items-center">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative hover:text-orange-500 transition ${isActive(
                  link.path
                )}`}
              >
                {link.name}

                {location.pathname === link.path && (
                  <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-orange-500 rounded-md"></span>
                )}
              </Link>
            ))}
          </div>

          {/* DESKTOP ICONS */}
          <div className="hidden md:flex items-center gap-8 text-2xl text-gray-700">

            <FiSearch
              className="cursor-pointer hover:text-orange-500"
              onClick={() => setSearchOpen(true)}
            />

            <Link to="/wishlist" className="relative">
              <FiHeart className="hover:text-orange-500 cursor-pointer" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex justify-center items-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/login">
              <FiUser className="hover:text-orange-500 cursor-pointer" />
            </Link>

            <Link to="/cart" className="relative">
              <FiShoppingBag className="hover:text-orange-500 cursor-pointer" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs w-5 h-5 rounded-full flex justify-center items-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="text-3xl text-gray-700 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <FiMenu />
          </button>
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 w-72 h-full bg-white shadow-xl z-50 transition-transform duration-300
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-6 h-20 border-b">
          <h2 className="text-3xl font-bold text-orange-500">RAADI</h2>
          <button
            className="text-3xl text-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FiX />
          </button>
        </div>

        {/* MOBILE SEARCH BUTTON */}
        <button
          onClick={() => {
            setMobileMenuOpen(false);
            setSearchOpen(true);
          }}
          className="flex items-center gap-3 px-6 py-4 text-xl border-b"
        >
          <FiSearch /> Search
        </button>

        {/* MOBILE LINKS */}
        <div className="px-6 mt-4 space-y-6 text-xl font-medium">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block pb-2 border-b ${isActive(link.path)}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* MOBILE ICON LINKS */}
        <div className="px-6 mt-10 space-y-6 text-2xl text-gray-700">

          <Link
            to="/wishlist"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between"
          >
            <span>Wishlist</span>
            <div className="relative">
              <FiHeart />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex justify-center items-center">
                  {wishlistCount}
                </span>
              )}
            </div>
          </Link>

          <Link
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between"
          >
            <span>Cart</span>
            <div className="relative">
              <FiShoppingBag />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs w-5 h-5 rounded-full flex justify-center items-center">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>

          <Link
            to="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between"
          >
            <span>Login</span>
            <FiUser />
          </Link>
        </div>
      </aside>

      {/* SEARCH MODAL — Works for Desktop + Mobile */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] flex justify-center px-4"
          onClick={() => {
            setSearchOpen(false);
            setShowDropdown(false);
          }}
        >
          <div
            className="w-full max-w-2xl mt-32 bg-white rounded-2xl p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* SEARCH INPUT */}
            <div className="flex items-center gap-4 border rounded-xl px-4 py-3 shadow-sm">
              <FiSearch className="text-xl text-gray-500" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for perfumes, deodorants, gift packs..."
                className="w-full outline-none text-lg"
              />
              <FiX
                className="text-2xl cursor-pointer hover:text-red-500"
                onClick={() => {
                  setSearchOpen(false);
                  setShowDropdown(false);
                }}
              />
            </div>

            {/* RESULTS DROPDOWN */}
            {showDropdown && (
              <div className="mt-4 max-h-80 overflow-y-auto border rounded-xl shadow-md bg-white">

                {searchLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    Searching...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No results found
                  </div>
                ) : (
                  searchResults.map((p) => (
                    <div
                      key={p._id}
                      onClick={() => {
                        setSearchOpen(false);
                        navigate(`/product/${p._id}`);
                      }}
                      className="flex items-center gap-4 p-4 border-b cursor-pointer hover:bg-gray-100"
                    >
                      <img
                        src={p.images?.[0]}
                        className="w-14 h-14 object-contain rounded-md"
                        alt="product"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {p.name}
                        </h4>
                        <p className="text-orange-600 font-bold">
                          ₹{p.price}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
