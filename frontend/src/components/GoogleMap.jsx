import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

export default function GoogleMap() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2
          data-aos="fade-up"
          className="text-center text-4xl md:text-5xl font-bold text-[#071a3c] mb-8"
        >
          Find Us on Map
        </h2>

        <div
          data-aos="zoom-in"
          className="rounded-3xl overflow-hidden shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300"
        >
          <iframe
            title="office-location"
            width="100%"
            height="450"
            loading="lazy"
            allowFullScreen
            className="w-full h-[450px]"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3772.086402938288!2d73.0022102760859!3d19.098253151506785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c2a2155e522b%3A0xe20b65f4a10d7acc!2sThe%20Ambience%20Court%2C%20Plot%20no%202%2C%20The%2C%20Phase%202%2C%20Sector%2019D%2C%20Vashi%2C%20Navi%20Mumbai%2C%20Maharashtra%20400703!5e0!3m2!1sen!2sin!4v1735729474433!5m2!1sen!2sin"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
