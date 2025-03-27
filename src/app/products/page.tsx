"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import api from "@/services/api";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await api.getProducts();

        // Filtrer par catégorie si spécifiée
        const filteredProducts = category
          ? allProducts.filter((product: any) => product.category === category)
          : allProducts;

        setProducts(filteredProducts);
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
  }, [category]);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">
        {category ? `Produits: ${category}` : "Tous nos produits"}
      </h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">{products.length} produits trouvés</p>
            {/* Filtres et tri à implementer plus tard */}
          </div>
          <ProductGrid products={products} />
        </>
      )}
    </div>
  );
}
