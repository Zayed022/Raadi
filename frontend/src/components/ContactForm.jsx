import { useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FiUser, FiMail, FiPhone, FiEdit3 } from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";

AOS.init();

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/v1/contact", form);
      alert("Message sent successfully!");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      alert("Failed to send message");
      console.log(error);
    }
  };

  return (
    <section className="py-20 px-6 bg-[#fefdfc]">
      <div className="max-w-7xl mx-auto">
        
        {/* Heading */}
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-[#e49b38] mb-10 text-center"
          data-aos="fade-up"
        >
          Get In Touch
        </motion.h2>

        <form
          onSubmit={handleSubmit}
          data-aos="zoom-in"
          className="bg-white shadow-xl rounded-3xl p-10 space-y-8"
        >

          {/* NAME + EMAIL */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-gray-800 font-semibold">Name</label>
              <div className="flex items-center gap-3 border rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-orange-400 transition">
                <FiUser className="text-orange-400 text-lg" />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full outline-none"
                  placeholder="Your Name"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-800 font-semibold">Your Email</label>
              <div className="flex items-center gap-3 border rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-orange-400 transition">
                <FiMail className="text-orange-400 text-lg" />
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Email"
                  className="w-full outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* PHONE + SUBJECT */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-gray-800 font-semibold">Your Phone</label>
              <div className="flex items-center gap-3 border rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-orange-400 transition">
                <FiPhone className="text-orange-400 text-lg" />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-800 font-semibold">Your Subject</label>
              <div className="flex items-center gap-3 border rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-orange-400 transition">
                <FiEdit3 className="text-orange-400 text-lg" />
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  className="w-full outline-none"
                />
              </div>
            </div>
          </div>

          {/* MESSAGE BOX */}
          <div>
            <label className="text-gray-800 font-semibold">Write Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="6"
              placeholder="Message"
              required
              className="w-full border rounded-xl px-4 py-4 shadow-sm focus:ring-2 focus:ring-orange-400 outline-none resize-none"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg py-3 px-10 rounded-xl mx-auto block transition-all shadow-md"
          >
            Send Message
          </motion.button>
        </form>
      </div>
    </section>
  );
}
