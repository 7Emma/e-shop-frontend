import { createCheckoutSession as apiCreateCheckoutSession, getPaymentStatus as apiGetPaymentStatus } from './api';

/**
 * Service de paiement Stripe
 */
class PaymentService {
  /**
    * Créer une session de paiement Stripe
    * @param {Object} shippingAddress - Adresse de livraison
    * @param {Array} cartItems - Articles du panier (pour les guests)
    * @returns {Object} SessionId et URL de paiement
    */
  async createCheckoutSession(shippingAddress, cartItems = []) {
    try {
      const response = await apiCreateCheckoutSession(shippingAddress, cartItems);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * Récupérer le statut du paiement
   * @param {String} sessionId - ID de la session Stripe
   * @returns {Object} Statut du paiement
   */
  async getPaymentStatus(sessionId) {
    try {
      const response = await apiGetPaymentStatus(sessionId);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * Rediriger vers Stripe Checkout
   * @param {String} url - URL de la session Stripe
   */
  redirectToCheckout(url) {
    if (url) {
      window.location.href = url;
    }
  }
}

export default new PaymentService();
