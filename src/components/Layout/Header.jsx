import { ShoppingCart, Search, Heart, Menu, X, Package } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCart, useWishlist } from "../../hooks";

function Header() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const mobileMenuRef = useRef(null);

  const categories = [
    { name: "Vêtements", path: "/products/vetements" },
    { name: "Chaussures", path: "/products/chaussures" },
    { name: "Montres", path: "/products/montres" },
    { name: "Bijoux", path: "/products/bijoux" },
    { name: "Beauté", path: "/products/beaute" },
  ];

  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermeture des menus au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        const menuButton = event.target.closest('button[aria-label="Menu mobile"]');
        if (!menuButton) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fermeture du menu mobile sur Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Recherche:", searchQuery);
      // Navigation vers la page de recherche
    }
  };



  return (
    <header className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? "shadow-lg" : "shadow-md"
    }`}>
      {/* Top Bar avec animation */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white text-center py-2 text-sm overflow-hidden">
        <div className="animate-slide-left inline-block">
          <p className="font-medium">
             Bienvenue sur EliteShop - Livraison gratuite à partir de 50€
          </p>
        </div>
      </div>

      {/* Main Header */}
      <div className={`transition-all duration-300 ${isScrolled ? "py-3" : "py-4"}`}>
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex items-center justify-between gap-4 md:gap-8">
            {/* Logo avec effet hover */}
            <a href="/" className="flex-shrink-0 group">
              <h1 className="text-2xl md:text-3xl font-bold transition-transform group-hover:scale-105">
                <span className="text-red-600">Elite</span>
                <span className="text-black">Shop</span>
              </h1>
            </a>

            {/* Search Bar améliorée */}
            <div className="flex-1 hidden md:flex bg-gray-100 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-red-500 transition-all">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                placeholder="Rechercher des produits..."
                className="bg-gray-100 border-none outline-none px-4 py-3 w-full text-sm"
                aria-label="Rechercher des produits"
              />
              <button 
                onClick={handleSearch}
                className="px-4 text-gray-600 flex items-center hover:bg-red-600 hover:text-white transition-all"
                aria-label="Rechercher"
              >
                <Search size={20} />
              </button>
            </div>

            {/* Right Icons avec tooltips */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* Wishlist */}
              <a 
                href="/favoris" 
                className="text-gray-700 hover:text-red-600 transition-all flex items-center relative group"
                aria-label={`Favoris (${wishlistCount} articles)`}
              >
                <Heart size={24} className="group-hover:scale-110 transition-transform" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce-subtle">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Favoris
                </span>
              </a>

              {/* Orders Icon */}
              <a 
                href="/orders" 
                className="text-gray-700 hover:text-red-600 transition-all flex items-center relative group"
                aria-label="Suivi des commandes"
              >
                <Package size={24} className="group-hover:scale-110 transition-transform" />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Commandes
                </span>
              </a>

              {/* Cart avec animation */}
              <a 
                href="/panier" 
                className="text-gray-700 hover:text-red-600 transition-all flex items-center relative group"
                aria-label={`Panier (${cartCount} articles)`}
              >
                <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce-subtle">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Panier
                </span>
              </a>

              {/* Menu mobile button */}
              <button
                className="md:hidden text-gray-700 flex items-center hover:text-red-600 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menu mobile"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Search Bar Mobile */}
          <div className="flex md:hidden mt-4 bg-gray-100 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-red-500 transition-all">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
              placeholder="Rechercher..."
              className="bg-gray-100 border-none outline-none px-4 py-2.5 w-full text-sm"
              aria-label="Rechercher des produits"
            />
            <button 
              onClick={handleSearch}
              className="px-4 text-gray-600 flex items-center hover:bg-red-600 hover:text-white transition-all"
              aria-label="Rechercher"
            >
              <Search size={20} />
            </button>
          </div>

          {/* Navigation Menu avec animation */}
          <nav
            ref={mobileMenuRef}
            className={`overflow-hidden transition-all duration-300 md:flex md:flex-row md:gap-10 md:mt-4 md:border-t md:pt-4 ${
              isMenuOpen
                ? "flex flex-col gap-0 mt-4 border-t pt-2 max-h-96 animate-slide-down"
                : "hidden md:flex max-h-0 md:max-h-none"
            }`}
          >
            {categories.map((cat, index) => (
              <a
                key={cat.path}
                href={cat.path}
                className="text-gray-700 font-medium hover:text-red-600 transition-all py-3 md:py-0 border-b md:border-b-0 hover:bg-red-50 md:hover:bg-transparent px-2 md:px-0 rounded md:rounded-none relative group"
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {cat.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300 hidden md:block"></span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      <style>{`
        @keyframes slide-left {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .animate-slide-left {
          animation: slide-left 20s linear infinite;
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.2s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </header>
  );
}

export default Header;