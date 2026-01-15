# E-Shop Frontend - Interface utilisateur React

Interface utilisateur moderne et réactive construite avec React + Vite pour la plateforme e-commerce E-Shop.

## 📋 Table des matières

1. [Installation](#installation)
2. [Démarrage rapide](#démarrage-rapide)
3. [Architecture](#architecture)
4. [Structure des dossiers](#structure-des-dossiers)
5. [Pages](#pages)
6. [Composants](#composants)
7. [Services](#services)
8. [Routing](#routing)
9. [Gestion d'état](#gestion-détat)
10. [Variables d'environnement](#variables-denvironnement)
11. [Scripts NPM](#scripts-npm)
12. [Dépendances](#dépendances)

---

## Installation

### Prérequis

- Node.js (v16+)
- npm ou yarn
- Backend E-Shop en cours d'exécution

### Installation des dépendances

```bash
cd frontend
npm install
# ou
yarn install
```

---

## Démarrage rapide

### Mode développement

```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible sur `http://localhost:5173`

### Compilation pour la production

```bash
npm run build
# ou
yarn build
```

Les fichiers compilés seront dans le dossier `dist/`.

### Aperçu de la build

```bash
npm run preview
# ou
yarn preview
```

---

## Architecture

### Structure générale

```
src/
├── assets/              # Images, icônes, ressources statiques
├── components/          # Composants réutilisables
├── pages/               # Pages complètes (Home, Products, etc.)
├── routes/              # Configuration du routage
├── services/            # Services API et utilitaires
├── App.jsx              # Composant racine
├── index.css            # Styles globaux
└── main.jsx             # Point d'entrée
```

### Flux de données

```
main.jsx
    ↓
App.jsx (BrowserRouter)
    ↓
AppRoute.jsx (Routes)
    ↓
Pages (Home, Products, etc.)
    ↓
Components (Header, ProductCard, etc.)
    ↓
Services (api.js, cartService.js, etc.)
    ↓
API Backend
```

---

## Structure des dossiers

### `/public`

Fichiers statiques servis directement par le serveur de développement.

### `/src/assets`

Images, icônes, et autres ressources d'application.

### `/src/components`

Composants réutilisables:

- **Layout/**
  - `Header.jsx` - Barre d'en-tête avec navigation
  - `Footer.jsx` - Pied de page

- **ui/** - Composants d'interface utilisateur

- **ProductCard.jsx** - Carte de produit réutilisable
- **SearchBar.jsx** - Barre de recherche
- **HeroCarousel.jsx** - Carrousel héro de la page d'accueil

### `/src/pages`

Pages complètes de l'application:

- `Home.jsx` - Page d'accueil
- `Products.jsx` - Catalogue de produits
- `ProductDetail.jsx` - Détails d'un produit
- `Cart.jsx` - Page du panier
- `Wishlist.jsx` - Page des favoris
- `Search.jsx` - Page de recherche
- `About.jsx` - Page à propos
- `Contact.jsx` - Page de contact

### `/src/routes`

- `AppRoute.jsx` - Configuration de toutes les routes de l'application

### `/src/services`

Services pour la communication avec l'API et la gestion de données:

- `api.js` - Client API Axios configuré
- `authService.js` - Service d'authentification
- `productService.js` - Service produits
- `cartService.js` - Service panier
- `wishlistService.js` - Service favoris
- `orderService.js` - Service commandes
- `userService.js` - Service utilisateur
- `notificationService.js` - Service notifications
- `storageService.js` - Service stockage local
- `index.js` - Exports centralisés

---

## Pages

### Home.jsx

Page d'accueil avec:
- Carrousel héro
- Produits en vedette
- Catégories populaires
- Appels à l'action

**Route:** `/`

### Products.jsx

Catalogue de produits avec:
- Affichage en grille
- Filtrage par catégorie
- Pagination
- Tri (prix, note, récent)
- Recherche

**Routes:** `/products/:category`, `/category/:category`

### ProductDetail.jsx

Page détaillée d'un produit:
- Images du produit
- Description complète
- Prix et stock
- Avis clients
- Boutons ajouter au panier/favoris

**Route:** `/product/:productId`

### Cart.jsx

Page du panier:
- Liste des articles
- Mise à jour des quantités
- Suppression d'articles
- Calcul du total
- Procédure de paiement

**Route:** `/panier`

### Wishlist.jsx

Page des favoris:
- Liste des produits en favoris
- Suppression de favoris
- Ajouter au panier depuis les favoris

**Route:** `/favoris`

### Search.jsx

Page de résultats de recherche:
- Résultats de la requête
- Filtres et tri
- Pagination

**Route:** `/search?q=<query>`

### About.jsx

Page à propos de l'entreprise.

**Route:** `/about`

### Contact.jsx

Page de contact avec formulaire.

**Route:** `/contact`

---

## Composants

### Layout/Header.jsx

Barre d'en-tête avec:
- Logo
- Barre de recherche
- Navigation principale
- Liens panier et favoris
- Menu utilisateur (si connecté)
- Menu mobile réactif

**Props:** Aucune

**État:**
- Menu mobile ouvert/fermé
- Utilisateur connecté

### Layout/Footer.jsx

Pied de page avec:
- Liens rapides
- Informations de contact
- Abonnement newsletter
- Réseaux sociaux
- Copyright

**Props:** Aucune

### ProductCard.jsx

Carte de produit réutilisable.

**Props:**
```javascript
{
  product: {
    _id: String,
    name: String,
    price: Number,
    originalPrice: Number,
    image: String,
    rating: Number,
    stock: Number
  },
  onAddToCart: Function,
  onAddToWishlist: Function,
  isWishlisted: Boolean
}
```

**Fonctionnalités:**
- Affichage de l'image
- Nom et prix
- Note et nombre d'avis
- Badge de remise si applicable
- Boutons d'action

### SearchBar.jsx

Barre de recherche réutilisable.

**Props:**
```javascript
{
  onSearch: Function,
  placeholder: String
}
```

### HeroCarousel.jsx

Carrousel d'images pour la page d'accueil.

**Props:**
```javascript
{
  images: Array,
  autoplay: Boolean,
  interval: Number
}
```

---

## Services

### api.js

Client Axios configuré pour communiquer avec l'API backend.

**Configuration:**
- Base URL: Variable d'environnement `VITE_API_URL`
- Fallback: `http://localhost:5000/api`
- Intercepteur: Ajout automatique du token JWT aux requêtes

**Exports:**

#### Produits
```javascript
getProducts(params)          // GET /products
getProductById(id)          // GET /products/:id
searchProducts(query)       // GET /products?search=query
getCategories()             // GET /products/categories
```

#### Authentification
```javascript
register(userData)          // POST /auth/register
login(userData)             // POST /auth/login
```

#### Panier
```javascript
getCart()                   // GET /cart
addToCart(productId, qty)   // POST /cart/add
updateCartItem(id, qty)     // PUT /cart/update/:id
removeFromCart(productId)   // DELETE /cart/remove/:id
clearCart()                 // DELETE /cart/clear
```

#### Favoris
```javascript
getWishlist()               // GET /wishlist
addToWishlist(productId)    // POST /wishlist/add/:id
removeFromWishlist(id)      // DELETE /wishlist/remove/:id
checkWishlist(productId)    // POST /wishlist/check/:id
```

#### Commandes
```javascript
getOrders()                 // GET /orders
getOrderById(id)            // GET /orders/:id
createOrder(data)           // POST /orders
```

#### Utilisateurs
```javascript
getUserProfile()            // GET /users/profile
updateUserProfile(data)     // PUT /users/profile
changePassword(passwords)   // PUT /users/change-password
```

#### Avis
```javascript
getProductReviews(id)       // GET /reviews/product/:id
createReview(data)          // POST /reviews
updateReview(id, data)      // PUT /reviews/:id
deleteReview(id)            // DELETE /reviews/:id
```

### authService.js

Service pour la gestion de l'authentification.

**Méthodes:**
- `register(userData)` - Inscription d'un nouvel utilisateur
- `login(userData)` - Connexion utilisateur
- `logout()` - Déconnexion
- `getToken()` - Récupère le token du localStorage
- `setToken(token)` - Sauvegarde le token
- `isAuthenticated()` - Vérifie si l'utilisateur est connecté

### cartService.js

Service pour la gestion du panier.

**Méthodes:**
- `getCart()` - Récupère le panier
- `addToCart(productId, quantity)` - Ajoute un produit
- `removeFromCart(productId)` - Supprime un produit
- `updateCartItem(productId, quantity)` - Met à jour la quantité
- `clearCart()` - Vide le panier
- `getCartTotal()` - Calcule le total

### wishlistService.js

Service pour la gestion des favoris.

**Méthodes:**
- `getWishlist()` - Récupère la wishlist
- `addToWishlist(productId)` - Ajoute un produit
- `removeFromWishlist(productId)` - Supprime un produit
- `isWishlisted(productId)` - Vérifie si un produit est en favoris
- `checkWishlist(productId)` - Vérifie le statut d'un produit

### productService.js

Service pour la gestion des produits.

**Méthodes:**
- `getProducts(params)` - Récupère les produits avec filtres
- `getProductById(id)` - Récupère un produit par ID
- `searchProducts(query)` - Recherche de produits
- `getCategories()` - Récupère les catégories

### orderService.js

Service pour la gestion des commandes.

**Méthodes:**
- `getOrders()` - Récupère les commandes de l'utilisateur
- `getOrderById(id)` - Récupère une commande spécifique
- `createOrder(orderData)` - Crée une nouvelle commande

### userService.js

Service pour la gestion du profil utilisateur.

**Méthodes:**
- `getProfile()` - Récupère le profil utilisateur
- `updateProfile(userData)` - Met à jour le profil
- `changePassword(passwords)` - Change le mot de passe

### notificationService.js

Service pour les notifications utilisateur.

**Méthodes:**
- `showSuccess(message)` - Affiche une notification de succès
- `showError(message)` - Affiche une notification d'erreur
- `showInfo(message)` - Affiche une notification d'info
- `showWarning(message)` - Affiche une notification d'avertissement

### storageService.js

Service pour la gestion du stockage local.

**Méthodes:**
- `setItem(key, value)` - Sauvegarde une valeur
- `getItem(key)` - Récupère une valeur
- `removeItem(key)` - Supprime une valeur
- `clear()` - Efface tout le stockage

### index.js

Exporte centralisé de tous les services.

```javascript
import { 
  authService, 
  productService, 
  cartService, 
  wishlistService, 
  orderService, 
  userService, 
  notificationService, 
  storageService 
} from './services';
```

---

## Routing

### Configuration des routes

Toutes les routes sont définies dans `AppRoute.jsx`:

```javascript
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/search" element={<SearchPage />} />
  <Route path="/category/:category" element={<Products />} />
  <Route path="/products/:category" element={<Products />} />
  <Route path="/product/:productId" element={<ProductDetail />} />
  <Route path="/favoris" element={<Wishlist />} />
  <Route path="/panier" element={<Cart />} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />
</Routes>
```

### Navigation

Utilisation de React Router pour la navigation:

```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/products/Électronique');
navigate(`/product/${productId}`);
navigate('/panier');
```

---

## Gestion d'état

### Contexte (Context API)

Pour gérer l'état global (utilisateur, panier, favoris):

```javascript
// Exemple avec hooks
const [user, setUser] = useState(null);
const [cart, setCart] = useState([]);
const [wishlist, setWishlist] = useState([]);
```

### LocalStorage

Persistance des données:

```javascript
// Token
localStorage.setItem('token', token);
const token = localStorage.getItem('token');

// Données utilisateur
localStorage.setItem('user', JSON.stringify(user));
const user = JSON.parse(localStorage.getItem('user'));
```

### Panier local

Le panier peut être stocké localement avant synchronisation avec le serveur:

```javascript
// Panier avant connexion
localStorage.setItem('cart', JSON.stringify(cartItems));
```

---

## Variables d'environnement

Créez un fichier `.env` à la racine du dossier `frontend`:

```env
VITE_API_URL=http://localhost:5000/api
```

**Accès dans le code:**

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

### Variables disponibles

| Variable | Description | Défaut |
|----------|-------------|--------|
| `VITE_API_URL` | URL de base de l'API | `http://localhost:5000/api` |

---

## Scripts NPM

### Développement

```bash
npm run dev
```

Démarre le serveur de développement Vite avec hot reload.

### Build

```bash
npm run build
```

Compile l'application pour la production. Les fichiers sont dans `dist/`.

### Linting

```bash
npm run lint
```

Vérifie la qualité du code avec ESLint.

### Aperçu

```bash
npm run preview
```

Prévisualise la build en local.

---

## Dépendances

### Production

| Package | Version | Description |
|---------|---------|-------------|
| react | ^19.2.0 | Bibliothèque React |
| react-dom | ^19.2.0 | React DOM |
| react-router-dom | ^7.10.1 | Routage côté client |
| axios | ^1.13.2 | Client HTTP |
| lucide-react | ^0.561.0 | Icônes SVG |
| tailwindcss | 3 | Framework CSS utilitaire |
| postcss | ^8.5.6 | Processeur CSS |
| autoprefixer | ^10.4.23 | Préfixes CSS automatiques |

### Développement

| Package | Version | Description |
|---------|---------|-------------|
| vite | ^7.2.4 | Build tool |
| @vitejs/plugin-react | ^5.1.1 | Plugin React pour Vite |
| eslint | ^9.39.1 | Linter JavaScript |
| eslint-plugin-react-hooks | ^7.0.1 | Plugin ESLint React Hooks |
| eslint-plugin-react-refresh | ^0.4.24 | Plugin ESLint React Refresh |
| @types/react | ^19.2.5 | Types TypeScript pour React |
| @types/react-dom | ^19.2.3 | Types TypeScript pour React DOM |

---

## Styling

### Tailwind CSS

Framework CSS utilitaire utilisé pour le styling.

**Configuration:** `tailwind.config.js`

**Imports:** Dans `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### PostCSS

Processeur CSS pour les transformations.

**Configuration:** `postcss.config.js`

---

## Bonnes pratiques

### Composants

- Créer des composants petits et réutilisables
- Nommer les props explicitement
- Utiliser les propTypes ou TypeScript pour valider les props

### Services

- Grouper les appels API par domaine
- Gérer les erreurs au niveau du service
- Utiliser des promesses ou async/await

### Styles

- Utiliser les classes Tailwind
- Éviter les styles CSS inline
- Grouper les styles liés dans des fichiers CSS

### Routes

- Garder les routes simples et prévisibles
- Utiliser des paramètres d'URL pour les IDs
- Rediriger les routes invalides vers la page d'accueil

---

## Dépannage

### Le serveur de développement ne démarre pas

1. Assurez-vous que Node.js est installé
2. Vérifiez que les dépendances sont installées (`npm install`)
3. Vérifiez que le port 5173 est disponible

### Erreur de connexion à l'API

1. Vérifiez que le backend s'exécute sur le port 5000
2. Vérifiez la variable `VITE_API_URL` dans `.env`
3. Vérifiez que CORS est correctement configuré sur le backend

### Pages blanches

1. Ouvrez la console du navigateur (F12)
2. Cherchez les erreurs JavaScript
3. Vérifiez que tous les composants importés existent
4. Vérifiez les route params

### Token JWT expiré

1. Supprimez le token du localStorage
2. Reconnectez-vous
3. Le token est automatiquement ajouté aux requêtes par l'intercepteur

---

## Performance

### Optimisations implémentées

- Lazy loading des images
- Code splitting avec React Router
- Minification en production (Vite)
- Caching des requêtes API

### Recommandations

- Utiliser React DevTools pour profiler
- Analyser les bundles avec `npm run build`
- Charger les images en bon format (WebP si possible)

---

## Support et Ressources

- [Documentation React](https://react.dev)
- [Documentation Vite](https://vitejs.dev)
- [Documentation React Router](https://reactrouter.com)
- [Documentation Tailwind CSS](https://tailwindcss.com)
- [Documentation Axios](https://axios-http.com)

---

**Dernière mise à jour**: 5 janvier 2024
