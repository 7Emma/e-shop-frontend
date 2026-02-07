import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Package, Search, AlertCircle, Truck, Calendar, MapPin, DollarSign } from "lucide-react";
import { orderService, notificationService } from "../services";

function TrackOrders() {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    // Charger les commandes depuis localStorage
    loadOrdersFromStorage();
    
    // Si un code est passé en paramètre, chercher automatiquement
    const codeParam = searchParams.get("code");
    if (codeParam) {
      setSearchQuery(codeParam);
      // Auto-search après le rendu
      setTimeout(() => {
        const form = document.querySelector("form");
        if (form) {
          form.dispatchEvent(new Event("submit", { bubbles: true }));
        }
      }, 100);
    }
  }, [searchParams]);

  const loadOrdersFromStorage = () => {
    try {
      const savedOrders = localStorage.getItem("user_orders");
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        setOrders(Array.isArray(parsedOrders) ? parsedOrders : []);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des commandes:", err);
      setError("Impossible de charger les commandes");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError("Veuillez entrer un numéro de commande");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Chercher d'abord dans les commandes locales
      const found = orders.find(
        (order) =>
          order._id.includes(searchQuery) ||
          order.orderNumber?.includes(searchQuery) ||
          order.trackingCode?.includes(searchQuery)
      );

      if (found) {
        setExpandedOrderId(found._id);
        notificationService.success("Commande trouvée");
      } else {
        // Chercher via l'API (pour les commandes guest)
        try {
          const response = await orderService.getOrderByTrackingCode(searchQuery);
          if (response && response.order) {
            // Ajouter la commande trouvée à la liste
            setOrders([response.order]);
            setExpandedOrderId(response.order._id);
            notificationService.success("Commande trouvée");
          } else {
            setError("Commande non trouvée. Vérifiez le code de suivi.");
          }
        } catch (apiErr) {
          if (apiErr.response?.status === 404) {
            setError("Commande non trouvée. Vérifiez le code de suivi.");
          } else {
            setError("Erreur lors de la recherche de la commande");
          }
        }
      }
    } catch (err) {
      setError("Erreur lors de la recherche");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        label: "En attente",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        icon: "⏳",
      },
      processing: {
        label: "En traitement",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        icon: "⚙️",
      },
      shipped: {
        label: "Expédié",
        bgColor: "bg-indigo-100",
        textColor: "text-indigo-800",
        icon: "📦",
      },
      delivered: {
        label: "Livré",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        icon: "✓",
      },
      cancelled: {
        label: "Annulé",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        icon: "✕",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${config.bgColor} ${config.textColor}`}
      >
        <span>{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Truck size={40} className="text-red-600" />
            <h1 className="text-4xl font-bold text-gray-900">Suivi des commandes</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Consultez l'état de vos commandes et suivez votre livraison en temps réel
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="mb-12 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Entrez votre numéro de commande..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-600 focus:outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Search size={20} />
                Rechercher
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <Package size={80} className="mx-auto text-gray-200 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucune commande</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Vous n'avez pas encore de commande. Commencez vos achats maintenant!
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <div
                key={order._id || order.trackingCode || index}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Order Header - Clickable */}
                <button
                  onClick={() => toggleOrderDetails(order._id || order.trackingCode || index)}
                  className="w-full p-6 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Order Number */}
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                          Commande #{order.orderNumber || order._id?.slice(-8) || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600 font-mono mt-1">
                          {order._id || order.trackingCode || 'N/A'}
                        </p>
                      </div>

                      {/* Order Info Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {/* Date */}
                        <div className="flex items-start gap-2">
                          <Calendar size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>

                        {/* Total */}
                        <div className="flex items-start gap-2">
                          <DollarSign size={16} className="text-red-600 mt-1 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500">Total</p>
                            <p className="text-sm font-bold text-red-600">
                              {order.totalPrice?.toFixed(2)}€
                            </p>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="flex items-start gap-2">
                          <Package size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500">Articles</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {order.items?.length || 0}
                            </p>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-start gap-2 col-span-2 md:col-span-1">
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500 mb-1">Statut</p>
                            {getStatusBadge(order.status)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Chevron Icon */}
                    <div className="text-gray-400 flex-shrink-0 mt-1">
                      {expandedOrderId === (order._id || order.trackingCode || index) ? "▲" : "▼"}
                    </div>
                  </div>
                </button>

                {/* Order Details - Expandable */}
                {expandedOrderId === (order._id || order.trackingCode || index) && (
                  <div className="border-t border-gray-100 p-6 bg-gray-50">
                    {/* Items */}
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Package size={20} className="text-red-600" />
                        Articles commandés
                      </h4>
                      <div className="space-y-3">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
                            >
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">
                                  {item.product?.name || "Produit"}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Quantité: {item.quantity} × {item.price?.toFixed(2)}€
                                </p>
                              </div>
                              <p className="font-bold text-gray-900 ml-4">
                                {(item.quantity * (item.price || 0)).toFixed(2)}€
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-600">Aucun article</p>
                        )}
                      </div>
                    </div>

                    {/* Shipping Info */}
                    {order.shippingAddress && (
                      <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <h5 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                          <MapPin size={16} />
                          Adresse de livraison
                        </h5>
                        <p className="text-blue-800 text-sm space-y-1">
                          {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                          <br />
                          {order.shippingAddress.street}
                          <br />
                          {order.shippingAddress.zipCode} {order.shippingAddress.city}
                          <br />
                          {order.shippingAddress.country}
                        </p>
                      </div>
                    )}

                    {/* Tracking Number */}
                    {order.trackingNumber && (
                      <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                        <h5 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                          <Truck size={16} />
                          Numéro de suivi
                        </h5>
                        <p className="text-green-900 font-mono text-lg font-bold">
                          {order.trackingNumber}
                        </p>
                        <p className="text-green-700 text-sm mt-2">
                          Utilisez ce numéro pour suivre votre colis
                        </p>
                      </div>
                    )}

                    {/* Summary */}
                    <div className="p-4 bg-white rounded-xl border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Sous-total</span>
                        <span className="font-semibold text-gray-900">
                          {(order.totalPrice - (order.shippingCost || 0)).toFixed(2)}€
                        </span>
                      </div>
                      {order.shippingCost > 0 && (
                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200">
                          <span className="text-gray-600">Livraison</span>
                          <span className="font-semibold text-gray-900">
                            {order.shippingCost.toFixed(2)}€
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-red-600">
                          {order.totalPrice?.toFixed(2)}€
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default TrackOrders;
