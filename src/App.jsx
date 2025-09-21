import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Checkout from "./pages/Checkout";
import ProductDetail from "./context/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost"; // ✅ ensure file is named BlogPost.jsx
import PaymentStatus from "./pages/PaymentStatus";
import ScrollToTop from "./pages/ScrollToTop";

import { CartProvider } from "./context/CartContext";
import "./index.css";

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop /> {/* ✅ keeps page top on route change */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blogpost/:id" element={<BlogPost />} />
          <Route path="/payment-status" element={<PaymentStatus />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
