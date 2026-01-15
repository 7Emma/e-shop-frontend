import {
  getUserProfile,
  updateUserProfile as apiUpdateUserProfile,
  changePassword as apiChangePassword,
} from './api';

class UserService {
  constructor() {
    this.userKey = 'user';
  }

  // Récupérer le profil utilisateur
  async fetchProfile() {
    try {
      const response = await getUserProfile();
      return response.data.user;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw error;
    }
  }

  // Mettre à jour le profil
  async updateProfile(userData) {
    try {
      const response = await apiUpdateUserProfile(userData);
      if (response.data.success) {
        this.saveUser(response.data.user);
      }
      return response.data.user;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Changer le mot de passe
  async changePassword(passwordData) {
    try {
      const response = await apiChangePassword(passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Sauvegarder l'utilisateur localement
  saveUser(user) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Récupérer l'utilisateur local
  getUser() {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  // Obtenir le nom complet
  getFullName() {
    const user = this.getUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  // Obtenir les initiales
  getInitials() {
    const user = this.getUser();
    if (user) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return '';
  }

  // Vérifier si l'utilisateur est admin
  isAdmin() {
    const user = this.getUser();
    return user?.role === 'admin';
  }

  // Vérifier l'email
  isEmailValid(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Validation du mot de passe
  isPasswordStrong(password) {
    // Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  }
}

export default new UserService();
