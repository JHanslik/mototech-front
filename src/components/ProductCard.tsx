"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    description?: string;
    category?: string;
    stock?: number;
  };
}

// Fonction pour déterminer l'image en fonction de la catégorie
const getProductImage = (category?: string): string => {
  if (!category) return "/images/products/placeholder.jpg";

  switch (category.toLowerCase()) {
    case "casques":
      return "/images/products/placeholder.jpg"; // Remplacer par une image de casque spécifique plus tard
    case "navigation":
      return "/images/products/placeholder.jpg"; // Remplacer par une image GPS spécifique plus tard
    case "accessoires":
      return "/images/products/placeholder.jpg"; // Remplacer par une image d'accessoire spécifique plus tard
    default:
      return "/images/products/placeholder.jpg";
  }
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-blue-500/20 hover:shadow-xl border border-gray-700 hover:border-blue-500/30">
      <div className="relative h-48 bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 group-hover:opacity-70 transition-opacity"></div>
        <Image
          src={getProductImage(product.category)}
          alt={product.name}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-t-lg group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4 bg-gradient-to-b from-gray-800 to-gray-900">
        <h3 className="text-lg font-bold text-white truncate group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-300 text-sm line-clamp-2 h-10 mt-1">
          {product.description || "Aucune description disponible"}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-400">
            {product.price.toFixed(2)} €
          </span>
          <div className="flex space-x-2">
            <Link
              href={`/products/${product._id}`}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors shadow-md"
            >
              Détails
            </Link>
            <button
              className="p-1 bg-gray-700 text-white rounded hover:bg-blue-600 transition-colors shadow-md"
              onClick={() => {
                // Ajouter au panier (à implémenter)
                console.log("Ajouter au panier:", product);
              }}
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>
        {product.stock !== undefined && (
          <p
            className={`text-sm mt-2 font-medium ${
              product.stock > 0 ? "text-blue-400" : "text-red-400"
            }`}
          >
            {product.stock > 0
              ? `En stock (${product.stock})`
              : "Rupture de stock"}
          </p>
        )}
      </div>
    </div>
  );
}
