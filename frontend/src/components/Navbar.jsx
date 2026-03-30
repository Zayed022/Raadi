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

import Logo from "../../public/Logo.jpeg";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const typingTimer = useRef(null);

  useEffect(() => {
    fetchWishlistCount();
    fetchCartCount();
  }, []);

  const fetchWishlistCount = async () => {
    try {
      const res = await axios.get(
        "https://raadi-jdun.onrender.com/api/v1/wishlist",
        { withCredentials: true }
      );
      setWishlistCount(res.data.wishlist?.products?.length || 0);
    } catch {
      setWishlistCount(0);
    }
  };

  const fetchCartCount = async () => {
    try {
      const res = await axios.get(
        "https://raadi-jdun.onrender.com/api/v1/cart",
        { withCredentials: true }
      );
      const qty =
        res.data.cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
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
        `https://raadi-jdun.onrender.com/api/v1/products?search=${query}`
      );
      setSearchResults(res.data.products || []);
      setShowDropdown(true);
    } catch {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Shop", path: "/shop" },
    { name: "Contact", path: "/contact-us" },
    { name: "My Orders", path: "/my-orders" },
  ];

  return (
    <>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-10 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center select-none">
            <img
              src={Logo}
              alt="RAADI Logo"
              className="h-11 w-auto object-contain transition hover:scale-105"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-12 text-[17px] font-medium items-center">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative group transition ${
                  location.pathname === link.path
                    ? "text-orange-600"
                    : "text-gray-700 hover:text-orange-600"
                }`}
              >
                {link.name}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-orange-600 transition-all duration-300 ${
                    location.pathname === link.path
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <FiSearch className="text-xl text-gray-700 hover:text-orange-600" />
            </button>

            <Link
              to="/wishlist"
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
            >
              <FiHeart className="text-xl text-gray-700 hover:text-orange-600" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-medium shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            

            <Link
              to="/cart"
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
            >
              <FiShoppingBag className="text-xl text-gray-700 hover:text-orange-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-medium shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="text-3xl text-gray-800 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <FiMenu />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-out md:hidden shadow-2xl ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b">
          <img src={Logo} alt="RAADI" className="h-10" />
          <button
            className="text-3xl text-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FiX />
          </button>
        </div>

        <div className="px-5 mt-6 space-y-6 text-lg font-medium">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block border-b pb-4 text-gray-800"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* SEARCH MODAL */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] flex justify-center px-4"
          onClick={() => {
            setSearchOpen(false);
            setShowDropdown(false);
          }}
        >
          <div
            className="w-full max-w-2xl mt-32 bg-white rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 border rounded-2xl px-5 py-4 bg-gray-50 focus-within:ring-2 focus-within:ring-orange-400 transition">
              <FiSearch className="text-xl text-gray-500" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full outline-none text-lg bg-transparent"
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
              <div className="mt-6 max-h-80 overflow-y-auto rounded-2xl border shadow-md">
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
                      className="flex items-center gap-4 p-4 border-b hover:bg-gray-50 cursor-pointer"
                    >
                      <img
                        src={p.images?.[0]}
                        className="w-14 h-14 object-contain rounded-lg"
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