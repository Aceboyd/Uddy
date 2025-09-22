import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Header from '../Components/Nav/Header';

const CategoryPage = () => {
  const { addToCart } = useCart();
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiCategory = categoryName;
        console.log('Fetching products for category:', apiCategory);

        const response = await fetch(
          `https://uddy.onrender.com/details/categories/${encodeURIComponent(apiCategory)}/`
        );

        if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`);

        const data = await response.json();
        console.log('API Response:', data);
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchProducts();
      setCurrentPage(1);
    }
  }, [categoryName]);

  const totalPages = Math.ceil(products.length / productsPerPage);
  const displayedProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="bg-white min-h-screen relative">
      <div className="absolute inset-0 bg-gradient-to-b from-pink-50/30 to-transparent pointer-events-none" />
      <Header />

      <section className="p-3 sm:p-8 pt-20 max-w-7xl mx-auto">
        <nav className="block md:hidden text-sm font-serif text-gray-600 mb-4">
          <Link to="/" className="hover:text-pink-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="capitalize">{categoryName}</span>
        </nav>

        <h1 className="text-center mt-12 md:mt-16 mb-8 text-[28px] sm:text-[30px] font-serif font-bold capitalize">
          {categoryName} Collection
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-600">
            No products found in this category.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-2 border border-pink-200"
                >
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-[250px] object-cover"
                  />
                  <div className="p-4 text-left">
                    <h2 className="text-sm text-gray-500 mb-1">{product.category}</h2>
                    <h3 className="text-lg font-serif mb-2 border-b pb-2">{product.title}</h3>
                    <p className="text-xs text-gray-400 mb-2">
                      {product.time_ago ? `Added ${product.time_ago}` : ""}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-pink-600 font-bold">
                        ₦{parseFloat(product.price).toLocaleString()}
                      </p>
                      <div className="flex items-center gap-3">
                        <ShoppingCart
                          className="w-5 h-5 text-gray-700 cursor-pointer hover:text-pink-600"
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                          }}
                        />
                        <Heart className="w-5 h-5 text-gray-700 cursor-pointer hover:text-pink-500" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="bg-gray-50 px-6 py-2 rounded-lg border disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="bg-gray-50 px-6 py-2 rounded-lg border disabled:opacity-50"
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
