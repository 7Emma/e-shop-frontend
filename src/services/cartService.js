import { getCart, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart } from './api';

/**
 * CartService - Gestion robuste du panier
 * Validations multi-couches, synchronisation serveur/client
 */
class CartService {
  constructor() {
    this.storageKey = 'cart';
    this.state = {
      items: [],
      totalItems: 0,
      totalPrice: 0,
    };
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

  validateQuantity(qty) {
    const quantity = parseInt(qty);
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error('Quantité doit être >= 1');
    }
    if (quantity > 10000) {
      throw new Error('Quantité maximale: 10000');
    }
    return quantity;
  }

  validateProduct(product) {
    if (!product || typeof product !== 'object') throw new Error('Produit invalide');
    if (!product._id) throw new Error('Product._id requis');
    if (typeof product.price !== 'number' || product.price < 0) {
      throw new Error('Product.price doit être un nombre positif');
    }
    return product;
  }

  validateCartItem(item) {
    if (!item || typeof item !== 'object') throw new Error('Item invalide');
    if (!item.product) throw new Error('Item.product requis');
    if (!item.quantity) throw new Error('Item.quantity requis');
    this.validateProduct(item.product);
    this.validateQuantity(item.quantity);
    return item;
  }

  validateState(state) {
    if (!state || typeof state !== 'object') return { items: [], totalItems: 0, totalPrice: 0 };

    const validItems = (state.items || [])
      .map((item) => {
        try {
          return this.validateCartItem(item);
        } catch (e) {
          console.warn('⚠️ Item invalide ignoré:', e.message);
          return null;
        }
      })
      .filter(Boolean);

    const totalItems = validItems.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = Math.round(validItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0) * 100) / 100;

    return {
      items: validItems,
      totalItems,
      totalPrice,
    };
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
          cart: this.state,
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

  // ============ API ============

  async fetchCart() {
    this.isLoading = true;
    this.error = null;
    this.notifySubscribers();

    try {
      const res = await getCart();
      const serverCart = res.data.cart || res.data;
      this.state = this.validateState(serverCart);
      this.saveToStorage();
      this.notifySubscribers();
      return this.state;
    } catch (e) {
      this.error = e.response?.data?.message || e.message || 'Erreur chargement panier';
      console.error('❌ fetchCart:', this.error);
      this.notifySubscribers();
      throw e;
    } finally {
      this.isLoading = false;
    }
  }

  async addToCart(productId, quantity = 1) {
    this.isLoading = true;
    this.error = null;
    this.notifySubscribers();

    try {
      productId = this.validateProductId(productId);
      quantity = this.validateQuantity(quantity);

      const res = await apiAddToCart(productId, quantity);

      if (res.data.isGuest) {
        // Mode guest: gestion locale
        const existingItem = this.state.items.find((i) => i.product._id === productId);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          const product = res.data.product;
          if (product) {
            this.state.items.push({ product, quantity });
          }
        }
      } else {
        // Connecté: utiliser réponse serveur
        this.state = this.validateState(res.data.cart || res.data);
      }

      this.state = this.validateState(this.state);
      this.saveToStorage();
      this.notifySubscribers();

      return { success: true, message: 'Ajouté au panier', cart: this.state };
    } catch (e) {
      this.error = e.response?.data?.message || e.message || 'Erreur ajout panier';
      console.error('❌ addToCart:', this.error);
      this.notifySubscribers();
      throw e;
    } finally {
      this.isLoading = false;
    }
  }

  async updateQuantity(productId, quantity) {
    this.isLoading = true;
    this.error = null;
    this.notifySubscribers();

    try {
      productId = this.validateProductId(productId);
      quantity = this.validateQuantity(quantity);

      if (quantity === 0) {
        return await this.removeFromCart(productId);
      }

      const res = await apiUpdateCartItem(productId, quantity);
      
      // Pour les users authentifiés: utiliser la réponse du serveur
      // Pour les guests: garder le panier local (le serveur retourne un panier vide)
      if (!res.data.isGuest && res.data.cart) {
        this.state = this.validateState(res.data.cart);
      } else if (res.data.isGuest) {
        // Guest user: mettre à jour localement le panier
        const item = this.state.items.find(i => i.product._id === productId);
        if (item) {
          item.quantity = quantity;
        }
        this.recalculateTotals();
      }
      
      this.saveToStorage();
      this.notifySubscribers();

      return { success: true, message: 'Quantité mise à jour', cart: this.state };
    } catch (e) {
      this.error = e.response?.data?.message || e.message;
      console.error('❌ updateQuantity:', this.error);
      this.notifySubscribers();
      throw e;
    } finally {
      this.isLoading = false;
    }
  }

  async removeFromCart(productId) {
    this.isLoading = true;
    this.error = null;
    this.notifySubscribers();

    try {
      productId = this.validateProductId(productId);

      const res = await apiRemoveFromCart(productId);
      
      // Pour les users authentifiés: utiliser la réponse du serveur
      // Pour les guests: garder le panier local (le serveur retourne un panier vide)
      if (!res.data.isGuest && res.data.cart) {
        this.state = this.validateState(res.data.cart);
      } else if (res.data.isGuest) {
        // Guest user: supprimer localement
        this.state.items = this.state.items.filter(i => i.product._id !== productId);
        this.recalculateTotals();
      }
      
      this.saveToStorage();
      this.notifySubscribers();

      return { success: true, message: 'Supprimé du panier', cart: this.state };
    } catch (e) {
      this.error = e.response?.data?.message || e.message;
      console.error('❌ removeFromCart:', this.error);
      this.notifySubscribers();
      throw e;
    } finally {
      this.isLoading = false;
    }
  }

  async clearCart() {
    this.isLoading = true;
    this.error = null;
    this.notifySubscribers();

    try {
      const res = await apiClearCart();
      this.state = { items: [], totalItems: 0, totalPrice: 0 };
      this.saveToStorage();
      this.notifySubscribers();

      return { success: true, message: 'Panier vidé', cart: this.state };
    } catch (e) {
      this.error = e.response?.data?.message || e.message;
      console.error('❌ clearCart:', this.error);
      this.notifySubscribers();
      throw e;
    } finally {
      this.isLoading = false;
    }
  }

  // ============ HELPERS ============
  
  recalculateTotals() {
    const totalItems = this.state.items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = Math.round(this.state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0) * 100) / 100;
    this.state.totalItems = totalItems;
    this.state.totalPrice = totalPrice;
  }

  // ============ GETTERS ============

  getCart() {
    return this.validateState(this.state);
  }

  getItems() {
    return this.state.items || [];
  }

  getCount() {
    return this.state.totalItems || 0;
  }

  getTotal() {
    return this.state.totalPrice || 0;
  }

  isEmpty() {
    return this.getCount() === 0;
  }

  hasProduct(productId) {
    return this.state.items.some((i) => i.product._id === productId);
  }

  getError() {
    return this.error;
  }

  reset() {
    this.state = { items: [], totalItems: 0, totalPrice: 0 };
    this.error = null;
    this.isLoading = false;
    localStorage.removeItem(this.storageKey);
    this.notifySubscribers();
  }
}

export default new CartService();
