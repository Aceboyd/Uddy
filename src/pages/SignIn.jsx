import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import fashionImage from '../assets/images/hl.jpg'; // ✅ Adjust if needed

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signing in with:', { email, password });
    // TODO: Add backend login logic here
  };

  const handleGoogleSignIn = () => {
    console.log('Google Sign-In clicked');
    // TODO: Add Google sign-in integration (e.g., Firebase)
  };

  return (
    <div className="min-h-screen flex font-poppins bg-gray-100">
      {/* Left Section: Background Image */}
      <div
        className="hidden lg:flex w-1/2 items-center justify-center bg-cover bg-center transition-all duration-500"
        style={{ backgroundImage: `url(${fashionImage})` }}
      />

      {/* Right Section: Sign In Form */}
      <div className="w-full lg:w-1/2 max-w-md mx-auto p-8 backdrop-blur-md relative">
        {/* Back to Home */}
        <Link
          to="/"
          className="absolute top-2 left-4 text-sm text-pink-600 hover:underline font-medium"
        >
          ← Back to Home
        </Link>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6 text-black">
          Welcome Back to BlissByGiddy
        </h2>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          type="button"
          className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-300 py-2 rounded-md text-black hover:bg-gray-100 transition-colors mb-5"
        >
          <FcGoogle size={20} />
          <span>Sign in with Google</span>
        </button>

        {/* OR divider */}
        <div className="flex items-center mb-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-sm text-black/70">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <Mail size={18} className="text-gray-500 mr-2" />
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full py-2 outline-none bg-transparent text-black"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <Lock size={18} className="text-gray-500 mr-2" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full py-2 outline-none bg-transparent text-black"
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

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between text-sm text-black">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-pink-600" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-pink-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition-colors"
          >
            <LogIn size={20} />
            <span>Sign In</span>
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-black">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-pink-600 font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
