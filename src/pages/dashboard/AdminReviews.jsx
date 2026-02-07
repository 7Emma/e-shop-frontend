import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Star, User, MessageSquare, AlertCircle, Loader } from 'lucide-react';
import AdminHeader from '../../components/Layout/AdminHeader';
import { adminService, notificationService } from '../../services';

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterRating, setFilterRating] = useState('all');
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier l'authentification et le rôle admin
    // Désactivé temporairement pour tester
    // const token = localStorage.getItem('token');
    // const user = JSON.parse(localStorage.getItem('user') || '{}');
    // if (!token || user.role !== 'admin') {
    //   navigate('/');
    //   return;
    // }

    // Récupérer les avis
    const loadReviews = async () => {
      try {
        setIsLoading(true);
        const response = await adminService.getAllReviews();
        setReviews(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement des avis');
        console.error('Erreur loadReviews:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, [navigate]);

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet avis?')) return;

    setDeletingId(reviewId);
    try {
      await adminService.deleteReview(reviewId);
      setReviews(reviews.filter(r => r._id !== reviewId));
      notificationService.success('Avis supprimé avec succès');
    } catch (err) {
      notificationService.error('Erreur lors de la suppression');
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredReviews = filterRating === 'all'
    ? reviews
    : reviews.filter(r => r.rating === parseInt(filterRating));

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (isLoading) {
    return (
      <>
        <AdminHeader />
        <div className="w-full mx-auto px-4 py-12 text-center">
          <Loader className="animate-spin mx-auto mb-4" size={32} />
          <p className="text-gray-600">Chargement des avis...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader />
      <main className="bg-gray-50 min-h-screen">
        <div className="w-full mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Avis des clients</h1>
            <p className="text-gray-600">Gérez les avis et évaluations des produits</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-gray-600 text-sm mb-2">Total des avis</p>
              <p className="text-4xl font-bold text-gray-900">{reviews.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-gray-600 text-sm mb-2">Note moyenne</p>
              <div className="flex items-center gap-2">
                <p className="text-4xl font-bold text-gray-900">{averageRating}</p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-gray-600 text-sm mb-2">Taux d'avis positifs</p>
              <p className="text-4xl font-bold text-gray-900">
                {reviews.length > 0 ? Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100) : 0}%
              </p>
            </div>
          </div>

          {/* Filtres */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Filtrer par note
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterRating('all')}
                className={`px-4 py-2 rounded-lg transition ${
                  filterRating === 'all'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tous
              </button>
              {[5, 4, 3, 2, 1].map(rating => (
                <button
                  key={rating}
                  onClick={() => setFilterRating(String(rating))}
                  className={`px-4 py-2 rounded-lg transition flex items-center gap-1 ${
                    filterRating === String(rating)
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {rating}★ ({reviews.filter(r => r.rating === rating).length})
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Reviews List */}
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">Aucun avis trouvé</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      {/* Produit */}
                      <div className="mb-3">
                        <p className="text-sm text-gray-500">Produit</p>
                        <p className="font-semibold text-gray-900">
                          {review.productId?.name || 'Produit supprimé'}
                        </p>
                      </div>

                      {/* Utilisateur et note */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-gray-500" />
                          <span className="text-sm text-gray-700">
                            {review.userId?.name || 'Utilisateur inconnu'}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }
                            />
                          ))}
                        </div>
                      </div>

                      {/* Commentaire */}
                      {review.comment && (
                        <p className="text-gray-700 mb-3">{review.comment}</p>
                      )}

                      {/* Date */}
                      <p className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    {/* Action */}
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      disabled={deletingId === review._id}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition disabled:opacity-50 flex items-center gap-2"
                    >
                      {deletingId === review._id ? (
                        <>
                          <Loader size={18} className="animate-spin" />
                          Suppression...
                        </>
                      ) : (
                        <>
                          <Trash2 size={18} />
                          Supprimer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default AdminReviews;
