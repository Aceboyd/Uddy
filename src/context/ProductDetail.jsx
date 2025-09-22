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
        const res = await fetch(
          `https://uddy.onrender.com/details/products/${id}/`
        );
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
      <div className="font-['Playfair_Display',_serif] bg-gray-50 min-h-screen">
        <Nav className="fixed top-0 w-full z-10" />
        <div
          className="pt-24 p-6 text-center text-pink-600 text-lg font-medium animate-pulse"
          style={{ color: '#db2777' }}
        >
          Loading product...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="font-['Playfair_Display',_serif] bg-gray-50 min-h-screen">
        <Nav className="fixed top-0 w-full z-10" />
        <div className="pt-24 p-6 flex flex-col items-center text-center text-gray-800">
          <h2 className="text-4xl font-bold mb-4">Product Not Found</h2>
          <Link
            to="/"
            className="text-pink-600 hover:text-pink-800 text-lg font-medium underline transition-colors"
            style={{ color: '#db2777' }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="font-['Playfair_Display',_serif] bg-gray-50 min-h-screen">
      <Nav className="fixed top-0 w-full z-10" />
      <div className="pt-24 px-4 sm:px-6 md:px-8 pb-12">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 border border-pink-600 animate-fade-in">
          <Link
            to="/"
            className="text-pink-600 hover:text-pink-800 text-base sm:text-lg font-medium underline mb-6 inline-block transition-colors"
            style={{ color: '#db2777' }}
          >
            ← Back to Collection
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Image Section */}
            <div className="relative rounded-2xl overflow-hidden shadow-md">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-auto max-h-[500px] lg:max-h-[600px] object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-4 right-4">
                <Heart
                  className="w-8 h-8 text-gray-600 cursor-pointer hover:text-pink-600 transition-colors"
                  style={{ color: '#4b5563', ':hover': { color: '#db2777' } }}
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <h2
                  className="text-pink-600 text-sm uppercase tracking-widest font-semibold"
                  style={{ color: '#db2777' }}
                >
                  {product.category}
                </h2>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-2">
                  {product.title}
                </h1>
              </div>
              <p
                className="text-pink-600 font-semibold text-2xl sm:text-3xl"
                style={{ color: '#db2777' }}
              >
                ₦{parseFloat(product.price).toLocaleString()}
              </p>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                {product.description || "No description available."}
              </p>
              {product.created_at && (
                <p className="text-sm text-gray-500">
                  Added: {new Date(product.created_at).toLocaleDateString()} (
                  {product.time_ago})
                </p>
              )}
              <button
                onClick={() => addToCart(product)}
                className="flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-3 rounded-lg text-lg font-semibold text-white bg-pink-600 hover:bg-pink-800 transition-all shadow-md hover:shadow-lg"
                style={{ backgroundColor: '#db2777' }}
              >
                <ShoppingCart className="w-6 h-6" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;