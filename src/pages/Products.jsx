import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ChevronDown, Filter } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/api.js";
import { notificationService } from "../services";

function Products() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || "createdAt"
  );
  const [order, setOrder] = useState(searchParams.get("order") || "desc");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([
    parseInt(searchParams.get("minPrice") || 0),
    parseInt(searchParams.get("maxPrice") || 500),
  ]);
  const [selectedRating, setSelectedRating] = useState(null);

  // Mapping des catégories
  const categoryNames = {
    vetements: "Vêtements",
    chaussures: "Chaussures",
    montres: "Montres",
    bijoux: "Bijoux",
    beaute: "Beauté",
    Vêtements: "Vêtements",
    Chaussures: "Chaussures",
    Montres: "Montres",
    Bijoux: "Bijoux",
    Beauté: "Beauté",
  };

  const categoryName = categoryNames[category] || category || "Produits";

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          limit: 12,
          sortBy: sortBy,
          order: order,
        };

        if (category) {
          params.category = categoryName;
        }
        if (priceRange[0] > 0) params.minPrice = priceRange[0];
        if (priceRange[1] < 500) params.maxPrice = priceRange[1];

        const response = await getProducts(params);
        setProducts(response.data.products || []);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          "Erreur lors du chargement des produits";
        setError(errorMessage);
        notificationService.error(errorMessage);
        console.error("Erreur de chargement:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, categoryName, sortBy, order, priceRange]);

  // Filtrer par note (client-side)
  let filteredProducts = products;
  if (selectedRating) {
    filteredProducts = products.filter((p) => p.rating >= selectedRating);
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handlePriceChange = (e) => {
    const newMax = parseInt(e.target.value);
    setPriceRange([0, newMax]);
  };

  const handleResetFilters = () => {
    setPriceRange([0, 500]);
    setSelectedRating(null);
    setSortBy("createdAt");
    setOrder("desc");
  };

  return (
    <main className="w-full bg-white">
      {/* Breadcrumb & Title */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <a href="/" className="hover:text-red-600">
              Accueil
            </a>
            <span>/</span>
            <span className="text-gray-900 font-semibold">{categoryName}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {categoryName}
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} produit
            {filteredProducts.length > 1 ? "s" : ""} disponible
            {filteredProducts.length > 1 ? "s" : ""}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`lg:col-span-1 ${
              showFilters ? "block" : "hidden"
            } lg:block bg-gray-50 p-6 rounded-lg h-fit sticky top-24`}
          >
            <div className="flex items-center justify-between lg:block mb-6 lg:mb-0">
              <h3 className="text-lg font-bold text-gray-900">Filtres</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Price Filter */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-800 mb-4">Prix</h4>
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange[1]}
                onChange={handlePriceChange}
                className="w-full"
              />
              <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
                <span>{priceRange[0]}€</span>
                <span>{priceRange[1]}€</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-800 mb-4">Note</h4>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={selectedRating === rating}
                      onChange={() =>
                        setSelectedRating(
                          selectedRating === rating ? null : rating)
                      }
                      className="w-4 h-4 text-red-600"
                    />
                    <span className="text-gray-700">
                      {"★".repeat(rating)}
                      {"☆".repeat(5 - rating)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reset Filters */}
            <button
              onClick={handleResetFilters}
              className="w-full py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition"
            >
              Réinitialiser
            </button>
          </aside>

          {/* Products Section */}
          <div className="lg:col-span-3">
            {/* Sort Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-gray-200">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Filter size={20} />
                Filtres
              </button>

              <div className="flex items-center gap-3">
                <span className="text-gray-600 text-sm">Trier par :</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg bg-white cursor-pointer text-gray-700 hover:border-gray-400"
                  >
                    <option value="createdAt">Plus récent</option>
                    <option value="price">Prix</option>
                    <option value="rating">Meilleure note</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Products Grid */}
            {!loading && filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : !loading && !error ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  Aucun produit ne correspond à vos critères
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Products;
