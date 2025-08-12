import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Nav from '../Components/Nav/Nav'; // Adjust if path differs

const Checkout = () => {
  // Move hooks to the top
  const { cart = [], updateQuantity = () => {}, removeFromCart = () => {}, cartTotal = 0, clearCart = () => {} } = useCart() || {};
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const tax = cartTotal * 0.1; // Dummy 10% tax
  const grandTotal = cartTotal + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = () => {
    alert('Payment Successful! Thank you for your purchase.');
    clearCart();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
        {cart.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <Link to="/" className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Your Items</h2>
              <ul className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <li key={item.id} className="flex items-center py-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1 ml-4">
                      <p className="text-lg font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">₦{item.price}</p>
                      <div className="flex items-center mt-2">
                        <label className="text-sm mr-2">Qty:</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                          className="w-16 border rounded px-2 py-1"
                          min="1"
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₦{(parseFloat(item.price.replace(',', '')) * item.quantity).toLocaleString()}</p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 text-sm hover:underline mt-2"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t pt-4">
                <p className="flex justify-between text-sm"><span>Subtotal:</span> <span>₦{cartTotal.toLocaleString()}</span></p>
                <p className="flex justify-between text-sm mt-2"><span>Tax (10%):</span> <span>₦{tax.toLocaleString()}</span></p>
                <p className="flex justify-between text-lg font-bold mt-2"><span>Grand Total:</span> <span>₦{grandTotal.toLocaleString()}</span></p>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
              <form className="bg-white p-6 rounded-lg shadow-sm">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentDetails.cardNumber}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Expiry Date</label>
                    <input
                      type="text"
                      name="expiry"
                      value={paymentDetails.expiry}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2"
                      placeholder="MM/YY"
                      maxLength="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentDetails.cvv}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2"
                      placeholder="123"
                      maxLength="3"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handlePayment}
                  className="w-full bg-pink-500 text-white py-3 rounded-md hover:bg-pink-600 font-semibold"
                >
                  Pay Now ₦{grandTotal.toLocaleString()}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;