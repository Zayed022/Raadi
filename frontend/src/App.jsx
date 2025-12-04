import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import CategoryProducts from "./pages/CategoryProducts";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import RefundPolicy from "./pages/Refund";
import ShippingPolicy from "./pages/Shipping";


function App() {
  return (
    <BrowserRouter>
      <Navbar/>

      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/about" element={<About />} />
         <Route path="/shop" element={<Shop />} />
         <Route path="/contact" element={<Contact />} />
         <Route path="/wishlist" element={<Wishlist />} />
         <Route path="/login" element={<Login />} />
         <Route path="/cart" element={<Cart />} />
         <Route path="/product/:id" element={<ProductDetails />} />
         <Route path="/category/:categoryName" element={<CategoryProducts />} />
         <Route path="/checkout" element={<Checkout />} />
         <Route path="/confirmation" element={<Confirmation />} />
         <Route path="/order-confirmed/:orderId" element={<OrderSuccess />} />
         <Route path="/my-orders" element={<MyOrders />} />
         <Route path="/privacy-policy" element={<PrivacyPolicy />} />
         <Route path="/terms" element={<Terms />} />
         <Route path="/return-policy" element={<RefundPolicy />} />
         <Route path="/shipping" element={<ShippingPolicy />} />


         <Route 
          path="/wishlist" 
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          } />

        <Route path="/login" element={<Login />} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
