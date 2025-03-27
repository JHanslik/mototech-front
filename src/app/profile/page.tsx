"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import {
  User,
  PenSquare,
  Clock,
  Package,
  ShoppingBag,
  Mail,
  UserCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";

// Types
interface OrderProduct {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

interface OrderItem {
  productId: OrderProduct;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt?: string;
}

export default function ProfilePage() {
  const { user, token, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  // État pour suivre les commandes déployées
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>(
    {}
  );
  // Référence pour les éléments de détails de commande
  const detailsRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Effet pour animer les détails de commande lorsqu'ils sont affichés
  useEffect(() => {
    // Pour chaque commande déployée, appliquer l'animation
    Object.keys(expandedOrders).forEach((orderId) => {
      const detailsEl = detailsRefs.current[orderId];
      if (!detailsEl) return;

      if (expandedOrders[orderId]) {
        // 1. D'abord on cache visuellement l'élément tout en le rendant accessible au DOM
        detailsEl.style.display = "block";
        detailsEl.style.overflow = "hidden";

        // 2. Mesurer la hauteur réelle quand l'élément est à sa pleine taille
        const contentHeight = detailsEl.scrollHeight;

        // 3. Appliquer l'animation immédiatement en un seul rendu
        // Nous utilisons requestAnimationFrame pour synchroniser avec le cycle de rendu
        requestAnimationFrame(() => {
          // Initialiser à l'état fermé
          detailsEl.style.maxHeight = "0px";
          detailsEl.style.paddingTop = "0px";
          detailsEl.style.paddingBottom = "0px";
          detailsEl.style.opacity = "0";
          detailsEl.style.transform = "translateY(-10px)";

          // Forcer le rendu
          detailsEl.offsetHeight;

          // Puis immédiatement passer à l'état ouvert
          detailsEl.style.maxHeight = `${contentHeight + 32}px`; // Ajouter marge pour le padding
          detailsEl.style.paddingTop = "16px";
          detailsEl.style.paddingBottom = "16px";
          detailsEl.style.opacity = "1";
          detailsEl.style.transform = "translateY(0)";
        });
      } else {
        // Animation de fermeture en une seule étape
        detailsEl.style.maxHeight = "0px";
        detailsEl.style.paddingTop = "0px";
        detailsEl.style.paddingBottom = "0px";
        detailsEl.style.opacity = "0";
        detailsEl.style.transform = "translateY(-10px)";

        // Cacher complètement après l'animation
        setTimeout(() => {
          if (!expandedOrders[orderId]) {
            detailsEl.style.display = "none";
          }
        }, 300); // Attendre que la transition soit terminée
      }
    });
  }, [expandedOrders]);

  // Fonction pour basculer l'affichage des détails d'une commande
  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // État pour le formulaire de mise à jour du profil
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Charger les informations utilisateur et les commandes
  useEffect(() => {
    // Skip le chargement si l'utilisateur n'est pas connecté
    if (!token || !isAuthenticated) return;

    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Récupérer le profil utilisateur
        const userData = await api.getUserProfile(token);
        setUsername(userData.username);
        setEmail(userData.email);

        // Récupérer les commandes de l'utilisateur
        const userOrders = await api.getUserOrders(token);
        setOrders(userOrders);
        console.log("Commandes récupérées:", userOrders);
      } catch (err: any) {
        setError("Erreur lors du chargement des données : " + err.message);
        console.error("Erreur lors du chargement des données:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();

    // Nettoyage au démontage (si nécessaire)
    return () => {
      // Logique de nettoyage si nécessaire
    };
  }, [token, isAuthenticated]); // Dépendances limitées pour éviter les boucles infinies

  // Gérer la soumission du formulaire de mise à jour du profil
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return;

    try {
      setFormError(null);
      setSuccessMessage(null);

      // Créer l'objet de mise à jour
      const updateData: any = {};
      if (username) updateData.username = username;
      if (email) updateData.email = email;
      if (currentPassword && newPassword) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }

      // Appeler l'API pour mettre à jour le profil
      const result = await api.updateUserProfile(updateData, token);

      // Réinitialiser les champs de mot de passe
      setCurrentPassword("");
      setNewPassword("");

      // Afficher un message de succès
      setSuccessMessage("Profil mis à jour avec succès !");

      // Revenir à l'affichage des informations
      setTimeout(() => {
        setIsEditing(false);
        setSuccessMessage(null);
      }, 2000);
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  // Afficher un écran de chargement
  if (isLoading) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-gray-900">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-white">
            Chargement du profil...
          </h1>
        </div>
      </div>
    );
  }

  // Afficher un message d'erreur
  if (error) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-gray-900">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-white">Erreur</h1>
          <p className="text-red-300">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center py-12 bg-gray-900">
      <div className="w-full max-w-4xl px-4">
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* En-tête du profil */}
          <div className="bg-blue-600 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white p-3 rounded-full">
                  <UserCircle size={48} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{username}</h1>
                  <div className="flex items-center mt-1 text-blue-100">
                    <Mail size={16} className="mr-2" />
                    <span>{email}</span>
                  </div>
                </div>
              </div>
              <div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-50 transition"
                  >
                    <PenSquare size={16} className="mr-2" />
                    Modifier
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-50 transition"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="p-6">
            {successMessage && (
              <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded mb-6">
                {successMessage}
              </div>
            )}

            {formError && (
              <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-6">
                {formError}
              </div>
            )}

