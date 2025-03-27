"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ShoppingCart,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo et liens principaux */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              Moto Tech
            </Link>

            {/* Menu pour desktop */}
            <div className="hidden md:flex space-x-6">
              <Link
                href="/"
                className={`hover:text-blue-300 transition ${
                  pathname === "/" ? "text-blue-400" : ""
                }`}
              >
                Accueil
              </Link>
              <Link
                href="/products"
                className={`hover:text-blue-300 transition ${
                  pathname.startsWith("/products") ? "text-blue-400" : ""
                }`}
              >
                Produits
              </Link>
            </div>
          </div>

          {/* Bouton menu pour mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Actions utilisateur pour desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/cart"
              className={`hover:text-blue-300 transition flex items-center ${
                pathname === "/cart" ? "text-blue-400" : ""
              }`}
            >
              <ShoppingCart className="mr-1" size={20} />
              Panier
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className={`hover:text-blue-300 transition flex items-center ${
                    pathname === "/profile" ? "text-blue-400" : ""
                  }`}
                >
                  <User className="mr-1" size={20} />
                  {user?.username}
                </Link>
                <button
                  onClick={logout}
                  className="hover:text-blue-300 transition flex items-center"
                >
                  <LogOut className="mr-1" size={20} />
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className={`hover:text-blue-300 transition flex items-center ${
                    pathname === "/login" ? "text-blue-400" : ""
                  }`}
                >
                  <LogIn className="mr-1" size={20} />
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className={`hover:text-blue-300 transition flex items-center ${
                    pathname === "/register" ? "text-blue-400" : ""
                  }`}
                >
                  <UserPlus className="mr-1" size={20} />
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 space-y-2 py-3 border-t border-gray-700">
            <Link
              href="/"
              className={`block py-2 hover:text-blue-300 transition ${
                pathname === "/" ? "text-blue-400" : ""
              }`}
              onClick={toggleMenu}
            >
              Accueil
            </Link>
            <Link
              href="/products"
              className={`block py-2 hover:text-blue-300 transition ${
                pathname.startsWith("/products") ? "text-blue-400" : ""
              }`}
              onClick={toggleMenu}
            >
              Produits
            </Link>
            <Link
              href="/cart"
              className={`block py-2 hover:text-blue-300 transition flex items-center ${
                pathname === "/cart" ? "text-blue-400" : ""
              }`}
              onClick={toggleMenu}
            >
              <ShoppingCart className="mr-1" size={20} />
              Panier
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className={`block py-2 hover:text-blue-300 transition flex items-center ${
                    pathname === "/profile" ? "text-blue-400" : ""
                  }`}
                  onClick={toggleMenu}
                >
                  <User className="mr-1" size={20} />
                  {user?.username}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                  className="block py-2 w-full text-left hover:text-blue-300 transition flex items-center"
                >
                  <LogOut className="mr-1" size={20} />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`block py-2 hover:text-blue-300 transition flex items-center ${
                    pathname === "/login" ? "text-blue-400" : ""
                  }`}
                  onClick={toggleMenu}
                >
                  <LogIn className="mr-1" size={20} />
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className={`block py-2 hover:text-blue-300 transition flex items-center ${
                    pathname === "/register" ? "text-blue-400" : ""
                  }`}
                  onClick={toggleMenu}
                >
                  <UserPlus className="mr-1" size={20} />
                  Inscription
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
