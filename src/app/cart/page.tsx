"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, removeFromCart, addToCart, clearCart, totalPrice } = useCart();
  const { isAuthenticated, token, user } = useAuth();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Référence pour suivre l'état des mises à jour de quantité
  const isUpdatingRef = useRef<Record<string, boolean>>({});
  // ID d'opération pour éviter les problèmes en mode strict
  const operationIdRef = useRef(0);

  const handleQuantityChange = useCallback(
    (productId: string, quantity: number) => {
      // Créer un ID unique pour cette opération
      const operationId = ++operationIdRef.current;
      const key = `${productId}-${quantity}-${operationId}`;

      // Si une mise à jour est déjà en cours pour ce produit, ignorer
      if (isUpdatingRef.current[productId]) {
        console.log(
          `🔒 Mise à jour ignorée pour ${productId} - Opération déjà en cours`
        );
        return;
      }

      // Marquer comme en cours de mise à jour
      isUpdatingRef.current[productId] = true;

      try {
        console.log(`--- Modification de quantité #${operationId} ---`);
        console.log("ProductId:", productId);
        console.log("Nouvelle quantité:", quantity);

        const item = items.find((item) => item.productId === productId);

        if (item) {
          console.log("Produit trouvé:", item.name);
          console.log("Quantité actuelle:", item.quantity);

          if (quantity > 0) {
            console.log("Mise à jour de la quantité");
            addToCart({ ...item, quantity }, true); // Utiliser shouldReplace = true
          } else {
            console.log("Suppression du produit (quantité <= 0)");
            removeFromCart(productId);
          }
        } else {
          console.log("Produit non trouvé dans le panier");
        }
      } finally {
        // Déverrouiller après un délai
        setTimeout(() => {
          isUpdatingRef.current[productId] = false;
        }, 500);
      }
    },
    [items, addToCart, removeFromCart]
  );

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }

    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated || !token) {
      toast.error("Veuillez vous connecter pour finaliser votre commande");
      router.push("/login");
      return;
    }

    setIsCheckingOut(true);

    try {
      // Préparer les données de commande avec tous les produits du panier
      const orderItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      const orderData = {
        items: orderItems,
        totalAmount: totalPrice,
      };

      // Appel API pour créer une seule commande avec tous les produits
      const result = await api.createOrder(orderData, token);

      toast.success("Commande confirmée !");

      // Enregistrer que le checkout est terminé pour la page de succès
      sessionStorage.setItem("checkoutComplete", "true");
      // Vider le panier après le succès
      clearCart();
      router.push("/checkout/success");
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      toast.error(
        "Une erreur est survenue lors de la validation de votre commande"
      );
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Votre panier est vide</h2>
        <p className="text-gray-200 mb-6">
          Ajoutez des produits pour commencer vos achats
        </p>
        <Link
          href="/products"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Découvrir nos produits
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Votre panier</h1>
        <button
          onClick={() => {
            clearCart();
            toast.success("Panier vidé");
          }}
          className="text-red-500 hover:text-red-700 transition-colors flex items-center"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Vider le panier
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Quantité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {items.map((item) => (
                <tr key={item.productId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-100">
                          {item.name}
                        </div>
                        {item.category && (
                          <div className="text-sm text-gray-400">
                            {item.category}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-100">
                      {item.price.toFixed(2)} €
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.productId,
                            item.quantity - 1
                          )
                        }
                        className="px-2 py-1 bg-gray-700 rounded-l-md hover:bg-gray-600 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 bg-gray-800 border-t border-b border-gray-700">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.productId,
                            item.quantity + 1
                          )
                        }
                        className="px-2 py-1 bg-gray-700 rounded-r-md hover:bg-gray-600 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-100 font-medium">
                      {(item.price * item.quantity).toFixed(2)} €
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        removeFromCart(item.productId);
                        toast.success(`${item.name} retiré du panier`);
                      }}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between mb-4">
          <span className="font-bold">Total</span>
          <span className="font-bold text-xl">{totalPrice.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between space-x-4">
          <Link
            href="/products"
            className="flex items-center justify-center px-4 py-2 border border-blue-500 rounded-md text-blue-500 hover:bg-blue-500/10 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continuer les achats
          </Link>
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className={`flex-1 px-6 py-3 bg-blue-600 text-white rounded-md transition-colors ${
              isCheckingOut
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            {isCheckingOut ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Traitement en cours...
              </span>
            ) : (
              "Passer à la caisse"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
