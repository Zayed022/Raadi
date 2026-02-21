import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import Logo2 from "../../public/Logo2.png";
import { useState } from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-[#0f172a] text-gray-300">
      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* BRAND */}
        <div>
          <img
            src={Logo2}
            alt="RAADI Logo"
            className="w-36 object-contain mb-6"
          />
          <p className="text-sm leading-7 text-gray-400">
            Discover premium perfumes, designer diffusers and curated aromas
            crafted to elevate your lifestyle experience.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-6">
            {[
              { icon: <FaFacebookF />, link: "#" },
              { icon: <FaInstagram />, link: "#" },
              { icon: <FaTwitter />, link: "#" },
              { icon: <FaLinkedinIn />, link: "#" },
            ].map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-orange-500 hover:text-white transition-all duration-300"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        {/* SHOP LINKS */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-6">
            Shop
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/" className="hover:text-orange-500 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-orange-500 transition">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-orange-500 transition">
                Wishlist
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-orange-500 transition">
                Cart
              </Link>
            </li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-6">
            Support
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/contact" className="hover:text-orange-500 transition">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-orange-500 transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/return-policy" className="hover:text-orange-500 transition">
                Return & Refund
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-orange-500 transition">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="hover:text-orange-500 transition">
                Shipping Methods
              </Link>
            </li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-6">
            Stay Updated
          </h3>
          <p className="text-sm text-gray-400 mb-5">
            Subscribe to receive updates, offers and exclusive discounts.
          </p>

          <div className="flex items-center bg-white/5 rounded-xl overflow-hidden border border-white/10 focus-within:border-orange-500 transition">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent px-4 py-3 text-sm outline-none w-full text-gray-200 placeholder-gray-500"
            />
            <button className="bg-orange-500 hover:bg-orange-600 px-4 py-3 text-white transition">
              <FiSend />
            </button>
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-white/10"></div>

      {/* BOTTOM BAR */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
        <p>
          © {year} RAADII. All rights reserved.
        </p>

        <p className="mt-2 md:mt-0">
          Designed & Developed by{" "}
          <span className="text-orange-500 font-medium">
            Raadii & Team
          </span>
        </p>
      </div>
    </footer>
  );
}