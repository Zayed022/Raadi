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
    
    <HomeBanner/>
    <PromoGrid/>
    <BestSeller/>
    <SpecialProduct/>
    <CategorySection/>
    <GalleryCarousel/>
    <Footer/>
    </>
  );
}
