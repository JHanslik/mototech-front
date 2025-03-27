"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useCallback,
} from "react";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
};

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem, shouldReplace?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Référence pour suivre la dernière opération d'ajout
  const lastAddRef = useRef<{
    id: string;
    time: number;
    requestId: string;
  } | null>(null);
  // ID unique pour les opérations (évite les problèmes avec le mode strict)
  const operationIdRef = useRef(0);

  // Charger le panier depuis le localStorage au démarrage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Erreur lors du chargement du panier:", e);
      }
    }
  }, []);

  // Mettre à jour le localStorage quand le panier change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));

    // Calculer les totaux
    setTotalItems(items.reduce((total, item) => total + item.quantity, 0));
    setTotalPrice(
      items.reduce((total, item) => total + item.price * item.quantity, 0)
    );
  }, [items]);

  // Utiliser useCallback pour mémoriser la fonction addToCart avec une stratégie d'idempotence
  const addToCart = useCallback(
    (newItem: CartItem, shouldReplace: boolean = false) => {
      // Générer un ID unique pour cette requête spécifique d'ajout
      const requestId = `${newItem.productId}-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;

      // Générer un ID d'opération pour les logs
      const operationId = ++operationIdRef.current;

      // Vérifier si cette requête exacte a déjà été traitée dans les 2 secondes précédentes
      // Cela permet une idempotence et gère les doubles appels du mode strict
      if (
        lastAddRef.current &&
        lastAddRef.current.id === newItem.productId &&
        Date.now() - lastAddRef.current.time < 2000
      ) {
        console.log(
          `🔒 Requête ignorée (idempotence) pour: ${newItem.name} (${requestId})`
        );
        return;
      }

      // Enregistrer cette opération comme la dernière requête
      lastAddRef.current = {
        id: newItem.productId,
        time: Date.now(),
        requestId: requestId,
      };

      // Log d'opération
      console.log(
        `=== CONTEXTE: AJOUT AU PANIER (Operation #${operationId}) ===`
      );
      console.log(`RequestID: ${requestId}`);
      console.log("Produit à ajouter:", newItem.name);
      console.log("Quantité à ajouter:", newItem.quantity);
      console.log("Mode remplacement:", shouldReplace);

      // Vérification des données du produit
      if (
        !newItem.productId ||
        !newItem.name ||
        newItem.price === undefined ||
        newItem.quantity <= 0
      ) {
        console.error(
          "Données de produit invalides pour l'ajout au panier",
          newItem
        );
        return;
      }

      // Utiliser un setter fonctionnel pour garantir l'atomicité de la mise à jour
      setItems((prevItems) => {
        // Afficher l'état actuel du panier
        console.log(
          "État actuel du panier:",
          prevItems.map((item) => `${item.name} (${item.quantity})`)
        );

        const existingItemIndex = prevItems.findIndex(
          (item) => item.productId === newItem.productId
        );

        // Si le produit existe déjà
        if (existingItemIndex >= 0) {
          const existingItem = prevItems[existingItemIndex];
          console.log(
            "Produit déjà dans le panier, quantité actuelle:",
            existingItem.quantity
          );

          // Créer une nouvelle copie de l'array pour éviter les mutations
          const updatedItems = [...prevItems];

          if (shouldReplace) {
            // Remplacer la quantité
            console.log(
              `Remplacement de quantité: ${existingItem.quantity} -> ${newItem.quantity}`
            );
            updatedItems[existingItemIndex] = {
              ...existingItem,
              quantity: newItem.quantity,
            };
          } else {
            // Additionner la quantité
            const newQuantity = existingItem.quantity + newItem.quantity;
            console.log(
              `Addition de quantité: ${existingItem.quantity} + ${newItem.quantity} = ${newQuantity}`
            );
            updatedItems[existingItemIndex] = {
              ...existingItem,
              quantity: newQuantity,
            };
          }

          console.log(
            "Nouvel état du panier:",
            updatedItems.map((item) => `${item.name} (${item.quantity})`)
          );

          return updatedItems;
        }
        // Si c'est un nouveau produit
        else {
          console.log("Nouveau produit ajouté au panier");
          const updatedItems = [...prevItems, { ...newItem }];

          console.log(
            "Nouvel état du panier:",
            updatedItems.map((item) => `${item.name} (${item.quantity})`)
          );

          return updatedItems;
        }
      });
    },
    [] // Pas de dépendances pour éviter les recréations
  );

  const removeFromCart = (productId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error(
      "useCart doit être utilisé à l'intérieur d'un CartProvider"
    );
  }
  return context;
}
