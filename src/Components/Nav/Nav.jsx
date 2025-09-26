import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const mobileHeaderUserRef = useRef(null);
  const mobileNavUserRef = useRef(null);
  const desktopUserRef = useRef(null);
  const mobileCartRef = useRef(null);
  const desktopCartRef = useRef(null);

  const navRef = useRef(null);

  const { userName, isAuthenticated, logout } = useContext(AuthContext);
  const { cart = [], removeFromCart = () => {}, cartTotal = 0 } = useCart() || {};
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const containers = [mobileHeaderUserRef, mobileNavUserRef, desktopUserRef];
    const cartContainers = [mobileCartRef, desktopCartRef];

    const isInsideAny = (target, refs) =>
      refs.some(r => r.current && (r.current === target || r.current.contains(target)));

    const handleGlobalClick = (event) => {
      const t = event.target;
      if (!isInsideAny(t, containers)) setIsDropdownOpen(false);
      if (!isInsideAny(t, cartContainers)) setIsCartOpen(false);

      const isToggleButton = t.closest('.nav-toggle') || t.classList.contains('nav-toggle');

      // ✅ Only auto-close on mobile/tablet (<1024px)
      if (window.innerWidth < 1024 && navRef.current && !navRef.current.contains(t) && !isToggleButton) {
        setIsNavOpen(false);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
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
      navigate('/contact-us');
    }
  };

  const handleLogout = async () => {
  try {
    await logout();
  } catch (err) {
    console.error("Logout failed:", err);
  } finally {
    setIsDropdownOpen(false);
    setIsNavOpen(false);
    navigate('/signin');
  }
};


  const handleSignIn = () => {
    navigate('/signin');
    setIsDropdownOpen(false);
    setIsNavOpen(false);
  };

  const cartCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);

  return (
    <header
      className={`flex flex-col lg:flex-row justify-between items-center py-[22px] px-4 lg:px-[60px] fixed top-0 lg:top-[3%] left-0 lg:left-1/2 lg:-translate-x-1/2 w-full lg:w-[90%] lg:max-w-[1400px] rounded-none lg:rounded-[70px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] z-50 backdrop-blur-lg transition-all duration-300 ${
        scrolled ? 'bg-white/90 text-black' : 'bg-transparent text-white'
      }`}
    >
      {/* Mobile & Tablet top bar */}
      <div className="flex justify-between items-center w-full lg:hidden">
        <button
          className="nav-toggle"
          onClick={(e) => {
            e.stopPropagation();
            setIsNavOpen((prev) => !prev);
          }}
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

        <Link to="/" className="text-2xl font-bold tracking-wide henny-penny">
          BlissByUddy
        </Link>

        <div className="flex items-center gap-4">
          {/* Mobile/Tablet Cart */}
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
              <div className="absolute right-0 top-full mt-2 w-[90vw] max-w-[400px] bg-white text-black rounded-lg shadow-lg z-50 p-4">
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

          {/* Mobile/Tablet user dropdown */}
          <div ref={mobileHeaderUserRef} className="relative cursor-pointer">
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center"
              aria-label="Toggle user menu"
            >
              <User size={20} className={scrolled ? 'text-black' : 'text-white'} />
            </button>

            {isDropdownOpen && (
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
                <Link
                  to="/account"
                  className="block px-4 py-2 text-xs hover:bg-pink-100 hover:text-pink-600"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  My Account
                </Link>
                <Link
                  to="/orders"
                  className="block px-4 py-2 text-xs hover:bg-pink-100 hover:text-pink-600"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Orders
                </Link>
                <Link
                  to="/wishlist"
                  className="block px-4 py-2 text-xs hover:bg-pink-100 hover:text-pink-600"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Wishlist
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop nav */}
        <div className="flex flex-col lg:flex-row w-full items-center lg:justify-between">
        <div className="hidden lg:block lg:absolute lg:left-1/2 lg:-translate-x-1/2">
  <Link
    to="/"
    className={`text-3xl font-bold tracking-wide henny-penny ${
      scrolled ? 'text-black' : 'text-white'
    }`}
  >
    BlissByUddy
  </Link>
</div>


        {/* ✅ Always visible on desktop */}
        <nav
          id="mobile-nav"
          ref={navRef}
          className={`transition-all duration-300 overflow-hidden 
            ${isNavOpen ? 'max-h-[500px] flex' : 'max-h-0 hidden'} 
            flex-col lg:flex lg:flex-row lg:max-h-none lg:overflow-visible lg:!flex gap-4 lg:gap-[40px] mt-4 lg:mt-0 lg:w-auto order-2 lg:order-1`}
        >
          {navLinks.map((item) => (
            <Link
              key={item}
              to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
              className={`text-[14px] lg:text-[16px] relative 
  hover:after:w-full after:content-[''] after:absolute after:left-0 after:-bottom-[2px] 
  after:h-[2px] after:w-0 after:transition-all after:duration-300
  ${scrolled 
    ? 'text-black after:bg-black hover:text-black' 
    : 'text-white after:bg-white hover:text-white'
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

          {/* Mobile/Tablet nav user dropdown */}
          <div ref={mobileNavUserRef} className="flex flex-col gap-4 lg:hidden mt-4">
            <div className="relative cursor-pointer">
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center"
                aria-label="Toggle user menu"
              >
                <span className={`text-[14px] ${scrolled ? 'text-black' : 'text-white'}`}>{userName}</span>
              </button>

              {isDropdownOpen && (
                <div className="mt-2 w-40 bg-white text-black rounded-md shadow-lg z-50 overflow-hidden">
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

        {/* Desktop user/cart */}
        <div className="hidden lg:flex gap-[16px] items-center order-3">
          <div className="relative cursor-pointer" ref={desktopCartRef}>
            <ShoppingCart
              size={20}
              className={`${scrolled ? 'text-black' : 'text-white'}`}
              onClick={() => setIsCartOpen((prev) => !prev)}
            />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
            {isCartOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white text-black rounded-lg shadow-lg z-50 p-4">
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

          <div ref={desktopUserRef} className="relative flex items-center gap-2 cursor-pointer">
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center"
              aria-label="Toggle user menu"
            >
              <User size={20} className={`${scrolled ? 'text-black' : 'text-white'}`} />
              <span className={`text-sm ${scrolled ? 'text-black' : 'text-white'}`}>{userName}</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50 overflow-hidden">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-pink-100 hover:text-pink-600"
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={handleSignIn}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-pink-100 hover:text-pink-600"
                  >
                    Sign In
                  </button>
                )}
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
    </header>
  );
};

export default Nav;