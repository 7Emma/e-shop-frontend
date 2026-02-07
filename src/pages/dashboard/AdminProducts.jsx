import { Plus, Edit2, Trash2, AlertCircle, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../components/Layout/AdminHeader';
import { adminService } from '../../services';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([
    'Vêtements',
    'Chaussures',
    'Montres',
    'Bijoux',
    'Beauté'
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ category: '', search: '' });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    originalPrice: '',
    image: '',
    stock: '',
    sku: '',
  });
  const navigate = useNavigate();

  // Vérification admin
  useEffect(() => {
    // Désactivé temporairement pour tester
    // const user = JSON.parse(localStorage.getItem('user') || '{}');
    // if (user.role !== 'admin') {
    //   navigate('/');
    // }
  }, [navigate]);

  // Charger les produits et catégories
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          adminService.getAllProducts(),
          adminService.getCategories()
        ]);
        setProducts(productsRes.data.products || []);
        const cats = categoriesRes.data.categories || ['Vêtements', 'Chaussures', 'Montres', 'Bijoux', 'Beauté'];
        setCategories(cats);
      } catch (err) {
        setError('Erreur lors du chargement');
        console.error(err);
        // Fallback: utiliser les catégories par défaut
        setCategories(['Vêtements', 'Chaussures', 'Montres', 'Bijoux', 'Beauté']);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = adminService.validateProductData(formData);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    try {
      setError(null);
      // Normaliser la catégorie avec les accents corrects
      const normalizedData = {
        ...formData,
        category: formData.category
          .replace('Vetements', 'Vêtements')
          .replace('Beaute', 'Beauté')
      };
      
      if (editingId) {
        await adminService.updateProduct(editingId, normalizedData);
        setSuccess('Produit mis à jour avec succès');
      } else {
        await adminService.createProduct(normalizedData);
        setSuccess('Produit créé avec succès');
      }

      // Recharger les produits
      const res = await adminService.getAllProducts();
      setProducts(res.data.products || []);
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    try {
      setError(null);
      await adminService.deleteProduct(id);
      setSuccess('Produit supprimé avec succès');
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleEdit = (product) => {
    // Normaliser la catégorie avec accents
    const normalizedCategory = product.category
      .replace('Vetements', 'Vêtements')
      .replace('Beaute', 'Beauté');
    
    setFormData({
      name: product.name,
      description: product.description,
      category: normalizedCategory,
      price: product.price,
      originalPrice: product.originalPrice || '',
      image: product.image,
      stock: product.stock,
      sku: product.sku || '',
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      originalPrice: '',
      image: '',
      stock: '',
      sku: '',
    });
    setEditingId(null);
  };

  const filteredProducts = products.filter(p => {
    const matchCategory = !filters.category || p.category === filters.category;
    const matchSearch = !filters.search || 
      p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      p.sku.toLowerCase().includes(filters.search.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Afficher les messages temporaires
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (isLoading) {
    return (
      <>
        <AdminHeader />
        <div className="w-full mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">Chargement des produits...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader />
      <main className="bg-gray-50 min-h-screen">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Produits</h1>
              <p className="text-gray-600 mt-2">{filteredProducts.length} produit(s)</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(!showForm);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <Plus size={20} />
              Ajouter un produit
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle size={20} className="text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <Check size={20} className="text-green-600" />
              <p className="text-green-700">{success}</p>
            </div>
          )}

          {/* Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingId ? 'Modifier le produit' : 'Ajouter un produit'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Catégorie *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Prix *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Prix original
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Stock *
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Image URL *
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                  >
                    {editingId ? 'Mettre à jour' : 'Créer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher par nom ou SKU..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nom</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Catégorie</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Prix</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map(product => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{product.price}€</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        product.stock > 0 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

export default AdminProducts;
