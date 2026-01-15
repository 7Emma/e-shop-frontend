import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
} from './api';
import { productService } from './index';

/**
 * Service de gestion du panier AMÉLIORÉ avec validations complètes
 * Gère l'état local et la communication avec le backend
 * Inclut toutes les vérifications de sécurité et de cohérence
 */
class CartServiceEnhanced {
  constructor() {
    this.cartKey = 'cart';
    this.cart = this.getLocalCart();
    this.listeners = [];
    this.isLoading = false;
    this.error = null;
    this.MAX_QUANTITY = 1000;
    this.MIN_QUANTITY = 1;
  }

  // ============ VALIDATIONS ============

  /**
   * Valider un ID de produit
   */
  validateProductId(productId) {
    if (!productId || typeof productId !== 'string') {
      throw new Error('ID produit invalide');
    }
    if (productId.trim().length === 0) {
      throw new Error('ID produit vide');
    }
    return productId.trim();
  }

  /**
   * Valider une quantité
   */
  validateQuantity(quantity) {
    if (!Number.isInteger(quantity)) {
      throw new Error('Quantité doit être un entier');
    }
    if (quantity < this.MIN_QUANTITY) {
      throw new Error(`Quantité minimale: ${this.MIN_QUANTITY}`);
    }
    if (quantity > this.MAX_QUANTITY) {
      throw new Error(`Quantité maximale: ${this.MAX_QUANTITY}`);
    }
    return quantity;
  }

  /**
   * Valider un produit
   */
  validateProduct(product) {
    if (!product || typeof product !== 'object') {
      throw new Error('Produit invalide');
    }
    
    // Vérifier les champs essentiels
    const requiredFields = ['_id', 'name', 'price', 'stock'];
    for (const field of requiredFields) {
      if (!(field in product)) {
        throw new Error(`Produit manque le champ: ${field}`);
      }
    }
    
    // Vérifier les types
    if (typeof product._id !== 'string') throw new Error('Product._id invalide');
    if (typeof product.name !== 'string') throw new Error('Product.name invalide');
    if (typeof product.price !== 'number' || product.price < 0) {
      throw new Error('Product.price invalide');
    }
    if (!Number.isInteger(product.stock) || product.stock < 0) {
      throw new Error('Product.stock invalide');
    }
    
    return product;
  }

  /**
   * Valider un item du panier
   */
  validateCartItem(item) {
    if (!item || typeof item !== 'object') {
      throw new Error('Item du panier invalide');
    }
    
    // Vérifier product
    if (!item.product) {
      throw new Error('Item manque product');
    }
    
    // Si product est un string (ID), c'est une erreur
    if (typeof item.product === 'string') {
      throw new Error('Item.product doit être un objet, pas un ID');
    }
    
    // Valider le produit
    this.validateProduct(item.product);
    
    // Vérifier quantity
    if (!('quantity' in item)) {
      throw new Error('Item manque quantity');
    }
    
    this.validateQuantity(item.quantity);
    
    return item;
  }

  /**
   * Valider et nettoyer le panier complet
   */
  validateAndCleanCart(cart) {
    if (!cart || typeof cart !== 'object') {
      console.warn('⚠️ Panier invalide, réinitialisation');
      return { items: [], totalItems: 0, totalPrice: 0 };
    }
    
    // Valider les items
    const validItems = (cart.items || [])
      .map((item, index) => {
        try {
          return this.validateCartItem(item);
        } catch (error) {
          console.warn(`⚠️ Item invalide à l'index ${index}:`, error.message);
          return null;
        }
      })
      .filter(Boolean);
    
    // Recalculer les totaux
    const totalItems = validItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = Math.round(
      validItems.reduce((sum, item) => {
        const price = item.product.price || 0;
        return sum + (price * item.quantity);
      }, 0) * 100
    ) / 100; // Arrondir à 2 décimales
    
    const cleanedCart = {
      ...cart,
      items: validItems,
      totalItems,
      totalPrice
    };
    
    return cleanedCart;
  }

  /**
   * Vérifier si un produit est en rupture de stock
   */
  async checkProductAvailability(productId, requestedQuantity) {
    try {
      const product = await productService.fetchProductById(productId);
      
      if (product.stock <= 0) {
        throw new Error('Produit en rupture de stock');
      }
      
      if (requestedQuantity > product.stock) {
        throw new Error(
          `Stock insuffisant. Disponible: ${product.stock}, Demandé: ${requestedQuantity}`
        );
      }
      
      return product;
    } catch (error) {
      throw error;
    }
  }

  // ============ GESTION DES ÉCOUTEURS ============

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notifyListeners(state) {
    this.listeners.forEach(callback => {
      try {
        callback({
          cart: this.cart,
          isLoading: this.isLoading,
          error: this.error,
          ...state
        });
      } catch (error) {
        console.error('Erreur dans un écouteur du panier:', error);
      }
    });
  }

