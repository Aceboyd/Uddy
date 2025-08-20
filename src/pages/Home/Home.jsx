import React, { useState } from "react";
import Nav from "../../Components/Nav/Nav";
import Hero from "../Home/Hero/Hero";
import Feature from "../Home/Feature/Feature";
import ShopByCategory from "../ShopByCategory";
import Blog from "../Blog";
import Testimony from "../Testimony";
import ContactUs from "../ContactUs";
import Footer from "../Footer";
const Home = () => {
  const [cart, setCart] = useState([]); // cart state

  // Example: function to add an item to the cart
  const handleAddToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  return (
    <div>
      {/* Pass cart length to Nav */}
      <Nav cartCount={cart.length} />

      {/* Pass handleAddToCart to Feature so it can update cart */}
      <Hero />
      <Feature onAddToCart={handleAddToCart} />
      <ShopByCategory />
      <Blog />
      <Testimony />   
      <ContactUs />
      <Footer />

    </div>
  );
};

export default Home;
