import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import Raadi from "../../public/Raadi.png"

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand / About */}
        <div>
            <img 
          src={Raadi}
          alt="RAADI Logo" 
          className="w-32 object-contain mb-4"
        />
          <p className="text-sm leading-6">
           Our features include a curated range of premium perfumes, soothing aromas, designer diffusers, and handpicked spices — crafted to elevate your lifestyle.”
          </p>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-white">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-orange-500">Home</Link></li>
            <li><Link to="/products" className="hover:text-orange-500">Shop</Link></li>
            <li><Link to="/wishlist" className="hover:text-orange-500">Wishlist</Link></li>
            <li><Link to="/cart" className="hover:text-orange-500">Cart</Link></li>
          </ul>
        </div>

        {/* Policies / Help */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-white">Help & Support</h3>
          <ul className="space-y-2">
            <li><Link to="/contact" className="hover:text-orange-500">Contact Us</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-orange-500">Privacy Policy</Link></li>
            <li><Link to="/return-policy" className="hover:text-orange-500">Return & Refund</Link></li>
            <li><Link to="/terms" className="hover:text-orange-500">Terms & Conditions</Link></li>
             <li><Link to="/shipping" className="hover:text-orange-500">Shipping Methods</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-white">Newsletter</h3>
          <p className="text-sm mb-3">Subscribe to receive updates, offers & discount coupons.</p>

         

          {/* Social Icons */}
          <div className="flex gap-4 text-xl mt-5">
            <a href="#" className="hover:text-orange-500"><FaFacebookF /></a>
            <a href="#" className="hover:text-orange-500"><FaInstagram /></a>
            <a href="#" className="hover:text-orange-500"><FaTwitter /></a>
            <a href="#" className="hover:text-orange-500"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 mt-8 py-4 text-center text-sm text-gray-400">
        © {year} RAADI. All rights reserved. | Designed & Developed by <span className="text-orange-500">Raadi & Team</span>
      </div>
    </footer>
  );
}
