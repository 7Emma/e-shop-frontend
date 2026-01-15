import { getWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist, checkWishlist as apiCheckWishlist } from './api';

/**
 * WishlistService - Gestion robuste des favoris
 * Validations, cache local, synchronisation serveur
 */
class WishlistService {
  constructor() {
    this.storageKey = 'wishlist';
    this.state = {
      products: [],
    };
    this.cache = new Map(); // Cache pour les vérifications rapides
    this.subscribers = [];
    this.isLoading = false;
    this.error = null;
    this.loadFromStorage();
  }

  // ============ VALIDATIONS ============

  validateProductId(productId) {
    if (!productId || typeof productId !== 'string' || !productId.trim()) {
      throw new Error('ID produit invalide');
    }
    return productId.trim();
  }

  validateProduct(product) {
    if (!product || typeof product !== 'object') throw new Error('Produit invalide');
    if (!product._id && !product.id) throw new Error('Product._id ou id requis');
    return product;
  }

  validateState(state) {
    if (!state || typeof state !== 'object') return { products: [] };

    const validProducts = (state.products || [])
      .map((product) => {
        try {
          return this.validateProduct(product);
        } catch (e) {
          console.warn('⚠️ Produit invalide ignoré:', e.message);
          return null;
        }
      })
      .filter(Boolean);

    // Supprimer les doublons par _id
    const seen = new Set();
    const unique = validProducts.filter((p) => {
      const id = p._id || p.id;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    return { products: unique };
  }

  // ============ SUBSCRIBERS ============

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== callback);
    };
  }

  notifySubscribers() {
    this.subscribers.forEach((cb) => {
      try {
        cb({
          wishlist: this.state,
          isLoading: this.isLoading,
          error: this.error,
        });
      } catch (e) {
        console.error('Erreur subscriber:', e);
      }
    });
  }

  // ============ STOCKAGE ============

  loadFromStorage() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        this.state = this.validateState(JSON.parse(data));
        this.updateCache();
      }
    } catch (e) {
      console.error('❌ Erreur lecture localStorage:', e);
      localStorage.removeItem(this.storageKey);
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.error('❌ Erreur sauvegarde localStorage:', e);
    }
  }

  updateCache() {
    this.cache.clear();
    (this.state.products || []).forEach((p) => {
      const id = p._id || p.id;
      this.cache.set(id, true);
    });
  }

  // ============ API ============

  async fetchWishlist() {
    this.isLoading = true;
    this.error = null;
    this.notifySubscribers();

    try {
      const res = await getWishlist();
      this.state = this.validateState(res.data.wishlist || res.data);
      this.updateCache();
      this.saveToStorage();
      this.notifySubscribers();
      return this.state;
    } catch (e) {
      this.error = e.response?.data?.message || e.message || 'Erreur chargement favoris';
      console.error('❌ fetchWishlist:', this.error);
      this.notifySubscribers();
      throw e;
    } finally {
      this.isLoading = false;
    }
  }

  async addToWishlist(productId) {
    this.isLoading = true;
    this.error = null;
    this.notifySubscribers();

    try {
      productId = this.validateProductId(productId);

      const res = await apiAddToWishlist(productId);

      if (res.data.isGuest) {
        // Mode guest: utiliser les données complètes du produit retournées par le backend
        if (!this.state.products.some((p) => (p._id || p.id) === productId)) {
          // Le backend retourne les données complètes du produit dans res.data.product
          const product = res.data.product || { _id: productId };
          this.state.products.push(product);
        }
      } else {
        // Connecté: utiliser réponse serveur
        this.state = this.validateState(res.data.wishlist || res.data);
      }

      this.state = this.validateState(this.state);
      this.updateCache();
      this.saveToStorage();
      this.notifySubscribers();

      return { success: true, message: 'Ajouté aux favoris', wishlist: this.state };
    } catch (e) {
      this.error = e.response?.data?.message || e.message;
      console.error('❌ addToWishlist:', this.error);
      this.notifySubscribers();
      throw e;
    } finally {
      this.isLoading = false;
    }
  }

  async removeFromWishlist(productId) {
    this.isLoading = true;
    this.error = null;
    this.notifySubscribers();

    try {
      productId = this.validateProductId(productId);

      const res = await apiRemoveFromWishlist(productId);

      if (res.data.isGuest) {
        // Mode guest: supprimer localement
        this.state.products = this.state.products.filter((p) => (p._id || p.id) !== productId);
      } else {
        // Connecté: utiliser réponse serveur
        this.state = this.validateState(res.data.wishlist || res.data);
      }

      this.updateCache();
      this.saveToStorage();
      this.notifySubscribers();

      return { success: true, message: 'Retiré des favoris', wishlist: this.state };
    } catch (e) {
      this.error = e.response?.data?.message || e.message;
      console.error('❌ removeFromWishlist:', this.error);
      this.notifySubscribers();
      throw e;
    } finally {
      this.isLoading = false;
    }
  }

  async toggleWishlist(productId, isWishlisted) {
    try {
      if (isWishlisted) {
        return await this.removeFromWishlist(productId);
      } else {
        return await this.addToWishlist(productId);
      }
    } catch (e) {
      this.error = e.response?.data?.message || e.message;
      console.error('❌ toggleWishlist:', this.error);
      this.notifySubscribers();
      throw e;
    }
  }

  async checkWishlist(productId) {
    try {
      productId = this.validateProductId(productId);

      // Utiliser le cache en premier
      if (this.cache.has(productId)) {
        return this.cache.get(productId);
      }

      // Sinon appeler l'API
      const res = await apiCheckWishlist(productId);
      const isWishlisted = res.data.isWishlisted || false;
      this.cache.set(productId, isWishlisted);
      return isWishlisted;
    } catch (e) {
      console.error('❌ checkWishlist:', e.message);
      return false;
    }
  }

  // ============ GETTERS ============

  getWishlist() {
    return this.validateState(this.state);
  }

  getProducts() {
    return this.state.products || [];
  }

  getCount() {
    return this.state.products.length;
  }

  isEmpty() {
    return this.getCount() === 0;
  }

  isInWishlist(productId) {
    try {
      productId = this.validateProductId(productId);
      return this.cache.get(productId) === true;
    } catch (e) {
      return false;
    }
  }

  getError() {
    return this.error;
  }

  reset() {
    this.state = { products: [] };
    this.error = null;
    this.isLoading = false;
    this.cache.clear();
    localStorage.removeItem(this.storageKey);
    this.notifySubscribers();
  }
}

export default new WishlistService();
