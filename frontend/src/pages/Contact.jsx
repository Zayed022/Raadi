import React from "react";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";

import ContactForm from "../components/ContactForm";
import ContactDetails from "../components/ContactDetails";
import GoogleMap from "../components/GoogleMap";
import Footer from "../components/Footer";

function Contact() {
  return (
    <>
      <SEO
        title="Contact Raadii – Customer Support & Enquiries"
        description="Get in touch with Raadii for product enquiries, support or bulk orders for perfumes, soaps and aroma diffusers."
        url="https://raadii.in/contact"
      />

      <h1 className="sr-only">Contact Raadii</h1>

      <ContactForm />
      <ContactDetails />
      <GoogleMap />

      {/* Internal links */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <p className="text-gray-700">
          Looking for our products? Visit our{" "}
          <Link to="/shop" className="text-blue-600 underline">
            Shop
          </Link>{" "}
          or explore our{" "}
          <Link to="/category/perfumes" className="text-blue-600 underline">
            Perfume Collection
          </Link>.
        </p>
      </section>

      <Footer />
    </>
  );
}

export default Contact;
