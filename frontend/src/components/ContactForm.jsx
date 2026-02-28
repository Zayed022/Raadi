import { useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiEdit3,
  FiMapPin,
  FiClock,
} from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(
        "https://raadi-jdun.onrender.com/api/v1/contact",
        form
      );
      setSuccess(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 4000);
    }
  };

  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-[#fafafa] to-[#f5f7fb] overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">

        {/* LEFT CONTENT */}
        <div>
          <h2 className="text-5xl font-bold text-gray-900 leading-tight">
            Let’s Start a Conversation
          </h2>
          <p className="text-gray-600 mt-6 text-lg">
            Have questions about our products or need assistance?
            Our team is here to help you.
          </p>

          <div className="mt-12 space-y-6">
            <div className="flex items-start gap-4">
              <FiMapPin className="text-orange-500 text-xl mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Our Location</p>
                <p className="text-gray-600 text-sm">
                  Mumbai, Maharashtra, India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FiMail className="text-orange-500 text-xl mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Email</p>
                <p className="text-gray-600 text-sm">
                  enquiry@raadii.in
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FiClock className="text-orange-500 text-xl mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Working Hours</p>
                <p className="text-gray-600 text-sm">
                  Mon – Sat, 9:00 AM – 7:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-10 border border-gray-100"
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-8">
            Send us a Message
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name + Email */}
            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                icon={<FiUser />}
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <InputField
                icon={<FiMail />}
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone + Subject */}
            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                icon={<FiPhone />}
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
              <InputField
                icon={<FiEdit3 />}
                label="Subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="5"
                required
                placeholder="Write your message..."
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition resize-none"
              />
            </div>

            {/* Success Message */}
            {success && (
              <p className="text-green-600 text-sm font-medium">
                Message sent successfully!
              </p>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-95 text-white font-semibold py-3 rounded-xl shadow-lg transition-all"
            >
              {loading ? "Sending..." : "Send Message"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

/* Reusable Input Component */
function InputField({
  icon,
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-400 transition">
        <span className="text-orange-500">{icon}</span>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={label}
          className="w-full outline-none bg-transparent"
        />
      </div>
    </div>
  );
}