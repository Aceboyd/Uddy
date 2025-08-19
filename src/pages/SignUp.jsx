import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import { LogIn, UserPlus, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import fashionImage from '../assets/images/hl.jpg';

function SignUp() {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    phone_number: '',
    country: '',
    password: '',
    confirmPassword: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (!formData.fullname.trim()) return 'Full name is required';
    if (!formData.username.trim()) return 'Username is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format';
    if (!formData.phone_number.trim()) return 'Phone number is required';
    if (!formData.country) return 'Country is required';
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'https://uddy.onrender.com/auth/users/',
        {
          username: formData.username,
          fullname: formData.fullname,
          email: formData.email,
          phone_number: formData.phone_number,
          country: formData.country,
          password: formData.password,
          confirm_password: formData.confirmPassword,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      console.log('Sign Up Successful:', response.data);

      // ✅ Redirect to signin after success
      navigate('/signin');

    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          setError('The signup endpoint was not found. Please verify the API URL.');
        } else if (err.response.status === 400) {
          setError(err.response.data?.message || 'Invalid data provided. Please check your input.');
        } else {
          setError(err.response.data?.message || 'An error occurred during signup.');
        }
      } else if (err.request) {
        setError('Network error: Unable to reach the server. Please check your connection or server status.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Sign Up Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-poppins bg-gray-100">
      <div
        className="hidden lg:flex w-1/2 items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${fashionImage})` }}
      />

      <div className="w-full lg:w-1/2 max-w-md mx-auto p-8 backdrop-blur-md relative">
        <h2 className="text-2xl font-bold text-center mb-6 text-black">Join BlissByGiddy</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mb-4">
            {error}
          </div>
        )}

        <button
          type="button"
          className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 text-black py-2 rounded-md hover:bg-gray-200 transition-colors mb-4"
          onClick={() => console.log('Google Sign Up clicked')}
        >
          <FcGoogle size={20} />
          <span>Sign up with Google</span>
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-sm text-black/70">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label htmlFor="fullname" className="block text-sm font-medium text-black mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-600 text-black"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-black mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-600 text-black"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-600 text-black"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-black mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-600 text-black"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-black mb-1">
              Country
            </label>
            <select
              id="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-600 text-black"
            >
              <option value="">Select your country</option>
              <option value="Nigeria">Nigeria</option>
              <option value="USA">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="India">India</option>
              <option value="Canada">Canada</option>
              <option value="Germany">Germany</option>
              <option value="South Africa">South Africa</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <Lock size={18} className="text-gray-500 mr-2" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full py-2 outline-none bg-transparent text-black"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mb-1">
              Confirm Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <Lock size={18} className="text-gray-500 mr-2" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full py-2 outline-none bg-transparent text-black"
                placeholder="Re-enter password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`flex items-center justify-center space-x-2 bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <UserPlus size={20} />
            <span>{loading ? 'Signing Up...' : 'Sign Up'}</span>
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-black">
            Already have an account?{' '}
            <Link to="/signin" className="text-pink-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;