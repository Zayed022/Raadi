import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiSearch, FiHeart, FiShoppingBag, FiMenu, FiX, FiArrowRight,
} from "react-icons/fi";
import Logo from "../../public/Logo.jpeg";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  // ✅ CONTEXT
const { cart } = useCart();
const { wishlist } = useWishlist();

 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const typingTimer = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close search on route change */
  useEffect(() => {
    setSearchOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  /* focus input when search opens */
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 60);
  }, [searchOpen]);

  
// ✅ DERIVED COUNTS
const wishlistCount = wishlist.length;

const cartCount = cart.reduce(
  (sum, item) => sum + item.quantity,
  0
);
  

  const handleSearch = (value) => {
    setSearchQuery(value);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => fetchSearchResults(value), 350);
  };

  const fetchSearchResults = async (query) => {
    if (!query.trim()) { setSearchResults([]); setShowDropdown(false); return; }
    setSearchLoading(true);
    try {
      const res = await axios.get(`https://raadi-jdun.onrender.com/api/v1/products?search=${query}`);
      setSearchResults(res.data.products || []);
      setShowDropdown(true);
    } catch { setSearchResults([]); }
    finally { setSearchLoading(false); }
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setShowDropdown(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Shop", path: "/shop" },
    { name: "Contact", path: "/contact-us" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=DM+Sans:wght@400;500;600&display=swap');

        .nb-root { font-family: 'DM Sans', sans-serif; }

        /* nav */
        .nb-nav {
          position: sticky; top: 0; z-index: 50;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(0,0,0,0.07);
          transition: box-shadow 0.3s, background 0.3s;
        }
        .nb-nav.scrolled {
          box-shadow: 0 2px 24px rgba(0,0,0,0.07);
          background: rgba(255,255,255,0.98);
        }
        .nb-inner {
          max-width: 1200px; margin: 0 auto;
          height: 68px; padding: 0 24px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 32px;
        }

        /* logo */
        .nb-logo img { height: 44px; width: auto; object-fit: contain; transition: transform 0.25s; }
        .nb-logo:hover img { transform: scale(1.03); }

        /* desktop links */
        .nb-links { display: flex; align-items: center; gap: 36px; }
        .nb-link {
          font-size: 15px; font-weight: 500; color: #3d3d3d;
          text-decoration: none; letter-spacing: 0.01em;
          position: relative; padding-bottom: 2px;
          transition: color 0.2s;
        }
        .nb-link::after {
          content: ''; position: absolute; bottom: -2px; left: 0;
          width: 0; height: 1.5px; background: #c2410c;
          transition: width 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .nb-link:hover, .nb-link.active { color: #c2410c; }
        .nb-link:hover::after, .nb-link.active::after { width: 100%; }

        /* icon group */
        .nb-icons { display: flex; align-items: center; gap: 6px; }
        .nb-icon-btn {
          position: relative; width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 10px; border: none; background: transparent;
          color: #3d3d3d; cursor: pointer; transition: background 0.18s, color 0.18s;
          text-decoration: none;
        }
        .nb-icon-btn:hover { background: #fff4ed; color: #c2410c; }
        .nb-icon-btn svg { font-size: 19px; }

        /* cart btn special */
        .nb-cart-btn {
          background: #1a1a1a; color: #fff;
          padding: 0 16px; width: auto; gap: 7px;
          border-radius: 10px; font-size: 14px; font-weight: 600;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .nb-cart-btn:hover { background: #c2410c; color: #fff; transform: translateY(-1px); }
        .nb-cart-btn span.label { font-family: 'DM Sans', sans-serif; }

        /* badge */
        .nb-badge {
          position: absolute; top: 4px; right: 4px;
          min-width: 16px; height: 16px; padding: 0 4px;
          background: #c2410c; color: #fff;
          font-size: 9px; font-weight: 700; border-radius: 999px;
          display: flex; align-items: center; justify-content: center;
          pointer-events: none; box-shadow: 0 0 0 2px #fff;
        }
        .nb-badge.blue { background: #1d4ed8; }

        /* search overlay */
        .nb-search-overlay {
          position: fixed; inset: 0; z-index: 70;
          background: rgba(10,10,10,0.55);
          backdrop-filter: blur(8px);
          display: flex; align-items: flex-start; justify-content: center;
          padding-top: 96px; padding-inline: 20px;
          animation: fadeIn 0.18s ease;
        }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

        .nb-search-box {
          width: 100%; max-width: 620px;
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,0.22);
          animation: slideDown 0.22s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px) } to { opacity: 1; transform: translateY(0) } }

        .nb-search-row {
          display: flex; align-items: center; gap: 12px;
          padding: 18px 20px;
          border-bottom: 1px solid #f0f0f0;
        }
        .nb-search-row svg { font-size: 20px; color: #999; flex-shrink: 0; }
        .nb-search-input {
          flex: 1; border: none; outline: none;
          font-size: 17px; font-family: 'DM Sans', sans-serif;
          color: #1a1a1a; background: transparent;
        }
        .nb-search-input::placeholder { color: #bbb; }
        .nb-search-close {
          width: 30px; height: 30px; border-radius: 8px;
          background: #f4f4f4; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s; flex-shrink: 0;
        }
        .nb-search-close:hover { background: #ffe4d6; color: #c2410c; }

        /* results */
        .nb-results { max-height: 360px; overflow-y: auto; }
        .nb-results::-webkit-scrollbar { width: 4px; }
        .nb-results::-webkit-scrollbar-track { background: transparent; }
        .nb-results::-webkit-scrollbar-thumb { background: #e5e5e5; border-radius: 999px; }

        .nb-result-empty {
          padding: 32px 20px; text-align: center;
          font-size: 14px; color: #aaa;
          font-family: 'DM Sans', sans-serif;
        }
        .nb-result-loading {
          padding: 28px 20px; display: flex; align-items: center;
          justify-content: center; gap: 10px;
          font-size: 14px; color: #aaa;
        }
        .nb-result-item {
          display: flex; align-items: center; gap: 14px;
          padding: 12px 20px;
          cursor: pointer; transition: background 0.15s;
          border-bottom: 1px solid #fafafa;
        }
        .nb-result-item:last-child { border-bottom: none; }
        .nb-result-item:hover { background: #fff8f5; }
        .nb-result-img {
          width: 52px; height: 52px; border-radius: 10px;
          object-fit: contain; background: #f7f7f7;
          border: 1px solid #f0f0f0; flex-shrink: 0;
        }
        .nb-result-name { font-size: 14px; font-weight: 500; color: #1a1a1a; margin-bottom: 3px; }
        .nb-result-price {
          font-size: 14px; font-weight: 700; color: #c2410c;
          font-family: 'DM Sans', sans-serif;
        }
        .nb-result-arrow { margin-left: auto; color: #ddd; flex-shrink: 0; transition: color 0.15s, transform 0.15s; }
        .nb-result-item:hover .nb-result-arrow { color: #c2410c; transform: translateX(2px); }

        /* search hint */
        .nb-search-hint {
          padding: 14px 20px;
          font-size: 12px; color: #c0c0c0;
          border-top: 1px solid #f5f5f5;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.02em;
        }
        .nb-search-hint kbd {
          display: inline-flex; align-items: center; justify-content: center;
          background: #f4f4f4; border: 1px solid #e5e5e5;
          border-radius: 5px; font-size: 11px; padding: 1px 6px;
          margin: 0 2px; color: #888; font-family: 'DM Sans', sans-serif;
        }

        /* mobile menu */
        .nb-mobile-btn {
          background: none; border: none; cursor: pointer;
          font-size: 24px; color: #1a1a1a; padding: 6px;
          display: none;
        }
        .nb-drawer {
          position: fixed; inset: 0; z-index: 60;
          background: #fff;
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .nb-drawer.open { transform: translateX(0); }
        .nb-drawer-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 20px; height: 68px; border-bottom: 1px solid #f0f0f0;
        }
        .nb-drawer-head img { height: 40px; }
        .nb-drawer-close {
          width: 36px; height: 36px; border-radius: 10px;
          background: #f4f4f4; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; color: #444;
        }
        .nb-drawer-links { padding: 24px 20px; display: flex; flex-direction: column; gap: 4px; }
        .nb-drawer-link {
          font-size: 22px; font-weight: 500;
          font-family: 'Cormorant Garamond', serif;
          color: #1a1a1a; text-decoration: none;
          padding: 12px 0;
          border-bottom: 1px solid #f5f5f5;
          display: flex; align-items: center; justify-content: space-between;
          transition: color 0.2s;
        }
        .nb-drawer-link:hover, .nb-drawer-link.active { color: #c2410c; }
        .nb-drawer-link svg { font-size: 16px; opacity: 0.4; }
        .nb-drawer-icons {
          padding: 20px;
          display: flex; gap: 12px;
        }

        /* loading dots */
        .nb-dots { display: flex; gap: 5px; }
        .nb-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #c2410c; opacity: 0.4;
          animation: pulse 1.2s ease-in-out infinite;
        }
        .nb-dot:nth-child(2) { animation-delay: 0.2s; }
        .nb-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes pulse { 0%,100%{opacity:0.2;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }

        @media (max-width: 768px) {
          .nb-links, .nb-icons { display: none; }
          .nb-mobile-btn { display: flex; }
        }
      `}</style>

      <div className="nb-root">
        {/* ── NAVBAR ── */}
        <nav className={`nb-nav ${scrolled ? "scrolled" : ""}`}>
          <div className="nb-inner">

            {/* Logo */}
            <Link to="/" className="nb-logo">
              <img src={Logo} alt="RAADI" />
            </Link>

            {/* Desktop Links */}
            <nav className="nb-links">
              {links.map((l) => (
                <Link
                  key={l.name}
                  to={l.path}
                  className={`nb-link ${location.pathname === l.path ? "active" : ""}`}
                >
                  {l.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Icons */}
            <div className="nb-icons">
              <button className="nb-icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
                <FiSearch />
              </button>

              <Link to="/wishlist" className="nb-icon-btn" aria-label="Wishlist">
                <FiHeart />
                {wishlistCount > 0 && <span className="nb-badge">{wishlistCount}</span>}
              </Link>

              <Link to="/cart" className="nb-icon-btn nb-cart-btn" aria-label="Cart">
                <FiShoppingBag style={{ fontSize: 17 }} />
                <span className="label">Cart</span>
                {cartCount > 0 && (
                  <span style={{
                    background: "#fff",
                    color: "#c2410c",
                    fontWeight: 700,
                    fontSize: 12,
                    borderRadius: 999,
                    padding: "1px 7px",
                    marginLeft: 2,
                  }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button className="nb-mobile-btn" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
              <FiMenu />
            </button>
          </div>
        </nav>

        {/* ── MOBILE DRAWER ── */}
        <div className={`nb-drawer ${mobileMenuOpen ? "open" : ""}`}>
          <div className="nb-drawer-head">
            <img src={Logo} alt="RAADI" />
            <button className="nb-drawer-close" onClick={() => setMobileMenuOpen(false)}>
              <FiX />
            </button>
          </div>
          <div className="nb-drawer-links">
            {links.map((l) => (
              <Link
                key={l.name}
                to={l.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`nb-drawer-link ${location.pathname === l.path ? "active" : ""}`}
              >
                {l.name}
                <FiArrowRight />
              </Link>
            ))}
          </div>
          <div className="nb-drawer-icons">
            <Link to="/wishlist" className="nb-icon-btn" onClick={() => setMobileMenuOpen(false)}>
              <FiHeart />
              {wishlistCount > 0 && <span className="nb-badge">{wishlistCount}</span>}
            </Link>
            <Link to="/cart" className="nb-icon-btn nb-cart-btn" onClick={() => setMobileMenuOpen(false)}>
              <FiShoppingBag style={{ fontSize: 17 }} />
              <span className="label">Cart</span>
              {cartCount > 0 && (
                <span style={{ background: "#fff", color: "#c2410c", fontWeight: 700, fontSize: 12, borderRadius: 999, padding: "1px 7px", marginLeft: 2 }}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* ── SEARCH OVERLAY ── */}
        {searchOpen && (
          <div className="nb-search-overlay" onClick={closeSearch}>
            <div className="nb-search-box" onClick={(e) => e.stopPropagation()}>

              {/* Input row */}
              <div className="nb-search-row">
                <FiSearch />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="nb-search-input"
                  placeholder="Search products…"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Escape" && closeSearch()}
                />
                <button className="nb-search-close" onClick={closeSearch}>
                  <FiX size={14} />
                </button>
              </div>

              {/* Results */}
              {showDropdown && (
                <div className="nb-results">
                  {searchLoading ? (
                    <div className="nb-result-loading">
                      <div className="nb-dots">
                        <div className="nb-dot" />
                        <div className="nb-dot" />
                        <div className="nb-dot" />
                      </div>
                      <span style={{ fontSize: 13, color: "#aaa" }}>Searching…</span>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="nb-result-empty">No products found for "{searchQuery}"</div>
                  ) : (
                    searchResults.map((p) => (
                      <div
                        key={p._id}
                        className="nb-result-item"
                        onClick={() => { closeSearch(); navigate(`/product/${p._id}`); }}
                      >
                        <img src={p.images?.[0]} alt={p.name} className="nb-result-img" />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="nb-result-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                          <div className="nb-result-price">₹{p.price}</div>
                        </div>
                        <FiArrowRight className="nb-result-arrow" size={15} />
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Hint bar */}
              <div className="nb-search-hint">
                Press <kbd>Esc</kbd> to close · <kbd>↵</kbd> to select
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}