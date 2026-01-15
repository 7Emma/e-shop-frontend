import { Heart, ShoppingCart, Eye, Star, TrendingUp, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cartService, wishlistService, notificationService } from "../services";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Charger l'état de la wishlist au montage
  useEffect(() => {
    setImageLoaded(true);
    // Vérifier si le produit est dans la wishlist (utilise le cache local)
    const isInWishlist = wishlistService.isInWishlist(product._id);
    setIsWishlisted(isInWishlist);

    // S'abonner aux changements de la wishlist pour mises à jour en temps réel
    const unsubscribe = wishlistService.subscribe(() => {
      const updated = wishlistService.isInWishlist(product._id);
      setIsWishlisted(updated);
    });

    return unsubscribe;
  }, [product._id]);

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

  const isNew = product.isNew || false;
  const isTrending = product.isTrending || false;
  const stock = product.stock || 0;
  const isLowStock = stock > 0 && stock <= 5;

  const handleAddToCart = async () => {
    try {
      setIsLoadingCart(true);
      console.log(`🛒 Ajout au panier: ${product._id}`);
      const result = await cartService.addToCart(product._id, 1);
      console.log('✅ Panier mis à jour:', result);
      notificationService.success(result.message || `${product.name} ajouté au panier`);
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout au panier:", error);
      notificationService.error(
        error.message || "Erreur lors de l'ajout au panier"
      );
    } finally {
      setIsLoadingCart(false);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      console.log(`❤️ Modification favoris: ${product._id}, isWishlisted: ${isWishlisted}`);
      if (isWishlisted) {
        const result = await wishlistService.removeFromWishlist(product._id);
        console.log('✅ Favoris retiré:', result);
        notificationService.success(result.message || "Produit retiré des favoris");
      } else {
        const result = await wishlistService.addToWishlist(product._id);
        console.log('✅ Favoris ajouté:', result);
        notificationService.success(result.message || "Produit ajouté aux favoris");
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error("❌ Erreur lors de la modification de la wishlist:", error);
      notificationService.error(
        error.message || "Erreur lors de la modification des favoris"
      );
    }
  };

  const handleQuickView = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoadingDetails(true);
    // Petite pause pour afficher le loading
    setTimeout(() => {
      navigate(`/product/${product._id}`);
    }, 500);
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full">
      {/* Product Image Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 aspect-square flex items-center justify-center">
        {/* Image avec effet de chargement */}
        <div
          className={`w-full h-full transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={
              product.image && product.image.trim()
                ? product.image
                : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
            }
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600";
            }}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        </div>

        {/* Effet de brillance au survol */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 pointer-events-none" />

        {/* Badges en haut */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {discount > 0 && (
            <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-badge-entry">
              <Zap size={12} fill="currentColor" />-{discount}%
            </div>
          )}
          {isNew && (
            <div
              className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-badge-entry"
              style={{ animationDelay: "100ms" }}
            >
              Nouveau
            </div>
          )}
          {isTrending && (
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-badge-entry"
              style={{ animationDelay: "200ms" }}
            >
              <TrendingUp size={12} />
              Tendance
            </div>
          )}
        </div>

        {/* Wishlist Button - Toujours visible */}
        <button
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 shadow-lg backdrop-blur-sm ${
            isWishlisted
              ? "bg-red-600 text-white scale-110"
              : "bg-white/90 text-gray-700 hover:bg-red-600 hover:text-white hover:scale-110"
          }`}
          onClick={(e) => {
            console.log("🖱️ Bouton heart cliqué!");
            handleToggleWishlist(e);
          }}
          title={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart
            size={18}
            fill={isWishlisted ? "currentColor" : "none"}
            className={`transition-transform ${
              isWishlisted ? "scale-110" : ""
            }`}
          />
        </button>

        {/* Overlay Actions au survol */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex items-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleQuickView}
              disabled={isLoadingDetails}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-red-600 hover:text-white transition-all duration-300 shadow-xl hover:scale-110 hover:rotate-12 disabled:opacity-70"
              title="Voir les détails"
            >
              {isLoadingDetails ? (
                <div className="w-5 h-5 border-2 border-gray-800 border-t-red-600 rounded-full animate-spin" />
              ) : (
                <Eye size={20} />
              )}
            </button>
            <button
              onClick={() => {
                console.log("🖱️ Bouton panier cliqué!");
                handleAddToCart();
              }}
              disabled={isLoadingCart || stock === 0}
              className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:scale-110 hover:-rotate-12"
              title={stock === 0 ? "Rupture de stock" : "Ajouter au panier"}
            >
              <ShoppingCart
                size={20}
                className={isLoadingCart ? "animate-bounce" : ""}
              />
            </button>
          </div>
        </div>

        {/* Indicateur de stock faible */}
        {isLowStock && (
          <div className="absolute bottom-3 left-3 right-3 bg-orange-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-semibold text-center animate-pulse-slow">
            Plus que {stock} en stock !
          </div>
        )}

        {/* Rupture de stock */}
        {stock === 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white px-6 py-3 rounded-full text-gray-800 font-bold text-sm shadow-xl">
              Rupture de stock
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-1">
        {/* Catégorie */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
            {product.category || "Mode"}
          </p>
          {stock > 5 && (
            <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
              En stock
            </span>
          )}
        </div>

        {/* Nom du produit */}
        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 min-h-12 leading-snug group-hover:text-red-600 transition-colors">
          {product.name || "Produit Premium"}
        </h3>

        {/* Rating avec stars animées */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`transition-all duration-200 ${
                  i < (product.rating || 4)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
                style={{
                  transitionDelay: `${i * 50}ms`,
                  transform:
                    i < (product.rating || 4) ? "scale(1)" : "scale(0.9)",
                }}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {product.rating || 4.0} ({product.reviews || 128})
          </span>
        </div>

        {/* Prix avec animation */}
        <div className="flex items-center gap-3 mb-4 mt-auto">
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through font-medium">
              {product.originalPrice}€
            </span>
          )}
          <span className="text-2xl font-black text-red-600 tracking-tight">
            {product.price || 49.99}€
          </span>
          {discount > 0 && (
            <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded-full">
              Économisez {(product.originalPrice - product.price).toFixed(2)}€
            </span>
          )}
        </div>

        {/* Barre de progression du stock */}
        {stock > 0 && stock <= 10 && (
          <div className="mb-4">
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  stock <= 3
                    ? "bg-red-500"
                    : stock <= 5
                    ? "bg-orange-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${(stock / 10) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              Disponibilité:{" "}
              {stock <= 3 ? "Limitée" : stock <= 5 ? "Faible" : "Bonne"}
            </p>
          </div>
        )}

        {/* Add to Cart Button amélioré */}
        <button
          onClick={() => {
            console.log("🖱️ Bouton panier (bas) cliqué!");
            handleAddToCart();
          }}
          disabled={isLoadingCart || stock === 0}
          className="w-full py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl text-sm font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 relative overflow-hidden group/btn"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoadingCart ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Ajout en cours...
              </>
            ) : stock === 0 ? (
              "Rupture de stock"
            ) : (
              <>
                <ShoppingCart size={18} />
                Ajouter au panier
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
        </button>
      </div>



      <style>{`
        @keyframes badge-entry {
          from {
            opacity: 0;
            transform: translateX(-10px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .animate-badge-entry {
          animation: badge-entry 0.4s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default ProductCard;
