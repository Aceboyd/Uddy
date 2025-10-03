import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, ZoomIn, Share2, ChevronDown, ChevronUp } from "lucide-react";
import { useCart } from "../context/CartContext";
import Nav from "../Components/Nav/Header";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showShare, setShowShare] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShare(true);
      setTimeout(() => setShowShare(false), 2000);
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Nav className="fixed top-0 w-full z-20 bg-white shadow-lg" />
        <div className="pt-24 flex items-center justify-center h-[calc(100vh-96px)]">
          <div className="text-pink-600 text-xl font-medium animate-pulse" style={{ color: '#db2777' }}>
            Loading product details...
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Nav className="fixed top-0 w-full z-20 bg-white shadow-lg" />
        <div className="pt-24 flex flex-col items-center justify-center h-[calc(100vh-96px)] text-center px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Product Not Found</h2>
          <p className="text-gray-600 mb-6 text-lg">We couldn't find the product you're looking for.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-pink-600 text-white font-semibold rounded-full hover:bg-pink-700 transition-all duration-300 shadow-md hover:shadow-lg"
            style={{ backgroundColor: '#db2777' }}
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Nav className="fixed top-0 w-full z-20 bg-white shadow-lg" />
      <main className="pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-gray-500 mb-10 font-medium">
          <Link to="/" className="hover:text-pink-600 transition-colors duration-200">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/collection" className="hover:text-pink-600 transition-colors duration-200">Collection</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
          {/* Image Section */}
          <div className="relative group">
            <div className="aspect-w-4 aspect-h-5 rounded-2xl overflow-hidden shadow-xl bg-white transition-transform duration-300 group-hover:shadow-2xl">
              <img
                src={product.image_url}
                alt={product.title}
                className={`w-full h-full object-cover transition-transform duration-500 ${isZoomed ? 'scale-150' : 'scale-100'}`}
              />
            </div>
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="absolute bottom-4 right-4 p-2 bg-white/95 rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-200"
            >
              <ZoomIn className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-between space-y-8">
            <div className="space-y-5">
              <p className="uppercase text-sm tracking-widest text-pink-600 font-medium" style={{ color: '#db2777' }}>
                {product.category}
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
                {product.title}
              </h1>
              <p className="text-2xl lg:text-3xl font-semibold text-pink-600" style={{ color: '#db2777' }}>
                ₦{parseFloat(product.price).toLocaleString()}
              </p>
              <p className="text-gray-600 leading-relaxed text-base lg:text-lg max-w-prose">
                {product.description || "No description available."}
              </p>
            </div>

            {/* Quantity Selector and Actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-lg bg-white shadow-sm">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-4 py-2 text-gray-600 hover:text-pink-600 transition-colors duration-200"
                >
                  -
                </button>
                <span className="px-5 py-2 text-gray-900 font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-4 py-2 text-gray-600 hover:text-pink-600 transition-colors duration-200"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => addToCart({ ...product, quantity })}
                className="flex-1 flex items-center justify-center gap-3 py-4 px-6 bg-pink-600 text-white font-bold text-lg rounded-lg hover:bg-pink-700 transition-all duration-300 shadow-md hover:shadow-xl"
                style={{ backgroundColor: '#db2777' }}
              >
                <ShoppingCart className="w-6 h-6" />
                Add to Cart
              </button>
              <button
                onClick={handleShare}
                className="p-3 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-all duration-200"
              >
                <Share2 className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            {showShare && (
              <p className="text-sm text-green-600 text-center animate-fade-in">Link copied to clipboard!</p>
            )}
          </div>
        </div>

        {/* Product Details Accordion */}
        <section className="mt-12 bg-white rounded-2xl shadow-lg p-6 lg:p-8">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center justify-between w-full text-left text-xl lg:text-2xl font-bold text-gray-900"
          >
            Product Details
            {showDetails ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>
          {showDetails && (
            <div className="mt-4 prose prose-lg text-gray-700 max-w-none">
              <p>{product.description || "Detailed description coming soon."}</p>
            </div>
          )}
        </section>

        {/* Trust Badges */}
        <section className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex flex-col items-center bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
            <p className="text-sm font-semibold text-gray-800">Fast Delivery</p>
            <p className="text-xs text-gray-500 mt-1">3-5 business days</p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
            <p className="text-sm font-semibold text-gray-800">Secure Payment</p>
            <p className="text-xs text-gray-500 mt-1">Trusted checkout</p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
            <p className="text-sm font-semibold text-gray-800">Easy Returns</p>
            <p className="text-xs text-gray-500 mt-1">7-day return policy</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDetail;