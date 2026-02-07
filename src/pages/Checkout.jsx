import { useState, useEffect } from "react";
import { Truck, AlertCircle, Loader } from "lucide-react";
import { cartService, paymentService, notificationService } from "../services";

function Checkout() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    zipCode: "",
    country: "France",
  });

  // ⚠️ Pas d'authentification requise - Récupérer le panier
  useEffect(() => {
    // Récupérer le panier
    const fetchCart = async () => {
      try {
        setLoading(true);
        // Pour les guest users, le serveur retourne un panier vide
        // Donc garder le panier local si c'est un guest
        const currentCart = cartService.getCart();
        
        // Ne recharger du serveur que si c'est un user authentifié
        const token = localStorage.getItem('token');
        if (token) {
          await cartService.fetchCart();
        }
        
        setCart(cartService.getCart());
      } catch (err) {
        notificationService.error("Erreur lors du chargement du panier");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // S'abonner aux changements du panier
  useEffect(() => {
    const unsubscribe = cartService.subscribe((state) => {
      setCart(state.cart);
    });
    return unsubscribe;
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Le prénom est requis";
    if (!formData.lastName.trim()) newErrors.lastName = "Le nom est requis";
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    if (!formData.email.includes("@")) newErrors.email = "Email invalide";
    if (!formData.phone.trim()) newErrors.phone = "Le téléphone est requis";
    if (!formData.street.trim()) newErrors.street = "L'adresse est requise";
    if (!formData.city.trim()) newErrors.city = "La ville est requise";
    if (!formData.zipCode.trim()) newErrors.zipCode = "Le code postal est requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Effacer l'erreur du champ en cours de modification
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      notificationService.error("Veuillez remplir tous les champs correctement");
      return;
    }

    if (!cart || cart.items.length === 0) {
      notificationService.error("Votre panier est vide");
      return;
    }

    setIsProcessing(true);
    try {
      const shippingAddress = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        street: formData.street,
        city: formData.city,
        zipCode: formData.zipCode,
        country: formData.country,
        phone: formData.phone,
      };
      
      // Envoyer aussi les articles du panier (pour les guests)
      // Nettoyer les images base64 (trop volumineux pour envoyer)
      const cartItems = (cart?.items || []).map(item => ({
        product: {
          _id: item.product._id,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          // Image non envoyée (base64 trop volumineux)
        },
        quantity: item.quantity
      }));
      console.log('📦 Items nettoyés envoyés au paiement:', JSON.stringify(cartItems, null, 2));

      const result = await paymentService.createCheckoutSession(shippingAddress, cartItems);

      console.log("Réponse paiement:", result);

      if (result.success && result.url) {
        // Rediriger vers Stripe
        console.log("Redirection vers:", result.url);
        window.location.href = result.url;
      } else {
        console.error("Réponse invalide:", result);
        notificationService.error("Erreur lors de la création de la session de paiement");
      }
    } catch (error) {
      console.error("Erreur checkout complet:", error);
      notificationService.error(error.message || error.toString() || "Erreur lors du paiement");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <main className="w-full bg-white">
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900">Paiement</h1>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-gray-600">Chargement...</p>
        </div>
      </main>
    );
  }

  const subtotal = cart?.totalPrice || 0; // Subtotal en HT
  // Frais de livraison: gratuit à partir de 100€
  const shipping = subtotal > 100 ? 0 : 5.99;
  // TVA: 18%
  const TVA_RATE = 0.18;
  const tax = Math.round(subtotal * TVA_RATE * 100) / 100;
  const total = subtotal + shipping + tax;

  return (
    <main className="w-full bg-white">
      {/* Header */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900">Paiement</h1>
          <p className="text-gray-600 mt-2">Complétez votre commande</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-20">
            <Truck size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Votre panier est vide
            </h2>
            <p className="text-gray-600">Ajoutez des articles avant de passer commande</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulaire */}
            <div className="lg:col-span-2">
              <form onSubmit={handleCheckout} className="space-y-6">
                {/* Informations personnelles */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Informations personnelles
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
                          errors.firstName
                            ? "border-red-500"
                            : "border-gray-300 focus:border-red-600"
                        }`}
                      />
                      {errors.firstName && (
                        <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
                          errors.lastName
                            ? "border-red-500"
                            : "border-gray-300 focus:border-red-600"
                        }`}
                      />
                      {errors.lastName && (
                        <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
                          errors.email
                            ? "border-red-500"
                            : "border-gray-300 focus:border-red-600"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
                          errors.phone
                            ? "border-red-500"
                            : "border-gray-300 focus:border-red-600"
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Adresse de livraison */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Adresse de livraison
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
                        errors.street
                          ? "border-red-500"
                          : "border-gray-300 focus:border-red-600"
                      }`}
                    />
                    {errors.street && (
                      <p className="text-red-600 text-sm mt-1">{errors.street}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ville
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
                          errors.city
                            ? "border-red-500"
                            : "border-gray-300 focus:border-red-600"
                        }`}
                      />
                      {errors.city && (
                        <p className="text-red-600 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Code postal
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
                          errors.zipCode
                            ? "border-red-500"
                            : "border-gray-300 focus:border-red-600"
                        }`}
                      />
                      {errors.zipCode && (
                        <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pays
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-red-600 transition"
                    >
                      <option value="France">France</option>
                      <option value="Belgium">Belgique</option>
                      <option value="Switzerland">Suisse</option>
                      <option value="Luxembourg">Luxembourg</option>
                    </select>
                  </div>
                </div>

                {/* Bouton de paiement */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    "Procéder au paiement"
                  )}
                </button>
              </form>
            </div>

            {/* Résumé de commande */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Résumé de commande
                </h2>

                {/* Articles */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 max-h-64 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.product._id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product.name} x {item.quantity}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {(item.product.price * item.quantity).toFixed(2)}€
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totaux */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Sous-total</span>
                    <span className="font-semibold">{subtotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Livraison</span>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-green-600">Gratuite</span>
                      ) : (
                        `${shipping}€`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Taxes (18%)</span>
                    <span className="font-semibold">{tax.toFixed(2)}€</span>
                  </div>
                </div>

                <div className="pt-6 border-t-2 border-gray-200 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-red-600">
                    {total.toFixed(2)}€
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      ✓ Ajouter {(50 - subtotal).toFixed(2)}€ pour la livraison gratuite
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Checkout;
