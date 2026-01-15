import {
  getOrders,
  getOrderById,
  createOrder as apiCreateOrder,
  getOrderBySessionId as apiGetOrderBySessionId,
} from './api';

class OrderService {
  constructor() {
    this.ordersKey = 'orders';
  }

  // Récupérer toutes les commandes
  async fetchOrders() {
    try {
      const response = await getOrders();
      return response.data.orders || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      throw error;
    }
  }

  // Récupérer une commande par ID
  async fetchOrderById(id) {
    try {
      const response = await getOrderById(id);
      return response.data.order;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Créer une commande
  async createOrder(orderData) {
    try {
      const response = await apiCreateOrder(orderData);
      return response.data.order;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Récupérer une commande par sessionId Stripe
  async getOrderBySessionId(sessionId) {
    try {
      const response = await apiGetOrderBySessionId(sessionId);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Récupérer les commandes de l'utilisateur
  async getUserOrders() {
    try {
      const response = await getOrders();
      return response.data.orders || [];
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Calculer le montant total
  calculateTotal(items) {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Formater la date
  formatDate(date) {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Obtenir le statut en français
  getStatusLabel(status) {
    const labels = {
      pending: 'En attente',
      processing: 'En traitement',
      shipped: 'Expédié',
      delivered: 'Livré',
      cancelled: 'Annulé',
    };
    return labels[status] || status;
  }

  // Obtenir la couleur du statut
  getStatusColor(status) {
    const colors = {
      pending: 'yellow',
      processing: 'blue',
      shipped: 'indigo',
      delivered: 'green',
      cancelled: 'red',
    };
    return colors[status] || 'gray';
  }

  // Vérifier si la commande peut être annulée
  canCancel(order) {
    return ['pending', 'processing'].includes(order.status);
  }

  // Vérifier si la commande peut être retournée
  canReturn(order) {
    const deliveredDate = new Date(order.updatedAt);
    const now = new Date();
    const daysDiff = Math.floor((now - deliveredDate) / (1000 * 60 * 60 * 24));
    return order.status === 'delivered' && daysDiff <= 30;
  }
}

export default new OrderService();
