import { BarChart3, Users, ShoppingBag, TrendingUp, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../components/Layout/AdminHeader';
import { adminService } from '../../services';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier l'authentification et le rôle admin
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'admin') {
      navigate('/');
      return;
    }

    // Récupérer les statistiques
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const response = await adminService.getDashboardStats();
        setStats(response.data.stats || {
          totalProducts: 0,
          totalUsers: 0,
          totalOrders: 0,
          totalRevenue: 0,
          pendingOrders: 0,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement');
        console.error('Erreur loadStats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [navigate]);

  if (isLoading) {
    return (
      <>
        <AdminHeader />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </>
    );
  }

  const statCards = [
    {
      label: 'Produits',
      value: stats?.totalProducts || 0,
      icon: ShoppingBag,
      color: 'blue',
      href: '/admin/products'
    },
    {
      label: 'Utilisateurs',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'green',
      href: '/admin/users'
    },
    {
      label: 'Commandes',
      value: stats?.totalOrders || 0,
      icon: BarChart3,
      color: 'purple',
      href: '/admin/orders'
    },
    {
      label: 'Revenus',
      value: `${(stats?.totalRevenue || 0).toFixed(2)}€`,
      icon: TrendingUp,
      color: 'red',
      href: '/admin/orders'
    },
  ];

  const getColorClass = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      red: 'bg-red-50 text-red-600',
    };
    return colors[color] || 'bg-gray-50 text-gray-600';
  };

  return (
    <>
      <AdminHeader />
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              Tableau de bord
            </h1>
            <p className="text-gray-600 mt-2">
              Bienvenue sur le panneau d'administration E-Shop
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle size={20} className="text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <a
                  key={card.label}
                  href={card.href}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">
                        {card.label}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {card.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${getColorClass(card.color)}`}>
                      <Icon size={24} />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Actions rapides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/admin/products?action=create"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition text-center"
              >
                <p className="font-semibold text-gray-900">
                  ➕ Ajouter un produit
                </p>
              </a>
              <a
                href="/admin/orders?status=pending"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition text-center"
              >
                <p className="font-semibold text-gray-900">
                  📦 Commandes en attente ({stats?.pendingOrders || 0})
                </p>
              </a>
              <a
                href="/admin/settings"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition text-center"
              >
                <p className="font-semibold text-gray-900">
                  ⚙️ Paramètres
                </p>
              </a>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Commandes récentes
              </h3>
              <div className="space-y-4">
                <p className="text-gray-500 text-center py-8">
                  Aucune donnée disponible pour le moment
                </p>
              </div>
              <a
                href="/admin/orders"
                className="mt-4 block text-center py-2 text-red-600 font-semibold hover:text-red-700"
              >
                Voir toutes les commandes →
              </a>
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Utilisateurs récents
              </h3>
              <div className="space-y-4">
                <p className="text-gray-500 text-center py-8">
                  Aucune donnée disponible pour le moment
                </p>
              </div>
              <a
                href="/admin/users"
                className="mt-4 block text-center py-2 text-red-600 font-semibold hover:text-red-700"
              >
                Voir tous les utilisateurs →
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default AdminDashboard;
