const API_URL = "http://localhost:5000/api";

/**
 * Service d'authentification pour communiquer avec l'API backend
 */
export const authService = {
  /**
   * Fonction d'inscription
   */
  async register(username: string, email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de l'inscription");
    }

    return data;
  },

  /**
   * Fonction de connexion
   */
  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de la connexion");
    }

    return data;
  },

  /**
   * Récupérer l'utilisateur actuel
   */
  async getCurrentUser(token: string) {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la récupération de l'utilisateur"
      );
    }

    return data;
  },

  /**
   * Vérifier si un token est valide
   */
  async verifyToken(token: string) {
    try {
      const user = await this.getCurrentUser(token);
      return { isValid: true, user };
    } catch (error) {
      return { isValid: false, user: null };
    }
  },
};

export default authService;