  emit(event, data) {
    this.notifyListeners({ event, data });
  }

  // ============ OPÉRATIONS SERVEUR ============

  /**
   * Récupérer le panier du serveur et le synchroniser
   */
  async fetchCart() {
    this.isLoading = true;
    this.error = null;
    this.notifyListeners();

    try {
      const response = await getCart();
      let serverCart = response.data.cart || response.data;
      
      // Valider et nettoyer
      serverCart = this.validateAndCleanCart(serverCart);
      
      // Fusionner avec le panier local si nécessaire
      if (serverCart.items.length === 0) {
        const localCart = this.getLocalCart();
        if (localCart.items.length > 0) {
          console.log('✓ Serveur vide, utilisant données locales');
          this.cart = localCart;
        } else {
          this.cart = serverCart;
        }
      } else {
        this.cart = serverCart;
      }
      
      this.saveLocalCart(this.cart);
      this.notifyListeners({ event: 'cartFetched' });
      return this.cart;
    } catch (error) {
      this.error = error.response?.data?.message || error.message || 'Erreur lors de la récupération du panier';
      console.error('❌ Erreur fetchCart:', this.error);
      // En cas d'erreur, garder le panier local
      this.cart = this.getLocalCart();
      this.notifyListeners({ event: 'error' });
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Ajouter un produit au panier
   * @param {String} productId - ID du produit
   * @param {Number} quantity - Quantité à ajouter
   * @returns {Object} Cart mis à jour
   */
  async addToCart(productId, quantity = 1) {
    this.isLoading = true;
    this.error = null;
    this.notifyListeners();

    try {
      // ✓ Validation 1: Paramètres
      productId = this.validateProductId(productId);
      quantity = this.validateQuantity(quantity);
      
      // ✓ Validation 2: Récupérer le produit complet
      console.log(`🔍 Récupération du produit ${productId}...`);
      const product = await productService.fetchProductById(productId);
      this.validateProduct(product);
      
      // ✓ Validation 3: Stock disponible
      if (product.stock <= 0) {
        throw new Error('Produit en rupture de stock');
      }
      
      // ✓ Validation 4: Vérifier la quantité totale ne dépasse pas le stock
      const currentCart = this.getCart();
      const existingItem = currentCart.items?.find(
        item => item.product?._id === productId
      );
      const totalRequested = (existingItem?.quantity || 0) + quantity;
      
      if (totalRequested > product.stock) {
        throw new Error(
          `Stock insuffisant. Disponible: ${product.stock}, Demandé: ${totalRequested}`
        );
      }
      
      // ✓ Appel API
      console.log(`📤 Ajout à l'API: ${productId} x${quantity}`);
      const response = await apiAddToCart(productId, quantity);
      
      // ✓ Validation 5: Réponse API
      if (!response || !response.data) {
        throw new Error('Réponse API invalide');
      }
      
      // ✓ Validation 6: Traiter la réponse
      if (response.data.isGuest) {
        console.log('👤 Mode guest: Gestion côté frontend');
        
        // Enrichir avec le produit complet
        if (!this.cart.items) {
          this.cart.items = [];
        }
        
        const existingItem = this.cart.items.find(
          item => item.product?._id === productId
        );
        
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          this.cart.items.push({
            product,  // Objet complet, pas juste l'ID
            quantity,
            addedAt: new Date().toISOString()
          });
        }
      } else {
        // Utilisateur connecté: valider la réponse serveur
        let cartData = response.data.cart || response.data;
        cartData = this.validateAndCleanCart(cartData);
        this.cart = cartData;
      }
      
      // ✓ Recalculer par sécurité
      this.cart = this.validateAndCleanCart(this.cart);
      
      // ✓ Sauvegarder
      this.saveLocalCart(this.cart);
      this.emit('itemAdded', { productId, quantity });
      this.notifyListeners();
      
      console.log('✅ Panier mis à jour:', {
        items: this.cart.items.length,
        total: this.cart.totalPrice
      });
      
      return {
        success: true,
        message: response.data.message || `${product.name} ajouté au panier`,
        cart: this.cart
      };
    } catch (error) {
      this.error = error.message || 'Erreur lors de l\'ajout au panier';
      console.error('❌ Erreur addToCart:', this.error);
      this.notifyListeners({ event: 'error' });
      throw {
        message: this.error,
        details: error
      };
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Mettre à jour la quantité d'un produit
   */
  async updateQuantity(productId, quantity) {
    this.isLoading = true;
    this.error = null;
    this.notifyListeners();

    try {
      // Validations
      productId = this.validateProductId(productId);
      quantity = this.validateQuantity(quantity);
      
      // Si quantité = 0, supprimer l'item
      if (quantity === 0) {
        return await this.removeFromCart(productId);
      }
      
      // Vérifier le stock
      const product = await productService.fetchProductById(productId);
      if (quantity > product.stock) {
        throw new Error(
          `Stock insuffisant. Disponible: ${product.stock}, Demandé: ${quantity}`
        );
      }
      
      // Appel API
      const response = await apiUpdateCartItem(productId, quantity);
      let cartData = response.data.cart || response.data;
      cartData = this.validateAndCleanCart(cartData);
      
      this.cart = cartData;
      this.saveLocalCart(this.cart);
      this.emit('itemUpdated', { productId, quantity });
      this.notifyListeners();
      
      return {
        success: true,
        message: 'Quantité mise à jour',
        cart: this.cart
      };
    } catch (error) {
      this.error = error.message || 'Erreur lors de la mise à jour';
      console.error('❌ Erreur updateQuantity:', this.error);
      this.notifyListeners({ event: 'error' });
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Supprimer un produit du panier
   */
  async removeFromCart(productId) {
    this.isLoading = true;
    this.error = null;
    this.notifyListeners();

    try {
      productId = this.validateProductId(productId);
      
      const response = await apiRemoveFromCart(productId);
      let cartData = response.data.cart || response.data;
      cartData = this.validateAndCleanCart(cartData);
      
      this.cart = cartData;
      this.saveLocalCart(this.cart);
      this.emit('itemRemoved', { productId });
      this.notifyListeners();
      
      return {
        success: true,
        message: response.data.message || 'Produit supprimé du panier',
        cart: this.cart
      };
    } catch (error) {
      this.error = error.message || 'Erreur lors de la suppression';
      console.error('❌ Erreur removeFromCart:', this.error);
      this.notifyListeners({ event: 'error' });
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Vider le panier
   */
  async clearCart() {
    this.isLoading = true;
    this.error = null;
    this.notifyListeners();

    try {
      const response = await apiClearCart();
      let cartData = response.data.cart || response.data;
      cartData = this.validateAndCleanCart(cartData);
      
      this.cart = cartData;
      this.saveLocalCart(this.cart);
      this.emit('cartCleared');
      this.notifyListeners();
      
      return {
        success: true,
        message: response.data.message || 'Panier vidé',
        cart: this.cart
      };
    } catch (error) {
      this.error = error.message || 'Erreur lors du vidage du panier';
      console.error('❌ Erreur clearCart:', this.error);
      this.notifyListeners({ event: 'error' });
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  // ============ GESTION DU STOCKAGE LOCAL ============

  getLocalCart() {
    try {
      const cart = localStorage.getItem(this.cartKey);
      if (!cart) {
        return { items: [], totalItems: 0, totalPrice: 0 };
      }
      
      const parsed = JSON.parse(cart);
      return this.validateAndCleanCart(parsed);
    } catch (error) {
      console.error('❌ Erreur lecture localStorage:', error);
      localStorage.removeItem(this.cartKey);
      return { items: [], totalItems: 0, totalPrice: 0 };
    }
  }

  saveLocalCart(cart) {
    try {
      // Valider avant de sauvegarder
      const validCart = this.validateAndCleanCart(cart);
      localStorage.setItem(this.cartKey, JSON.stringify(validCart));
      this.cart = validCart;
      return true;
    } catch (error) {
      console.error('❌ Erreur sauvegarde localStorage:', error);
      return false;
    }
  }

  clearLocalCart() {
    try {
      localStorage.removeItem(this.cartKey);
      this.cart = { items: [], totalItems: 0, totalPrice: 0 };
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('❌ Erreur effacement localStorage:', error);
      return false;
    }
  }

  // ============ GETTERS ============

  getCart() {
    return this.validateAndCleanCart(this.cart);
  }

  getCartCount() {
    return this.cart?.totalItems || 0;
  }

  getCartTotal() {
    return this.cart?.totalPrice || 0;
  }

  getCartItems() {
    return this.cart?.items || [];
  }

  isEmpty() {
    return this.getCartCount() === 0;
  }

  getCartItem(productId) {
    const items = this.getCartItems();
    return items.find(item => {
      const itemProductId = item.product?._id || item.product;
      return itemProductId === productId;
    }) || null;
  }

  getUniqueItemsCount() {
    return this.getCartItems().length;
  }

  hasProduct(productId) {
    return this.getCartItem(productId) !== null;
  }

  getLoadingState() {
    return this.isLoading;
  }

  getError() {
    return this.error;
  }

  reset() {
    this.cart = { items: [], totalItems: 0, totalPrice: 0 };
    this.error = null;
    this.isLoading = false;
    this.clearLocalCart();
  }
}

export default new CartServiceEnhanced();
