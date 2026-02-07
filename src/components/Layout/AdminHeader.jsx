import { LogOut, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function AdminHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const isActive = (href) => {
    return location.pathname === href;
  };

  const menuItems = [
    { label: 'Tableau de bord', href: '/admin' },
    { label: 'Produits', href: '/admin/products' },
    { label: 'Commandes', href: '/admin/orders' },
    { label: 'Paramètres', href: '/admin/settings' },
  ];

  return (
    <header className="w-screen bg-gray-900 text-white sticky top-0 z-40 left-0">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold">
              A
            </div>
            <span className="text-xl font-bold">E-Shop Admin</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`transition font-medium pb-1 ${
                  isActive(item.href)
                    ? 'text-white border-b-2 border-red-600'
                    : 'text-gray-300 hover:text-white border-b-2 border-transparent hover:border-red-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition text-sm font-semibold"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2 border-t border-gray-700 pt-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg transition ${
                  isActive(item.href)
                    ? 'bg-red-600 text-white font-semibold'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}

          </nav>
        )}
      </div>
    </header>
  );
}

export default AdminHeader;
