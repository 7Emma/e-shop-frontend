/**
 * FavoritesService - Gestion des articles favoris
 * Synchronisation avec localStorage et API
 */
class FavoritesService {
  constructor() {
    this.storageKey = 'favorites';
    this.state = {
      items: [],
      totalCount: 0,
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

  validateProduct(product) {
    if (!product || typeof product !== 'object') {
      throw new Error('Produit invalide');
    }
    if (!product._id && !product.id) {
      throw new Error('Product._id ou Product.id requis');
    }
    return product;
  }

  validateFavoriteItem(item) {
    if (!item || typeof item !== 'object') {
      throw new Error('Item invalide');
    }
    if (!item.product) {
      throw new Error('Item.product requis');
    }
    this.validateProduct(item.product);
    return item;
  }

  validateState(state) {
    if (!state || typeof state !== 'object') {
      return { items: [], totalCount: 0 };
    }

    const validItems = (state.items || [])
      .map((item) => {
        try {
          return this.validateFavoriteItem(item);
        } catch (e) {
          console.warn('⚠️ Item invalide ignoré:', e.message);
          return null;
        }
      })
      .filter(Boolean);

    return {
      items: validItems,
      totalCount: validItems.length,
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
          favorites: this.state,
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

  // ============ MÉTHODES ============

  addToFavorites(product) {
    this.isLoading = true;
    this.error = null;
    this.notifySubscribers();

    try {
      product = this.validateProduct(product);
      const productId = product._id || product.id;

      // Vérifier si le produit est déjà en favoris
      const exists = this.state.items.some((item) => {
        const id = item.product._id || item.product.id;
        return id === productId;
      });

      if (!exists) {
        this.state.items.push({ product });
        this.state.totalCount = this.state.items.length;
        this.saveToStorage();
      }

      this.notifySubscribers();
      return { success: true, message: 'Ajouté aux favoris', favorites: this.state };
    } catch (e) {
      this.error = e.message || 'Erreur ajout aux favoris';
      console.error('❌ addToFavorites:', this.error);
      this.notifySubscribers();
      throw e;
    } finally {
      this.isLoading = false;
    }
  }

  removeFromFavorites(productId) {
    this.isLoading = true;
    this.error = null;
    this.notifySubscribers();

    try {
      productId = this.validateProductId(productId);

      this.state.items = this.state.items.filter((item) => {
        const id = item.product._id || item.product.id;
        return id !== productId;
      });

      this.state.totalCount = this.state.items.length;
      this.saveToStorage();
      this.notifySubscribers();

      return { success: true, message: 'Supprimé des favoris', favorites: this.state };
    } catch (e) {
      this.error = e.message || 'Erreur suppression favoris';
      console.error('❌ removeFromFavorites:', this.error);
      this.notifySubscribers();
      throw e;
    } finally {
      this.isLoading = false;
    }
  }

  toggleFavorite(product) {
    const productId = product._id || product.id;
    if (this.isFavorite(productId)) {
      return this.removeFromFavorites(productId);
    } else {
      return this.addToFavorites(product);
    }
  }

  isFavorite(productId) {
    return this.state.items.some((item) => {
      const id = item.product._id || item.product.id;
      return id === productId;
    });
  }

  clearFavorites() {
    this.isLoading = true;
    this.error = null;
    this.notifySubscribers();

    try {
      this.state = { items: [], totalCount: 0 };
      this.saveToStorage();
      this.notifySubscribers();

      return { success: true, message: 'Favoris vidés', favorites: this.state };
    } catch (e) {
      this.error = e.message || 'Erreur vidage favoris';
      console.error('❌ clearFavorites:', this.error);
      this.notifySubscribers();
      throw e;
    } finally {
      this.isLoading = false;
    }
  }

  // ============ GETTERS ============

  getFavorites() {
    return this.validateState(this.state);
  }

  getItems() {
    return this.state.items || [];
  }

  getCount() {
    return this.state.totalCount || 0;
  }

  isEmpty() {
    return this.getCount() === 0;
  }

  getError() {
    return this.error;
  }

  reset() {
    this.state = { items: [], totalCount: 0 };
    this.error = null;
    this.isLoading = false;
    localStorage.removeItem(this.storageKey);
    this.notifySubscribers();
  }
}

export default new FavoritesService();
