import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { AuthContext } from '../context/AuthContext';
import fashionImage from '../assets/images/hl.jpg';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);       // for email/password login
  const [googleLoading, setGoogleLoading] = useState(false); // for Google login
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const success = await login(email, password);
    setLoading(false);

    if (success) {
      navigate('/');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    console.log('Google Sign-In clicked');
    // TODO: integrate real Google OAuth
    setTimeout(() => {
      setGoogleLoading(false);
    }, 2000); // simulate delay
  };

  return (
    <div className="min-h-screen flex font-poppins bg-gray-100">
      <div
        className="hidden lg:flex w-1/2 items-center justify-center bg-cover bg-center transition-all duration-500"
        style={{ backgroundImage: `url(${fashionImage})` }}
      />

      <div className="w-full lg:w-1/2 max-w-md mx-auto p-8 backdrop-blur-md relative">
        <Link
          to="/"
          className="absolute top-2 left-4 text-sm text-pink-600 hover:underline font-medium"
        >
          ← Back to Home
        </Link>

        <h2 className="text-2xl font-bold text-center mb-6 text-black">
          Welcome Back to BlissByGiddy
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        {/* ✅ Google Button */}
        <button
          onClick={handleGoogleSignIn}
          type="button"
          disabled={googleLoading}
          className={`w-full flex items-center justify-center space-x-3 border border-gray-300 py-2 rounded-md transition-colors mb-5
            ${googleLoading ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-gray-100 text-black'}
          `}
        >
          {googleLoading ? (
            <>
              <Loader2 size={20} className="animate-spin text-gray-600" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <FcGoogle size={20} />
              <span>Sign in with Google</span>
            </>
          )}
        </button>

        <div className="flex items-center mb-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-sm text-black/70">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* ✅ Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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

          <div className="flex items-center justify-between text-sm text-black">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-pink-600" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-pink-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* ✅ Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center space-x-2 py-2 rounded-md transition-colors 
              ${loading 
                ? 'bg-pink-400 cursor-not-allowed' 
                : 'bg-pink-600 hover:bg-pink-700 text-white'
              }`}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

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
