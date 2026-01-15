import { cartService, wishlistService, notificationService } from '../services';

/**
 * Réinitialiser le panier et les favoris
 */
export const resetCartAndWishlist = () => {
  console.log('🔄 Réinitialisation du panier et favoris...');
  
  try {
    // Réinitialiser les services (qui vident aussi le localStorage)
    cartService.reset();
    wishlistService.reset();
    
    // S'assurer que le localStorage est vide
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
    
    // Notifier
    notificationService.success('Panier et favoris réinitialisés');
    console.log('✅ Panier et favoris réinitialisés');
    
    // Recharger la page pour que les changements soient visibles
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
    notificationService.error('Erreur lors de la réinitialisation');
  }
};

/**
 * Réinitialiser complètement (tout le localStorage)
 */
export const resetAllLocalStorage = () => {
  console.log('🔄 Réinitialisation complète du localStorage...');
  
  try {
    // Réinitialiser les services
    cartService.reset();
    wishlistService.reset();
    
    // Vider tout le localStorage
    localStorage.clear();
    
    // Notifier
    notificationService.success('Tout a été réinitialisé');
    console.log('✅ LocalStorage complètement vidé');
    
    // Recharger la page
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
    notificationService.error('Erreur lors de la réinitialisation');
  }
};

export default {
  resetCartAndWishlist,
  resetAllLocalStorage,
};
