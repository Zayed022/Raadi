import { FiPhoneCall, FiMail, FiMapPin } from "react-icons/fi";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

export default function ContactDetails() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
        
        {/* ADDRESS CARD */}
        <div
          data-aos="fade-right"
          className="bg-white border border-gray-200 shadow-xl rounded-3xl p-10 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
        >
          <h2 className="text-3xl font-extrabold text-[#071a3c] mb-6 flex items-center gap-3">
            <FiMapPin className="text-orange-500 text-4xl" />
            Address
          </h2>

          <p className="text-gray-900 font-semibold text-lg mb-1">INDIA</p>

          <p className="text-gray-600 leading-relaxed text-base">
            SIRAJ ENTERPRISES <br />
            1204 / The Ambience Court, Vashi 19 D, Groma Marg, <br />
            Navi Mumbai 400703, Maharashtra.
          </p>
        </div>

        {/* CONTACT CARD */}
        <div
          data-aos="fade-left"
          className="bg-white border border-gray-200 shadow-xl rounded-3xl p-10 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
        >
          <h2 className="text-3xl font-extrabold text-[#071a3c] mb-6 flex items-center gap-3">
            <FiPhoneCall className="text-orange-500 text-4xl" />
            Contact
          </h2>

          <p className="text-gray-900 font-semibold text-lg flex items-center gap-2 mb-3">
            <FiPhoneCall className="text-orange-400" />
            +91 8422996280
          </p>

          <p className="text-orange-500 text-lg font-medium underline cursor-pointer hover:text-orange-600 transition">
            <FiMail className="inline-block mr-2" />
            enquiry@raadii.in
          </p>
        </div>

      </div>
    </section>
  );
}
