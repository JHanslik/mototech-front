import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-gray-800">
      {/* Section principale du footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo et description */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex-shrink-0 font-bold text-xl text-white"
            >
              <span className="text-blue-500">Moto</span>Tech
            </Link>
            <p className="text-gray-400 text-sm mt-2">
              Équipements technologiques innovants pour les motards passionnés.
              Qualité, innovation et sécurité au service de votre passion.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">
              Liens rapides
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  Produits
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  À propos de nous
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Catégories */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">
              Catégories
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products?category=casques"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  Casques Intelligents
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=navigation"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  Navigation GPS
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=accessoires"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  Accessoires Connectés
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=communication"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  Systèmes de Communication
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=vetements"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  Vêtements Techniques
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin
                  size={18}
                  className="text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                />
                <span className="text-gray-400 text-sm">
                  123 Avenue des Technologies, 75000 Paris, France
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-blue-500 mr-2 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-blue-500 mr-2 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  contact@mototech.fr
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Ligne de séparation avec effet */}
      <div className="border-t border-gray-800 relative">
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      </div>

      {/* Copyright et mentions légales */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} MotoTech. Tous droits réservés.
          </p>
          <div className="flex space-x-6">
            <Link
              href="/privacy"
              className="text-gray-500 hover:text-blue-400 text-sm transition-colors"
            >
              Politique de confidentialité
            </Link>
            <Link
              href="/terms"
              className="text-gray-500 hover:text-blue-400 text-sm transition-colors"
            >
              Conditions d'utilisation
            </Link>
            <Link
              href="/cookies"
              className="text-gray-500 hover:text-blue-400 text-sm transition-colors"
            >
              Politique de cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
