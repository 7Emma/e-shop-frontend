import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, AlertCircle, Loader, Eye, EyeOff } from 'lucide-react';
import AdminHeader from '../../components/Layout/AdminHeader';
import { adminService, notificationService } from '../../services';

function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: '',
    storeEmail: '',
    storePhone: '',
    storeAddress: '',
    storeCity: '',
    storeZipCode: '',
    storeCountry: '',
    taxRate: 20,
    freeShippingThreshold: 50,
    shippingCost: 10,
    stripePublicKey: '',
    stripeSecretKey: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showKeys, setShowKeys] = useState({
    stripePublicKey: false,
    stripeSecretKey: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier l'authentification et le rôle admin
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'admin') {
      navigate('/');
      return;
    }

    // Récupérer les paramètres
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const response = await adminService.getSettings();
        setSettings(prev => ({
          ...prev,
          ...response.data,
        }));
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement des paramètres');
        console.error('Erreur loadSettings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: name.includes('Rate') || name.includes('Cost') || name.includes('Threshold')
        ? parseFloat(value) || 0
        : value,
    }));
    setSuccess(false);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    
    if (!settings.storeName.trim()) {
      notificationService.error('Le nom du magasin est requis');
      return;
    }

    setIsSaving(true);
    try {
      await adminService.updateSettings(settings);
      notificationService.success('Paramètres enregistrés avec succès');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      notificationService.error('Erreur lors de l\'enregistrement');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleKeyVisibility = (key) => {
    setShowKeys(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (isLoading) {
    return (
      <>
        <AdminHeader />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <Loader className="animate-spin mx-auto mb-4" size={32} />
          <p className="text-gray-600">Chargement des paramètres...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader />
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Paramètres du magasin</h1>
            <p className="text-gray-600">Configurez les informations et paramètres de votre magasin</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700">✓ Paramètres enregistrés avec succès</p>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-8">
            {/* Informations du magasin */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations du magasin</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom du magasin */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du magasin *
                  </label>
                  <input
                    type="text"
                    name="storeName"
                    value={settings.storeName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-red-600"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email du magasin
                  </label>
                  <input
                    type="email"
                    name="storeEmail"
                    value={settings.storeEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-red-600"
                  />
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone du magasin
                  </label>
                  <input
                    type="tel"
                    name="storePhone"
                    value={settings.storePhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-red-600"
                  />
                </div>

                {/* Adresse */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="storeAddress"
                    value={settings.storeAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-red-600"
                  />
                </div>

                {/* Ville */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville
                  </label>
                  <input
                    type="text"
                    name="storeCity"
                    value={settings.storeCity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-red-600"
                  />
                </div>

                {/* Code postal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal
                  </label>
                  <input
                    type="text"
                    name="storeZipCode"
                    value={settings.storeZipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-red-600"
                  />
                </div>

                {/* Pays */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pays
                  </label>
                  <input
                    type="text"
                    name="storeCountry"
                    value={settings.storeCountry}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-red-600"
                  />
                </div>
              </div>
            </div>

            {/* Paramètres commerciaux */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Paramètres commerciaux</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Taux de TVA */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taux de TVA (%)
                  </label>
                  <input
                    type="number"
                    name="taxRate"
                    value={settings.taxRate}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-red-600"
                  />
                </div>

                {/* Coût de livraison */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coût de livraison (€)
                  </label>
                  <input
                    type="number"
                    name="shippingCost"
                    value={settings.shippingCost}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-red-600"
                  />
                </div>

                {/* Seuil livraison gratuite */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant minimum pour livraison gratuite (€)
                  </label>
                  <input
                    type="number"
                    name="freeShippingThreshold"
                    value={settings.freeShippingThreshold}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-red-600"
                  />
                </div>
              </div>
            </div>

            {/* Clés Stripe */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Clés Stripe</h2>

              <div className="grid grid-cols-1 gap-6">
                {/* Clé publique */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clé publique (pk_test_...)
                  </label>
                  <div className="relative">
                    <input
                      type={showKeys.stripePublicKey ? 'text' : 'password'}
                      name="stripePublicKey"
                      value={settings.stripePublicKey}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-red-600 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleKeyVisibility('stripePublicKey')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showKeys.stripePublicKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Clé secrète */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clé secrète (sk_test_...)
                  </label>
                  <div className="relative">
                    <input
                      type={showKeys.stripeSecretKey ? 'text' : 'password'}
                      name="stripeSecretKey"
                      value={settings.stripeSecretKey}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-red-600 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleKeyVisibility('stripeSecretKey')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showKeys.stripeSecretKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                ⚠️ Les clés Stripe ne doivent jamais être partagées. Gardez-les confidentielles.
              </p>
            </div>

            {/* Bouton de sauvegarde */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Enregistrer les paramètres
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default AdminSettings;
