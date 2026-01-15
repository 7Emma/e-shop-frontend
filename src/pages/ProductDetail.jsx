import { useState, useEffect } from "react";
import { Heart, ShoppingCart, Share2, Truck, Shield, RotateCcw, Mail, MessageCircle, Facebook } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { productService, cartService, wishlistService, notificationService } from "../services";

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const prod = await productService.fetchProductById(productId);
        setProduct(prod);

        // Récupérer les produits similaires de la même catégorie
        if (prod.category) {
          const data = await productService.fetchProducts({
            category: prod.category,
            limit: 4,
          });
          setRelatedProducts(data.products?.filter((p) => p._id !== productId) || []);
        }

        // Récupérer les avis
        try {
          const reviewsData = await fetch(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/reviews/product/${productId}`
          );
          const reviewsJson = await reviewsData.json();
          setReviews(reviewsJson.reviews || []);
        } catch (err) {
          console.warn('Erreur chargement avis:', err);
          setReviews([]);
        }

        // Vérifier si le produit est en wishlist
        const isInWishlist = await wishlistService.isInWishlist(productId);
        setIsWishlisted(isInWishlist);
      } catch (error) {
        notificationService.error("Erreur lors du chargement du produit");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = async () => {
    setLoadingCart(true);
    try {
      await cartService.addToCart(productId, quantity);
      notificationService.success(`${product?.name} ajouté au panier`);
      setQuantity(1);
    } catch {
      notificationService.error("Erreur lors de l'ajout au panier");
    } finally {
      setLoadingCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    try {
      console.log('Toggle wishlist:', { productId, isWishlisted });
      await wishlistService.toggleWishlist(productId, isWishlisted);
      setIsWishlisted(!isWishlisted);
      if (!isWishlisted) {
        notificationService.success("Ajouté aux favoris");
      } else {
        notificationService.success("Retiré des favoris");
      }
    } catch (error) {
      console.error('Erreur wishlist:', error);
      notificationService.error(error?.message || "Erreur lors de la mise à jour des favoris");
    }
  };

  const getShareUrl = () => {
    return `${window.location.origin}/product/${productId}`;
  };

  const getShareText = () => {
    return `${product?.name} - ${productService.formatPrice(product?.price)}`;
  };

  const handleShare = (platform) => {
    const url = getShareUrl();
    const text = getShareText();
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    const shareLinks = {
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      email: `mailto:?subject=${encodedText}&body=Regarde ce produit : ${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      copy: null,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      notificationService.success('Lien copié !');
      setShowShareMenu(false);
      return;
    }

    if (shareLinks[platform]) {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400');
      setShowShareMenu(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Produit non trouvé</p>
      </div>
    );
  }

  const discount = productService.calculateDiscount(
    product.originalPrice,
    product.price
  );

  return (
    <main className="w-full bg-white">
      {/* Breadcrumb */}
      <section className="py-4 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-red-600">Accueil</Link>
            <span>/</span>
            <Link to={`/search?category=${product.category}`} className="hover:text-red-600">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">{product.name}</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{discount}%
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-red-600 transition"
                  >
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                {product.category}
              </p>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < product.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating || 0}/5 ({product.reviews || 0} avis)
                </span>
              </div>

              {/* Price */}
              <div className="space-y-2 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      {productService.formatPrice(product.originalPrice)}
                    </span>
                  )}
                  <span className="text-4xl font-bold text-red-600">
                    {productService.formatPrice(product.price)}
                  </span>
                </div>
                {product.stock > 0 ? (
                  <p className="text-green-600 font-semibold">
                    ✓ En stock ({product.stock} disponibles)
                  </p>
                ) : (
                  <p className="text-red-600 font-semibold">Rupture de stock</p>
                )}
              </div>

              {/* Quantity & Add to Cart */}
              {product.stock > 0 && (
                <div className="flex gap-4 mb-6">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-12 text-center border-l border-r border-gray-300 outline-none"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-3 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={loadingCart}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                  >
                    <ShoppingCart size={20} />
                    {loadingCart ? 'Ajout...' : 'Ajouter au panier'}
                  </button>
                </div>
              )}

              {/* Wishlist & Share */}
              <div className="flex gap-2">
                <button
                  onClick={handleToggleWishlist}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 border-2 rounded-lg font-semibold transition ${
                    isWishlisted
                      ? "border-red-600 bg-red-50 text-red-600"
                      : "border-gray-300 text-gray-700 hover:border-red-600"
                  }`}
                >
                  <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                  Favoris
                </button>
                <div className="relative flex-1">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Share2 size={20} />
                    Partager
                  </button>
                  
                  {/* Share Menu Dropdown */}
                  {showShareMenu && (
                    <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[200px]">
                      <button
                        onClick={() => handleShare('whatsapp')}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-200 font-semibold text-gray-900 flex items-center gap-2"
                      >
                        💬 WhatsApp
                      </button>
                      <button
                        onClick={() => handleShare('facebook')}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-200 font-semibold text-gray-900 flex items-center gap-2"
                      >
                        <Facebook size={16} /> Facebook
                      </button>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-200 font-semibold text-gray-900 flex items-center gap-2"
                      >
                        𝕏 Twitter/X
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-200 font-semibold text-gray-900 flex items-center gap-2"
                      >
                        💼 LinkedIn
                      </button>
                      <button
                        onClick={() => handleShare('email')}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-200 font-semibold text-gray-900 flex items-center gap-2"
                      >
                        <Mail size={16} /> Email
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 font-semibold text-gray-900 flex items-center gap-2"
                      >
                        🔗 Copier le lien
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <Truck className="mx-auto mb-2 text-red-600" size={24} />
                  <p className="text-sm font-semibold text-gray-900">Livraison rapide</p>
                  <p className="text-xs text-gray-600">2-3 jours</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="mx-auto mb-2 text-red-600" size={24} />
                  <p className="text-sm font-semibold text-gray-900">Retours gratuits</p>
                  <p className="text-xs text-gray-600">30 jours</p>
                </div>
                <div className="text-center">
                  <Shield className="mx-auto mb-2 text-red-600" size={24} />
                  <p className="text-sm font-semibold text-gray-900">Sécurisé</p>
                  <p className="text-xs text-gray-600">100% protégé</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-12 border-b border-gray-200">
          <div className="flex gap-8">
            {["description", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 font-semibold border-b-2 transition ${
                  activeTab === tab
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab === "description" && "Description"}
                {tab === "reviews" && `Avis (${reviews.length})`}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {product.description || "Aucune description disponible"}
                </p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review._id} className="pb-6 border-b border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">{review.user?.firstName} {review.user?.lastName}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < review.rating ? "text-yellow-400" : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                      <p className="text-gray-700">{review.comment}</p>
                      {review.isVerifiedPurchase && (
                        <p className="text-xs text-green-600 mt-2">✓ Achat vérifié</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">Aucun avis pour le moment</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Produits similaires
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default ProductDetail;
