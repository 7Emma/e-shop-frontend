import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Trash2, X, Tag } from "lucide-react";
import { TAILWIND_CLASSES } from "../config/colors";
import { useCart } from "../hooks";

const ShoppingCartComponent = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [updatingItem, setUpdatingItem] = useState(null);

  // Service hook
  const { cart, updateQuantity, removeFromCart, isLoading, error } = useCart();
  
  const handleCheckout = () => {
    console.log('🛒 handleCheckout - cartItems:', cartItems);
    console.log('🛒 handleCheckout - cart:', cart);
    if (cartItems.length === 0) {
      console.warn('⚠️ Panier vide - impossible de procéder au paiement');
      return;
    }
    navigate('/checkout');
  };

  // Extract items from cart
  const cartItems = cart.items || [];

  const updateItemQuantity = async (productId, delta) => {
    try {
      setUpdatingItem(productId);
      const item = cartItems.find((i) => i.product?._id === productId);
      const newQty = (item?.quantity || 0) + delta;

      if (newQty > 0) {
        await updateQuantity(productId, newQty);
      } else {
        await removeFromCart(productId);
      }
    } catch (err) {
      console.error("Erreur mise à jour panier:", err);
    } finally {
      setUpdatingItem(null);
    }
  };

  const removeItem = async (productId) => {
    try {
      setUpdatingItem(productId);
      await removeFromCart(productId);
    } catch (err) {
      console.error("Erreur suppression panier:", err);
    } finally {
      setUpdatingItem(null);
    }
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "PROMO10") {
      setAppliedPromo({ code: promoCode, discount: 0.1 });
      setPromoCode("");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
    0
  );
  const discount = appliedPromo ? subtotal * appliedPromo.discount : 0;
  // Frais de livraison: gratuit à partir de 100€ (cohérent avec backend)
  const shipping = subtotal > 100 ? 0 : 5.99;
  const total = subtotal - discount + shipping;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-4 flex items-center justify-center`}
    >
      <div className="w-full max-w-2xl">
        {/* Bouton d'ouverture du panier */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className={`fixed top-4 right-4 ${TAILWIND_CLASSES.cart.button} text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-all`}
          >
            <ShoppingCart className="w-6 h-6" />
            <span
              className={`absolute -top-2 -right-2 ${TAILWIND_CLASSES.cart.badge} text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center`}
            >
              {cart.totalItems || 0}
            </span>
          </button>
        )}

        {/* Panier */}
        {isOpen && (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* En-tête */}
            <div
              className={`bg-gradient-to-r ${TAILWIND_CLASSES.cart.gradient} p-6 text-white flex justify-between items-center`}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">Mon Panier</h2>
                  <p className="text-primary-100 text-sm">
                    {cart.totalItems || 0} article
                    {(cart.totalItems || 0) > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Articles du panier */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">Votre panier est vide</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const product = item.product;
                    const productId = product?._id || product?.id;
                    return (
                      <div
                        key={productId}
                        className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <img
                          src={product?.image}
                          alt={product?.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-secondary-800">
                            {product?.name}
                          </h3>
                          <p
                            className={`${TAILWIND_CLASSES.cart.text} font-bold`}
                          >
                            {product?.price?.toFixed(2)} €
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateItemQuantity(productId, -1)}
                              disabled={updatingItem === productId}
                              className={`bg-white p-1 rounded-md ${TAILWIND_CLASSES.cart.hover} transition-colors disabled:opacity-50`}
                            >
                              <Minus
                                className={`w-4 h-4 ${TAILWIND_CLASSES.cart.text}`}
                              />
                            </button>
                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateItemQuantity(productId, 1)}
                              disabled={updatingItem === productId}
                              className={`bg-white p-1 rounded-md ${TAILWIND_CLASSES.cart.hover} transition-colors disabled:opacity-50`}
                            >
                              <Plus
                                className={`w-4 h-4 ${TAILWIND_CLASSES.cart.text}`}
                              />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col justify-between items-end">
                          <button
                            onClick={() => removeItem(productId)}
                            disabled={updatingItem === productId}
                            className={`${TAILWIND_CLASSES.cart.text} hover:bg-primary-50 p-2 rounded-lg transition-colors disabled:opacity-50`}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <p className="font-bold text-secondary-800">
                            {(
                              (product?.price || 0) * (item.quantity || 0)
                            ).toFixed(2)}{" "}
                            €
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Code promo */}
            {cartItems.length > 0 && (
              <div className="px-6 pb-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Code promo"
                      className={`w-full pl-10 pr-4 py-2 border-2 border-secondary-200 rounded-lg focus:border-primary-500 focus:outline-none`}
                    />
                  </div>
                  <button
                    onClick={applyPromoCode}
                    className="px-6 py-2 bg-secondary-800 text-white rounded-lg hover:bg-secondary-900 transition-colors font-semibold"
                  >
                    Appliquer
                  </button>
                </div>
                {appliedPromo && (
                  <p className="text-primary-600 text-sm mt-2 flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    Code "{appliedPromo.code}" appliqué (-
                    {(appliedPromo.discount * 100).toFixed(0)}%)
                  </p>
                )}
              </div>
            )}

            {/* Résumé */}
            {cartItems.length > 0 && (
              <div
                className={`border-t-2 border-secondary-100 p-6 bg-secondary-50`}
              >
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-secondary-600">
                    <span>Sous-total</span>
                    <span>{subtotal.toFixed(2)} €</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-primary-600">
                      <span>Réduction</span>
                      <span>-{discount.toFixed(2)} €</span>
                    </div>
                  )}
                  <div className="flex justify-between text-secondary-600">
                    <span>Livraison</span>
                    <span>
                      {shipping === 0 ? "Gratuite" : shipping.toFixed(2) + " €"}
                    </span>
                  </div>
                  {subtotal < 100 && (
                    <p className={`text-xs ${TAILWIND_CLASSES.cart.text}`}>
                      Ajoutez {(100 - subtotal).toFixed(2)} € pour la livraison
                      gratuite
                    </p>
                  )}
                </div>
                <div
                  className={`flex justify-between text-xl font-bold text-secondary-800 mb-4 pt-4 border-t-2 border-secondary-200`}
                >
                  <span>Total</span>
                  <span className={TAILWIND_CLASSES.cart.text}>
                    {total.toFixed(2)} €
                  </span>
                </div>
                <button
                   onClick={handleCheckout}
                   className={`w-full bg-gradient-to-r ${TAILWIND_CLASSES.cart.gradient} text-white py-4 rounded-xl font-bold text-lg hover:from-primary-700 hover:to-secondary-800 transition-all shadow-lg hover:shadow-xl`}
                 >
                   Procéder au paiement
                 </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCartComponent;
