
import { Routes, Route } from 'react-router-dom';
import React from 'react';
import Home from './pages/Home/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Checkout from './pages/Checkout';
import ProductDetail from './context/ProductDetail';
import CategoryPage from './pages/CategoryPage';
import Blog from './pages/Blog';
import BlogPost from './pages/blogPosts';
import './index.css';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blogpost/:id" element={<BlogPost />} />

      </Routes>
    </CartProvider>
  );
}

export default App;