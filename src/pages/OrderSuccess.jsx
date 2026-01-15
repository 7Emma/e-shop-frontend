import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  CheckCircle,
  Loader,
  AlertCircle,
  Download,
  Eye,
  EyeOff,
  Package,
  Copy,
} from "lucide-react";
import {
  paymentService,
  orderService,
  notificationService,
  cartService,
} from "../services";

function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const checkPaymentStatus = async (retryCount = 0) => {
      if (!sessionId) {
        setStatus("error");
        setError("Session de paiement introuvable");
        return;
      }

      try {
        const result = await paymentService.getPaymentStatus(sessionId);

        if (result.status === "paid") {
          setStatus("success");
          notificationService.success("Paiement confirmé !");

          // Vider le panier côté frontend
          cartService.reset();

          // Récupérer la commande via le sessionId Stripe
          try {
            const response = await orderService.getOrderBySessionId(sessionId);
            if (response && response.order) {
              setOrder(response.order);
            }
          } catch (err) {
            // Si la commande n'existe pas encore (webhook pas déclenché), retry
            if (err.response?.status === 404 && retryCount < 5) {
              console.log(`Tentative ${retryCount + 1}/5 - Commande en création...`);
              setTimeout(() => checkPaymentStatus(retryCount + 1), 2000);
              return;
            }
            console.log("Erreur récupération commande:", err);
          }
        } else {
          setStatus("error");
          setError("Le paiement n'a pas pu être confirmé");
        }
      } catch (err) {
        console.error("Erreur vérification paiement:", err);
        setStatus("error");
        setError(err.message || "Erreur lors de la vérification du paiement");
      }
    };

    const timer = setTimeout(() => {
      checkPaymentStatus();
    }, 1500);

    return () => clearTimeout(timer);
  }, [sessionId]);

  const [showTrackingCode, setShowTrackingCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const copyTrackingCode = () => {
    if (order?.trackingCode) {
      navigator.clipboard.writeText(order.trackingCode);
      setCopiedCode(true);
      notificationService.success("Code copié !");
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const downloadReceipt = async () => {
    if (!order) {
      console.warn("Pas de commande disponible pour le téléchargement");
      return;
    }

    try {
      const endpoint = `/api/orders/${order._id}/receipt/pdf`;

      console.log(`📥 Téléchargement PDF - URL: ${endpoint}`);
      console.log(`📦 Order ID: ${order._id}, Tracking: ${order.trackingCode}`);

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(`📊 Réponse: ${response.status} ${response.statusText}`);
      console.log(`📄 Content-Type: ${response.headers.get("content-type")}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMsg =
          errorData?.message ||
          `Erreur ${response.status}: ${response.statusText}`;
        console.error("❌ Erreur API:", errorMsg);
        notificationService.error(
          errorMsg || "Erreur lors du téléchargement du reçu"
        );
        return;
      }

      const contentType = response.headers.get("content-type");
      console.log(`🔍 Vérification MIME: ${contentType}`);

      if (!contentType?.includes("application/pdf")) {
        console.error("❌ Type MIME invalide pour PDF:", contentType);
        notificationService.error(
          "Réponse invalide du serveur (MIME type incorrect)"
        );
        return;
      }

      const blob = await response.blob();
      console.log(`✓ Blob créé: ${blob.size} bytes`);

      const element = document.createElement("a");
      element.href = URL.createObjectURL(blob);
      element.download = `Reçu_${order.trackingCode}.pdf`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      console.log(`✅ Fichier téléchargé: ${element.download}`);
      notificationService.success("Reçu téléchargé avec succès");
    } catch (error) {
      console.error("❌ Erreur téléchargement reçu:", error);
      notificationService.error("Erreur lors du téléchargement du reçu");
    }
  };

  if (status === "loading") {
    return (
      <main className="w-full bg-white">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <Loader
              size={48}
              className="mx-auto text-red-600 animate-spin mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Vérification du paiement...
            </h1>
            <p className="text-gray-600">Veuillez patienter</p>
          </div>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="w-full bg-white">
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900">
              Erreur de paiement
            </h1>
            <p className="text-gray-600 mt-2">
              Votre paiement n'a pas pu être confirmé
            </p>
          </div>
        </section>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 mb-6">
            <div className="flex gap-4">
              <AlertCircle
                size={48}
                className="text-red-600 flex-shrink-0 mt-1"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Paiement non confirmé
                </h2>
                <p className="text-red-700 mb-4">
                  {error ||
                    "Le paiement n'a pas pu être traité. Aucune commande n'a été créée."}
                </p>
                <p className="text-red-600 text-sm">
                  ⚠️ Important: Puisque le paiement a échoué, aucune commande
                  n'a été enregistrée. Votre panier reste intact avec tous les
                  articles.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3">Que faire?</h3>
            <ul className="space-y-2 text-blue-700 text-sm">
              <li>✓ Vérifiez les informations de votre carte bancaire</li>
              <li>✓ Vérifiez que votre adresse de facturation est correcte</li>
              <li>✓ Essayez avec une autre méthode de paiement</li>
              <li>✓ Contactez votre banque si le problème persiste</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/panier"
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition text-center"
            >
              Retour au panier
            </Link>
            <Link
              to="/checkout"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition text-center"
            >
              Réessayer le paiement
            </Link>
            <Link
              to="/"
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition text-center"
            >
              Accueil
            </Link>
          </div>

          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <p className="text-gray-600 text-sm">
              Questions?{" "}
              <a
                href="/contact"
                className="text-red-600 hover:underline font-semibold"
              >
                Contactez-nous
              </a>
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full bg-white">
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900">
            Commande confirmée
          </h1>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center mb-8">
          <CheckCircle size={64} className="mx-auto text-green-600 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Merci pour votre commande !
          </h2>
          <p className="text-green-700 mb-4">
            Votre paiement a été confirmé et votre commande est en cours de
            traitement.
          </p>
          {order && (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Numéro de commande</p>
                <p className="text-gray-900 font-mono font-semibold">
                  {order._id}
                </p>
              </div>
              {order.trackingCode && (
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-gray-600 mb-3">Code de suivi</p>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      {showTrackingCode ? (
                        <p className="text-2xl font-mono font-bold text-red-600">
                          {order.trackingCode}
                        </p>
                      ) : (
                        <p className="text-2xl font-mono font-bold text-gray-400">
                          ••••••••••
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setShowTrackingCode(!showTrackingCode)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                      title={showTrackingCode ? "Masquer" : "Afficher"}
                    >
                      {showTrackingCode ? (
                        <EyeOff size={20} className="text-gray-600" />
                      ) : (
                        <Eye size={20} className="text-gray-600" />
                      )}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={copyTrackingCode}
                      className="flex-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <Copy size={16} />
                      {copiedCode ? "Copié !" : "Copier le code"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-3">
                    Utilisez ce code pour suivre votre commande
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {order && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Détails de la commande
            </h3>

            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              {order.items?.map((item) => (
                <div key={item.product._id} className="flex justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {item.product?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Quantité: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {(item.price * item.quantity).toFixed(2)}€
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total HT</span>
                <span>
                  {order.totalPrice.toFixed(2)}€
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>TVA (18%)</span>
                <span>
                  {(order.totalPrice * 0.18).toFixed(
                    2
                  )}
                  €
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-4 border-t border-gray-200">
                <span>Total TTC</span>
                <span className="text-red-600">
                  {(order.totalPrice * 1.18).toFixed(2)}€
                </span>
              </div>
            </div>

            {order.shippingAddress && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Adresse de livraison
                </h4>
                <p className="text-gray-600">
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                  <br />
                  {order.shippingAddress.street}
                  <br />
                  {order.shippingAddress.zipCode} {order.shippingAddress.city}
                  <br />
                  {order.shippingAddress.country}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={downloadReceipt}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2"
          >
            <Download size={16} />
            Télécharger reçu (PDF)
          </button>

          {order && (
            <Link
              to={`/track/${order.trackingCode}`}
              className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition inline-flex items-center gap-2"
            >
              <Package size={16} />
              Suivre la commande
            </Link>
          )}

          <Link
            to="/orders"
            className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition"
          >
            Mes commandes
          </Link>
          <Link
            to="/"
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition"
          >
            Continuer vos achats
          </Link>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-blue-700 text-sm">
            Un email de confirmation a été envoyé à votre adresse email. Vous
            pouvez suivre votre commande dans la section "Mes commandes".
          </p>
        </div>
      </div>
    </main>
  );
}

export default OrderSuccess;
