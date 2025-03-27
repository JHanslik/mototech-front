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
  async createOrder(order: any) {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la création de la commande");
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
