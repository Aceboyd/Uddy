import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="min-h-screen flex font-poppins bg-gray-100">
      {/* African Fashion Model Image */}
      <div
        className="hidden lg:flex w-1/2 items-center justify-center bg-cover bg-center transition-all duration-500"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1585488763177-bde7d15fd3cf?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        }}
      />

      <div className="w-full lg:w-1/2 max-w-lg mx-auto p-12 backdrop-blur-md relative">
        <Link
          to="/"
          className="absolute top-4 left-4 text-sm text-pink-600 hover:underline font-medium"
        >
          ← Back to Home
        </Link>

        <h2 className="text-3xl font-bold text-center mb-6 lg:mb-10 text-black">
          Welcome Back to BlissByuddy
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-base font-medium text-black mb-2">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-1">
              <Mail size={20} className="text-gray-500 mr-3" />
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full py-3 outline-none bg-transparent text-black text-base"
              />
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full py-3 outline-none bg-transparent text-black text-base"
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

          <div className="flex items-center justify-between text-base text-black">
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
            disabled={loading}
            className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg transition-colors text-base font-medium
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

        <div className="mt-6 lg:mt-8 text-center">
          <p className="text-base text-black">
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