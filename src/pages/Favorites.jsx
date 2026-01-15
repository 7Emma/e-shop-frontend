import React, { useState } from "react";
import { Heart, ShoppingCart, Trash2, Share2, Grid, List } from "lucide-react";
import { TAILWIND_CLASSES } from "../config/colors";
import { useWishlist } from "../hooks";
import { cartService, notificationService } from "../services";

const FavoritesComponent = () => {
  // Services hooks
  const { wishlist, removeFromWishlist, isLoading, error } = useWishlist();

  // UI state
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [addingToCart, setAddingToCart] = useState(null);

  // Extract items from wishlist
  const favoriteItems = wishlist.products || [];

  // Get categories from favorites
  const categories = [
    "all",
    ...new Set(favoriteItems.map((item) => item?.category || "Sans catégorie")),
  ];

  const removeFavorite = async (productId) => {
    try {
      await removeFromWishlist(productId);
      notificationService.success("Produit retiré des favoris");
    } catch (err) {
      console.error("Erreur suppression favoris:", err);
      notificationService.error("Erreur lors de la suppression");
    }
  };

  const addToCart = async (item) => {
    try {
      setAddingToCart(item._id || item.id);
      const result = await cartService.addToCart(item._id || item.id, 1);
      notificationService.success(
        result.message || `"${item.name}" ajouté au panier !`
      );
    } catch (err) {
      console.error("Erreur ajout panier:", err);
      notificationService.error("Erreur lors de l'ajout au panier");
    } finally {
      setAddingToCart(null);
    }
  };

  const filteredFavorites =
    selectedCategory === "all"
      ? favoriteItems
      : favoriteItems.filter((item) => item?.category === selectedCategory);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-4 md:p-8`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`bg-gradient-to-r ${TAILWIND_CLASSES.favorites.gradient} p-3 rounded-xl shadow-lg`}
              >
                <Heart className="text-white fill-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-secondary-800">
                  Mes Favoris
                </h1>
                <p className="text-secondary-500">
                  {favoriteItems.length} articles sauvegardés
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? `${TAILWIND_CLASSES.favorites.active}`
                    : TAILWIND_CLASSES.favorites.inactive
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? TAILWIND_CLASSES.favorites.active
                    : TAILWIND_CLASSES.favorites.inactive
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? TAILWIND_CLASSES.favorites.active
                    : TAILWIND_CLASSES.favorites.inactive
                }`}
              >
                {category === "all" ? "Tous" : category}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredFavorites.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <Heart className="mx-auto mb-4 text-slate-300" size={64} />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              {selectedCategory === "all"
                ? "Aucun favori pour le moment"
                : `Aucun favori dans "${selectedCategory}"`}
            </h3>
            <p className="text-slate-500">
              Ajoutez des articles à vos favoris pour les retrouver facilement
            </p>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFavorites.map((item) => {
                  const productId = item?._id || item?.id;
                  return (
                    <div
                      key={productId}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="relative">
                        <img
                          src={item?.image}
                          alt={item?.name}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          onClick={() => removeFavorite(productId)}
                          disabled={isLoading}
                          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-lg disabled:opacity-50"
                        >
                          <Heart className="fill-red-500" size={20} />
                        </button>
                        {item?.originalPrice && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            -
                            {Math.round(
                              (1 - item.price / item.originalPrice) * 100
                            )}
                            %
                          </div>
                        )}
                        {!item?.inStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-white text-slate-800 px-4 py-2 rounded-lg font-semibold">
                              Rupture de stock
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <span
                          className={`text-xs font-semibold ${TAILWIND_CLASSES.favorites.badge} px-2 py-1 rounded`}
                        >
                          {item?.category || "Sans catégorie"}
                        </span>
                        <h3 className="font-semibold text-secondary-800 text-lg mt-2 mb-2">
                          {item?.name}
                        </h3>
                        <div className="flex items-baseline gap-2 mb-4">
                          <span
                            className={`text-2xl font-bold ${TAILWIND_CLASSES.favorites.text}`}
                          >
                            {item?.price?.toFixed(2)} €
                          </span>
                          {item?.originalPrice && (
                            <span className="text-secondary-400 line-through text-sm">
                              {item?.originalPrice?.toFixed(2)} €
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => addToCart(item)}
                          disabled={
                            !item?.inStock || addingToCart === productId
                          }
                          className={`w-full bg-gradient-to-r ${TAILWIND_CLASSES.favorites.gradient} hover:from-primary-700 hover:to-secondary-800 disabled:from-secondary-300 disabled:to-secondary-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg`}
                        >
                          <ShoppingCart size={18} />
                          {addingToCart === productId
                            ? "Ajout en cours..."
                            : item?.inStock
                            ? "Ajouter au panier"
                            : "Indisponible"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-4">
                {filteredFavorites.map((item) => {
                  const productId = item?._id || item?.id;
                  return (
                    <div
                      key={productId}
                      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-6">
                        <div className="relative flex-shrink-0">
                          <img
                            src={item?.image}
                            alt={item?.name}
                            className="w-32 h-32 object-cover rounded-xl"
                          />
                          {item?.originalPrice && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                              -
                              {Math.round(
                                (1 - item.price / item.originalPrice) * 100
                              )}
                              %
                            </div>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <span
                                  className={`text-xs font-semibold ${TAILWIND_CLASSES.favorites.badge} px-2 py-1 rounded`}
                                >
                                  {item?.category || "Sans catégorie"}
                                </span>
                                <h3 className="font-semibold text-secondary-800 text-xl mt-2">
                                  {item?.name}
                                </h3>
                              </div>
                              <button
                                onClick={() => removeFavorite(productId)}
                                disabled={isLoading}
                                className={`${TAILWIND_CLASSES.favorites.text} hover:bg-primary-50 p-2 rounded-lg transition-colors disabled:opacity-50`}
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>

                            <div className="flex items-baseline gap-2 mb-3">
                              <span
                                className={`text-2xl font-bold ${TAILWIND_CLASSES.favorites.text}`}
                              >
                                {item?.price?.toFixed(2)} €
                              </span>
                              {item?.originalPrice && (
                                <span className="text-secondary-400 line-through">
                                  {item?.originalPrice?.toFixed(2)} €
                                </span>
                              )}
                            </div>

                            {!item?.inStock && (
                              <span className="inline-block bg-secondary-100 text-secondary-600 px-3 py-1 rounded-lg text-sm font-semibold">
                                Rupture de stock
                              </span>
                            )}
                          </div>

                          <div className="flex gap-3 mt-4">
                            <button
                              onClick={() => addToCart(item)}
                              disabled={
                                !item?.inStock || addingToCart === productId
                              }
                              className={`flex-1 bg-gradient-to-r ${TAILWIND_CLASSES.favorites.gradient} hover:from-primary-700 hover:to-secondary-800 disabled:from-secondary-300 disabled:to-secondary-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2`}
                            >
                              <ShoppingCart size={18} />
                              {addingToCart === productId
                                ? "Ajout en cours..."
                                : item?.inStock
                                ? "Ajouter au panier"
                                : "Indisponible"}
                            </button>
                            <button
                              className={`px-4 border-2 border-secondary-200 hover:border-secondary-300 text-secondary-700 rounded-xl transition-colors`}
                            >
                              <Share2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Actions Footer */}
            <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-secondary-600">
                  <span
                    className={`font-bold ${TAILWIND_CLASSES.favorites.text}`}
                  >
                    {favoriteItems.length}
                  </span>{" "}
                  articles dans vos favoris
                </p>
                <p className="text-sm text-secondary-500">
                  Valeur totale:{" "}
                  <span className="font-semibold">
                    {favoriteItems
                      .reduce((sum, item) => sum + (item?.price || 0), 0)
                      .toFixed(2)}{" "}
                    €
                  </span>
                </p>
              </div>
              <button
                onClick={() => {
                  favoriteItems.forEach((item) => addToCart(item));
                }}
                disabled={isLoading || favoriteItems.length === 0}
                className={`w-full sm:w-auto bg-gradient-to-r ${TAILWIND_CLASSES.favorites.gradient} hover:from-primary-700 hover:to-secondary-800 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Tout ajouter au panier
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FavoritesComponent;
