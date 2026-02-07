import api from './api';

/**
 * Service d'administration pour la gestion du backend
 * Toutes les opérations admin nécessitent un role 'admin'
 */
class AdminService {
  // ============ PRODUITS ============

  /**
   * Récupérer tous les produits (avec filtres)
   */
  getAllProducts(params = {}) {
    return api.get('/products', { params });
  }

  /**
   * Créer un nouveau produit
   */
  createProduct(productData) {
    return api.post('/products', productData);
  }

  /**
   * Mettre à jour un produit
   */
  updateProduct(productId, productData) {
    return api.put(`/products/${productId}`, productData);
  }

  /**
   * Supprimer un produit
   */
  deleteProduct(productId) {
    return api.delete(`/products/${productId}`);
  }

  /**
   * Obtenir les catégories disponibles
   */
  getCategories() {
    return api.get('/products/categories');
  }

  // ============ UTILISATEURS ============

  /**
   * Récupérer tous les utilisateurs
   */
  getAllUsers(params = {}) {
    return api.get('/users', { params });
  }

  /**
   * Obtenir les détails d'un utilisateur
   */
  getUser(userId) {
    return api.get(`/users/${userId}`);
  }

  /**
   * Mettre à jour un utilisateur
   */
  updateUser(userId, userData) {
    return api.put(`/users/${userId}`, userData);
  }

  /**
   * Supprimer un utilisateur
   */
  deleteUser(userId) {
    return api.delete(`/users/${userId}`);
  }

  /**
   * Changer le rôle d'un utilisateur
   */
  changeUserRole(userId, role) {
    return api.put(`/users/${userId}/role`, { role });
  }

  // ============ COMMANDES ============

  /**
   * Récupérer toutes les commandes
   */
  getAllOrders(params = {}) {
    return api.get('/admin/orders', { params });
  }

  /**
   * Obtenir les détails d'une commande
   */
  getOrder(orderId) {
    return api.get(`/admin/orders/${orderId}`);
  }

  /**
   * Mettre à jour le statut d'une commande
   */
  updateOrderStatus(orderId, status) {
    return api.put(`/admin/orders/${orderId}`, { status });
  }

  /**
   * Ajouter un numéro de suivi
   */
  updateTrackingNumber(orderId, trackingNumber) {
    return api.put(`/admin/orders/${orderId}`, { trackingNumber });
  }

  /**
   * Annuler une commande
   */
  cancelOrder(orderId) {
    return api.delete(`/admin/orders/${orderId}`);
  }

  // ============ AVIS ============

  /**
   * Récupérer tous les avis
   */
  getAllReviews(params = {}) {
    return api.get('/reviews', { params });
  }

  /**
   * Obtenir les avis d'un produit
   */
  getProductReviews(productId) {
    return api.get(`/reviews/product/${productId}`);
  }

  /**
   * Supprimer un avis
   */
  deleteReview(reviewId) {
    return api.delete(`/reviews/${reviewId}`);
  }

  /**
   * Signaler un avis abusif
   */
  flagReview(reviewId, reason) {
    return api.post(`/reviews/${reviewId}/flag`, { reason });
  }

  // ============ STATISTIQUES ============

  /**
   * Obtenir le profil de l'admin par ID
   */
  getAdminProfile(adminId) {
    return api.get(`/admin/profile/${adminId}`);
  }

  /**
   * Obtenir les statistiques du dashboard
   */
  getDashboardStats() {
    return api.get('/admin/stats');
  }

  /**
   * Obtenir les statistiques de ventes
   */
  getSalesStats(period = 'month') {
    return api.get('/admin/stats/sales', { params: { period } });
  }

  /**
   * Obtenir les produits les plus vendus
   */
  getTopProducts(limit = 10) {
    return api.get('/admin/stats/top-products', { params: { limit } });
  }

  /**
   * Obtenir les utilisateurs actifs
   */
  getActiveUsers(period = 'month') {
    return api.get('/admin/stats/active-users', { params: { period } });
  }

  /**
   * Obtenir les revenus
   */
  getRevenue(period = 'month') {
    return api.get('/admin/stats/revenue', { params: { period } });
  }

  // ============ IMPORTS/EXPORTS ============

  /**
   * Exporter les produits en CSV
   */
  exportProducts() {
    return api.get('/admin/export/products', { responseType: 'blob' });
  }

  /**
   * Exporter les commandes en CSV
   */
  exportOrders(params = {}) {
    return api.get('/admin/export/orders', { 
      params,
      responseType: 'blob' 
    });
  }

  /**
   * Importer des produits en CSV
   */
  importProducts(file) {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/import/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  // ============ PARAMÈTRES ============

  /**
   * Obtenir les paramètres du magasin
   */
  getSettings() {
    return api.get('/admin/settings');
  }

  /**
   * Mettre à jour les paramètres du magasin
   */
  updateSettings(settings) {
    return api.put('/admin/settings', settings);
  }

  // ============ UTILITAIRES ============

  /**
   * Vérifier si l'utilisateur est admin
   */
  isAdmin() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'admin';
  }

  /**
   * Récupérer le token admin
   */
  getAdminToken() {
    return localStorage.getItem('token');
  }

  /**
   * Valider les données avant envoi
   */
  validateProductData(data) {
    const errors = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Le nom du produit est requis');
    }

    if (!data.description || data.description.trim().length === 0) {
      errors.push('La description est requise');
    }

    if (!data.category) {
      errors.push('La catégorie est requise');
    }

    if (!data.price || data.price <= 0) {
      errors.push('Le prix doit être supérieur à 0');
    }

    if (!data.image) {
      errors.push('L\'image est requise');
    }

    if (data.stock === undefined || data.stock < 0) {
      errors.push('Le stock doit être supérieur ou égal à 0');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Formater les données de commande pour l'affichage
   */
  formatOrder(order) {
    return {
      ...order,
      formattedDate: new Date(order.createdAt).toLocaleDateString('fr-FR'),
      formattedPrice: order.totalPrice.toFixed(2),
      statusLabel: this.getOrderStatusLabel(order.status)
    };
  }

  /**
   * Obtenir le label du statut de commande
   */
  getOrderStatusLabel(status) {
    const labels = {
      pending: 'En attente',
      processing: 'En traitement',
      shipped: 'Expédié',
      delivered: 'Livré',
      cancelled: 'Annulé'
    };
    return labels[status] || status;
  }

  /**
   * Obtenir la couleur du statut
   */
  getOrderStatusColor(status) {
    const colors = {
      pending: 'yellow',
      processing: 'blue',
      shipped: 'purple',
      delivered: 'green',
      cancelled: 'red'
    };
    return colors[status] || 'gray';
  }
}

export default new AdminService();
