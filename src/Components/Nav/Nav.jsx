import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext'; // Adjust path as needed

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dropdownRef = useRef(null);
  const cartRef = useRef(null);

  const userName = 'Alex'; // Example

  const { cart, removeFromCart, cartTotal } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className={`flex justify-between items-center py-[22px] px-[60px] fixed top-[3%] left-1/2 -translate-x-1/2 w-[90%] max-w-[1400px] rounded-[70px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] z-10 backdrop-blur-lg transition-all duration-300 ${
        scrolled ? 'bg-white/90 text-black' : 'bg-transparent text-white'
      }`}
    >
      {/* Left Nav */}
      <div className="flex gap-[40px]">
        {['Home', 'Collection', 'Shop', 'About Us'].map((item) => (
          <a
            key={item}
            href="#"
            className={`text-[16px] relative hover:after:w-full after:content-[''] after:absolute after:left-0 after:-bottom-[2px] after:h-[2px] after:w-0 after:transition-all after:duration-300 ${
              scrolled
                ? 'after:bg-black hover:text-black'
                : 'after:bg-white hover:text-white'
            }`}
          >
            {item}
          </a>
        ))}
      </div>

      {/* Logo */}
      <h1 className="text-3xl font-bold tracking-wide mr-40 henny-penny transition-colors duration-300">
        BlissByUddy
      </h1>

      {/* Right Section */}
      <div className="flex gap-[40px] items-center relative">
        {/* Cart */}
        <div className="relative cursor-pointer" ref={cartRef}>
          <ShoppingBag
            size={20}
            className={`${scrolled ? 'text-black' : 'text-white'} transition-colors`}
            onClick={() => setIsCartOpen((prev) => !prev)}
          />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}

          {/* Cart Dropdown */}
          {isCartOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white text-black rounded-lg shadow-lg z-50 p-4">
              <h2 className="text-lg font-semibold mb-2">Your Cart</h2>
              {cart.length === 0 ? (
                <p className="text-gray-500 text-sm">Your cart is empty.</p>
              ) : (
                <>
                  <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                    {cart.map((item) => (
                      <li key={item.id} className="flex items-center justify-between py-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 ml-3">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            ₦{item.price} x {item.quantity}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 border-t pt-2">
                    <p className="text-sm font-medium">Subtotal: ₦{cartTotal.toLocaleString()}</p>
                    <Link
                      to="/Checkout"
                      className="block mt-2 bg-pink-500 text-white text-center py-2 rounded-md hover:bg-pink-600"
                      onClick={() => setIsCartOpen(false)}
                    >
                      Proceed to Checkout
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Profile */}
        <div
          ref={dropdownRef}
          className="relative flex items-center gap-2 cursor-pointer select-none"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        >
          <User
            size={20}
            className={`${scrolled ? 'text-black' : 'text-white'} transition-colors`}
          />
          <span
            className={`text-sm font-medium ${
              scrolled ? 'text-black' : 'text-white'
            }`}
          >
            {userName}
          </span>
          <ChevronDown
            size={16}
            className={`${scrolled ? 'text-black' : 'text-white'} transition-colors`}
          />

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50 overflow-hidden">
              <Link
                to="/signin"
                className="block px-4 py-2 text-sm hover:bg-pink-100 hover:text-pink-600"
              >
                Sign In
              </Link>
              <hr className="border-t border-gray-200 my-1" />
              <Link
                to="/account"
                className="block px-4 py-2 text-sm hover:bg-pink-100 hover:text-pink-600"
              >
                My Account
              </Link>
              <Link
                to="/orders"
                className="block px-4 py-2 text-sm hover:bg-pink-100 hover:text-pink-600"
              >
                Orders
              </Link>
              <Link
                to="/wishlist"
                className="block px-4 py-2 text-sm hover:bg-pink-100 hover:text-pink-600"
              >
                Wishlist
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nav;