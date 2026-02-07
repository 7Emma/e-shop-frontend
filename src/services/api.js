import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔧 API Configuration:');
console.log('  VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('  API_BASE_URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ Permet d'envoyer les cookies HTTP-only avec les requêtes CORS
});

// ⚠️ Token JWT optionnel - pas d'authentification requise
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`📤 [${config.method.toUpperCase()}] ${config.url}`, config.data);
  return config;
});

// Log des réponses
api.interceptors.response.use(
  (response) => {
    console.log(`📥 [${response.status}] ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error(`❌ [${error.response?.status || 'ERROR'}] ${error.config?.url}`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Products
export const getProducts = (params) => 
  api.get('/products', { params });
export const getProductById = (id) => 
  api.get(`/products/${id}`);
export const searchProducts = (query) => 
  getProducts({ search: query });
export const getCategories = () => 
  api.get('/products/categories');

// Auth
export const register = (userData) => 
  api.post('/auth/register', userData);
export const login = (userData) => 
  api.post('/auth/login', userData);

// Cart
export const getCart = () => 
  api.get('/cart');
export const addToCart = (productId, quantity) => 
  api.post('/cart/add', { productId, quantity });
export const updateCartItem = (productId, quantity) => 
  api.put(`/cart/update/${productId}`, { quantity });
export const removeFromCart = (productId) => 
  api.delete(`/cart/remove/${productId}`);
export const clearCart = () => 
  api.delete('/cart/clear');

// Orders
export const getOrders = () => 
  api.get('/orders');
export const getOrderById = (id) => 
  api.get(`/orders/${id}`);
export const getOrderBySessionId = (sessionId) => 
  api.get(`/orders/session/${sessionId}`);
export const getOrderByTrackingCode = (trackingCode) => 
  api.get(`/orders/track/${trackingCode}`);
export const createOrder = (orderData) => 
  api.post('/orders', orderData);

// Wishlist
export const getWishlist = () => 
  api.get('/wishlist');
export const addToWishlist = (productId) => 
  api.post(`/wishlist/add/${productId}`);
export const removeFromWishlist = (productId) => 
  api.delete(`/wishlist/remove/${productId}`);
export const checkWishlist = (productId) => 
  api.post(`/wishlist/check/${productId}`);

// Users
export const getUserProfile = () => 
  api.get('/users/profile');
export const updateUserProfile = (userData) => 
  api.put('/users/profile', userData);
export const changePassword = (passwords) => 
  api.put('/users/change-password', passwords);

// Reviews
export const getProductReviews = (productId) => 
  api.get(`/reviews/product/${productId}`);
export const createReview = (reviewData) => 
  api.post('/reviews', reviewData);
export const updateReview = (id, reviewData) => 
  api.put(`/reviews/${id}`, reviewData);
export const deleteReview = (id) => 
  api.delete(`/reviews/${id}`);

// Payment (Stripe)
export const createCheckoutSession = (shippingAddress, cartItems = []) => 
  api.post('/payment/checkout', { shippingAddress, cartItems });
export const getPaymentStatus = (sessionId) => 
  api.get(`/payment/status/${sessionId}`);

export default api;
