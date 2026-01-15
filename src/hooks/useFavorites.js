import { useState, useEffect } from 'react';
import favoritesService from '../services/favoritesService';

/**
 * Hook pour gérer l'état des favoris
 * S'abonne aux changements du service
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState(favoritesService.getFavorites());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Charger les favoris initiaux
    setFavorites(favoritesService.getFavorites());

    // S'abonner aux changements
    const unsubscribe = favoritesService.subscribe((state) => {
      setFavorites(state.favorites || favoritesService.getFavorites());
      setIsLoading(state.isLoading);
      if (state.error) setError(state.error);
    });

    return unsubscribe;
  }, []);

  return {
    favorites,
    isLoading,
    error,
    addToFavorites: (product) => favoritesService.addToFavorites(product),
    removeFromFavorites: (productId) => favoritesService.removeFromFavorites(productId),
    toggleFavorite: (product) => favoritesService.toggleFavorite(product),
    isFavorite: (productId) => favoritesService.isFavorite(productId),
    clearFavorites: () => favoritesService.clearFavorites(),
  };
}

export default useFavorites;
