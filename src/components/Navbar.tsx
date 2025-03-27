"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, User, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-black bg-opacity-90 text-white shadow-md border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex-shrink-0 font-bold text-xl text-white"
            >
              <span className="text-blue-500">Moto</span>Tech
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link
                  href="/"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-800 hover:text-blue-400 transition-colors"
                >
                  Accueil
                </Link>
                <Link
                  href="/products"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-800 hover:text-blue-400 transition-colors"
                >
                  Produits
                </Link>
                <Link
                  href="/about"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-800 hover:text-blue-400 transition-colors"
                >
                  À propos
                </Link>
                <Link
                  href="/contact"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-800 hover:text-blue-400 transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center ml-4 md:ml-6">
              <Link
                href="/cart"
                className="p-2 rounded-full hover:bg-gray-800 text-white hover:text-blue-400 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
              </Link>
              <Link
                href="/profile"
                className="p-2 ml-2 rounded-full hover:bg-gray-800 text-white hover:text-blue-400 transition-colors"
              >
                <User className="h-6 w-6" />
              </Link>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-800 hover:text-blue-400 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800 hover:text-blue-400 transition-colors"
            >
              Accueil
            </Link>
            <Link
              href="/products"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800 hover:text-blue-400 transition-colors"
            >
              Produits
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800 hover:text-blue-400 transition-colors"
            >
              À propos
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800 hover:text-blue-400 transition-colors"
            >
              Contact
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <Link
                href="/cart"
                className="p-2 rounded-full hover:bg-gray-800 hover:text-blue-400 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
              </Link>
              <Link
                href="/profile"
                className="p-2 ml-2 rounded-full hover:bg-gray-800 hover:text-blue-400 transition-colors"
              >
                <User className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
