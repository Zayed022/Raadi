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
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Routes>

{/* PUBLIC */}
<Route path="/login" element={<Login />} />

{/* PROTECTED */}
<Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
<Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
<Route path="/products/add" element={<PrivateRoute><ProductAdd /></PrivateRoute>} />
<Route path="/products/manage" element={<PrivateRoute><ProductManager /></PrivateRoute>} />
<Route path="/products/bestSeller" element={<PrivateRoute><AdminBestSellers /></PrivateRoute>} />
<Route path="/products/feature" element={<PrivateRoute><AdminFeaturedProducts /></PrivateRoute>} />
<Route path="/about/banners" element={<PrivateRoute><AdminAboutBanner /></PrivateRoute>} />
<Route path="/about/intro" element={<PrivateRoute><AdminAboutIntro /></PrivateRoute>} />
<Route path="/admin/categories" element={<PrivateRoute><AdminCategories /></PrivateRoute>} />
<Route path="/gallery" element={<PrivateRoute><AdminGallery /></PrivateRoute>} />
<Route path="/home/banners" element={<PrivateRoute><AdminHomeBanner /></PrivateRoute>} />
<Route path="/orders" element={<PrivateRoute><AdminOrders /></PrivateRoute>} />
<Route path="/pricing" element={<PrivateRoute><AdminPricingConfig /></PrivateRoute>} />
<Route path="/card" element={<PrivateRoute><AdminPromoCards /></PrivateRoute>} />
<Route path="/code" element={<PrivateRoute><AdminPromoCodes /></PrivateRoute>} />
<Route path="/special" element={<PrivateRoute><AdminSpecialProduct /></PrivateRoute>} />
<Route path="/video" element={<PrivateRoute><AdminVideoSection /></PrivateRoute>} />

</Routes>
    </>
  )
}

export default App
