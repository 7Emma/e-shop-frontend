import { useState, useEffect } from 'react';
import { cartService } from '../services';

/**
 * Hook pour gérer l'état du panier
 * S'abonne aux changements du service
 */
export function useCart() {
  const [cart, setCart] = useState(cartService.getCart());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Charger le panier initial
    setCart(cartService.getCart());

    // S'abonner aux changements
    const unsubscribe = cartService.subscribe((state) => {
      setCart(state.cart || cartService.getCart());
      setIsLoading(state.isLoading);
      if (state.error) setError(state.error);
    });

    return unsubscribe;
  }, []);

  return {
    cart,
    isLoading,
    error,
    addToCart: (productId, quantity) => cartService.addToCart(productId, quantity),
    removeFromCart: (productId) => cartService.removeFromCart(productId),
    updateQuantity: (productId, quantity) => cartService.updateQuantity(productId, quantity),
    clearCart: () => cartService.clearCart(),
  };
}

export default useCart;
