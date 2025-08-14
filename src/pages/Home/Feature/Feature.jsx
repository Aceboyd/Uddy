
import React, { useState } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import CATIMG from '/CATIMG.jpg';
import CATIMG2 from '/CATIMG2.jpg';
import CATIMG3 from '/CATIMG3.jpg';
import CATIMG4 from '/CATIMG4.jpg';
import { useCart } from '../../../context/CartContext';

const products = [
  { id: 1, name: 'Elegant Handbag', price: '14,000', image: 'https://images.pexels.com/photos/2090785/pexels-photo-2090785.jpeg', category: 'Bags', description: 'A stylish and spacious handbag perfect for daily use or special occasions. Made with high-quality leather and durable stitching.' },
  { id: 2, name: 'Men’s Sneakers', price: '21,000', image: 'https://images.pexels.com/photos/904350/pexels-photo-904350.jpeg', category: 'Footwears', description: 'Comfortable and trendy sneakers designed for all-day wear. Features breathable mesh and a cushioned sole.' },
  { id: 3, name: 'Ladies Gown', price: '18,500', image: 'https://images.pexels.com/photos/19090/pexels-photo.jpg', category: 'Cloths', description: 'An elegant gown with a flattering fit, perfect for formal events or evening outings. Made with soft, flowing fabric.' },
  { id: 4, name: 'Wrist Watch', price: '8,000', image: 'https://images.pexels.com/photos/3782789/pexels-photo-3782789.jpeg', category: 'Accessories', description: 'A sleek wrist watch with a minimalist design, suitable for both casual and formal occasions.' },
  { id: 5, name: 'Classic Backpack', price: '11,200', image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=735&auto=format&fit=crop', category: 'Bags', description: 'A versatile backpack with multiple compartments for organization. Ideal for travel or daily commutes.' },
  { id: 6, name: 'Formal Shoes', price: '22,000', image: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?q=80&w=1170&auto=format&fit=crop', category: 'Footwears', description: 'Polished formal shoes crafted for sophistication and comfort. Perfect for business meetings or formal events.' },
  { id: 7, name: 'Casual Shirt', price: '9,500', image: 'https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg', category: 'Cloths', description: 'A lightweight casual shirt with a modern fit, ideal for everyday wear or casual outings.' },
  { id: 8, name: 'Leather Belt', price: '4,000', image: 'https://images.pexels.com/photos/2633986/pexels-photo-2633986.jpeg', category: 'Accessories', description: 'A durable leather belt with a classic buckle, adding a touch of style to any outfit.' },
  { id: 9, name: 'Tote Bag', price: '12,500', image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg', category: 'Bags', description: 'A chic tote bag with ample space, perfect for work or casual outings. Crafted with premium materials.' },
  { id: 10, name: 'Running Shoes', price: '19,000', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg', category: 'Footwears', description: 'Lightweight running shoes with superior cushioning, designed for performance and comfort.' },
  { id: 11, name: 'Denim Jacket', price: '15,000', image: 'https://images.pexels.com/photos/1366877/pexels-photo-1366877.jpeg', category: 'Cloths', description: 'A stylish denim jacket with a relaxed fit, ideal for layering in any season.' },
  { id: 12, name: 'Sunglasses', price: '6,500', image: 'https://images.pexels.com/photos/343720/pexels-photo-343720.jpeg', category: 'Accessories', description: 'Trendy sunglasses with UV protection, perfect for adding flair to your look.' },
];

const categories = [
  { name: 'Bags', image: CATIMG2, description: 'Stylish and functional bags for every occasion.' },
  { name: 'Cloths', image: CATIMG3, description: 'Trendy clothing to elevate your wardrobe.' },
  { name: 'Footwears', image: CATIMG, description: 'Comfortable and fashionable footwear.' },
  { name: 'Accessories', image: CATIMG4, description: 'Perfect add-ons to complete your look.' },
];

const Feature = () => {
  const { addToCart } = useCart();
  const [visibleProducts, setVisibleProducts] = useState(4);

  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 4, products.length));
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-50">
      {/* Featured Products */}
      <section>
        <h1 className="text-center mt-4 sm:mt-8 mb-8 sm:mb-16 text-[30px] font-semibold">
          💥 Featured Products 💥
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, visibleProducts).map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-transform duration-200 hover:-translate-y-1"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[150px] sm:h-[400px] object-cover"
              />
              <div className="p-4 text-left">
                <h2 className="text-xs sm:text-sm text-gray-500 font-normal mb-1">
                  {product.category}
                </h2>
                <h3 className="text-base sm:text-lg font-light mb-2 border-b border-gray-300 pb-2">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm sm:text-base text-red-600 font-bold">
                    ₦{product.price}
                  </p>
                  <div className="flex items-center gap-3">
                    <ShoppingCart
                      className="w-5 h-5 text-gray-700 cursor-pointer hover:text-black"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent Link navigation
                        addToCart(product);
                      }}
                    />
                    <Heart className="w-5 h-5 text-gray-700 cursor-pointer hover:text-red-500" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {visibleProducts < products.length && (
          <div className="text-center mt-8 px-6">
            <button
              onClick={loadMore}
              className="bg-gray-50 text-black px-8 py-3 text-lg rounded-lg hover:bg-gray-200 transition-colors w-full border-2 border-gray-300"
              aria-label="Load more products"
            >
              Load More
            </button>
          </div>
        )}
      </section>

      {/* Shop by Category */}
      <section id="shop-by-category" className="mt-8 sm:mt-16">
        <h1 className="text-center mb-8 sm:mb-16 text-[30px] font-semibold">
          Shop by Category
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link
              to={`/category/${category.name.toLowerCase()}`}
              key={category.name}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-transform duration-200 hover:-translate-y-1"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-[100px] sm:h-[200px] object-cover"
              />
              <div className="p-4 text-left">
                <h3 className="text-base sm:font-medium mb-2">
                  {category.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Feature;