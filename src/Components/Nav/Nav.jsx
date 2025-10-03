import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';

const CartDropdown = ({ cart, cartTotal, removeFromCart, onClose, isMobile }) => (
  <div className="relative">
    <div
      className={`absolute top-full mt-2 bg-white text-black rounded-lg shadow-lg z-50 p-5gi
        ${isMobile
          ? "inset-x-0 mx-[-350px] w-[90vw] max-w-[400px]"
          : "right-0 w-80"
        }`}
    >
      {cart.length === 0 ? (
        <p className="text-gray-500 text-sm">Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
            {cart.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-2">
                <img
                  src={item.image}
                  alt={item.name || "Cart item"}
                  className="w-10 h-10 object-cover rounded"
                />
                <div className="flex-1 ml-2">
                  <p className="text-xs font-medium">{item.name || "Unknown Item"}</p>
                  <p className="text-xs text-gray-500">
                    ₦{(item.price || 0).toLocaleString()} x {item.quantity || 0}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 text-xs hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t pt-2">
            <p className="text-xs font-medium">
              Subtotal: ₦{cartTotal.toLocaleString()}
            </p>
            <Link
              to="/checkout"
              className="block mt-2 bg-pink-500 text-white text-center py-2 rounded-md hover:bg-pink-600 text-xs"
              onClick={onClose}
            >
              Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  </div>
);


const UserDropdown = ({ isAuthenticated, handleLogout, handleSignIn, onClose }) => (
  <div className="absolute right-0 top-full mt-2 w-40 bg-white text-black rounded-md shadow-lg z-50 overflow-hidden">
    {isAuthenticated ? (
      <button
        onClick={handleLogout}
        className="block w-full text-left px-4 py-2 text-xs hover:bg-pink-100 hover:text-pink-600"
      >
        Logout
      </button>
    ) : (
      <button
        onClick={handleSignIn}
        className="block w-full text-left px-4 py-2 text-xs hover:bg-pink-100 hover:text-pink-600"
      >
        Sign In
      </button>
    )}
    <hr className="border-t border-gray-200 my-1" />
    {['account', 'orders', 'wishlist'].map((path) => (
      <Link
        key={path}
        to={`/${path}`}
        className="block px-4 py-2 text-xs hover:bg-pink-100 hover:text-pink-600"
        onClick={onClose}
      >
        {path.charAt(0).toUpperCase() + path.slice(1)}
      </Link>
    ))}
  </div>
);

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const navRef = useRef(null);
  const mobileHeaderUserRef = useRef(null);
  const mobileNavUserRef = useRef(null);
  const desktopUserRef = useRef(null);
  const mobileCartRef = useRef(null);
  const desktopCartRef = useRef(null);

  const { userName, isAuthenticated, logout } = useContext(AuthContext);
  const { cart = [], removeFromCart = () => {}, cartTotal = 0 } = useCart() || {};
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global click (to close dropdowns)
  useEffect(() => {
    const containers = [mobileHeaderUserRef, mobileNavUserRef, desktopUserRef];
    const cartContainers = [mobileCartRef, desktopCartRef];
    const isInsideAny = (target, refs) =>
      refs.some((r) => r.current && (r.current === target || r.current.contains(target)));

    const handleGlobalClick = (e) => {
      const t = e.target;
      if (!isInsideAny(t, containers)) setIsDropdownOpen(false);
      if (!isInsideAny(t, cartContainers)) setIsCartOpen(false);

      const isToggleButton = t.closest('.nav-toggle') || t.classList.contains('nav-toggle');
      if (window.innerWidth < 1024 && navRef.current && !navRef.current.contains(t) && !isToggleButton) {
        setIsNavOpen(false);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  // Handlers
  const handleScrollToCategory = (e) => {
    e.preventDefault();
    const section = document.getElementById('shop-by-category');
    section?.scrollIntoView({ behavior: 'smooth' });
    setIsNavOpen(false);
  };

  const handleScrollToContact = (e) => {
    e.preventDefault();
    const section = document.getElementById('contact-us');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsNavOpen(false);
    } else if (location.pathname !== '/contact-us') {
      navigate('/contact-us');
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    setIsNavOpen(false);
    navigate('/signin');
  };

  const handleSignIn = () => {
    navigate('/signin');
    setIsDropdownOpen(false);
    setIsNavOpen(false);
  };

  const cartCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Collection', onClick: handleScrollToCategory },
    { label: 'Contact Us', onClick: handleScrollToContact },
    { label: 'About Us', path: '/about-us' },
  ];

  return (
    <header
      className={`flex flex-col lg:flex-row justify-between items-center py-[22px] px-4 lg:px-[60px] fixed top-0 lg:top-[3%] left-0 lg:left-1/2 lg:-translate-x-1/2 w-full lg:w-[90%] lg:max-w-[1400px] rounded-none lg:rounded-[70px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] z-50 backdrop-blur-lg transition-all duration-300 ${
        scrolled ? 'bg-white/90 text-black' : 'bg-transparent text-white'
      }`}
    >
      {/* Mobile Header */}
      <div className="flex justify-between items-center w-full lg:hidden">
        <button
          className="nav-toggle"
          onClick={(e) => {
            e.stopPropagation();
            setIsNavOpen((prev) => !prev);
          }}
        >
          {isNavOpen ? (
            <X size={24} className={scrolled ? 'text-black' : 'text-white'} />
          ) : (
            <Menu size={24} className={scrolled ? 'text-black' : 'text-white'} />
          )}
        </button>

        <a href="/" className="text-2xl font-bold tracking-wide henny-penny">
          BlissByUddy
        </a>

        <div className="flex items-center cursor-pointer gap-4">
          {/* Mobile Cart */}
          <div className="relative cursor-pointer" ref={mobileCartRef}>
            <div className="flex items-center gap-2" onClick={() => setIsCartOpen((prev) => !prev)}>
              <ShoppingCart size={20} className={scrolled ? 'text-black' : 'text-white'} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            {isCartOpen && (
              <CartDropdown
                cart={cart}
                cartTotal={cartTotal}
                removeFromCart={removeFromCart}
                onClose={() => {
                  setIsCartOpen(false);
                  setIsNavOpen(false);
                }}
                isMobile
              />
            )}
          </div>

          {/* Mobile User */}
          <div ref={mobileHeaderUserRef} className="relative cursor-pointer">
            <button onClick={() => setIsDropdownOpen((prev) => !prev)} className="flex items-center">
              <User size={20} className={scrolled ? 'text-black' : 'text-white'} />
            </button>
            {isDropdownOpen && (
              <UserDropdown
                isAuthenticated={isAuthenticated}
                handleLogout={handleLogout}
                handleSignIn={handleSignIn}
                onClose={() => setIsDropdownOpen(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Desktop Nav */}
      <div className="flex flex-col lg:flex-row w-full items-center lg:justify-between">
        {/* Logo */}
        <div className="hidden lg:block lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          <a
            href="/"
            className={`text-3xl font-bold tracking-wide henny-penny ${
              scrolled ? 'text-black' : 'text-white'
            }`}
          >
            BlissByUddy
          </a>
        </div>

        {/* Links */}
          <nav
            ref={navRef}
            className={`transition-all duration-300 overflow-hidden ${
              isNavOpen ? 'max-h-[500px] flex' : 'max-h-0 hidden'
            } flex-col lg:flex lg:flex-row lg:max-h-none lg:overflow-visible lg:!flex gap-4 lg:gap-[40px] mt-4 lg:mt-0`}
          >
            {navLinks.map(({ label, path, onClick }) => (
              <a
                key={label}
                href={path || '#'}
                onClick={onClick || (() => setIsNavOpen(false))}
                className={`text-[14px] lg:text-[16px] relative 
                  hover:after:w-full after:content-[''] after:absolute after:left-0 after:-bottom-[2px] 
                  after:h-[2px] after:w-0 after:transition-all after:duration-300 cursor-pointer
                  ${scrolled ? 'text-black after:bg-black' : 'text-white after:bg-white'}`}
              >
                {label}
              </a>
            ))}
          </nav>


        {/* Desktop User & Cart */}
        <div className="hidden lg:flex gap-4 items-center">
          {/* Cart */}
          <div className="relative cursor-pointer" ref={desktopCartRef}>
            <ShoppingCart
              size={20}
              className={scrolled ? 'text-black' : 'text-white'}
              onClick={() => setIsCartOpen((prev) => !prev)}
            />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
            {isCartOpen && (
              <CartDropdown
                cart={cart}
                cartTotal={cartTotal}
                removeFromCart={removeFromCart}
                onClose={() => setIsCartOpen(false)}
              />
            )}
          </div>

          {/* User */}
          <div ref={desktopUserRef} className="relative flex items-center gap-2 cursor-pointer">
            <button onClick={() => setIsDropdownOpen((prev) => !prev)} className="flex cursor-pointer items-center">
              <User size={20} className={scrolled ? 'text-black' : 'text-white'} />
              <span className={`text-sm ${scrolled ? 'text-black' : 'text-white'}`}>{userName}</span>
            </button>
            {isDropdownOpen && (
              <UserDropdown
                isAuthenticated={isAuthenticated}
                handleLogout={handleLogout}
                handleSignIn={handleSignIn}
                onClose={() => setIsDropdownOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Nav;
