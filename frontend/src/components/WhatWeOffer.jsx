import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Logo from "../../public/Logo.jpeg"

export default function WhatWeOffer() {
  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  return (
    <section
      className="w-full py-16 md:py-24 bg-gradient-to-b from-[#1d1f24] to-[#0f1013] text-white"
      id="what-we-offer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-center relative">
        
        {/* Heading */}
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4"
          data-aos="fade-up"
        >
          What We Offer
        </h2>

        {/* Subtext */}
        <p
          className="text-gray-300 max-w-3xl mx-auto text-base sm:text-lg mb-16"
          data-aos="fade-up"
        >
          At Siraj Enterprises, we bring you a carefully curated selection of 
          premium products designed to elevate everyday experiences.
        </p>

        {/* GRID */}
        <div className="
          grid grid-cols-1 
          md:grid-cols-3 
          gap-y-16 md:gap-y-28 gap-x-6
          items-center
        ">
          
          {/* Left Top */}
          <div className="md:text-left text-center px-4" data-aos="fade-right">
            <h3 className="text-xl sm:text-2xl font-bold">Premium Perfumes</h3>
            <p className="text-gray-400 mt-3 max-w-sm mx-auto md:mx-0">
              Exquisite fragrances crafted for sophistication and elegance.
            </p>
          </div>

          {/* Center Logo */}
          <div className="flex justify-center items-center" data-aos="zoom-in">
            <img
              src={Logo}
              alt="RAADI"
              className="
                w-40 sm:w-52 md:w-72 lg:w-80 
                opacity-90 
                hover:scale-110 
                transition duration-500
              "
            />
          </div>

          {/* Right Top */}
          <div className="md:text-right text-center px-4" data-aos="fade-left">
            <h3 className="text-xl sm:text-2xl font-bold">
              Captivating Scents & Aromas
            </h3>
            <p className="text-gray-400 mt-3 max-w-sm mx-auto md:ml-auto">
              Soothing and exotic aromas that refresh your senses.
            </p>
          </div>

          {/* Left Bottom */}
          <div className="md:text-left text-center px-4" data-aos="fade-right">
            <h3 className="text-xl sm:text-2xl font-bold">Elegant Diffusers</h3>
            <p className="text-gray-400 mt-3 max-w-sm mx-auto md:mx-0">
              Stylish diffusers that enhance any space with lasting fragrance.
            </p>
          </div>

          {/* Spacer for MD+ */}
          <div className="hidden md:block"></div>

          {/* Right Bottom */}
          <div className="md:text-right text-center px-4" data-aos="fade-left">
            <h3 className="text-xl sm:text-2xl font-bold">Authentic Spices</h3>
            <p className="text-gray-400 mt-3 max-w-sm mx-auto md:ml-auto">
              Handpicked, high-quality spices for true flavor and aroma.
            </p>
          </div>
        </div>

        {/* Decorative Arrows — Desktop Only */}
        <img
          src="/images/dotted-arrow-left-top.svg"
          className="hidden lg:block absolute left-[18%] top-[32%] w-32 opacity-50"
          alt=""
        />
        <img
          src="/images/dotted-arrow-right-top.svg"
          className="hidden lg:block absolute right-[18%] top-[32%] w-32 opacity-50"
          alt=""
        />
        <img
          src="/images/dotted-arrow-left-bottom.svg"
          className="hidden lg:block absolute left-[18%] bottom-[18%] w-32 opacity-50"
          alt=""
        />
        <img
          src="/images/dotted-arrow-right-bottom.svg"
          className="hidden lg:block absolute right-[18%] bottom-[18%] w-32 opacity-50"
          alt=""
        />
      </div>
    </section>
  );
}
