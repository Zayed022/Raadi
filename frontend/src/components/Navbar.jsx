import { Link, useLocation } from "react-router-dom";
import { FiSearch, FiHeart, FiUser, FiShoppingBag } from "react-icons/fi";

export default function Navbar() {
  const location = useLocation();

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Shop", path: "/products" },
    { name: "Contact", path: "/contact" },
  ];

  const activeLink = (path) =>
    location.pathname === path ? "text-orange-500" : "text-gray-800";

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow">
      
      {/* Logo */}
      <Link to="/" className="text-3xl font-extrabold text-orange-500 tracking-wider">
        RAADI
      </Link>

      {/* Center nav menu */}
      <div className="flex gap-10 font-medium text-lg">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`relative ${activeLink(link.path)} hover:text-orange-500 transition`}
          >
            {link.name}
            {location.pathname === link.path && (
              <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-orange-500 rounded"></span>
            )}
          </Link>
        ))}
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-6 text-2xl text-gray-800">
        <FiSearch className="cursor-pointer hover:text-orange-500" />
        <Link to="/wishlist">
          <FiHeart className="cursor-pointer hover:text-orange-500" />
        </Link>
        <Link to="/login">
          <FiUser className="cursor-pointer hover:text-orange-500" />
        </Link>

        {/* Cart icon with badge */}
        <Link to="/cart" className="relative">
          <FiShoppingBag className="cursor-pointer hover:text-orange-500" />
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            2
          </span>
        </Link>
      </div>
    </nav>
  );
}
