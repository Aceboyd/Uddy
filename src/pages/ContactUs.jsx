import React, { useState } from 'react';
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div id="contact-us" className="min-h-screen bg-pink-50">
      <header className="py-6 text-center">
        <h1 className="text-3xl tab:text-[28px] font-bold tracking-wide henny-penny text-pink-600">
          Contact
        </h1>
      </header>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT: Contact Information */}
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-center">
              <h3 className="text-xl font-semibold text-pink-600 mb-4">Contact Information</h3>
              <p className="text-gray-700 mb-3">
                Have questions or need assistance? We’re here to help!
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="material-icons text-pink-600 mr-2">location_on</span>
                  <span>123 Fashion Street, Lagos, Nigeria</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-pink-600 mr-2">phone</span>
                  <span>+234 800 123 4567</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-pink-600 mr-2">email</span>
                  <span>support@blissbyuddy.com</span>
                </li>
              </ul>
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
                <div className="flex space-x-4 text-2xl text-pink-600">
                  <a href="#" className="hover:text-pink-800">
                    <FaInstagram />
                  </a>
                  <a href="#" className="hover:text-pink-800">
                    <FaFacebookF />
                  </a>
                  <a href="#" className="hover:text-pink-800">
                    <FaTwitter />
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT: Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col">
              <h3 className="text-3xl tab:text-[28px] font-bold tracking-wide henny-penny text-pink-600 mb-6 text-center lg:text-left">
                BlissByUddy
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    name="message"
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50"
                    required
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full bg-pink-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
