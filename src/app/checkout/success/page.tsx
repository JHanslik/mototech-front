"use client";

import Link from "next/link";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutSuccessPage() {
  const router = useRouter();

  // Rediriger vers la page d'accueil si l'utilisateur accède directement à cette page
  useEffect(() => {
    const isPostCheckout = sessionStorage.getItem("checkoutComplete");
    if (!isPostCheckout) {
      router.push("/");
    } else {
      sessionStorage.removeItem("checkoutComplete");
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-500/20 p-3">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4">Commande confirmée !</h1>

        <p className="text-gray-300 mb-8">
          Merci pour votre achat. Un email de confirmation a été envoyé avec les
          détails de votre commande.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>

          <Link
            href="/products"
            className="flex items-center justify-center w-full px-6 py-3 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500/10 transition-colors"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Continuer les achats
          </Link>
        </div>
      </div>
    </div>
  );
}
