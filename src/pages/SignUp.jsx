import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, Eye, EyeOff, User, Phone, Globe } from 'lucide-react';
import axios from 'axios';

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

  const navigate = useNavigate();

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
      {/* African Female Fashion Model Image */}
      <div
        className="hidden lg:flex w-1/2 items-center justify-center bg-cover bg-center transition-all duration-500"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=900&h=1350&fit=crop')`,
        }}
      />

      <div className="w-full lg:w-1/2 max-w-lg mx-auto p-8 lg:p-12 backdrop-blur-md relative">
        <Link
          to="/"
          className="absolute top-4 left-4 text-sm text-pink-600 hover:underline font-medium"
        >
          ← Back to Home
        </Link>

        <h2 className="text-3xl font-bold text-center mb-6 lg:mb-8 text-black">
          Join BlissByuddy
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-base">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div>
            <label htmlFor="fullname" className="block text-base font-medium text-black mb-2">
              Full Name
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-1">
              <User size={20} className="text-gray-500 mr-3" />
              <input
                type="text"
                id="fullname"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full py-3 outline-none bg-transparent text-black text-base"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="username" className="block text-base font-medium text-black mb-2">
              Username
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-1">
              <User size={20} className="text-gray-500 mr-3" />
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full py-3 outline-none bg-transparent text-black text-base"
                placeholder="Choose a username"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-base font-medium text-black mb-2">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-1">
              <Mail size={20} className="text-gray-500 mr-3" />
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full py-3 outline-none bg-transparent text-black text-base"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone_number" className="block text-base font-medium text-black mb-2">
              Phone Number
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-1">
              <Phone size={20} className="text-gray-500 mr-3" />
              <input
                type="tel"
                id="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full py-3 outline-none bg-transparent text-black text-base"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div>
            <label htmlFor="country" className="block text-base font-medium text-black mb-2">
              Country
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-1">
              <Globe size={20} className="text-gray-500 mr-3" />
              <select
                id="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full py-3 outline-none bg-transparent text-black text-base"
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
          </div>

          <div>
            <label htmlFor="password" className="block text-base font-medium text-black mb-2">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-1">
              <Lock size={20} className="text-gray-500 mr-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full py-3 outline-none bg-transparent text-black text-base"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-base font-medium text-black mb-2">
              Confirm Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-1">
              <Lock size={20} className="text-gray-500 mr-3" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full py-3 outline-none bg-transparent text-black text-base"
                placeholder="Re-enter password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg transition-colors text-base font-medium
              ${loading 
                ? 'bg-pink-400 cursor-not-allowed' 
                : 'bg-pink-600 hover:bg-pink-700 text-white'
              }`}
          >
            <UserPlus size={20} />
            <span>{loading ? 'Signing Up...' : 'Sign Up'}</span>
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-base text-black">
            Already have an account?{' '}
            <Link to="/signin" className="text-pink-600 font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;