import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
  Headphones,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import HeroCarousel from "../components/HeroCarousel";
import { productService, notificationService } from "../services";

function Home() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    {
      name: "Électronique",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=800&q=85&fit=crop",
      link: "Électronique",
    },
    {
      name: "Vêtements",
      image:
        "https://images.unsplash.com/photo-1595777707802-221f4395ce66?w=600&h=800&q=85&fit=crop",
      link: "Vêtements",
    },
    {
      name: "Accessoires",
      image:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&q=85&fit=crop",
      link: "Accessoires",
    },
    {
      name: "Maison",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=800&q=85&fit=crop",
      link: "Maison",
    },
    {
      name: "Autres",
      image:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=800&q=85&fit=crop",
      link: "Autres",
    },
  ];

  // Mapping catégories pour URLs
  const categoryUrlMap = {
    Électronique: "Électronique",
    Vêtements: "Vêtements",
    Accessoires: "Accessoires",
    Maison: "Maison",
    Autres: "Autres",
  };

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productService.fetchProducts({
          limit: 8,
          sortBy: "rating",
          order: "desc",
        });
        setFeaturedProducts(data.products || []);
      } catch (err) {
        setError("Erreur lors du chargement des produits");
        notificationService.error("Erreur lors du chargement des produits");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <main className="w-full bg-white">
      {/* Hero Carousel Section */}
      <HeroCarousel />

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Truck,
                title: "Livraison Gratuite",
                desc: "À partir de 50€",
              },
              {
                icon: RotateCcw,
                title: "Retours Faciles",
                desc: "30 jours pour changer d'avis",
              },
              {
                icon: Shield,
                title: "Paiement Sécurisé",
                desc: "100% sécurisé et protégé",
              },
              {
                icon: Headphones,
                title: "Support Client",
                desc: "24/7 pour vous aider",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex justify-center mb-4 text-red-600">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-center font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-center text-sm text-gray-600">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12">
            Nos Catégories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => navigate(`/category/${categoryUrlMap[cat.link]}`)}
                className="relative rounded-lg overflow-hidden h-64 group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Produits Mis en Avant
            </h2>
            <a
              href="/search"
              className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 transition-colors duration-200"
            >
              Voir tous les produits
              <ChevronRight size={20} />
            </a>
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
          {!loading && featuredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {!loading && featuredProducts.length === 0 && !error && (
            <div className="text-center py-12">
              <p className="text-gray-600">Aucun produit disponible</p>
            </div>
          )}
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
            Moyens de Paiement Sécurisés
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-center justify-center">
            {[
              {
                name: "Visa",
                logo: "data:image/png;base64,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",
              },
              {
                name: "Mastercard",
                logo: "data:image/png;base64,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",
              },
              {
                name: "PayPal",
                logo: "data:image/png;base64,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",
              },
              {
                name: "Apple Pay",
                logo: "data:image/png;base64,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",
              },
              {
                name: "Google Pay",
                logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAV0AAACQCAMAAACcV0hbAAABa1BMVEX///9fY2jpQjU0qFNChfT6uwVYXGJRVlyoqqzk5OVaXmPw9f4yfvSWmJtcYGZTWF1nmfXW19j39/itxvl1eHzpPS8jpEj6twC7vL7oMiGIi47DxMausLLP0NFiZmsspk7yn5rnKBOeoKN6fYHt7u7oMB798O/4yMXud2/Jysz7wgCJjI+ipKZtcXXd3t+VzaJEgf/l8+jvgXr1sKzrU0jqSz/5z83629n2u7j/+/DnLjn82IzR3/y4zvpArF0OoD7H5M53wIip1bNdtnP74+Hxj4ntaF/yl5LrW1HnGQDzoojnKyzyiyP3rRbrWTP94qnwgCj6wSv2ohv+8tjuciz82pHsYTH968Tvdhzwio/7y1qPs/jh6v380nX7ylL95a/7xkP/+OXKtBNUj/WbsTxjrE3fuR2vszV9rkaiv/mCqvfAw2az2rwlkaQ3o3lBiuA8lbc4n4o+kMg6m5s2pWtBieMepjOCxZJsvH9mDCLyAAAPCElEQVR4nO2daX/bxhGHSdMCKMQELESkeFPiIYumKFWWZDu1LVJirLhHkrpumzZXm9hNm1S9W8sfvwDBYwbYC4slBan4v/HPFLlYPBzOzs7OLlKpRIn+f/ThvcPN5w92ds53dh483zy898i+6h7dDNkPDx8cb3VKpfxcpVJn69bO5r3tq+7c9daHh+elTil/iyQX8tHmo6vu4nXV9ubRFoXsnHDn1vMEcHg9Pt/Ks9FOCXeODhMvHEbbh3mO1SK+pdJHiQsW1mapJIx2asAJXzE5dhuSrWfAm1fd8Wugh8cybF2Vjh9GvHa1v85Tq5XbLa61ldzq0mU/2BL3twHz3XoQ7epZy+TLMDRLrzfX1NzwMvVQLEyg870VKTzLamlBmYZuNFdV3fZy9HwrEltXW5sRri9O15Whl68R3+0Xsh4XqrQj34NwdF2+uesSaT+K6BWmyh9Lx2Zh6Tp8ta5KBgvT4+heYYq3JOt8w9NNp/WcUgyL0aEyuI7vfSzZCRm6aW099t5hUyXce7K9kKKbNtIxD3/jAVeSbtrUYh07KHUL8nBl6Tp4Y2y96ga0aHAxXc0iSzMIeOvKYKjWo7jARXS1yhpR3WKurgdsXGupoqFY2+JziPGiGhNutDwOpKszfOlqNu3na1UjXXlhOhKZROTd5bXjF+c75y+O89SltmiWK07XUdUyMV7O+69Iz/mmm++Udg4fzmdg248OH+Q7QcARLTcU3VS7j83XXI948UXoHs/p5kv55yRqjzZv+QBHhhuKbipVtrDxVqJeXrlsjuXmO0f0ide9c8g3OtyQdFM9ZL1mP/L1VWuH7XRLR2xP+vCooxBuWLqpFsJr1aL3QKnYfiFf4icMHk8GOBVwQ9NN1eHQZsYtKjtmwe3siKQSt89d59JRATc83T3kevV4pXM2WV5361CwlY+21FiuBN1UDk7crFiNazbDL+Tz4knaxz9RVOwUnq4NjdeIVar3pz+jww21wKCqUCQ8XWS8sco2fHD/5z+mwr0SFyZBd02PqeN9snH/41jBlaGbgq5Bj1GRw4qj+5+QzDd/RTVhMnRbICiz4rOE+enGGO8vgni3rqoiV4ZuE2Yti4vtXwi9XBnr/i/9eDuioZhyydCtQrqxSUO+2liZyucWIpR7RNSC6LbXKtlmr+WonMsup8TvyQzuyv1fQfMtXV0h7gLotou9uq5bmmF4FX5uiZ/Zyi56+FsBgqFZ6cr8ghzdXYNO1y72deIynKabzb1AU/ZuFkjYh2eDnwKOwcW7MQ/GRBtdgGTolgE9PBVu53TNDKKdyNDXAwbcsrS5RIPnmg4/5NH9NaLr8P2NZ76diIs3kSRDFxKzAC87pxOsFlmw3vJdA01NRIfIdfgNat5rL1d88rxD/oVYk4uRBN1VNFebD1gVkkcI8s3i1vqQlNi8ug07YDTHr32w4ae7cv9jB69ARneBkqBbRQn02cs9eM8MWesogqigmZ9QNh76/enX+1mQrqNPbuWFSSxCEnRh/nyWPm/XBQx3Ym0Gug78rsSy8fBKRs97ze92J+b729+Jo1iAwtNFxjb1lKsGfTALyNRh8IB+CiJdqJDyHJ+T4Dp4X3Eas9+TkWhOKDxdhHHykVV/qQNH8Eo4X7zL7wAc02brpmS4Kyu8xr6/I6MvREClJOjmkNf1hqE2OQwz3YDJIHkMMw2+fbzYwe0AGlSnASFhUBvrK15r79+5LaG7AqBchaVbRGOX5xjsehCuYelGq5mtVnd7ad0KEDaAg8W4uDOKJmzMnLz4ikx341Nea3J0b/NBjRWSbg0HBl74Xw7C08uVeWTQ7pYDRX46oAg/zy+RIAbIv6fQ5bldSbp3uKA8haPbxXC1cay55p9DGFbTn7ZxJnE++9bmvmENDVPB6TISHtOmjXxK8Qwf8O5Iku57vHY9haKb9YW0E0J2GaGzWqSU2KqvCM37ZjxBzzINsWiCY9p8zfQJGe5L7v1L0v2S2/BYIejureMqMuAja/V5MzrNczbxd2PNjRfbIzNduYcmirMOf0Wm+zX3/iXpPuU2PJYw3b2e/7eNSiCb078ypltVwojoyaS8HhRakJ4PjZRwlxsyXD1du71aydWDCRoLGdlqf2yAzFVMjHc+ifbt3mC0YKOpx/yLpNB9wr1/SbrPuA0H70unyAqGVAQjLTpfACdR0ERXm49fNgrKGAuhReBDYC3F19eAbhgR3Gu7rPNSiDAjBl0A5QcfEBz/YGh8w+iSOXJTXDCda9JmFPRxDY1pIKa7Fp4hKlwBwYBKA6/DGgmjSfs0NHH0rmWPaouka8qX9HeB44Sj6BrNKqFsqoVTIrLPuf2JH13DkF/fhRkxVLnep3hUqCLorFGGf1n2bGJxdPVWlJI3QBHV8aBogJJsgN8ADv1oM2Fud5YX7wpJ06IVRAPXiecNcEZBjprRkIh3c9GyON/wuhMrupqWFTFce69bzeZ6ZUe5ZrVYAw4WXBCnymFPyMkGtNKPg2JaBvIzXk+Xl2fgydDNKp9tu9Kr6+7ObcMtxnFLcTRLt9abNe+jYKEHF67bvLJg9AYT/+2b5WbPZXJkdJmiB5LZ1b5ukdbYTMPSW65PodJF4ZaWDbbNLLCi0OU63uXld9OGRpJh1tfL2a5Apd0qsxQnbVrGrk2ni2YUhGRDHfw1YNt/IMPlOt7lrU1YezZRgk3xS3EcmzPAdMK/pQXOKIIJC7gsEtwMQwnJvj3jdPrZXaZek+Eual2NrgqfrSti8ttTjTJN9gTHtGBPyUHDm8xJlFtKpb4gO4aFrQnTJFqKAxSwQBTP+jrTZqInDWsbK3/MZAbDCPeUSlHcruBkQhVde11mzuenC2cU/mQDcmGEbFHQcL/LOGq8k74nR1+SvbJoQKaIri1e58Sii9d78Z94m+QCmYY/ZcYaHMjeVMqtJYk0qCmi2yfCNScxiEEpgwrSRaf0oGRDDeYnSGkIf5nenz240Yw34qCmhm456BYMy6qXnWmao+pur28QKkYIdJFzRckGFE8QO4HovszMFMF4n1Icw/eiDaigWwkMaBqqFnG1WulZ/mIzwibjHgwMQGUDxE6pNYMp3m/ncDMN+bDhLmVQE8wyKKFr+y3X0MgT5m4LLysT6MIZBcwxom6S5zXANbzJQBX2pW6LOqYJz9SU0N310WWc0ItLIkgb5JEHmGMUKSeBgRjGK+kbKKZ7+wfhFhTQxTUkJntZGAVdBLqwlmqeTEArGrRsx5OgV5g6B6n7ekYzXWHHoIBuEdE1TU4+gp5n8ASzCbNkA5g+08v4vAnFmyDcTGMkcV/v0TIQ4o5BAd0W8qXcwzfBpgciXfhlTZO4cExjVDu445rfK0x8w2n4+6JEY7fviDsGBXRRwMDfVpLj0IVj5HTGC0t2NcJnJnq18R2RrRTeH6imKzpRSymgi04h4hUwplAugXzsy26wR6K7vv9Cgxse7xfUzOTrEK1EpovrF7ktQNMk04VuwCtDhZewWPnQgwEDb6g5G9VyxTM4riLThSsGAqfk1DgxQ8o3o3BfYKSEfTpt0PE2TsQDs7uMnLpwIykFdFF5DP+EJ4G3w3ImN9kA/8/p4kGBTjfTGFyI3dLT23S4d94Xa8OTUroC+3zRJlTKl+GLv8AuI+5uwTMW3kxhJGK+l3/9Ed1yQ4RjKQV04e+Yf4wLXsaj0PXNHaDpckOSE4ZvcM2XOyu+yBQGf6N73VCmu2TbRTv/6I4EzCiMHmAt4NdZA9vYfAv7LPu9OHGNv1H4O4VvmIAhpYBuNozfxXuvqG+H9WJov4vA8Rj7TN8w5ns6JH90eNmYfvjtP4jeIcQkeKzIdIsoh8N5L05VUukGsm7TD4h0aMT0DWP/UGicXvgs+ODiNDMAn3z7T4L1hpmmjRWZbojNZmu+PDDd1JvEtQ6RTcScuGEOuFA4udw/u7i4ONu/fJcZFAq+L6Vw8jrAN9yQllJAF9cfscb0PX+SnU63TVxgZu+1mmnIcb0zwg2XsaMG0dobb//l8w5h/YKKPAM6HIS6Wc1n5By6KBKZvZ0/zfbEDsvE9fbfCK9wFcNc0enio0aoMVMxaI4MugE7T/P3uM51qQhv4T9wXiG8VjlXdLq+XzG56N8mFZOwQox+YBk5zBH27xThdUKzmfmK1j1CKVib8G1xJy38VDRSFMCi2w34kVDHVPMDB0G9nU7cwiQeZ1JAd9UfChg+51usB1Bx6aaCbw/VqZEi681MJm7hRzRXKlbcm37D1Kxctz22YHuvWMZVp31BulVfo2GP81TlHDKFzH/vSMJVUy2SDjhJw7I0sz7+B/kNvQZmH0y6tu8XwUzsknSqCq87cZODq4YuaYQnympyVy1naorNmunaF4x7uWq8FY5WfFJTRxasxiHKPQ1HmC525zJ9Gw6UjG2NjHStlKIKU0I0S4DrxlTCdPFxOVIPZTk4UeAdCiP57XmqqqMFrNfou90UpwvXQ8WOMAzqMrJ34GeEGVJWe77GO2PT8vbvidOthUrsUjTMRDLfQmYoe2VX6vZNtFtM89UnteTidMECkEhil6ZLee/bGFzKX9eVOrqO8zWo5f2aOf1pC9OF+UrapnchHYwk+RZCrCKTtQtPaIn8nMpqoEZ3/LvWwKG7WXA9ZtILVFCJJXbpGp74s7dCbIfRruqovQqk4HEtlZZvr6WDtg7LeeEFWflaGJAJJnYZGoa030bhRHB5fslqV3J9Y/KYZ4f0elYuFAcZXnwUg6QOTgeiBtwoDEZDBZdclOz2Xq3b7db2pI0O5jXFE7vsTp2NBAA7aE/OovrbuAvMgxU+WPfgbERb6BmTbRQKoxuP1nfAi9LnD9rD/VHBXaSEkMdLbIPCaH8YoweaLU4o/6i++YPh2eW7E9cLDBzQmZPR6f7F8Obb7FTAdOPznKabIliCEqenD94M1YUrdhOFVoVyJFwiFQLL7bF72va1FzxjJHZPir/2AvmbWD2v+EYIroFGSewmIqns3/OTSJ0EjmJIJC24ESN6YjcRUhtuF1SR2E0EhBb6YvSQ+BshWD6mMLGbaCyYelSb2E2Ey3YZRzEkklExSewuUOhZKEliV63YZ+wmiibWEbGJIor2FKBEKoQeeZAkdtUKlo4liV3VKsN6zCSxq1gyDwpIlChRokTL1/8AqhuUYnc+IwYAAAAASUVORK5CYII=",
              },
            ].map((method, i) => (
              <div
                key={i}
                className="flex items-center justify-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <img src={method.logo} alt={method.name} className="h-12" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Inscrivez-vous à Notre Newsletter
            </h2>
            <p className="text-lg text-gray-300">
              Recevez nos meilleures offres et les nouveautés directement dans
              votre boîte mail
            </p>
          </div>
          <form className="flex flex-col sm:flex-row gap-2 bg-gray-800 bg-opacity-50 p-2 rounded-lg backdrop-blur-sm">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-6 py-3 bg-transparent outline-none text-white placeholder-gray-400 text-sm sm:text-base"
            />
            <button
              type="submit"
              className="px-6 sm:px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 whitespace-nowrap"
            >
              S'inscrire
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Home;
