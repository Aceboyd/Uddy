import React from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import CATIMG from '/CATIMG.jpg';
import CATIMG2 from '/CATIMG2.jpg';
import CATIMG3 from '/CATIMG3.jpg';
import CATIMG4 from '/CATIMG4.jpg';
import { useCart } from '../../../context/CartContext'; // Adjust path as needed

const products = [
  { id: 1, name: 'Elegant Handbag', price: '14,000', image: 'https://images.pexels.com/photos/2090785/pexels-photo-2090785.jpeg', category: 'Bags' },
  { id: 2, name: 'Men’s Sneakers', price: '21,000', image: 'https://images.pexels.com/photos/904350/pexels-photo-904350.jpeg', category: 'Footwears' },
  { id: 3, name: 'Ladies Gown', price: '18,500', image: 'https://images.pexels.com/photos/19090/pexels-photo.jpg', category: 'Cloths' },
  { id: 4, name: 'Wrist Watch', price: '8,000', image: 'https://images.pexels.com/photos/3782789/pexels-photo-3782789.jpeg', category: 'Accessories' },
  { id: 5, name: 'Classic Backpack', price: '11,200', image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=735&auto=format&fit=crop', category: 'Bags' },
  { id: 6, name: 'Formal Shoes', price: '22,000', image: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?q=80&w=1170&auto=format&fit=crop', category: 'Footwears' },
  { id: 7, name: 'Casual Shirt', price: '9,500', image: 'https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg', category: 'Cloths' },
  { id: 8, name: 'Leather Belt', price: '4,000', image: 'https://images.pexels.com/photos/2633986/pexels-photo-2633986.jpeg', category: 'Accessories' },
];

const categories = [
  { name: 'Bags', image: CATIMG2, description: 'Stylish and functional bags for every occasion.' },
  { name: 'Cloths', image: CATIMG3, description: 'Trendy clothing to elevate your wardrobe.' },
  { name: 'Footwears', image: CATIMG, description: 'Comfortable and fashionable footwear.' },
  { name: 'Accessories', image: CATIMG4, description: 'Perfect add-ons to complete your look.' },
];

const Feature = () => {
  const { addToCart } = useCart();

  return (
    <div className="p-8 bg-gray-50">
      {/* Featured Products */}
      <section>
        <h1 className="text-center mt-8 mb-16 text-[30px] font-semibold">
          💥 Featured Products 💥
        </h1>
        <div className="grid grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-transform duration-200 hover:-translate-y-1"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[400px] object-cover"
              />
              <div className="p-4 text-left">
                <h2 className="text-gray-500 text-sm font-normal mb-1">
                  {product.category}
                </h2>
                <h3 className="text-lg font-light mb-2 border-b border-gray-300 pb-2">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-red-600 font-bold text-base">
                    ₦{product.price}
                  </p>
                  <div className="flex items-center gap-3">
                    <ShoppingCart
                      className="w-5 h-5 text-gray-700 cursor-pointer hover:text-black"
                      onClick={() => addToCart(product)}
                    />
                    <Heart className="w-5 h-5 text-gray-700 cursor-pointer hover:text-red-500" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by Category */}
      <section className="mt-16">
        <h1 className="text-center mb-16 text-[30px] font-semibold">
          Shop by Category
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-transform duration-200 hover:-translate-y-1"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-[200px] object-cover"
              />
              <div className="p-4 text-left">
                <h3 className="mb-2 font-medium">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Feature;