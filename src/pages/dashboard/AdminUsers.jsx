import { Eye, Edit2, Trash2, AlertCircle, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../components/Layout/AdminHeader';
import { adminService } from '../../services';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filters, setFilters] = useState({ role: '', search: '' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingRole, setEditingRole] = useState('user');
  const navigate = useNavigate();

  // Vérification admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      navigate('/');
    }
  }, [navigate]);

  // Charger les utilisateurs
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const res = await adminService.getAllUsers();
        setUsers(res.data.users || []);
      } catch (err) {
        setError('Erreur lors du chargement des utilisateurs');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      setError(null);
      await adminService.changeUserRole(userId, newRole);
      setSuccess('Rôle mis à jour avec succès');
      
      setUsers(users.map(u => 
        u._id === userId ? { ...u, role: newRole } : u));
      
      if (selectedUser?._id === userId) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      setError(null);
      await adminService.deleteUser(userId);
      setSuccess('Utilisateur supprimé');
      setUsers(users.filter(u => u._id !== userId));
      setSelectedUser(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchRole = !filters.role || user.role === filters.role;
    const matchSearch = !filters.search || 
      user.email?.includes(filters.search) ||
      user.firstName?.includes(filters.search) ||
      user.lastName?.includes(filters.search);
    return matchRole && matchSearch;
  });

  const getRoleColor = (role) => {
    return role === 'admin' 
      ? 'bg-red-100 text-red-700' 
      : 'bg-blue-100 text-blue-700';
  };

  // Afficher les messages temporaires
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (isLoading) {
    return (
      <>
        <AdminHeader />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">Chargement des utilisateurs...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader />
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Utilisateurs</h1>
            <p className="text-gray-600 mt-2">{filteredUsers.length} utilisateur(s)</p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle size={20} className="text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <Check size={20} className="text-green-600" />
              <p className="text-green-700">{success}</p>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher par email, nom ou prénom..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Tous les rôles</option>
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Users List */}
            <div className="lg:col-span-2 space-y-4">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div
                    key={user._id}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-gray-600">{user.email}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleColor(user.role)}`}>
                        {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs uppercase">Téléphone</p>
                        <p className="text-gray-900">{user.phone || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase">Inscrit</p>
                        <p className="text-gray-900">
                          {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setEditingRole(user.role);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 text-red-600 hover:text-red-700 font-semibold"
                    >
                      <Eye size={18} />
                      Voir les détails
                    </button>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-600">Aucun utilisateur trouvé</p>
                </div>
              )}
            </div>

            {/* Details Panel */}
            {selectedUser && (
              <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Détails de l'utilisateur
                </h3>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Nom complet</p>
                    <p className="text-gray-900 font-semibold">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="text-gray-900 font-semibold">
                      {selectedUser.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Téléphone</p>
                    <p className="text-gray-900">
                      {selectedUser.phone || '-'}
                    </p>
                  </div>
                  {selectedUser.address && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Adresse</p>
                      <p className="text-gray-900 text-sm">
                        {selectedUser.address.street}<br />
                        {selectedUser.address.zipCode} {selectedUser.address.city}<br />
                        {selectedUser.address.country}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Membre depuis</p>
                    <p className="text-gray-900">
                      {new Date(selectedUser.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                {/* Change Role */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 mb-3">
                    Changer le rôle
                  </p>
                  <select
                    value={editingRole}
                    onChange={(e) => {
                      setEditingRole(e.target.value);
                      handleRoleChange(selectedUser._id, e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  >
                    <option value="user">Utilisateur</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteUser(selectedUser._id)}
                  className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm"
                >
                  Supprimer l'utilisateur
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default AdminUsers;
