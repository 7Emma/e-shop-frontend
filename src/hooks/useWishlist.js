import { useState, useEffect } from 'react';
import { wishlistService } from '../services';

/**
 * Hook pour gérer l'état de la wishlist
 * S'abonne aux changements du service
 */
export function useWishlist() {
  const [wishlist, setWishlist] = useState(wishlistService.getWishlist());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Charger la wishlist initiale
    setWishlist(wishlistService.getWishlist());

    // S'abonner aux changements
    const unsubscribe = wishlistService.subscribe((state) => {
      setWishlist(state.wishlist || wishlistService.getWishlist());
      setIsLoading(state.isLoading);
      if (state.error) setError(state.error);
    });

    return unsubscribe;
  }, []);

  return {
    wishlist,
    isLoading,
    error,
    addToWishlist: (productId) => wishlistService.addToWishlist(productId),
    removeFromWishlist: (productId) => wishlistService.removeFromWishlist(productId),
    toggleWishlist: (productId, isWishlisted) => wishlistService.toggleWishlist(productId, isWishlisted),
    isInWishlist: (productId) => wishlistService.isInWishlist(productId),
  };
}

export default useWishlist;
