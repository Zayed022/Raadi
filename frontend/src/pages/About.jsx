import React from "react";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";

import AboutBanner from "../components/AboutBanner";
import StatsCounter from "../components/StatsCounter";
import AboutIntroSection from "../components/AboutIntro";
import VideoSection from "../components/VideoSection";
import MissionSection from "../components/MissionSection";
import TopProducts from "../components/TopProducts";
import FeaturedProducts from "../components/FeaturedProducts";
import Testimonials from "../components/Testimonals";
import WhatWeOffer from "../components/WhatWeOffer";
import Footer from "../components/Footer";

function About() {
  return (
    <>
      <SEO
        title="About Raadii – Luxury Perfumes & Home Fragrances"
        description="Learn about Raadii’s journey in crafting luxury perfumes, soaps, aroma diffusers and premium home fragrances."
        url="https://raadii.in/about"
      />

      <h1 className="sr-only">
        About Raadii – Luxury Perfumes & Home Fragrances
      </h1>

      <AboutBanner />
      <StatsCounter />
      <AboutIntroSection />
      <WhatWeOffer />
      <VideoSection />
      <Testimonials />
      <FeaturedProducts />
      <TopProducts />
      <MissionSection />

      {/* Internal linking block */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-4">Explore Raadi Collections</h2>
        <ul className="list-disc ml-6 text-gray-700">
          <li><Link to="/category/perfumes">Luxury Perfumes</Link></li>
          <li><Link to="/category/soaps">Handcrafted Soaps</Link></li>
          <li><Link to="/shop">Shop All Products</Link></li>
        </ul>
      </section>

      <Footer />
    </>
  );
}

export default About;
