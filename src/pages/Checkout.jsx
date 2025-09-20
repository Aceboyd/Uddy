import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Header from "../Components/Nav/Header";
import { Minus, Plus } from "lucide-react";

const Checkout = () => {
  const {
    cart = [],
    cartTotal = 0,
    clearCart = () => {},
    removeFromCart = () => {},
    updateQuantity = () => {},
  } = useCart() || {};

  const { isAuthenticated, token } = useAuth();
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

  const handlePayment = async () => {
    if (!isAuthenticated || !token) {
      alert("Authentication required. Please log in.");
      navigate("/signin");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty. Please add items before checkout.");
      navigate("/");
      return;
    }

    try {
      const response = await fetch("/details/checkout/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert("Failed to initiate payment. No checkout URL provided.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert(`Payment failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20">
      <Header />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-10">
        {cart.length === 0 ? (
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
                  <li
                    key={item.id}
                    className="flex items-center justify-between py-5"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      <div className="ml-4">
                        <p className="text-lg font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">₦{item.price}</p>

                        {/* Quantity Controls */}
                        <div className="flex items-center mt-3 space-x-2">
                          <button
                            onClick={() =>
                              item.quantity > 1 &&
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-4 py-1 border rounded-md bg-gray-50 font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-800">
                        ₦
                        {(
                          parseFloat(item.price.toString().replace(",", "")) *
                          item.quantity
                        ).toLocaleString()}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
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
