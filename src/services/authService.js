import { register as apiRegister, login as apiLogin } from './api.js';

class AuthService {
  constructor() {
    this.tokenKey = 'token';
    this.userKey = 'user';
  }

  // Inscription
  async register(userData) {
    try {
      const response = await apiRegister(userData);
      if (response.data.success) {
        this.setToken(response.data.token);
        this.setUser(response.data.user);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Connexion
  async login(credentials) {
    try {
      const response = await apiLogin(credentials);
      if (response.data.success) {
        this.setToken(response.data.token);
        this.setUser(response.data.user);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Déconnexion
  logout() {
    this.removeToken();
    this.removeUser();
  }

  // Gestion du token
  setToken(token) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken() {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  // Gestion de l'utilisateur
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

  // Vérifier l'authentification
  checkAuth() {
    return this.isAuthenticated() && this.getUser() !== null;
  }
}

export default new AuthService();
