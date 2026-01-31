import React from "react";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";

import ShopProduct from "../components/ShopProduct";
import Footer from "../components/Footer";

function Shop() {
  return (
    <>
      <SEO
        title="Shop Luxury Perfumes, Soaps & Diffusers | Raadii"
        description="Shop premium perfumes, handcrafted soaps and aroma diffusers by Raadii. Designed for long-lasting fragrance."
        url="https://raadii.in/shop"
      />

      <h1 className="sr-only">
        Shop Luxury Perfumes, Soaps & Home Fragrances
      </h1>

      <ShopProduct />

      {/* Internal category links */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-xl font-semibold mb-3">Browse by Category</h2>
        <ul className="flex gap-6 text-blue-600 underline">
          <li><Link to="/category/perfumes">Perfumes</Link></li>
          <li><Link to="/category/soaps">Soaps</Link></li>
        </ul>
      </section>

      <Footer />
    </>
  );
}

export default Shop;
