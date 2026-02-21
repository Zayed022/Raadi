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
      

      <Footer />
    </>
  );
}

export default Shop;