            {isEditing ? (
              /* Mode édition */
              <div className="bg-gray-700 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Modifier mon profil
                </h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Nom d'utilisateur
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Mot de passe actuel
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 transition"
                  >
                    Enregistrer les modifications
                  </button>
                </form>
              </div>
            ) : (
              /* Mode affichage */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <User className="text-blue-400 mr-2" size={20} />
                    <h2 className="text-xl font-semibold text-white">
                      Informations personnelles
                    </h2>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-sm">Nom d'utilisateur</p>
                      <p className="text-white font-medium">{username}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-white font-medium">{email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Rôle</p>
                      <p className="text-white font-medium">Client</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <ShoppingBag className="text-blue-400 mr-2" size={20} />
                    <h2 className="text-xl font-semibold text-white">
                      Activité récente
                    </h2>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-sm">
                        Nombre de commandes
                      </p>
                      <p className="text-white font-medium">{orders.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Dernière commande</p>
                      <p className="text-white font-medium">
                        {orders.length > 0
                          ? orders[0].createdAt
                            ? new Date(orders[0].createdAt).toLocaleDateString()
                            : "Date non disponible"
                          : "Aucune commande"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Statut</p>
                      <p className="text-white font-medium">
                        {orders.length > 0
                          ? orders[0].status === "pending"
                            ? "En attente"
                            : orders[0].status === "completed"
                            ? "Terminée"
                            : orders[0].status
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Historique des commandes */}
            <div className="bg-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Clock className="text-blue-400 mr-2" size={20} />
                <h2 className="text-xl font-semibold text-white">
                  Historique des commandes
                </h2>
              </div>

              {orders.length === 0 ? (
                <div className="bg-gray-800 rounded-lg p-8 text-center">
                  <Package className="mx-auto text-gray-500 mb-2" size={32} />
                  <p className="text-gray-400">
                    Vous n'avez pas encore passé de commande.
                  </p>
                  <button
                    onClick={() => router.push("/products")}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition inline-flex items-center"
                  >
                    <ShoppingBag size={16} className="mr-2" />
                    Découvrir nos produits
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="py-3 px-4 text-left text-gray-300 font-medium">
                          ID
                        </th>
                        <th className="py-3 px-4 text-left text-gray-300 font-medium">
                          Date
                        </th>
                        <th className="py-3 px-4 text-left text-gray-300 font-medium">
                          Produits
                        </th>
                        <th className="py-3 px-4 text-left text-gray-300 font-medium">
                          Total
                        </th>
                        <th className="py-3 px-4 text-left text-gray-300 font-medium">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order: Order) => (
                        <>
                          <tr
                            key={order._id}
                            onClick={() => toggleOrderDetails(order._id)}
                            className="border-b border-gray-700 hover:bg-gray-750 cursor-pointer"
                          >
                            <td className="py-3 px-4 text-gray-300">
                              {order._id.substring(0, 8)}
                            </td>
                            <td className="py-3 px-4 text-gray-300">
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td className="py-3 px-4 text-gray-300">
                              {order.items && order.items.length > 0
                                ? `${order.items.length} article${
                                    order.items.length > 1 ? "s" : ""
                                  }`
                                : "Données manquantes"}
                            </td>
                            <td className="py-3 px-4 text-gray-300">
                              {order.totalAmount
                                ? `${order.totalAmount.toFixed(2)} €`
                                : "N/A"}
                            </td>
                            <td className="py-3 px-4 flex items-center">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${
                                  order.status === "completed"
                                    ? "bg-green-900 text-green-300"
                                    : order.status === "pending"
                                    ? "bg-yellow-900 text-yellow-300"
                                    : "bg-gray-700 text-gray-300"
                                }`}
                              >
                                {order.status === "pending"
                                  ? "En attente"
                                  : order.status === "completed"
                                  ? "Terminée"
                                  : order.status === "cancelled"
                                  ? "Annulée"
                                  : order.status}
                              </span>
                              <ChevronDown
                                className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
                                  expandedOrders[order._id] ? "rotate-180" : ""
                                }`}
                              />
                            </td>
                          </tr>
                          {expandedOrders[order._id] && (
                            <tr className="bg-gray-800">
                              <td colSpan={5} className="px-4 py-2">
                                <div
                                  ref={(el) => {
                                    detailsRefs.current[order._id] = el;
                                  }}
                                  className="bg-gray-700 rounded-md overflow-hidden transition-all duration-300 ease-in-out"
                                  style={{
                                    opacity: 0,
                                    maxHeight: 0,
                                    transform: "translateY(-10px)",
                                    display: "none",
                                    padding: 0,
                                  }}
                                >
                                  <div className="px-4">
                                    <h4 className="text-white font-medium mb-3">
                                      Détails de la commande
                                    </h4>
                                    <div className="space-y-3">
                                      {order.items &&
                                        order.items.map((item, index) => (
                                          <div
                                            key={`${order._id}-item-${index}`}
                                            className="flex justify-between items-center border-b border-gray-700 pb-2"
                                          >
                                            <div>
                                              <p className="text-white">
                                                {item.productId?.name ||
                                                  "Produit inconnu"}
                                              </p>
                                              <p className="text-sm text-gray-400">
                                                Quantité: {item.quantity}
                                              </p>
                                            </div>
                                            <div className="text-white font-medium">
                                              {(
                                                item.price * item.quantity
                                              ).toFixed(2)}{" "}
                                              €
                                            </div>
                                          </div>
                                        ))}
                                      <div className="flex justify-between items-center pt-2">
                                        <p className="text-white font-bold">
                                          Total
                                        </p>
                                        <p className="text-white font-bold">
                                          {order.totalAmount.toFixed(2)} €
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Bouton de déconnexion */}
            <button
              onClick={logout}
              className="mt-6 w-full py-3 px-4 rounded-md text-white font-medium bg-red-600 hover:bg-red-700 transition flex items-center justify-center"
            >
              <LogOut size={16} className="mr-2" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
