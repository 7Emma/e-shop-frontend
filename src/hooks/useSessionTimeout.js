import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const INACTIVITY_TIMEOUT = 2 * 60 * 1000; // 2 minutes

/**
 * Hook pour gérer la session avec timeout d'inactivité
 * Logout automatiquement après 2 min sans activité
 */
export function useSessionTimeout() {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  // Réinitialiser le timer à chaque activité
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      // Session expirée
      console.log('⏱️ Session expirée après 2 minutes d\'inactivité');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    // Écouter les événements d'activité
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    const handleActivity = () => {
      resetTimeout();
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Initialiser le timer
    resetTimeout();

    return () => {
      // Cleanup
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [navigate]);
}
