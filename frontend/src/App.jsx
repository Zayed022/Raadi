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
