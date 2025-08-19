import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "../context/CartContext"; // Adjust path as needed
import Nav from "../Components/Nav/Header";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://uddy.onrender.com/details/products/${id}/`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="font-['Playfair_Display',_serif]">
        <Nav className="fixed top-0 w-full z-10" />
        <div className="pt-24 p-8 text-center text-gray-600">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="font-['Playfair_Display',_serif]">
        <Nav className="fixed top-0 w-full z-10" />
        <div className="pt-24 p-8 text-center text-gray-800">
          <h2 className="text-3xl font-semibold">Product Not Found</h2>
          <Link
            to="/"
            className="text-amber-600 hover:underline text-lg mt-4 inline-block"
          >
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
              {/* Image */}
              <div className="relative overflow-hidden rounded-xl order-1 md:order-2">
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-auto md:h-[600px] object-cover product-image"
                />
              </div>

              {/* Details */}
              <div className="flex flex-col justify-center order-2 md:order-1">
                <h2 className="text-gray-600 text-xs sm:text-sm uppercase tracking-wider mb-1 sm:mb-2">
                  {product.category}
                </h2>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {product.title}
                </h1>
                <p className="text-amber-600 font-semibold text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6">
                  ₦{parseFloat(product.price).toLocaleString()}
                </p>
                <p className="text-gray-700 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
                  {product.description || "No description available."}
                </p>

                {/* Extra info if available */}
                {product.created_at && (
                  <p className="text-sm text-gray-500 mb-2">
                    Added: {new Date(product.created_at).toLocaleDateString()} ({product.time_ago})
                  </p>
                )}

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
