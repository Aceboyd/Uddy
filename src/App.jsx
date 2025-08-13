// App.jsx
import { Routes, Route } from 'react-router-dom';
import React from 'react';
import Home from './pages/Home/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Checkout from './pages/Checkout'; // <-- Import Checkout
import ProductDetail from './context/ProductDetail';
import './index.css';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/checkout' element={<Checkout />} /> {/* ✅ Add this */}
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </CartProvider>
  );
}

export default App;
