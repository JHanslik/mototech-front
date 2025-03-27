"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import api from "@/services/api";

interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  stock?: number;
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

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.getProduct(productId);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement du produit:", err);
        setError(
          "Impossible de charger les détails du produit. Veuillez réessayer plus tard."
        );
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    // Ajouter au panier (à implémenter)
    console.log("Ajouter au panier:", product, "quantité:", quantity);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error || "Produit non trouvé"}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center text-blue-500 hover:text-blue-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Retour
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-200 aspect-square relative rounded-lg overflow-hidden">
          <Image
            src={getProductImage(product.category)}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-2 00">{product.name}</h1>

          <div className="border-t border-b border-gray-200 py-4">
            <p className="text-3xl font-bold text-blue-700">
              {product.price.toFixed(2)} €
            </p>
            {product.stock !== undefined && (
              <p
                className={`text-sm font-medium mt-2 ${
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stock > 0
                  ? `En stock (${product.stock})`
                  : "Rupture de stock"}
              </p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-200">
              Description
            </h2>
            <p className="text-gray-200">
              {product.description ||
                "Aucune description disponible pour ce produit."}
            </p>
          </div>

          {product.stock && product.stock > 0 && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-200 mb-1"
                >
                  Quantité
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="border border-gray-300 rounded-md px-3 py-2 w-20"
                />
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Ajouter au panier
              </button>
            </div>
          )}

          {product.category && (
            <div className="text-sm font-medium text-gray-200">
              Catégorie: {product.category}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
