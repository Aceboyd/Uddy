import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext'; // Adjust path as needed
import Nav from '../Components/Nav/Header';

const products = [
  { id: 1, name: 'Elegant Handbag', price: '14,000', image: 'https://images.pexels.com/photos/2090785/pexels-photo-2090785.jpeg', category: 'Bags', description: 'A stylish and spacious handbag perfect for daily use or special occasions. Made with high-quality leather and durable stitching. Features multiple compartments and an adjustable strap for comfort.', details: { material: 'Premium Leather', dimensions: '15" x 10" x 5"', origin: 'Italy' } },
  { id: 2, name: 'Men’s Sneakers', price: '21,000', image: 'https://images.pexels.com/photos/904350/pexels-photo-904350.jpeg', category: 'Footwears', description: 'Comfortable and trendy sneakers designed for all-day wear. Features breathable mesh, a cushioned sole, and a durable rubber outsole for excellent traction.', details: { material: 'Mesh & Rubber', dimensions: 'Sizes 7-12', origin: 'USA' } },
  { id: 3, name: 'Ladies Gown', price: '18,500', image: 'https://images.pexels.com/photos/19090/pexels-photo.jpg', category: 'Cloths', description: 'An elegant gown with a flattering fit, perfect for formal events or evening outings. Made with soft, flowing fabric and intricate detailing.', details: { material: 'Silk & Chiffon', dimensions: 'Sizes XS-L', origin: 'France' } },
  { id: 4, name: 'Wrist Watch', price: '8,000', image: 'https://images.pexels.com/photos/3782789/pexels-photo-3782789.jpeg', category: 'Accessories', description: 'A sleek wrist watch with a minimalist design, suitable for both casual and formal occasions. Features a stainless steel case and water resistance.', details: { material: 'Stainless Steel', dimensions: '40mm case', origin: 'Switzerland' } },
  { id: 5, name: 'Classic Backpack', price: '11,200', image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=735&auto=format&fit=crop', category: 'Bags', description: 'A versatile backpack with multiple compartments for organization. Ideal for travel or daily commutes. Made with water-resistant material and padded straps.', details: { material: 'Nylon & Leather', dimensions: '18" x 12" x 6"', origin: 'Italy' } },
  { id: 6, name: 'Formal Shoes', price: '22,000', image: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?q=80&w=1170&auto=format&fit=crop', category: 'Footwears', description: 'Polished formal shoes crafted for sophistication and comfort. Perfect for business meetings or formal events. Made with premium leather and a cushioned insole.', details: { material: 'Premium Leather', dimensions: 'Sizes 8-11', origin: 'Italy' } },
  { id: 7, name: 'Casual Shirt', price: '9,500', image: 'https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg', category: 'Cloths', description: 'A lightweight casual shirt with a modern fit, ideal for everyday wear or casual outings. Made with breathable cotton and available in multiple colors.', details: { material: '100% Cotton', dimensions: 'Sizes S-XXL', origin: 'USA' } },
  { id: 8, name: 'Leather Belt', price: '4,000', image: 'https://images.pexels.com/photos/2633986/pexels-photo-2633986.jpeg', category: 'Accessories', description: 'A durable leather belt with a classic buckle, adding a touch of style to any outfit. Adjustable fit and high-quality craftsmanship.', details: { material: 'Genuine Leather', dimensions: 'Adjustable, 30-42"', origin: 'Italy' } },
];

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="font-['Playfair_Display',_serif]">
        <Nav className="fixed top-0 w-full z-10" />
        <div className="pt-24 p-8 text-center text-gray-800">
          <h2 className="text-3xl font-semibold">Product Not Found</h2>
          <Link to="/" className="text-amber-600 hover:underline text-lg mt-4 inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
          
          .luxury-button {
            border: 2px solid #d4af37;
            background: linear-gradient(to right, #1a1a1a, #2c2c2c);
            transition: all 0.3s ease;
          }
          .luxury-button:hover {
            background: #d4af37;
            color: #1a1a1a;
            transform: translateY(-2px);
          }
          .product-image {
            transition: transform 0.5s ease;
          }
          .product-image:hover {
            transform: scale(1.05);
          }
          .fade-in {
            animation: fadeIn 1s ease-in;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <div className="font-['Playfair_Display',_serif]">
        <Nav className="fixed top-0 w-full z-10" />
        <div className="pt-20 md:pt-24 p-4 sm:p-6 md:p-8 bg-amber-50 min-h-screen">

          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 fade-in">
            <Link
              to="/"
              className="text-amber-600 hover:text-amber-700 text-base sm:text-lg underline mb-4 sm:mb-6 inline-block transition-colors"
            >
              ← Back to Collection
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12 gap-6 sm:gap-8">
              
              {/* Image first on mobile, second on desktop */}
              <div className="relative overflow-hidden rounded-xl order-1 md:order-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto md:h-[600px] object-cover product-image"
                />
              </div>

              {/* Details second on mobile, first on desktop */}
              <div className="flex flex-col justify-center order-2 md:order-1">
                <h2 className="text-gray-600 text-xs sm:text-sm uppercase tracking-wider mb-1 sm:mb-2">
                  {product.category}
                </h2>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {product.name}
                </h1>
                <p className="text-amber-600 font-semibold text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6">
                  ₦{product.price}
                </p>
                <p className="text-gray-700 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
                  {product.description}
                </p>
                <div className="border-t border-gray-200 pt-4 sm:pt-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                    Product Details
                  </h3>
                  <ul className="text-gray-700 text-sm sm:text-base space-y-1 sm:space-y-2">
                    <li><span className="font-medium">Material:</span> {product.details.material}</li>
                    <li><span className="font-medium">Dimensions:</span> {product.details.dimensions}</li>
                    <li><span className="font-medium">Origin:</span> {product.details.origin}</li>
                  </ul>
                </div>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 sm:mt-8">
                  <button
                    onClick={() => addToCart(product)}
                    className="luxury-button flex items-center gap-2 sm:gap-3 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-base sm:text-lg font-medium"
                  >
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                    Add to Cart
                  </button>
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700 cursor-pointer hover:text-red-600 transition-colors" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
