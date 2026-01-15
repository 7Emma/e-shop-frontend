import { resetCartAndWishlist, resetAllLocalStorage } from '../utils/resetData';
import { Trash2 } from 'lucide-react';

export default function DebugPanel() {
  if (import.meta.env.VITE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <button
        onClick={resetCartAndWishlist}
        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg transition-all hover:shadow-xl"
        title="Réinitialiser panier et favoris"
      >
        <Trash2 size={14} />
        Réinitialiser
      </button>
      <button
        onClick={resetAllLocalStorage}
        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg transition-all hover:shadow-xl"
        title="Réinitialiser tout"
      >
        <Trash2 size={14} />
        Tout
      </button>
    </div>
  );
}
