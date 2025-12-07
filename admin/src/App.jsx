import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Products from './components/Products/Products'
import ProductAdd from './components/Products/ProductAdd'
import ProductManager from './components/Products/ProductManager'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Routes>

      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/add" element={<ProductAdd />} />
       <Route path="/products/manage" element={<ProductManager />} />
     </Routes>
    </>
  )
}

export default App
