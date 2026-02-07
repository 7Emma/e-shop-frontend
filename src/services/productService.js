import {
  getProducts,
  getProductById,
  searchProducts,
} from './api';

class ProductService {
  constructor() {
    this.productsKey = 'products';
    this.productsCacheKey = 'products_cache';
    this.cacheDuration = 5 * 60 * 1000; // 5 minutes
  }

  // Récupérer tous les produits
  async fetchProducts(params = {}) {
    try {
      const response = await getProducts(params);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw error;
    }
  }

  // Récupérer un produit par ID
  async fetchProductById(id) {
    try {
      const response = await getProductById(id);
      return response.data.product;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Rechercher des produits
  async searchProducts(query) {
    try {
      const response = await searchProducts(query);
      return response.data.products || [];
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Filtrer les produits
  async filterProducts(filters) {
    try {
      const response = await getProducts(filters);
      return {
        products: response.data.products || [],
        pagination: response.data.pagination || {}
      };
    } catch (error) {
      console.error('Erreur filtrage produits:', error);
      throw error;
    }
  }

  // Calculer la réduction
  calculateDiscount(originalPrice, currentPrice) {
    if (!originalPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  // Économie réalisée
  calculateSavings(originalPrice, currentPrice) {
    if (!originalPrice) return 0;
    return (originalPrice - currentPrice).toFixed(2);
  }

  // Formater le prix
  formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  }

  // Évaluation moyenne
  getAverageRating(reviews) {
    if (!reviews || reviews.length === 0) return 0;
    return (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  }

  // Catégories disponibles
  getCategories() {
    return [
      'Vêtements',
      'Chaussures',
      'Montres',
      'Bijoux',
      'Beauté'
    ];
  }

  // Trier les produits
  sortProducts(products, sortBy = 'popular') {
    const sorted = [...products];
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'popular':
      default:
        return sorted.sort((a, b) => b.reviews - a.reviews);
    }
  }

  // Cache des produits
  setCacheProducts(products) {
    localStorage.setItem(this.productsCacheKey, JSON.stringify({
      products,
      timestamp: Date.now(),
    }));
  }

  getCacheProducts() {
    const cache = localStorage.getItem(this.productsCacheKey);
    if (!cache) return null;

    const { products, timestamp } = JSON.parse(cache);
    if (Date.now() - timestamp > this.cacheDuration) {
      localStorage.removeItem(this.productsCacheKey);
      return null;
    }

    return products;
  }

  clearCache() {
    localStorage.removeItem(this.productsCacheKey);
  }
}

export default new ProductService();
