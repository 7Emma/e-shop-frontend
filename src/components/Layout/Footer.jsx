import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-950 text-white border-t-2 border-red-600">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand & Newsletter - Takes more space */}
          <div className="lg:col-span-4">
            <h2 className="text-2xl font-bold mb-6 tracking-tighter">
              ELITE<span className="text-red-600">SHOP</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Votre destination mode haut de gamme. Rejoignez notre newsletter
              pour recevoir des offres exclusives et les dernières tendances.
            </p>
            <form className="flex max-w-sm">
              <input
                type="email"
                placeholder="Votre email"
                className="bg-gray-900 border-none text-white text-sm px-4 py-3 rounded-l-md focus:ring-1 focus:ring-red-600 w-full outline-none"
              />
              <button className="bg-red-600 hover:bg-red-700 transition-colors px-4 py-3 rounded-r-md group">
                <Send
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </form>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6">
              Menu
            </h3>
            <ul className="space-y-4">
              {[
                { label: "Accueil", path: "/" },
                { label: "About", path: "/about" },
                { label: "Produits", path: "/products" },
                { label: "Suivi de Commande", path: "/track-order" },
                { label: "Contact", path: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-gray-400 text-sm hover:text-white hover:pl-2 transition-all duration-300 flex items-center group"
                  >
                    <span className="h-[1px] w-0 group-hover:w-3 bg-red-600 mr-0 group-hover:mr-2 transition-all"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6">
              Collections
            </h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>
                <Link
                  to="/products/vetements"
                  className="hover:text-red-500 transition"
                >
                  Vêtements
                </Link>
              </li>
              <li>
                <Link
                  to="/products/chaussures"
                  className="hover:text-red-500 transition"
                >
                  Chaussures
                </Link>
              </li>
              <li>
                <Link
                  to="/products/montres"
                  className="hover:text-red-500 transition"
                >
                  Montres
                </Link>
              </li>
              <li>
                <Link
                  to="/products/bijoux"
                  className="hover:text-red-500 transition"
                >
                  Bijoux
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="lg:col-span-4">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6">
              Nous trouver
            </h3>
            <div className="space-y-4 mb-8">
              <a
                href="tel:+33123456789"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition group"
              >
                <div className="p-2 bg-gray-900 rounded-lg group-hover:bg-red-600/20 group-hover:text-red-500 transition-colors">
                  <Phone size={18} />
                </div>
                <span className="text-sm">+33 1 23 45 67 89</span>
              </a>
              <a
                href="mailto:contact@eliteshop.fr"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition group"
              >
                <div className="p-2 bg-gray-900 rounded-lg group-hover:bg-red-600/20 group-hover:text-red-500 transition-colors">
                  <Mail size={18} />
                </div>
                <span className="text-sm">contact@eliteshop.fr</span>
              </a>
            </div>

            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-3 bg-gray-900 hover:bg-red-600 hover:-translate-y-1 transition-all duration-300 rounded-xl text-white"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Methods - Simplified and more elegant */}
        <div className="border-t border-gray-900 pt-8 pb-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center gap-6">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
              alt="Visa"
              className="h-4"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
              alt="Mastercard"
              className="h-6"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              alt="Paypal"
              className="h-5"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg"
              alt="Apple Pay"
              className="h-6 filter invert"
            />
          </div>

          <div className="flex gap-6 text-[11px] uppercase tracking-widest text-gray-500">
            <Link to="/privacy" className="hover:text-white transition">
              Confidentialité
            </Link>
            <Link to="/terms" className="hover:text-white transition">
              CGV
            </Link>
            <Link to="/mentions" className="hover:text-white transition">
              Mentions
            </Link>
          </div>
        </div>

        <p className="text-center text-gray-600 text-[10px] mt-8 uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} EliteShop Paris. All Rights
          Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
