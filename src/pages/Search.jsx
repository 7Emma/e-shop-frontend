import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, Filter, Search as SearchIcon } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api.js';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Paramètres de recherche
  const searchQuery = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const order = searchParams.get('order') || 'desc';
  const page = parseInt(searchParams.get('page') || '1');

  // États locaux pour les filtres
  const [localMinPrice, setLocalMinPrice] = useState(minPrice || 0);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice || 1000);
  const [localSortBy, setLocalSortBy] = useState(sortBy);
  const [localOrder, setLocalOrder] = useState(order);
  const [localCategory, setLocalCategory] = useState(category);

  const categories = [
    'Électronique',
    'Vêtements',
    'Accessoires',
    'Maison',
    'Autres'
  ];

  // Récupérer les produits
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page,
          limit: 12,
          sortBy: localSortBy,
          order: localOrder,
        };

        if (searchQuery) params.search = searchQuery;
        if (localCategory) params.category = localCategory;
        if (localMinPrice) params.minPrice = parseFloat(localMinPrice);
        if (localMaxPrice) params.maxPrice = parseFloat(localMaxPrice);

        const response = await getProducts(params);
        setProducts(response.data.products || []);
        setPagination(response.data.pagination || {});
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors de la recherche');
        console.error('Erreur de recherche:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, localCategory, localMinPrice, localMaxPrice, localSortBy, localOrder, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input[type="text"]').value;
    if (input.trim()) {
      setSearchParams({ q: input, page: '1' });
    }
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (localCategory) params.set('category', localCategory);
    if (localMinPrice) params.set('minPrice', localMinPrice);
    if (localMaxPrice) params.set('maxPrice', localMaxPrice);
    params.set('sortBy', localSortBy);
    params.set('order', localOrder);
    params.set('page', '1');
    
    setSearchParams(params);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setLocalMinPrice(0);
    setLocalMaxPrice(1000);
    setLocalCategory('');
    setLocalSortBy('createdAt');
    setLocalOrder('desc');
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage);
    setSearchParams(params);
    window.scrollTo(0, 0);
  };

  return (
    <main className="w-full bg-white">
      {/* Search Header */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <input
                type="text"
                defaultValue={searchQuery}
                placeholder="Chercher des produits..."
                className="w-full px-5 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-600"
              >
                <SearchIcon size={20} />
              </button>
            </div>
          </form>

          {/* Breadcrumb & Title */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <a href="/" className="hover:text-red-600">Accueil</a>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Résultats de recherche</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {searchQuery ? `Résultats pour "${searchQuery}"` : 'Tous les produits'}
          </h1>
          <p className="text-gray-600">
            {products.length} produit{products.length !== 1 ? 's' : ''} trouvé{products.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`lg:col-span-1 ${
              showFilters ? 'block' : 'hidden'
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

            {/* Category Filter */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-800 mb-4">Catégorie</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={localCategory === ''}
                    onChange={(e) => setLocalCategory(e.target.value)}
                    className="w-4 h-4 text-red-600"
                  />
                  <span className="text-gray-700">Toutes les catégories</span>
                </label>
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={localCategory === cat}
                      onChange={(e) => setLocalCategory(e.target.value)}
                      className="w-4 h-4 text-red-600"
                    />
                    <span className="text-gray-700">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-800 mb-4">Prix</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Prix min</label>
                  <input
                    type="number"
                    min="0"
                    value={localMinPrice}
                    onChange={(e) => setLocalMinPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Prix max</label>
                  <input
                    type="number"
                    min="0"
                    value={localMaxPrice}
                    onChange={(e) => setLocalMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-800 mb-4">Tri</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Trier par</label>
                  <select
                    value={localSortBy}
                    onChange={(e) => setLocalSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="createdAt">Plus récent</option>
                    <option value="price">Prix</option>
                    <option value="rating">Note</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Ordre</label>
                  <select
                    value={localOrder}
                    onChange={(e) => setLocalOrder(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="asc">Croissant</option>
                    <option value="desc">Décroissant</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleApplyFilters}
                className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Appliquer les filtres
              </button>
              <button
                onClick={handleResetFilters}
                className="w-full py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition"
              >
                Réinitialiser
              </button>
            </div>
          </aside>

          {/* Products Section */}
          <div className="lg:col-span-3">
            {/* Sort Bar Mobile */}
            <div className="flex justify-between items-center gap-4 mb-8 pb-6 border-b border-gray-200">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Filter size={20} />
                Filtres
              </button>
              <span className="text-sm text-gray-600 hidden sm:block">
                {products.length} résultat{products.length !== 1 ? 's' : ''}
              </span>
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
            {!loading && products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 py-8 border-t border-gray-200">
                    <button
                      onClick={() => handlePageChange(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Précédent
                    </button>

                    {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                      let pageNum;
                      if (pagination.pages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 rounded-lg transition ${
                            page === pageNum
                              ? 'bg-red-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(Math.min(pagination.pages, page + 1))}
                      disabled={page === pagination.pages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Suivant
                    </button>
                  </div>
                )}
              </>
            ) : !loading ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 mb-4">
                  Aucun produit ne correspond à votre recherche
                </p>
                <a
                  href="/"
                  className="inline-block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Retour à l'accueil
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}

export default SearchPage;
