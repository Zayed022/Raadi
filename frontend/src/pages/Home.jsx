import BestSeller from "../components/BestSeller";
import CategorySection from "../components/Category";
import Footer from "../components/Footer";
import GalleryCarousel from "../components/Gallery";
import HomeBanner from "../components/HomeBanner";
import PromoGrid from "../components/PromoCard";
import SpecialProduct from "../components/SpecialProduct";

export default function Home() {
  return (
    <>
      {/* H1 for SEO (can be visually hidden if needed) */}
      <h1 style={{ position: "absolute", left: "-9999px" }}>
        Raadi – Luxury Perfumes, Soaps & Home Fragrances
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

        <section aria-label="Brand gallery">
          <GalleryCarousel />
        </section>
      </main>

      <Footer />
    </>
  );
}
