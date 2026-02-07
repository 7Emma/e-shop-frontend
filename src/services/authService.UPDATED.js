// ✅ UPDATED VERSION - Uses httpOnly cookies instead of localStorage for tokens
// Replace the current authService.js with this version

import { register as apiRegister, login as apiLogin } from './api.js';

class AuthService {
  constructor() {
    this.userKey = 'user';  // Keep user in localStorage only
    // Token is now in httpOnly cookie, managed by the server
  }

  /**
   * ✅ Inscription
   */
  async register(userData) {
    try {
      const response = await apiRegister(userData);
      if (response.data.success) {
        this.setUser(response.data.user);
        // Token is automatically set in httpOnly cookie by the server
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * ✅ Connexion
   */
  async login(credentials) {
    try {
      const response = await apiLogin(credentials);
      if (response.data.success) {
        this.setUser(response.data.user);
        // Token is automatically set in httpOnly cookie by the server
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * ✅ Déconnexion
   */
  async logout() {
    try {
      // Notify server to clear cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',  // Include cookies
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local user data
      this.removeUser();
    }
  }

  /**
   * Gestion de l'utilisateur (localStorage only)
   */
  setUser(user) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser() {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  removeUser() {
    localStorage.removeItem(this.userKey);
  }

  /**
   * ✅ Vérifier l'authentification
   * Now checks if user exists and if token cookie is present
   */
  checkAuth() {
    return this.getUser() !== null;
    // Token cookie is validated automatically by the server on API calls
  }

  /**
   * ✅ Check if user is authenticated
   */
  isAuthenticated() {
    return this.getUser() !== null;
  }
}

export default new AuthService();
