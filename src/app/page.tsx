"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductGrid from "@/components/ProductGrid";
import api from "@/services/api";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await api.getProducts();
        setFeaturedProducts(products.slice(0, 4));
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des produits:", err);
        setError(
          "Impossible de charger les produits. Veuillez réessayer plus tard."
        );
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="space-y-16">
      {/* Héro */}
      <section className="relative h-[500px] bg-black rounded-xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-transparent z-10"></div>

        {/* Effet de flou et de lumière moderne */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 via-blue-600/5 to-transparent z-0"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-700/10 rounded-full blur-3xl"></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 z-20">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Équipements <span className="text-blue-500">Moto</span> &{" "}
            <span className="text-blue-500">Technologie</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            Découvrez notre sélection d'équipements de pointe pour les motards
            passionnés de technologie
          </p>
          <Link
            href="/products"
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/30"
          >
            Voir les produits
          </Link>
        </div>
      </section>

      {/* Catégories */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-white border-l-4 border-blue-500 pl-4">
          Nos catégories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CategoryCard
            title="Casques Intelligents"
            href="/products?category=casques"
            description="Protégez-vous avec nos casques connectés"
            icon="helmet"
          />
          <CategoryCard
            title="Navigation GPS"
            href="/products?category=navigation"
            description="Guidage précis pour vos aventures"
            icon="compass"
          />
          <CategoryCard
            title="Accessoires Connectés"
            href="/products?category=accessoires"
            description="Enrichissez votre expérience de conduite"
            icon="gadget"
          />
        </div>
      </section>

      {/* Produits en vedette */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white border-l-4 border-blue-500 pl-4">
            Produits en vedette
          </h2>
          <Link
            href="/products"
            className="text-blue-400 hover:text-blue-300 hover:underline transition-colors font-medium"
          >
            Voir tout
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <ProductGrid products={featuredProducts} />
        )}
      </section>

      {/* Avantages */}
      <section className="bg-gradient-to-br from-gray-900 via-black to-gray-900 p-10 rounded-xl shadow-xl border border-gray-800 relative overflow-hidden">
        {/* Effet de lumière */}
        <div className="absolute top-0 left-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-px bg-gradient-to-r from-blue-500 via-blue-500/50 to-transparent"></div>

        <h2 className="text-3xl font-bold mb-10 text-center text-white">
          Pourquoi nous <span className="text-blue-500">choisir</span> ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Produits Innovants"
            description="Nous sélectionnons les technologies les plus récentes pour les motards."
            icon="innovation"
          />
          <FeatureCard
            title="Livraison Rapide"
            description="Livraison gratuite en France métropolitaine sous 48h."
            icon="shipping"
          />
          <FeatureCard
            title="Service Client"
            description="Notre équipe est disponible 7j/7 pour répondre à vos questions."
            icon="support"
          />
        </div>
      </section>
    </div>
  );
}

function CategoryCard({
  title,
  href,
  description,
  icon,
}: {
  title: string;
  href: string;
  description: string;
  icon: string;
}) {
  // Simulation d'icônes (à remplacer par de vraies icônes ou images)
  const getIconStyle = () => {
    switch (icon) {
      case "helmet":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      case "compass":
        return "bg-cyan-500/10 text-cyan-500 border-cyan-500/30";
      case "gadget":
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/30";
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
    }
  };

  return (
    <Link
      href={href}
      className="relative group overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-800 hover:to-black transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-blue-500/20 border border-gray-700 hover:border-blue-500/20"
    >
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Effet de brillance */}
      <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -rotate-12"></div>

      <div className="p-6 z-10 h-60 flex flex-col justify-between relative">
        <div>
          <div
            className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center border ${getIconStyle()}`}
          >
            {/* Icon placeholder */}
            <div className="w-6 h-6"></div>
          </div>
          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
            {title}
          </h3>
          <p className="text-gray-300">{description}</p>
        </div>
        <div className="flex items-center mt-4 text-blue-400 group-hover:translate-x-2 transition-transform">
          <span className="mr-2">Explorer</span>
          <span>→</span>
        </div>
      </div>

      {/* Cercle décoratif */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/5 rounded-tl-full transform translate-y-1/3 translate-x-1/3 group-hover:bg-blue-500/10 transition-all duration-500"></div>
    </Link>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  const getIconStyle = () => {
    switch (icon) {
      case "innovation":
        return "bg-blue-500/20 border-blue-500/30 text-blue-400";
      case "shipping":
        return "bg-cyan-500/20 border-cyan-500/30 text-cyan-400";
      case "support":
        return "bg-indigo-500/20 border-indigo-500/30 text-indigo-400";
      default:
        return "bg-blue-500/20 border-blue-500/30 text-blue-400";
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-800 hover:border-blue-500/30 transition-all duration-300 hover:shadow-blue-500/5 group">
      <div
        className={`p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4 ${getIconStyle()} border`}
      >
        {/* Placeholder pour une icône - à remplacer par des composants d'icônes réels */}
        <div className="w-6 h-6 rounded"></div>
      </div>
      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
        {title}
      </h3>
      <p className="text-gray-300">{description}</p>
      <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-transparent mt-4 group-hover:w-full transition-all duration-500"></div>
    </div>
  );
}
