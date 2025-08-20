import React, { useState, useEffect } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../../context/CartContext";

const FeaturedProducts = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://uddy.onrender.com/details/products/");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 4, products.length));
  };

  return (
    <section className="p-4 sm:p-8 bg-gray-50">
      <h1 className="text-center mt-4 sm:mt-8 mb-8 sm:mb-16 text-[30px] font-semibold">
        💥 Featured Products 💥
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, visibleProducts).map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-transform duration-200 hover:-translate-y-1"
            >
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-[150px] sm:h-[400px] object-cover"
              />
              <div className="p-4 text-left">
                <h2 className="text-xs sm:text-sm text-gray-500 font-normal mb-1">
                  {product.category}
                </h2>
                <h3 className="text-base sm:text-lg font-light mb-2 border-b border-gray-300 pb-2">
                  {product.title}
                </h3>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm sm:text-base text-red-600 font-bold">
                    ₦{parseFloat(product.price).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-3">
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
      )}

      {!loading && visibleProducts < products.length && (
        <div className="text-center mt-8 px-6">
          <button
            onClick={loadMore}
            className="bg-gray-50 text-black px-8 py-3 text-lg rounded-lg hover:bg-gray-200 transition-colors w-full border-2 border-gray-300"
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;
