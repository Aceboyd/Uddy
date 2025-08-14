import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, ChevronDown, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const dropdownRef = useRef(null);
  const cartRef = useRef(null);
  const navRef = useRef(null);

  const userName = 'Alex'; // Replace with auth context
  const { cart = [], removeFromCart = () => {}, cartTotal = 0 } = useCart() || {};
  const location = useLocation(); // To check current route

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsDropdownOpen(false);
      if (cartRef.current && !cartRef.current.contains(event.target)) setIsCartOpen(false);
      if (navRef.current && !navRef.current.contains(event.target) && !event.target.closest('.nav-toggle'))
        setIsNavOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = ['Home', 'Collection', 'Contact Us', 'About Us'];

  const handleScrollToCategory = (e) => {
    e.preventDefault();
    const categorySection = document.getElementById('shop-by-category');
    if (categorySection) {
      categorySection.scrollIntoView({ behavior: 'smooth' });
      setIsNavOpen(false);
    }
  };

  const handleScrollToContact = (e) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact-us');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      setIsNavOpen(false);
    } else if (location.pathname !== '/contact-us') {
      // Navigate to /contact-us if not on the page
      window.location.href = '/contact-us';
    }
  };

  return (
    <header
      className={`flex flex-col sm:flex-row justify-between items-center py-[22px] px-4 sm:px-[60px] tab:px-[48px] fixed top-0 sm:top-[3%] tab:top-[1.5%] left-0 sm:left-1/2 sm:-translate-x-1/2 w-full sm:w-[90%] sm:max-w-[1400px] tab:max-w-[820px] rounded-none sm:rounded-[70px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] z-10 backdrop-blur-lg transition-all duration-300 ${
        scrolled ? 'bg-white/90 text-black' : 'bg-transparent text-white'
      }`}
    >
      {/* Mobile Menu Toggle and Cart */}
      <div className="flex justify-between items-center w-full sm:hidden">
        <button
          className="nav-toggle"
          onClick={() => setIsNavOpen((prev) => !prev)}
          aria-expanded={isNavOpen}
          aria-controls="mobile-nav"
          aria-label={isNavOpen ? 'Close menu' : 'Open menu'}
        >
          {isNavOpen ? (
            <X size={24} className={scrolled ? 'text-black' : 'text-white'} />
          ) : (
            <Menu size={24} className={scrolled ? 'text-black' : 'text-white'} />
          )}
        </button>
        <Link to="/" className="text-2xl tab:text-[28px] font-bold tracking-wide henny-penny">
          BlissByUddy
        </Link>
        {/* Mobile Cart */}
        <div className="relative cursor-pointer" ref={cartRef}>
          <div className="flex items-center gap-2" onClick={() => setIsCartOpen((prev) => !prev)}>
            <ShoppingCart size={20} className={scrolled ? 'text-black' : 'text-white'} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.reduce((total, item) => total + (item.quantity || 0), 0)}
              </span>
            )}
          </div>
          {isCartOpen && (
            <div className="absolute right-0 top-full mt-2 w-[90vw] max-w-[400px] tab:w-[360px] bg-white text-black rounded-lg shadow-lg z-50 p-4">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-sm">Your cart is empty.</p>
              ) : (
                <>
                  <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                    {cart.map((item) => (
                      <li key={item.id} className="flex items-center justify-between py-2">
                        <img src={item.image} alt={item.name || 'Cart item'} className="w-10 h-10 object-cover rounded" />
                        <div className="flex-1 ml-2">
                          <p className="text-xs font-medium">{item.name || 'Unknown Item'}</p>
                          <p className="text-xs text-gray-500">
                            ₦{(item.price || 0).toLocaleString()} x {item.quantity || 0}
                          </p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-xs hover:underline">
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
                      Checkout
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Nav Content */}
      <div className="flex flex-col sm:flex-row w-full items-center sm:justify-between">
        {/* Center Logo Desktop */}
        <div className="hidden sm:block sm:absolute sm:left-1/2 sm:-translate-x-1/2">
          <Link to="/" className="text-3xl tab:text-[28px] font-bold tracking-wide henny-penny">
            BlissByUddy
          </Link>
        </div>

        {/* Navigation Links */}
        <nav
          id="mobile-nav"
          ref={navRef}
          className={`nav-menu flex flex-col sm:flex-row gap-4 sm:gap-[40px] tab:gap-[32px] mt-4 sm:mt-0 ${
            isNavOpen ? 'flex' : 'hidden sm:flex'
          } sm:w-auto order-2 sm:order-1`}
        >
          {navLinks.map((item) => (
            <Link
              key={item}
              id={`nav-link-${item === 'Collection' ? 'feature' : item.toLowerCase().replace(' ', '-')}`}
              to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
              className={`text-[14px] sm:text-[16px] tab:text-[15px] relative hover:after:w-full after:content-[''] after:absolute after:left-0 after:-bottom-[2px] after:h-[2px] after:w-0 after:transition-all after:duration-300 ${
                scrolled ? 'after:bg-black hover:text-black' : 'after:bg-white hover:text-white'
              }`}
              onClick={
                item === 'Collection'
                  ? handleScrollToCategory
                  : item === 'Contact Us'
                  ? handleScrollToContact
                  : () => setIsNavOpen(false)
              }
            >
              {item}
            </Link>
          ))}

          {/* Mobile Profile */}
          <div className="flex flex-col gap-4 sm:hidden mt-4">
            <div ref={dropdownRef} className="relative cursor-pointer" onClick={() => setIsDropdownOpen((prev) => !prev)}>
              <div className="flex items-center gap-2">
                <User size={20} className={scrolled ? 'text-black' : 'text-white'} />
                <span className={`text-[14px] ${scrolled ? 'text-black' : 'text-white'}`}>{userName}</span>
                <ChevronDown size={16} className={scrolled ? 'text-black' : 'text-white'} />
              </div>
              {isDropdownOpen && (
                <div className="mt-2 w-40 bg-white text-black rounded-md shadow-lg z-50 overflow-hidden">
                  <Link to="/signin" className="block px-4 py-2 text-xs hover:bg-pink-100 hover:text-pink-600">
                    Sign In
                  </Link>
                  <hr className="border-t border-gray-200 my-1" />
                  <Link to="/account" className="block px-4 py-2 text-xs hover:bg-pink-100 hover:text-pink-600">
                    My Account
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-xs hover:bg-pink-100 hover:text-pink-600">
                    Orders
                  </Link>
                  <Link to="/wishlist" className="block px-4 py-2 text-xs hover:bg-pink-100 hover:text-pink-600">
                    Wishlist
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Desktop Right Section */}
        <div className="hidden sm:flex gap-[40px] tab:gap-[32px] items-center order-3">
          {/* Cart */}
          <div className="relative cursor-pointer" ref={cartRef}>
            <ShoppingCart
              size={20}
              className={`${scrolled ? 'text-black' : 'text-white'}`}
              onClick={() => setIsCartOpen((prev) => !prev)}
            />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.reduce((total, item) => total + (item.quantity || 0), 0)}
              </span>
            )}
            {isCartOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 tab:w-[360px] bg-white text-black rounded-lg shadow-lg z-50 p-4">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-sm">Your cart is empty.</p>
                ) : (
                  <>
                    <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                      {cart.map((item) => (
                        <li key={item.id} className="flex items-center justify-between py-2">
                          <img src={item.image} alt={item.name || 'Cart item'} className="w-12 h-12 object-cover rounded" />
                          <div className="flex-1 ml-3">
                            <p className="text-sm font-medium">{item.name || 'Unknown Item'}</p>
                            <p className="text-xs text-gray-500">
                              ₦{(item.price || 0).toLocaleString()} x {item.quantity || 0}
                            </p>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm hover:underline">
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 border-t pt-2">
                      <p className="text-sm font-medium">Subtotal: ₦{cartTotal.toLocaleString()}</p>
                      <Link
                        to="/checkout"
                        className="block mt-2 bg-pink-500 text-white text-center py-2 rounded-md hover:bg-pink-600"
                        onClick={() => setIsCartOpen(false)}
                      >
                        Checkout
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Profile */}
          <div ref={dropdownRef} className="relative flex items-center gap-2 cursor-pointer" onClick={() => setIsDropdownOpen((prev) => !prev)}>
            <User size={20} className={`${scrolled ? 'text-black' : 'text-white'}`} />
            <span className={`text-sm ${scrolled ? 'text-black' : 'text-white'}`}>{userName}</span>
            <ChevronDown size={16} className={`${scrolled ? 'text-black' : 'text-white'}`} />
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50 overflow-hidden">
                <Link to="/signin" className="block px-4 py-2 text-sm hover:bg-pink-100 hover:text-pink-600">
                  Sign In
                </Link>
                <hr className="border-t border-gray-200 my-1" />
                <Link to="/account" className="block px-4 py-2 text-sm hover:bg-pink-100 hover:text-pink-600">
                  My Account
                </Link>
                <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-pink-100 hover:text-pink-600">
                  Orders
                </Link>
                <Link to="/wishlist" className="block px-4 py-2 text-sm hover:bg-pink-100 hover:text-pink-600">
                  Wishlist
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Nav;