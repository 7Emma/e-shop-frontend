import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Package,
  Loader,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Truck,
} from "lucide-react";
import { orderService, notificationService } from "../services";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const navigate = useNavigate();

  // Vérifier l'authentification
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Récupérer les commandes
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await orderService.fetchOrders();
        setOrders(data || []);
      } catch (err) {
        console.error("Erreur lors de la récupération des commandes:", err);
        setError(err.message || "Impossible de charger les commandes");
        notificationService.error(
          "Erreur lors de la récupération des commandes"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        label: "En attente",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        borderColor: "border-yellow-300",
      },
      processing: {
        label: "En traitement",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        borderColor: "border-blue-300",
      },
      shipped: {
        label: "Expédié",
        bgColor: "bg-indigo-100",
        textColor: "text-indigo-800",
        borderColor: "border-indigo-300",
      },
      delivered: {
        label: "Livré",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        borderColor: "border-green-300",
      },
      cancelled: {
        label: "Annulé",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        borderColor: "border-red-300",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
      >
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    const paymentConfig = {
      pending: {
        label: "En attente",
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
      },
      paid: {
        label: "Payé",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
      },
      failed: {
        label: "Échoué",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
      },
    };

    const config = paymentConfig[paymentStatus] || paymentConfig.pending;

    return (
      <span
        className={`text-sm font-semibold ${config.bgColor} ${config.textColor} px-3 py-1 rounded-full`}
      >
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

  if (isLoading) {
    return (
      <main className="w-full bg-white">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <Loader
              size={48}
              className="mx-auto text-red-600 animate-spin mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Chargement des commandes...
            </h1>
            <p className="text-gray-600">Veuillez patienter</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full bg-white">
      {/* Header */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Package size={36} className="text-red-600" />
            <h1 className="text-4xl font-bold text-gray-900">Mes commandes</h1>
          </div>
          <p className="text-gray-600">
            Consultez l'historique et le statut de vos commandes
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="mb-8 flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Loader size={20} className="text-blue-600 animate-spin" />
            <p className="text-blue-700 font-medium">Chargement de vos commandes...</p>
          </div>
        )}

        {/* Bouton Suivre la commande */}
        <div className="mb-8">
          <Link
            to="/track"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            <Truck size={20} />
            Suivre une commande
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
            <AlertCircle
              size={24}
              className="text-red-600 flex-shrink-0 mt-0.5"
            />
            <div>
              <h3 className="font-semibold text-red-900">Erreur</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Aucune commande
            </h2>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas encore passé de commande. Commencez vos achats
              maintenant!
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
            >
              Voir les produits
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
              >
                {/* Order Header */}
                <button
                  onClick={() => toggleOrderDetails(order._id)}
                  className="w-full p-4 sm:p-6 bg-gray-50 hover:bg-gray-100 transition text-left flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Numéro de commande
                        </p>
                        <p className="font-mono text-gray-900 font-semibold break-all">
                          {order._id}
                        </p>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-2">
                        <div>
                          <p className="text-sm text-gray-600">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {getStatusBadge(order.status)}
                          {getPaymentStatusBadge(order.paymentStatus)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 text-gray-400 flex-shrink-0">
                    {expandedOrderId === order._id ? (
                      <ChevronUp size={24} />
                    ) : (
                      <ChevronDown size={24} />
                    )}
                  </div>
                </button>

                {/* Order Details */}
                {expandedOrderId === order._id && (
                  <div className="border-t border-gray-200 p-4 sm:p-6 bg-white">
                    {/* Items */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Articles commandés
                      </h4>
                      <div className="space-y-3">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start justify-between py-3 border-b border-gray-200 last:border-b-0"
                            >
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">
                                  {item.product?.name || "Produit supprimé"}
                                </p>
                                {item.product?.category && (
                                  <p className="text-sm text-gray-600">
                                    {item.product.category}
                                  </p>
                                )}
                                <p className="text-sm text-gray-600 mt-1">
                                  Quantité: {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                  {(item.price * item.quantity).toFixed(2)}€
                                </p>
                                <p className="text-sm text-gray-600">
                                  {item.price.toFixed(2)}€ × {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-600">Aucun article</p>
                        )}
                      </div>
                    </div>

                    {/* Pricing Summary */}
                    <div className="mb-6 pb-6 border-t border-gray-200 pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-gray-600">
                          <span>Sous-total</span>
                          <span>
                            {(
                              order.totalPrice - (order.shippingCost || 0)
                            ).toFixed(2)}
                            €
                          </span>
                        </div>
                        {order.shippingCost > 0 && (
                          <div className="flex justify-between text-gray-600">
                            <span>Frais de livraison</span>
                            <span>{order.shippingCost.toFixed(2)}€</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                          <span>Total</span>
                          <span className="text-red-600">
                            {order.totalPrice.toFixed(2)}€
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tracking Number */}
                    {order.trackingNumber && (
                      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                          <Package size={16} />
                          Numéro de suivi colis
                        </h5>
                        <p className="text-blue-700 font-mono text-lg">
                          {order.trackingNumber}
                        </p>
                        <p className="text-blue-600 text-sm mt-2">
                          Vous pouvez utiliser ce numéro pour suivre votre colis
                          auprès du transporteur
                        </p>
                      </div>
                    )}

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Package size={16} />
                          Adresse de livraison
                        </h5>
                        <p className="text-gray-600 text-sm space-y-1">
                          {order.shippingAddress.firstName}{" "}
                          {order.shippingAddress.lastName}
                          <br />
                          {order.shippingAddress.street}
                          <br />
                          {order.shippingAddress.zipCode}{" "}
                          {order.shippingAddress.city}
                          <br />
                          {order.shippingAddress.country}
                          <br />
                          {order.shippingAddress.phone && (
                            <>{order.shippingAddress.phone}</>
                          )}
                        </p>
                      </div>
                    )}

                    {/* Notes */}
                    {order.notes && (
                      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h5 className="font-semibold text-blue-900 mb-2">
                          Notes de commande
                        </h5>
                        <p className="text-blue-800 text-sm">{order.notes}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                      <Link
                        to={`/order/${order._id}`}
                        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                      >
                        Voir les détails complets
                      </Link>
                      {order.status === "pending" && (
                        <button
                          onClick={() => {
                            notificationService.info(
                              "Fonction d'annulation en développement"
                            );
                          }}
                          className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                        >
                          Annuler la commande
                        </button>
                      )}
                      {order.status === "delivered" && (
                        <button
                          onClick={() => {
                            notificationService.info(
                              "Fonction de retour en développement"
                            );
                          }}
                          className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                        >
                          Retourner l'article
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick Summary (when collapsed) */}
                {expandedOrderId !== order._id && (
                  <div className="px-4 sm:px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        {order.items?.length || 0} article
                        {(order.items?.length || 0) > 1 ? "s" : ""}
                      </p>
                    </div>
                    <p className="font-bold text-lg text-red-600">
                      {order.totalPrice.toFixed(2)}€
                    </p>
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

export default Orders;
