import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, AlertCircle, Loader, Eye, EyeOff } from 'lucide-react';
import AdminHeader from '../../components/Layout/AdminHeader';
import { notificationService } from '../../services';

function AdminProfile() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setProfile({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address?.street || '',
          city: user.address?.city || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || '',
        });
      } catch (err) {
        setError('Erreur lors du chargement du profil');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value,
    }));
    setSuccess(false);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    if (!profile.firstName.trim() || !profile.lastName.trim()) {
      notificationService.error('Le prénom et le nom sont requis');
      return;
    }

    setIsSaving(true);
    try {
      // Mettre à jour localStorage pour la démo
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = {
        ...user,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        address: {
          street: profile.address,
          city: profile.city,
          zipCode: profile.zipCode,
          country: profile.country,
        },
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      notificationService.success('Profil mis à jour avec succès');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      notificationService.error('Erreur lors de la mise à jour du profil');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      notificationService.error('Tous les champs sont requis');
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      notificationService.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwords.newPassword.length < 6) {
      notificationService.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsSaving(true);
    try {
      // Simulation de changement de mot de passe
      notificationService.success('Mot de passe changé avec succès');
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      notificationService.error('Erreur lors du changement de mot de passe');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <AdminHeader />
        <div className="w-full mx-auto px-4 py-12 text-center">
          <Loader className="animate-spin mx-auto mb-4" size={32} />
          <p className="text-gray-600">Chargement du profil...</p>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Mon Profil</h1>
            <p className="text-gray-600">Gérez vos informations personnelles et vos paramètres de sécurité</p>
          </div>

          {/* Tabs */}
          <div className="mb-8 border-b border-gray-200">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-3 font-medium border-b-2 transition ${
                  activeTab === 'profile'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Informations personnelles
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-4 py-3 font-medium border-b-2 transition ${
                  activeTab === 'security'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Sécurité
              </button>
            </div>
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
              <p className="text-green-700">✓ Modifications enregistrées avec succès</p>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations personnelles</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Prénom */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-red-600"
                    />
                  </div>

                  {/* Nom */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-red-600"
                    />
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-red-600"
                    />
                  </div>

                  {/* Téléphone */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-red-600"
                    />
                  </div>

                  {/* Adresse */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={profile.address}
                      onChange={handleProfileChange}
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
                      name="city"
                      value={profile.city}
                      onChange={handleProfileChange}
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
                      name="zipCode"
                      value={profile.zipCode}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-red-600"
                    />
                  </div>

                  {/* Pays */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pays
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={profile.country}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                {/* Bouton de sauvegarde */}
                <div className="mt-8 flex gap-4">
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
                        Enregistrer
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Changer le mot de passe</h2>

                <div className="space-y-6 max-w-md">
                  {/* Mot de passe actuel */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe actuel
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwords.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-red-600 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({
                          ...prev,
                          current: !prev.current
                        }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Nouveau mot de passe */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        name="newPassword"
                        value={passwords.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-red-600 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({
                          ...prev,
                          new: !prev.new
                        }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirmer le mot de passe */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwords.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-red-600 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({
                          ...prev,
                          confirm: !prev.confirm
                        }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Bouton de sauvegarde */}
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
                        Changer le mot de passe
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
}

export default AdminProfile;
