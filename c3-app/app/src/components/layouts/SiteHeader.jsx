import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50 border-b-2 border-accent-200">
      <div className="container-custom">
        <div className="flex justify-between items-center py-2 px-4">
          <Link to="/" className="flex items-center">
            <img src="/c3ops-logo-full-light.svg" alt="C3Ops" className="h-10 w-auto" />
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-700 hover:text-accent-600 transition-colors font-medium text-sm">Home</Link>
              <Link to="/platform" className="text-gray-700 hover:text-accent-600 transition-colors font-medium text-sm">Platform</Link>
              <Link to="/pricing" className="text-gray-700 hover:text-accent-600 transition-colors font-medium text-sm">Pricing</Link>
              <Link to="/contact" className="text-gray-700 hover:text-accent-600 transition-colors font-medium text-sm">Contact</Link>
            </div>

            <a
              href="https://finops.c3ops.io"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-accent-600 to-accent-700 text-white font-semibold py-2.5 px-6 rounded-lg text-sm"
            >
              Launch App
            </a>
          </div>

          <button className="md:hidden text-gray-800 p-2" onClick={()=>setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-accent-200 shadow-lg">
          <div className="w-full py-4 px-6 space-y-2">
            <Link to="/" className="block text-gray-700 hover:text-accent-600 py-3 px-4 rounded-lg" onClick={()=>setIsMenuOpen(false)}>Home</Link>
            <Link to="/platform" className="block text-gray-700 hover:text-accent-600 py-3 px-4 rounded-lg" onClick={()=>setIsMenuOpen(false)}>Platform</Link>
            <Link to="/pricing" className="block text-gray-700 hover:text-accent-600 py-3 px-4 rounded-lg" onClick={()=>setIsMenuOpen(false)}>Pricing</Link>
            <Link to="/contact" className="block text-gray-700 hover:text-accent-600 py-3 px-4 rounded-lg" onClick={()=>setIsMenuOpen(false)}>Contact</Link>
            <a href="https://finops.c3ops.io" target="_blank" rel="noopener noreferrer" className="block w-full bg-gradient-to-r from-accent-600 to-accent-700 text-white py-3 px-4 rounded-lg text-center mt-2">Launch App</a>
          </div>
        </div>
      )}
    </nav>
  );
}
