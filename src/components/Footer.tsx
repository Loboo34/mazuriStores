import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-african-brown to-african-terracotta text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-display font-bold mb-4">Mazuri Stores</h3>
            <p className="text-gray-200 mb-4 leading-relaxed">
              Authentic African decor and artifacts that celebrate the rich cultural heritage of Africa. 
              Each piece tells a story of tradition and craftsmanship.
            </p>
            <div className="flex space-x-4">
              <button className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </button>
              <button className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-200 hover:text-african-gold transition-colors duration-300">Home</a></li>
              <li><a href="#" className="text-gray-200 hover:text-african-gold transition-colors duration-300">Shop All</a></li>
              <li><a href="#" className="text-gray-200 hover:text-african-gold transition-colors duration-300">Categories</a></li>
              <li><a href="#" className="text-gray-200 hover:text-african-gold transition-colors duration-300">About Us</a></li>
              <li><a href="#" className="text-gray-200 hover:text-african-gold transition-colors duration-300">FAQ</a></li>
              <li><a href="#" className="text-gray-200 hover:text-african-gold transition-colors duration-300">Return Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-1 text-african-gold flex-shrink-0" />
                <div>
                  <p className="text-gray-200">Ukunda-Ramisi Rd</p>
                  <p className="text-gray-200">Ukunda, Kenya</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-african-gold" />
                <a href="tel:+254759511401" className="text-gray-200 hover:text-african-gold transition-colors duration-300">
                  0759 511 401
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-african-gold" />
                <a href="mailto:info@mazuristores.com" className="text-gray-200 hover:text-african-gold transition-colors duration-300">
                  info@mazuristores.com
                </a>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Business Hours</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-african-gold" />
                <div>
                  <p className="text-gray-200">Monday - Saturday</p>
                  <p className="text-gray-300 text-sm">8:00 AM - 7:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-african-gold" />
                <div>
                  <p className="text-gray-200">Sunday</p>
                  <p className="text-gray-300 text-sm">Closed</p>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-6">
              <h5 className="font-semibold mb-2">We Accept</h5>
              <div className="flex space-x-2">
                <div className="bg-white bg-opacity-20 px-3 py-1 rounded text-sm">M-Pesa</div>
                <div className="bg-white bg-opacity-20 px-3 py-1 rounded text-sm">Card</div>
                <div className="bg-white bg-opacity-20 px-3 py-1 rounded text-sm">Cash</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white border-opacity-20 mt-8 pt-8 text-center">
          <p className="text-gray-200">
            &copy; 2024 Mazuri Stores. All rights reserved. | 
            <span className="text-african-gold"> Celebrating African Heritage Through Authentic Decor</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;