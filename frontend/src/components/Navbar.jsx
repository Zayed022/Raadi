import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  FiSearch,
  FiHeart,
  FiUser,
  FiShoppingBag,
  FiMenu,
  FiX,
} from "react-icons/fi";

export default function Navbar() {
  const location = useLocation();

  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchWishlistCount();
    fetchCartCount();

    const handleUpdate = () => {
      fetchWishlistCount();
      fetchCartCount();
    };

    window.addEventListener("storage", handleUpdate);
    return () => window.removeEventListener("storage", handleUpdate);
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
      const totalQty =
        res.data.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ||
        0;

      setCartCount(totalQty);
    } catch {
      setCartCount(0);
    }
  };

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Shop", path: "/shop" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) =>
    location.pathname === path ? "text-orange-500" : "text-gray-800";

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav
        className="
          sticky top-0 z-50 w-full
          bg-white/70 backdrop-blur-lg shadow-md
          border-b border-white/20
        "
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-6 lg:px-10">

          {/* LOGO */}
          <Link
            to="/"
            className="text-3xl md:text-4xl font-extrabold text-orange-500 tracking-wider"
          >
            RAADI
          </Link>

          {/* DESKTOP MENU */}
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

          {/* ICONS */}
          <div className="hidden md:flex items-center gap-8 text-2xl text-gray-700">

            <FiSearch className="cursor-pointer hover:text-orange-500" />

            <Link to="/wishlist" className="relative">
              <FiHeart className="hover:text-orange-500 cursor-pointer" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
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
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-3xl text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <FiMenu />
          </button>
        </div>
      </nav>

      {/* ================= MOBILE MENU OVERLAY ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
             onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* ================= MOBILE SIDEBAR ================= */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-[60]
          transform transition-transform duration-300
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

        {/* Mobile Links */}
        <div className="px-6 mt-6 space-y-6 text-xl font-medium">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block pb-2 border-b ${isActive(link.path)} hover:text-orange-500`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Icons */}
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
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
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
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
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
    </>
  );
}
