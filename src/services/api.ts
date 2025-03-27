const API_URL = "http://localhost:5000/api";

/**
 * Service pour communiquer avec l'API backend
 */
export const api = {
  /**
   * Récupérer tous les produits
   */
  async getProducts() {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des produits");
    }
    return response.json();
  },

  /**
   * Récupérer un produit par son ID
   */
  async getProduct(id: string) {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération du produit");
    }
    return response.json();
  },

  /**
   * Créer une commande
   */
  async createOrder(order: any, token: string) {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(order),
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la création de la commande");
    }
    return response.json();
  },

  /**
   * Récupérer les commandes d'un utilisateur
   */
  async getUserOrders(token: string) {
    const response = await fetch(`${API_URL}/orders/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des commandes");
    }
    return response.json();
  },

  /**
   * Récupérer les informations utilisateur
   */
  async getUserProfile(token: string) {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération du profil");
    }
    return response.json();
  },

  /**
   * Mettre à jour les informations utilisateur
   */
  async updateUserProfile(userData: any, token: string) {
    const response = await fetch(`${API_URL}/auth/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour du profil");
    }
    return response.json();
  },

  /**
   * Récupérer le panier d'un utilisateur
   */
  async getCart(userId: string) {
    const response = await fetch(`${API_URL}/cart/${userId}`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération du panier");
    }
    return response.json();
  },

  /**
   * Sauvegarder le panier d'un utilisateur
   */
  async saveCart(userId: string, items: any[]) {
    const response = await fetch(`${API_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, items }),
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la sauvegarde du panier");
    }
    return response.json();
  },

  /**
   * Vider le panier d'un utilisateur
   */
  async clearCart(userId: string) {
    const response = await fetch(`${API_URL}/cart/${userId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la suppression du panier");
    }
    return response.json();
  },

  /**
   * Créer un utilisateur
   */
  async createUser(user: any) {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la création de l'utilisateur");
    }
    return response.json();
  },
};

export default api;
