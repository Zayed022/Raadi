import { useEffect, useState, useRef } from "react";
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

import Logo from "../../public/Logo.jpeg"

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

  const typingTimer = useRef(null);

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

  const fetchWishlistCount = async () => {
    try {
      const res = await axios.get("https://raadi.onrender.com/api/v1/wishlist", {
        withCredentials: true,
      });
      setWishlistCount(res.data.wishlist?.products?.length || 0);
    } catch {
      setWishlistCount(0);
    }
  };

  const fetchCartCount = async () => {
    try {
      const res = await axios.get("https://raadi.onrender.com/api/v1/cart", {
        withCredentials: true,
      });
      const qty =
        res.data.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

      setCartCount(qty);
    } catch {
      setCartCount(0);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    clearTimeout(typingTimer.current);

    typingTimer.current = setTimeout(() => {
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
        `https://raadi.onrender.com/api/v1/products?search=${query}`
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
    location.pathname === path ? "text-orange-600 font-semibold" : "text-gray-800";

  return (
    <>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-10 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 select-none">
            <img
              src={Logo}
              alt="RAADI Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex gap-10 text-lg font-medium items-center">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative hover:text-orange-600 transition ${isActive(
                  link.path
                )}`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-orange-600 rounded-md"></span>
                )}
              </Link>
            ))}
          </div>

          {/* DESKTOP ICONS */}
          <div className="hidden md:flex items-center gap-6 text-2xl text-gray-700">
            <FiSearch
              className="cursor-pointer hover:text-orange-600"
              onClick={() => setSearchOpen(true)}
            />

            <Link to="/wishlist" className="relative">
              <FiHeart className="hover:text-orange-600 cursor-pointer" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex justify-center items-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/login">
              <FiUser className="hover:text-orange-600 cursor-pointer" />
            </Link>

            <Link to="/cart" className="relative">
              <FiShoppingBag className="hover:text-orange-600 cursor-pointer" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-orange-600 text-white text-[10px] w-4 h-4 rounded-full flex justify-center items-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="text-3xl text-gray-800 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <FiMenu />
          </button>
        </div>
      </nav>

      {/* FULLSCREEN MOBILE MENU */}
      <div
        className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-out md:hidden
        ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b">
          <img src={Logo} alt="RAADI" className="h-10" />

          <button
            className="text-3xl text-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FiX />
          </button>
        </div>

        {/* Search bar */}
        <div className="px-5 py-4">
          <div
            onClick={() => {
              setMobileMenuOpen(false);
              setSearchOpen(true);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-700 text-base"
          >
            <FiSearch className="text-lg" />
            <span>Search products…</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="px-5 mt-2 space-y-4 text-lg font-medium">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-3 border-b text-gray-800 ${isActive(link.path)}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Extra Actions */}
        <div className="px-5 mt-8 space-y-6 text-xl text-gray-800">
          <Link
            to="/wishlist"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between"
          >
            <span>Wishlist</span>
            <div className="relative text-2xl">
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
            <div className="relative text-2xl">
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
            <FiUser className="text-2xl" />
          </Link>
        </div>
      </div>

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

            {showDropdown && (
              <div className="mt-4 max-h-80 overflow-y-auto border rounded-xl shadow-md bg-white">
                {searchLoading ? (
                  <div className="p-4 text-center text-gray-500">Searching...</div>
                ) : searchResults.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No results found</div>
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
                        <h4 className="font-semibold text-gray-800">{p.name}</h4>
                        <p className="text-orange-600 font-bold">₹{p.price}</p>
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
