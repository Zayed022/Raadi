import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Products from './components/Products/Products'
import ProductAdd from './components/Products/ProductAdd'
import ProductManager from './components/Products/ProductManager'
import AdminAboutBanner from './components/AboutBanner/AboutBanner'
import AdminAboutIntro from './components/AboutIntro/AboutIntro'
import AdminBestSellers from './components/Products/BestSeller'
import AdminCategories from './components/Category/AdminCategories'
import AdminFeaturedProducts from './components/Products/FeaturedProduct'
import AdminGallery from './components/Gallery/Gallery'
import AdminHomeBanner from './components/HomeBanner/HomeBanner'
import AdminOrders from './components/Orders/Orders'
import AdminPricingConfig from './components/Pricing/Pricing'
import AdminPromoCards from './components/PromoCard/PromoCard'
import AdminPromoCodes from './components/PromoCode/PromoCode'
import AdminSpecialProduct from './components/SpecialProduct/SpecialProduct'
import AdminVideoSection from './components/VideoComponent/VideoAdmin'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Routes>

      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/add" element={<ProductAdd />} />
      <Route path="/products/manage" element={<ProductManager />} />
      <Route path="/products/bestSeller" element={<AdminBestSellers />} />
       <Route path="/products/feature" element={<AdminFeaturedProducts />} />
      <Route path="/about/banners" element={<AdminAboutBanner />} />
      <Route path="/about/intro" element={<AdminAboutIntro />} />
      <Route path="/admin/categories" element={<AdminCategories />} />
      <Route path="/gallery" element={<AdminGallery />} />
      <Route path="/home/banners" element={<AdminHomeBanner />} />
      <Route path="/orders" element={<AdminOrders />} />
      <Route path="/pricing" element={<AdminPricingConfig />} />
      <Route path="/card" element={<AdminPromoCards />} />
      <Route path="/code" element={<AdminPromoCodes />} />
      <Route path="/special" element={<AdminSpecialProduct />} />
      <Route path="/video" element={<AdminVideoSection />} />
     </Routes>
    </>
  )
}

export default App
