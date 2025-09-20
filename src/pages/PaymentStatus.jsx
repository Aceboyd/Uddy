import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Header from '../Components/Nav/Header'; // Adjust if path differs

const PaymentStatus = () => {
  const { api, token, isAuthenticated, loading } = useAuth();
  const { clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [error, setError] = useState(null);
  const [hasShownSuccessAlert, setHasShownSuccessAlert] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      console.log('Starting payment verification:', {
        isAuthenticated,
        token: token ? 'Present' : 'Missing',
        loading,
        locationSearch: location.search,
      });

      if (loading) {
        console.log('Auth loading, waiting...');
        return;
      }

      const params = new URLSearchParams(location.search);
      const reference = params.get('reference');

      if (!reference) {
        console.error('No reference in URL');
        setError('No payment reference found.');
        setPaymentStatus('failed');
        return;
      }

      if (!isAuthenticated || !token) {
        console.error('Authentication failed:', { isAuthenticated, token: token ? 'Present' : 'Missing' });
        setError('Authentication required. Please sign in.');
        setPaymentStatus('failed');
        navigate('/signin');
        return;
      }

      try {
        const response = await api.get(`/details/verify-payment/${reference}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Payment verification response:', JSON.stringify(response.data, null, 2));

        const data = response.data;
        // Check nested data.status for Kora response
        const paymentStatusFromResponse = data.data?.status || data.status;

        if (paymentStatusFromResponse === 'success' && !hasShownSuccessAlert) {
          clearCart();
          alert('Payment Successful! Thank you for your purchase.');
          setHasShownSuccessAlert(true);
          setPaymentStatus('success');
          // Optional: Navigate to clear reference
          // navigate('/orders', { replace: true });
        } else if (paymentStatusFromResponse === 'failed') {
          setError('Payment verification failed. Please contact support.');
          setPaymentStatus('failed');
        } else if (paymentStatusFromResponse === 'pending') {
          setError('Payment is still pending. Please check again later.');
          setPaymentStatus('pending');
        } else {
          console.error('Unexpected status:', paymentStatusFromResponse);
          setError('Unknown payment status. Please contact support.');
          setPaymentStatus('failed');
        }
      } catch (error) {
        console.error('Payment verification error:', {
          message: error.message,
          status: error.response?.status,
          data: JSON.stringify(error.response?.data, null, 2),
        });
        setError(error.response?.data?.error || 'An error occurred while verifying payment.');
        setPaymentStatus('failed');
      }
    };

    verifyPayment();
  }, [location.search, token, loading, isAuthenticated, api, navigate, clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
            Payment Status
          </h2>
          {paymentStatus === 'pending' && !error && (
            <div className="flex justify-center items-center mb-6">
              <svg
                className="animate-spin h-8 w-8 text-pink-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="ml-3 text-gray-600 text-lg">Verifying your payment...</p>
            </div>
          )}
          {paymentStatus === 'success' && (
            <div className="text-center">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-green-600 text-xl font-semibold mb-4">
                Payment Successful!
              </p>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been confirmed.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 bg-pink-500 text-white font-semibold rounded-full hover:bg-pink-600 transition duration-300"
                >
                  Continue Shopping
                </Link>
                <Link
                  to="/orders"
                  className="inline-flex items-center px-4 py-2 bg-gray-500 text-white font-semibold rounded-full hover:bg-gray-600 transition duration-300"
                >
                  View Orders
                </Link>
              </div>
            </div>
          )}
          {paymentStatus === 'failed' && (
            <div className="text-center">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <p className="text-red-600 text-xl font-semibold mb-4">
                {error || 'Payment Failed'}
              </p>
              <p className="text-gray-600 mb-6">
                Something went wrong. Please try again or contact support.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 bg-pink-500 text-white font-semibold rounded-full hover:bg-pink-600 transition duration-300"
                >
                  Continue Shopping
                </Link>
                <Link
                  to="/support"
                  className="inline-flex items-center px-4 py-2 bg-gray-500 text-white font-semibold rounded-full hover:bg-gray-600 transition duration-300"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          )}
          {paymentStatus === 'pending' && error && (
            <div className="text-center">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-yellow-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-yellow-600 text-xl font-semibold mb-4">
                {error}
              </p>
              <p className="text-gray-600 mb-6">
                Your payment is being processed. Please check again later or contact support.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 bg-pink-500 text-white font-semibold rounded-full hover:bg-pink-600 transition duration-300"
                >
                  Continue Shopping
                </Link>
                <Link
                  to="/support"
                  className="inline-flex items-center px-4 py-2 bg-gray-500 text-white font-semibold rounded-full hover:bg-gray-600 transition duration-300"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PaymentStatus;