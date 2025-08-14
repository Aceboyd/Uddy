import React from 'react';
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-pink-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Brand Info */}
          <div>
            <h3 className="text-2xl tab:text-[28px] font-bold tracking-wide henny-penny text-white mb-4">
              BlissByUddy
            </h3>
            <p className="text-gray-200 mb-4">
              Your destination for women’s fashion: stylish clothing, shoes, bags, and accessories.
            </p>
            {/* Social Icons */}
            <div className="flex justify-center md:justify-start space-x-4 text-2xl text-white">
              <a href="#" className="hover:text-pink-300 transition-colors">
                <FaInstagram />
              </a>
              <a href="#" className="hover:text-pink-300 transition-colors">
                <FaFacebookF />
              </a>
              <a href="#" className="hover:text-pink-300 transition-colors">
                <FaTwitter />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/home" className="text-gray-200 hover:text-white transition-colors">Home</a></li>
              <li><a href="/blog" className="text-gray-200 hover:text-white transition-colors">Blog</a></li>
              <li><a href="/testimony" className="text-gray-200 hover:text-white transition-colors">Testimonials</a></li>
              <li><a href="/contactus" className="text-gray-200 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <p className="text-gray-200">1234 Fashion Avenue, Lagos, Nigeria</p>
            <p className="text-gray-200">Email: support@blissbyuddy.com</p>
            <p className="text-gray-200">Phone: (+234) 123-456-7890</p>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-8 border-t border-pink-700 pt-4 text-center">
          <p className="text-gray-200">&copy; 2025 BlissByUddy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
