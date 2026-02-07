import { Eye, Truck, X, AlertCircle, Check, Package, Clock, CheckCircle, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../components/Layout/AdminHeader';
import { adminService } from '../../services';
import { useSessionTimeout } from '../../hooks/useSessionTimeout';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filters, setFilters] = useState({ status: '', search: '' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const navigate = useNavigate();

  // ⏱️ Session timeout après 2 min d'inactivité
  useSessionTimeout();

  // Vérification admin
  useEffect(() => {
    // Désactivé temporairement pour tester
    // const user = JSON.parse(localStorage.getItem('user') || '{}');
    // if (user.role !== 'admin') {
    //   navigate('/');
    // }
  }, [navigate]);

  // Charger les commandes
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const res = await adminService.getAllOrders();
        setOrders(res.data.orders || []);
      } catch (err) {
        setError('Erreur lors du chargement des commandes');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setError(null);
      await adminService.updateOrderStatus(orderId, newStatus);
      setSuccess('Statut mis à jour avec succès');
      
      // Mettre à jour l'affichage
      setOrders(orders.map(o => 
        o._id === orderId ? { ...o, status: newStatus } : o));
      
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleTrackingUpdate = async (orderId) => {
    if (!trackingNumber.trim()) {
      setError('Veuillez entrer un numéro de suivi');
      return;
    }

    try {
      setError(null);
      await adminService.updateTrackingNumber(orderId, trackingNumber);
      setSuccess('Numéro de suivi ajouté');
      
      setOrders(orders.map(o =>
        o._id === orderId ? { ...o, trackingNumber } : o));
      setTrackingNumber('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      return;
    }

    try {
      setError(null);
      await adminService.cancelOrder(orderId);
      setSuccess('Commande annulée');
      setOrders(orders.filter(o => o._id !== orderId));
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'annulation');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchStatus = !filters.status || order.status === filters.status;
    const matchSearch = !filters.search || 
      order._id.includes(filters.search) ||
      order.user?.email?.includes(filters.search);
    return matchStatus && matchSearch;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'En attente',
      processing: 'En traitement',
      shipped: 'Expédié',
      delivered: 'Livré',
      cancelled: 'Annulé',
    };
    return labels[status] || status;
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
        <div className="w-full mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">Chargement des commandes...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader />
      <main className="bg-gray-50 min-h-screen">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Commandes</h1>
            <p className="text-gray-600 mt-2">{filteredOrders.length} commande(s)</p>
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
                placeholder="Rechercher par ID de commande ou email..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="processing">En traitement</option>
              <option value="shipped">Expédié</option>
              <option value="delivered">Livré</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Orders List */}
            <div className="lg:col-span-2 space-y-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <div
                    key={order._id}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Commande</p>
                        <p className="font-mono text-gray-900">{order._id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <p className="text-sm text-gray-500">Client</p>
                        <p className="text-gray-900">{order.user?.email || order.shippingAddress?.email || 'Guest'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-lg font-bold text-gray-900">
                          {order.totalPrice.toFixed(2)}€
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Articles</p>
                        <p className="text-gray-900">{order.items?.length || 0}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="w-full flex items-center justify-center gap-2 py-2 text-red-600 hover:text-red-700 font-semibold"
                    >
                      <Eye size={18} />
                      Voir les détails
                    </button>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-600">Aucune commande trouvée</p>
                </div>
              )}
            </div>

            {/* Details Panel */}
            {selectedOrder && (
              <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-24">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Détails</h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Status Change */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Package size={16} />
                    Statut de la commande
                  </p>
                  
                  {/* Status Timeline */}
                  <div className="space-y-2 mb-4">
                    <div className={`p-3 rounded-lg border-2 flex items-center gap-2 cursor-pointer transition ${selectedOrder.status === 'pending' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
                      onClick={() => handleStatusChange(selectedOrder._id, 'pending')}
                    >
                      <Clock size={18} className="text-yellow-600" />
                      <span className="text-sm font-semibold text-gray-900">En attente</span>
                      {selectedOrder.status === 'pending' && <CheckCircle size={16} className="ml-auto text-yellow-600" />}
                    </div>
                    
                    <div className={`p-3 rounded-lg border-2 flex items-center gap-2 cursor-pointer transition ${selectedOrder.status === 'processing' ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
                      onClick={() => handleStatusChange(selectedOrder._id, 'processing')}
                    >
                      <Package size={18} className="text-blue-600" />
                      <span className="text-sm font-semibold text-gray-900">En traitement</span>
                      {selectedOrder.status === 'processing' && <CheckCircle size={16} className="ml-auto text-blue-600" />}
                    </div>
                    
                    <div className={`p-3 rounded-lg border-2 flex items-center gap-2 cursor-pointer transition ${selectedOrder.status === 'shipped' ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
                      onClick={() => handleStatusChange(selectedOrder._id, 'shipped')}
                    >
                      <Truck size={18} className="text-purple-600" />
                      <span className="text-sm font-semibold text-gray-900">Expédié</span>
                      {selectedOrder.status === 'shipped' && <CheckCircle size={16} className="ml-auto text-purple-600" />}
                    </div>
                    
                    <div className={`p-3 rounded-lg border-2 flex items-center gap-2 cursor-pointer transition ${selectedOrder.status === 'delivered' ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
                      onClick={() => handleStatusChange(selectedOrder._id, 'delivered')}
                    >
                      <CheckCircle size={18} className="text-green-600" />
                      <span className="text-sm font-semibold text-gray-900">Livré</span>
                      {selectedOrder.status === 'delivered' && <CheckCircle size={16} className="ml-auto text-green-600" />}
                    </div>
                    
                    <div className={`p-3 rounded-lg border-2 flex items-center gap-2 cursor-pointer transition ${selectedOrder.status === 'cancelled' ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
                      onClick={() => handleStatusChange(selectedOrder._id, 'cancelled')}
                    >
                      <X size={18} className="text-red-600" />
                      <span className="text-sm font-semibold text-gray-900">Annulé</span>
                      {selectedOrder.status === 'cancelled' && <CheckCircle size={16} className="ml-auto text-red-600" />}
                    </div>
                  </div>
                </div>

                {/* Tracking */}
                {selectedOrder.status === 'shipped' && (
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Truck size={16} />
                      Numéro de suivi
                    </p>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Entrer le numéro de suivi"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm mb-2"
                    />
                    <button
                      onClick={() => handleTrackingUpdate(selectedOrder._id)}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                    >
                      Ajouter le suivi
                    </button>
                  </div>
                )}

                {/* Shipping Address */}
                {selectedOrder.shippingAddress && (
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin size={16} />
                      Adresse de livraison
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 space-y-1">
                      <p className="font-semibold text-gray-900">
                        {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                      </p>
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>{selectedOrder.shippingAddress.zipCode} {selectedOrder.shippingAddress.city}</p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                      {selectedOrder.shippingAddress.phone && (
                        <p className="pt-2 border-t border-gray-200">{selectedOrder.shippingAddress.phone}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Package size={16} />
                    Articles
                  </p>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, idx) => (
                       <div key={idx} className="text-sm bg-gray-50 p-3 rounded-lg">
                         <p className="text-gray-900 font-semibold">
                           {item.product?.name || item.name}
                         </p>
                         <p className="text-gray-600">
                           Qty: {item.quantity} × {item.price.toFixed(2)}€
                         </p>
                         <p className="text-gray-900 font-semibold mt-1">
                           Sous-total: {(item.quantity * item.price).toFixed(2)}€
                         </p>
                       </div>
                     ))}
                  </div>
                </div>

                {/* Payment Status */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 mb-3">Statut du paiement</p>
                  {selectedOrder.paymentStatus === 'paid' && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                      <CheckCircle size={18} className="text-green-600" />
                      <span className="text-sm font-semibold text-green-700">Paiement confirmé</span>
                    </div>
                  )}
                  {selectedOrder.paymentStatus === 'pending' && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                      <Clock size={18} className="text-yellow-600" />
                      <span className="text-sm font-semibold text-yellow-700">En attente de paiement</span>
                    </div>
                  )}
                  {selectedOrder.paymentStatus === 'failed' && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                      <AlertCircle size={18} className="text-red-600" />
                      <span className="text-sm font-semibold text-red-700">Paiement échoué</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Total TTC</p>
                  <p className="text-2xl font-bold text-red-600">
                    {selectedOrder.totalPrice?.toFixed(2)}€
                  </p>
                </div>

                {/* Actions */}
                {selectedOrder.status !== 'cancelled' && (
                  <button
                    onClick={() => handleCancelOrder(selectedOrder._id)}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                  >
                    <X size={18} />
                    Annuler la commande
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default AdminOrders;
