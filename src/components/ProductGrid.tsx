"use client";

import ProductCard from "./ProductCard";

interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  stock?: number;
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-800/30 rounded-xl border border-gray-700 p-8">
        <p className="text-gray-400">Aucun produit trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
