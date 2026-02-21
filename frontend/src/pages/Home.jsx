import { useNavigate } from "react-router-dom";
import BestSeller from "../components/BestSeller";
import CategorySection from "../components/Category";
import Footer from "../components/Footer";
import GalleryCarousel from "../components/Gallery";
import HomeBanner from "../components/HomeBanner";
import PromoGrid from "../components/PromoCard";
import SpecialProduct from "../components/SpecialProduct";

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      {/* H1 for SEO (can be visually hidden if needed) */}
      <h1 style={{ position: "absolute", left: "-9999px" }}>
        Raadii – Luxury Perfumes, Soaps & Home Fragrances
        <img src="Raadi.png" alt="" />
      </h1>

      <main>
        <section aria-label="Hero section">
          <HomeBanner />
        </section>

        <section aria-label="Promotions">
          <PromoGrid />
        </section>

        <section aria-label="Best selling products">
          <BestSeller />
        </section>

        <section aria-label="Special products">
          <SpecialProduct />
        </section>

        <section aria-label="Product categories">
          <CategorySection />
        </section>
        <div className="flex justify-center mt-14">
  <button
    onClick={() => navigate("/shop")}
    className="
      bg-[#E6B174]
      hover:bg-[#dca35e]
      text-white
      font-semibold
      text-lg
      px-16
      py-4
      rounded-xl
      shadow-md
      transition-all
      duration-300
      hover:shadow-lg
      hover:-translate-y-0.5
      active:translate-y-0
    "
  >
    View All Products
  </button>
</div>

        <section aria-label="Brand gallery">
          <GalleryCarousel />
        </section>
      </main>

      <Footer />
    </>
  );
}


