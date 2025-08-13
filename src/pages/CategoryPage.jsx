
import React, { useState } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Adjust path as needed
import Header from '../Components/Nav/Header';

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
  { id: 13, name: 'Luxury Leather Tote', price: '25,000', image: 'https://images.unsplash.com/photo-1534180753760-2a9a7d7e0c1d?auto=format&fit=crop&w=800&q=80', category: 'Bags', description: 'Premium leather tote for elegant style and functionality.' },
  { id: 14, name: 'Designer Crossbody Bag', price: '18,000', image: 'https://images.unsplash.com/photo-1560264357-7a5c51f6b2b9?auto=format&fit=crop&w=800&q=80', category: 'Bags', description: 'Compact crossbody bag for everyday luxury and convenience.' },
  { id: 15, name: 'Luxury Leather Sneakers', price: '30,000', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', category: 'Footwears', description: 'High-end sneakers for casual luxury and comfort.' },
  { id: 16, name: 'Elegant Formal Loafers', price: '28,000', image: 'https://images.unsplash.com/photo-1605348532760-6753d2c433eb?auto=format&fit=crop&w=800&q=80', category: 'Footwears', description: 'Sophisticated loafers for formal occasions and style.' },
  { id: 17, name: 'Luxury Silk Gown', price: '35,000', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80', category: 'Cloths', description: 'Silk gown for evening elegance and sophistication.' },
  { id: 18, name: 'Designer Tailored Shirt', price: '12,000', image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0c2e?auto=format&fit=crop&w=800&q=80', category: 'Cloths', description: 'Tailored shirt for a sophisticated and refined look.' },
  { id: 19, name: 'Luxury Gold Wristwatch', price: '40,000', image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80', category: 'Accessories', description: 'Gold wristwatch for timeless style and luxury.' },
  { id: 20, name: 'Designer Leather Belt', price: '7,000', image: 'https://images.unsplash.com/photo-1509942777745-65c2f0d9e8a8?auto=format&fit=crop&w=800&q=80', category: 'Accessories', description: 'Premium leather belt for fashion accent and elegance.' },
];

const CategoryPage = () => {
  const { addToCart } = useCart();
  const { categoryName } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === categoryName?.toLowerCase()
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="bg-stone-100 min-h-screen relative">
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/20 to-transparent pointer-events-none" />
      <Header />
      <section className="p-3 xs:p-4 sm:p-8 pt-20 sm:pt-20 max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="block md:hidden text-xs xs:text-sm sm:text-base font-serif text-gray-600 mb-4 xs:mb-6">
          <Link to="/" className="hover:text-amber-700 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="capitalize" aria-current="page">
            {categoryName}
          </span>
        </nav>

        <h1 className="text-center mt-4 xs:mt-6 sm:mt-8 mb-6 xs:mb-8 sm:mb-16 text-[24px] xs:text-[28px] sm:text-[30px] font-serif font-bold capitalize text-black leading-tight">
          {categoryName} Collection
        </h1>
        {filteredProducts.length === 0 ? (
          <p className="text-center text-sm xs:text-base sm:text-base font-serif text-gray-600">
            No products found in this category.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
              {displayedProducts.map((product) => (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-2 border border-amber-200"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[200px] xs:h-[220px] sm:h-[400px] object-cover"
                  />
                  <div className="p-3 xs:p-4 text-left">
                    <h2 className="text-sm xs:text-sm sm:text-sm text-gray-500 font-normal mb-1 leading-tight">
                      {product.category}
                    </h2>
                    <h3 className="text-base xs:text-base sm:text-lg font-serif font-light mb-2 border-b border-gray-300 pb-2 leading-tight">
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center mt-3 xs:mt-4">
                      <p className="text-base xs:text-base sm:text-base text-amber-700 font-bold leading-tight">
                        ₦{product.price}
                      </p>
                      <div className="flex items-center gap-2 xs:gap-3">
                        <ShoppingCart
                          className="w-5 h-5 text-gray-700 cursor-pointer hover:text-black"
                          onClick={(e) => {
                            e.preventDefault();
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
            <div className="flex justify-between mt-6 xs:mt-8 px-6">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="bg-gray-50 text-black px-8 py-3 text-lg rounded-lg hover:bg-gray-200 transition-colors border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed w-1/2 sm:w-auto mr-2"
                aria-label="Previous page"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="bg-gray-50 text-black px-8 py-3 text-lg rounded-lg hover:bg-gray-200 transition-colors border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed w-1/2 sm:w-auto ml-2"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default CategoryPage;
