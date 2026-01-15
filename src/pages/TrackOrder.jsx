import { useState } from "react";
import {
  Package,
  Mail,
  CheckCircle,
  AlertCircle,
  Loader,
  ArrowRight,
  Star,
} from "lucide-react";

function TrackOrder() {
  const [trackingCode, setTrackingCode] = useState("");
  const [step, setStep] = useState("input"); // input, otp, details
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [order, setOrder] = useState(null);
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Étape 1: Tracking initial
  const handleTrackOrder = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      // D'abord vérifier que la commande existe
      const checkResponse = await fetch(
        `${API_BASE}/orders/track/${trackingCode}`
      );
      const checkData = await checkResponse.json();

      if (!checkResponse.ok) {
        setError(checkData.message || "Commande non trouvée");
        setLoading(false);
        return;
      }

      // Si on reçoit requiresOTP: true, générer l'OTP
      if (checkData.requiresOTP) {
        // Générer l'OTP
        const otpResponse = await fetch(`${API_BASE}/otp/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trackingCode }),
        });

        const otpData = await otpResponse.json();

        if (!otpResponse.ok) {
          setError(
            otpData.message || "Erreur lors de la génération du code OTP"
          );
          setLoading(false);
          return;
        }

        setMaskedEmail(otpData.maskedEmail);
        setMessage(`Code OTP envoyé à ${otpData.maskedEmail}`);
        setStep("otp");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Confirmer la réception de la commande
  const handleConfirmReceived = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE}/orders/track/${trackingCode}/confirm-received`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-OTP-Token": otpToken,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Erreur lors de la confirmation");
        return;
      }

      setMessage(
        "✅ Réception confirmée ! Vous pouvez maintenant noter le produit."
      );
      setOrder(data.order);
    } catch (err) {
      setError("Erreur de connexion au serveur");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ⭐ Noter le produit
  const handleSubmitRating = async () => {
    if (!rating) {
      setError("Veuillez sélectionner une note");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE}/orders/track/${trackingCode}/rate`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-OTP-Token": otpToken,
          },
          body: JSON.stringify({ score: rating }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Erreur lors de la notation");
        return;
      }

      setMessage("⭐ Merci pour votre notation !");
      setOrder(data.order);
      setRating(0);
    } catch (err) {
      setError("Erreur de connexion au serveur");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Étape 2 : Vérifier l'OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingCode, code: otpCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAttemptsLeft(data.attemptsLeft || 0);
        setError(data.message || "Code OTP incorrect");
        return;
      }

      // OTP vérifié, stocker le token et récupérer les détails
      setOtpToken(data.token);
      await fetchOrderDetails(data.token);
      setStep("details");
    } catch (err) {
      setError("Erreur lors de la vérification du code OTP");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les détails de la commande avec token OTP
  const fetchOrderDetails = async (token) => {
    try {
      const response = await fetch(`${API_BASE}/orders/track/${trackingCode}`, {
        headers: { "X-OTP-Token": token },
      });

      const data = await response.json();

      if (response.ok && data.order) {
        setOrder(data.order);
      } else {
        setError("Impossible de récupérer les détails de la commande");
      }
    } catch (err) {
      console.error("Erreur récupération commande:", err);
      setError("Erreur de connexion au serveur");
    }
  };

  // Réinitialiser le formulaire
  const handleReset = () => {
    setStep("input");
    setTrackingCode("");
    setOtpCode("");
    setOtpToken("");
    setOrder(null);
    setError("");
    setMessage("");
    setAttemptsLeft(5);
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: "bg-yellow-500",
      processing: "bg-blue-500",
      shipped: "bg-purple-500",
      delivered: "bg-green-500",
      cancelled: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "En attente",
      processing: "En traitement",
      shipped: "Expédié",
      delivered: "Livré",
      cancelled: "Annulé",
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-20">
      <div className="max-w-2xl mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-12">
          <Package className="w-16 h-16 mx-auto text-red-600 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Suivi de Commande
          </h1>
          <p className="text-gray-600">
            Suivez l'état de votre commande en temps réel
          </p>
        </div>

        {/* STEP 1 : Input Tracking Code */}
        {step === "input" && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleTrackOrder}>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Code de suivi
                </label>
                <input
                  type="text"
                  value={trackingCode}
                  onChange={(e) =>
                    setTrackingCode(e.target.value.toUpperCase())
                  }
                  placeholder="Ex: SHOP123456ABC"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200"
                  required
                  minLength={8}
                />
                <p className="text-gray-500 text-sm mt-2">
                  Vous trouverez le code de suivi dans votre email de
                  confirmation
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {message && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-green-700">{message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !trackingCode}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {loading && <Loader className="w-5 h-5 animate-spin" />}
                {loading ? "Vérification..." : "Continuer"}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2 : Verify OTP */}
        {step === "otp" && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <Mail className="w-12 h-12 mx-auto text-blue-600 mb-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                Vérification par Email
              </h2>
              <p className="text-gray-600 mt-2">
                Un code OTP a été envoyé à {maskedEmail}
              </p>
            </div>

            <form onSubmit={handleVerifyOTP}>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Code OTP (6 chiffres)
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) =>
                    setOtpCode(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  placeholder="000000"
                  className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200 font-mono"
                  required
                  maxLength={6}
                />
                <p className="text-gray-500 text-sm mt-2">
                  Le code expire dans 15 minutes
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-700 font-semibold">{error}</p>
                    {attemptsLeft > 0 && (
                      <p className="text-red-600 text-sm mt-1">
                        {attemptsLeft} tentative(s) restante(s)
                      </p>
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {loading && <Loader className="w-5 h-5 animate-spin" />}
                {loading ? "Vérification..." : "Vérifier le Code"}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full mt-3 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Utiliser un autre code de suivi
              </button>
            </form>
          </div>
        )}

        {/* STEP 3 : Order Details */}
        {step === "details" && order && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Order Status */}
            <div className="mb-8 pb-8 border-b">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-gray-600 text-sm">Numéro de commande</p>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {order._id}
                  </h2>
                </div>
                <span
                  className={`${getStatusBadgeColor(
                    order.status
                  )} text-white px-4 py-2 rounded-full font-semibold whitespace-nowrap`}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm">Code de suivi</p>
                  <p className="text-lg font-mono font-semibold text-gray-900">
                    {order.trackingCode}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm">Statut du paiement</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {order.paymentStatus === "paid"
                      ? "✅ Payé"
                      : order.paymentStatus === "pending"
                      ? "⏳ En attente"
                      : "❌ Échoué"}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm">Date de commande</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm">Montant total</p>
                  <p className="text-lg font-semibold text-red-600">
                    {order.totalPrice.toFixed(2)} €
                  </p>
                </div>
              </div>
            </div>

            {/* Items */}
            {order.items && order.items.length > 0 && (
              <div className="mb-8 pb-8 border-b">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Articles commandés
                </h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {item.product?.name || "Produit"}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Quantité: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {item.price.toFixed(2)} €
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="mb-8 pb-8 border-b">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Adresse de livraison
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 font-semibold">
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName}
                  </p>
                  <p className="text-gray-600">
                    {order.shippingAddress.street}
                  </p>
                  <p className="text-gray-600">
                    {order.shippingAddress.zipCode} {order.shippingAddress.city}
                  </p>
                  <p className="text-gray-600">
                    {order.shippingAddress.country}
                  </p>
                  {order.shippingAddress.phone && (
                    <p className="text-gray-600 mt-2">
                      {order.shippingAddress.phone}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Tracking Number */}
            {order.trackingNumber && (
              <div className="mb-8 pb-8 border-b">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Numéro de suivi transporteur
                </h3>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-lg font-mono font-bold text-blue-900">
                    {order.trackingNumber}
                  </p>
                  <p className="text-blue-600 text-sm mt-2">
                    Vous pouvez suivre votre colis avec ce numéro auprès du
                    transporteur
                  </p>
                </div>
              </div>
            )}

            {/* Bouton "Reçu" - Affiche seulement si status === 'delivered' et pas encore reçu */}
            {order.status === "delivered" && !order.isReceived && (
              <div className="mb-8 pb-8 border-b">
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700">{error}</p>
                  </div>
                )}
                <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Confirmer la réception
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Avez-vous bien reçu votre commande ?
                  </p>
                  <button
                    onClick={handleConfirmReceived}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader className="w-5 h-5 animate-spin" />}✓
                    J'ai reçu ma commande
                  </button>
                </div>
              </div>
            )}

            {/* Message de confirmation de réception */}
            {order.isReceived && message && (
              <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-700">{message}</p>
                </div>
              </div>
            )}

            {/* Système de notation - Affiche seulement après confirmation de réception */}
            {order.isReceived && !order.rating?.score && (
              <div className="mb-8">
                <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Notez le produit
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Aidez-nous en partageant votre avis sur cette commande
                  </p>

                  <div className="flex justify-center gap-3 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition"
                      >
                        <Star
                          size={40}
                          className={`${
                            star <= (hoverRating || rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          } cursor-pointer transition`}
                        />
                      </button>
                    ))}
                  </div>

                  {rating > 0 && (
                    <p className="text-center text-gray-700 mb-4">
                      {rating === 1 && "Mauvais"}
                      {rating === 2 && "À améliorer"}
                      {rating === 3 && "Satisfait"}
                      {rating === 4 && "Très satisfait"}
                      {rating === 5 && "Excellent !"}
                    </p>
                  )}

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-red-700">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleSubmitRating}
                    disabled={loading || !rating}
                    className="w-full bg-yellow-600 text-white py-3 rounded-lg font-semibold hover:bg-yellow-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader className="w-5 h-5 animate-spin" />}
                    Soumettre ma notation
                  </button>
                </div>
              </div>
            )}

            {/* Message de confirmation si déjà noté */}
            {order.rating?.score && (
              <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-green-700 font-semibold">
                      Merci pour votre notation !
                    </p>
                    <p className="text-green-600 text-sm">
                      Vous avez noté cette commande: {order.rating.score}{" "}
                      étoile(s)
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleReset}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
            >
              <ArrowRight size={20} />
              Suivre une autre commande
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackOrder;
