import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Header from "../Components/Nav/Header";

const Checkout = () => {
  const {
    cart = [],
    cartTotal = 0,
    clearCart = () => {},
    removeFromCart = () => {},
    updateQuantity = () => {},
  } = useCart();

  const { isAuthenticated, token, api } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const tax = cartTotal * 0.1;
  const grandTotal = cartTotal + tax;

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      alert("Please log in to proceed with checkout.");
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);

  // Update quantity using PATCH
  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      await api.patch(`/details/cart/${itemId}/`, { quantity });
      updateQuantity(itemId, quantity);
    } catch (err) {
      console.error("Update quantity error:", err.response?.data || err.message);
      alert("Failed to update quantity.");
    }
  };

  // Remove item
  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
    } catch (err) {
      console.error("Remove item error:", err.response?.data || err.message);
      alert("Failed to remove item.");
    }
  };

  // Handle payment
  const handlePayment = async () => {
    if (!isAuthenticated || !token) {
      alert("Authentication required. Please log in.");
      navigate("/signin");
      return;
    }
    if (!cart.length) {
      alert("Your cart is empty.");
      navigate("/");
      return;
    }

    try {
      const response = await api.post("/details/checkout/");
      const data = response.data;

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert("Checkout URL not returned.");
      }
    } catch (err) {
      console.error("Payment error:", err.response?.data || err.message);
      alert("Payment failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20">
      <Header />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-10">
        {!cart.length ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <p className="text-gray-500 mb-6 text-lg">🛒 Your cart is empty.</p>
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 px-6 rounded-lg font-medium shadow hover:opacity-90 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Your Items</h2>
              <ul className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <li key={item.id} className="flex items-center justify-between py-5">
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      <div className="ml-4">
                        <p className="text-lg font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">₦{item.price}</p>
                        <div className="flex items-center mt-3">
                          <label className="text-sm mr-2">Qty:</label>
                          <input
                            type="number"
                            value={item.quantity}
                            min="1"
                            onChange={(e) =>
                              handleUpdateQuantity(item.id, parseInt(e.target.value))
                            }
                            className="w-16 border rounded-md px-2 py-1 text-center focus:ring-2 focus:ring-pink-500"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-800">
                        ₦
                        {(
                          parseFloat(item.price.replace(",", "")) * item.quantity
                        ).toLocaleString()}
                      </p>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-red-500 text-sm hover:underline mt-3"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between text-base">
                  <span>Subtotal</span>
                  <span>₦{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span>Tax (10%)</span>
                  <span>₦{tax.toLocaleString()}</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handlePayment}
                className="mt-8 w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 rounded-lg font-semibold shadow-lg hover:opacity-90 transition"
              >
                Pay Now ₦{grandTotal.toLocaleString()}
              </button>
              <p className="text-sm text-gray-500 mt-3 text-center">
                💳 Secure checkout powered by your payment provider
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
