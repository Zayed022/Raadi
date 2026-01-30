import SEO from "../components/SEO";
import Footer from "../components/Footer";

export default function Terms() {
  return (
    <>
      <SEO
        title="Terms & Conditions | Raadi"
        description="Read the terms and conditions governing the use of Raadi’s website and services."
        url="https://raadii.in/terms"
        noIndex={true}
      />

      <div className="max-w-5xl mx-auto px-6 py-12 leading-relaxed text-gray-800">
        <h1 className="text-4xl font-extrabold text-[#0b1b3f] mb-6">
          Terms & Conditions
        </h1>

        {/* (your existing content unchanged) */}
      </div>

      <Footer />
    </>
  );
}
