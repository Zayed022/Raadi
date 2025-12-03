import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function WhatWeOffer() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section
      className="w-full py-24 bg-gradient-to-b from-[#1d1f24] to-[#0f1013] text-white"
      id="what-we-offer"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4" data-aos="fade-up">
          What We Offers
        </h2>

        <p
          className="text-gray-300 max-w-3xl mx-auto text-lg mb-20"
          data-aos="fade-up"
        >
          At Siraj Enterprises, we bring you a carefully curated selection of
          premium products designed to elevate everyday experiences:
        </p>

        {/* GRID */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-y-24 gap-x-6 md:gap-y-32 mt-10">

          {/* Left Top */}
          <div className="md:text-left" data-aos="fade-right">
            <h3 className="text-2xl font-bold">Premium Perfumes</h3>
            <p className="text-gray-400 mt-3 max-w-sm">
              Exquisite fragrances crafted for sophistication and elegance.
            </p>
          </div>

          {/* Center Logo */}
          <div className="flex justify-center items-center" data-aos="zoom-in">
            <img
              src="/images/raadi-logo.png" // replace path with actual RAADI logo
              alt="RAADI"
              className="w-64 md:w-80 opacity-90 hover:scale-110 transition duration-500"
            />
          </div>

          {/* Right Top */}
          <div className="md:text-right" data-aos="fade-left">
            <h3 className="text-2xl font-bold">Captivating Scents & Aromas</h3>
            <p className="text-gray-400 mt-3 max-w-sm ml-auto">
              Soothing and exotic aromas that refresh your senses.
            </p>
          </div>

          {/* Left bottom */}
          <div className="md:text-left" data-aos="fade-right">
            <h3 className="text-2xl font-bold">Elegant Diffusers</h3>
            <p className="text-gray-400 mt-3 max-w-sm">
              Stylish diffusers that enhance any space with lasting fragrance.
            </p>
          </div>

          <div></div> {/* spacer */}

          {/* Right bottom */}
          <div className="md:text-right" data-aos="fade-left">
            <h3 className="text-2xl font-bold">Authentic Spices</h3>
            <p className="text-gray-400 mt-3 max-w-sm ml-auto">
              Handpicked, high-quality spices for true flavor and aroma.
            </p>
          </div>
        </div>

        {/* Decorative Arrows */}
        <img
          src="/images/dotted-arrow-left-top.svg"
          className="hidden md:block absolute left-[23%] top-[37%] w-40 opacity-50"
          alt=""
        />
        <img
          src="/images/dotted-arrow-right-top.svg"
          className="hidden md:block absolute right-[23%] top-[37%] w-40 opacity-50"
          alt=""
        />
        <img
          src="/images/dotted-arrow-left-bottom.svg"
          className="hidden md:block absolute left-[23%] bottom-[12%] w-40 opacity-50"
          alt=""
        />
        <img
          src="/images/dotted-arrow-right-bottom.svg"
          className="hidden md:block absolute right-[23%] bottom-[12%] w-40 opacity-50"
          alt=""
        />
      </div>
    </section>
  );
}
