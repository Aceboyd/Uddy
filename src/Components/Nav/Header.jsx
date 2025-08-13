import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, ChevronDown, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext'; // Adjust path as needed

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const dropdownRef = useRef(null);
  const cartRef = useRef(null);
  const navRef = useRef(null);

  // Assume userName comes from auth context in a real app
  const userName = 'Alex'; // Replace with auth context
  const { cart = [], removeFromCart = () => {}, cartTotal = 0 } = useCart() || {};

  // Handle outside clicks for closing dropdowns and mobile nav
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
      if (navRef.current && !navRef.current.contains(event.target) && !event.target.closest('.nav-toggle')) {
        setIsNavOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full sm:top-[2%] sm:left-1/2 sm:-translate-x-1/2 sm:w-[90%] sm:max-w-[1400px] bg-white text-black rounded-none sm:rounded-[70px] shadow-md sm:shadow-[0_4px_20px_rgba(0,0,0,0.1)] z-50 backdrop-blur-lg">
      <div className="flex flex-col sm:flex-row items-center py-4 sm:py-[22px] px-4 sm:px-8 md:px-[60px]">
        {/* Mobile Menu Toggle and Logo */}
        <div className="flex justify-between items-center w-full sm:hidden">
          <button
            className="nav-toggle"
            onClick={() => setIsNavOpen((prev) => !prev)}
            aria-expanded={isNavOpen}
            aria-controls="mobile-nav"
            aria-label={isNavOpen ? 'Close menu' : 'Open menu'}
          >
            {isNavOpen ? <X size={24} className="text-black" /> : <Menu size={24} className="text-black" />}
          </button>
          <Link to="/" className="text-2xl font-bold tracking-wide henny-penny">
            BlissByUddy
          </Link>
          <div className="w-6" /> {/* Spacer for symmetry */}
        </div>

        {/* Main Content: Nav, Logo, Right Section */}
        <div className="flex flex-col sm:flex-row w-full items-center justify-between">
          {/* Logo (Centered on Desktop) */}
          <div className="hidden sm:block sm:absolute sm:left-1/2 sm:-translate-x-1/2">
            <Link to="/" className="text-2xl sm:text-3xl font-bold tracking-wide henny-penny">
              BlissByUddy
            </Link>
          </div>

          {/* Navigation (Left on Desktop, Below Logo on Mobile) */}
          <nav
            id="mobile-nav"
            ref={navRef}
            className={`nav-menu flex flex-col sm:flex-row gap-4 sm:gap-[40px] mt-4 sm:mt-0 ${isNavOpen ? 'flex' : 'hidden sm:flex'} sm:w-auto order-2 sm:order-1`}
          >
            {['Home', 'Collection', 'Shop', 'About Us'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase().replace(' ', '-')}`}
                className="text-[14px] sm:text-[16px] relative hover:after:w-full after:content-[''] after:absolute after:left-0 after:-bottom-[2px] after:h-[2px] after:w-0 after:transition-all after:duration-300 after:bg-black hover:text-black"
                onClick={() => setIsNavOpen(false)}
              >
                {item}
              </Link>
            ))}

            {/* Cart and Profile in Mobile Menu */}
            <div className="flex flex-col gap-4 sm:hidden mt-4">
              {/* Cart */}
              <div className="relative cursor-pointer" ref={cartRef}>
                <div className="flex items-center gap-2" onClick={() => setIsCartOpen((prev) => !prev)}>
                  <ShoppingBag size={20} className="text-black" aria-label="View cart" />
                  <span className="text-[14px]">Cart</span>
                  {cart.length > 0 && (
                    <span className="absolute -top-2 left-5 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.reduce((total, item) => total + (item.quantity || 0), 0)}
                    </span>
                  )}
                </div>

                {/* Cart Dropdown */}
                {isCartOpen && (
                  <div className="mt-2 w-[90vw] max-w-[400px] bg-white text-black rounded-lg shadow-lg z-50 p-4">
                    <h2 className="text-base font-semibold mb-2">Your Cart</h2>
                    {cart.length === 0 ? (
                      <p className="text-gray-500 text-sm">Your cart is empty.</p>
                    ) : (
                      <>
                        <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                          {cart.map((item) => (
                            <li key={item.id} className="flex items-center justify-between py-2">
                              <img
                                src={item.image}
                                alt={item.name || 'Cart item'}
                                className="w-10 h-10 object-cover rounded"
                              />
                              <div className="flex-1 ml-2">
                                <p className="text-xs font-medium">{item.name || 'Unknown Item'}</p>
                                <p className="text-xs text-gray-500">
                                  ₦{(item.price || 0).toLocaleString()} x {item.quantity || 0}
                                </p>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 text-xs hover:underline"
                                aria-label={`Remove ${item.name || 'item'} from cart`}
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 border-t pt-2">
                          <p className="text-xs font-medium">Subtotal: ₦{cartTotal.toLocaleString()}</p>
                          <Link
                            to="/checkout"
                            className="block mt-2 bg-pink-500 text-white text-center py-2 rounded-md hover:bg-pink-600 text-xs"
                            onClick={() => {
                              setIsCartOpen(false);
                              setIsNavOpen(false);
                            }}
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
                className="relative cursor-pointer select-none"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                aria-label="User profile menu"
              >
                <div className="flex items-center gap-2">
                  <User size={20} className="text-black" />
                  <span className="text-[14px] font-medium text-black">{userName}</span>
                  <ChevronDown size={16} className="text-black" />
                </div>

                {isDropdownOpen && (
                  <div className="mt-2 w-40 bg-white text-black rounded-md shadow-lg z-50 overflow-hidden">
                    <Link
                      to="/signin"
                      className="block px-4 py-2 text-xs hover:bg-pink-100 hover:text-pink-600"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsNavOpen(false);
                      }}
                    >
                      Sign In
                    </Link>
                    <hr className="border-t border-gray-200 my-1" />
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-xs hover:bg-pink-100 hover:text-pink-600"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsNavOpen(false);
                      }}
                    >
                      My Account
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-xs hover:bg-pink-100 hover:text-pink-600"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsNavOpen(false);
                      }}
                    >
                      Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-2 text-xs hover:bg-pink-100 hover:text-pink-600"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsNavOpen(false);
                      }}
                    >
                      Wishlist
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </nav>

          {/* Right Section (Cart & Profile) - Desktop Only */}
          <div className="hidden sm:flex gap-4 sm:gap-[40px] items-center order-3">
            {/* Cart */}
            <div className="relative cursor-pointer" ref={cartRef}>
              <ShoppingBag
                size={20}
                className="text-black"
                onClick={() => setIsCartOpen((prev) => !prev)}
                aria-label="View cart"
              />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.reduce((total, item) => total + (item.quantity || 0), 0)}
                </span>
              )}

              {/* Cart Dropdown */}
              {isCartOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white text-black rounded-lg shadow-lg z-50 p-4 max-w-[400px]">
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
                              alt={item.name || 'Cart item'}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1 ml-3">
                              <p className="text-sm font-medium">{item.name || 'Unknown Item'}</p>
                              <p className="text-xs text-gray-500">
                                ₦{(item.price || 0).toLocaleString()} x {item.quantity || 0}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 text-xs hover:underline"
                              aria-label={`Remove ${item.name || 'item'} from cart`}
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 border-t pt-2">
                        <p className="text-sm font-medium">Subtotal: ₦{cartTotal.toLocaleString()}</p>
                        <Link
                          to="/checkout"
                          className="block mt-2 bg-pink-500 text-white text-center py-2 rounded-md hover:bg-pink-600 text-sm"
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
              aria-label="User profile menu"
            >
              <User size={20} className="text-black" />
              <span className="text-sm font-medium text-black">{userName}</span>
              <ChevronDown size={16} className="text-black" />

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50 overflow-hidden">
                  <Link
                    to="/signin"
                    className="block px-4 py-2 text-sm hover:bg-pink-100 hover:text-pink-600"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Sign In
                  </Link>
                  <hr className="border-t border-gray-200 my-1" />
                  <Link
                    to="/account"
                    className="block px-4 py-2 text-sm hover:bg-pink-100 hover:text-pink-600"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    My Account
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm hover:bg-pink-100 hover:text-pink-600"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-4 py-2 text-sm hover:bg-pink-100 hover:text-pink-600"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Wishlist
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;