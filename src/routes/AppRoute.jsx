import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Favorites from "../pages/Favorites";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";
import Orders from "../pages/Orders";
import TrackOrder from "../pages/TrackOrder";
import TrackOrders from "../pages/TrackOrders";
import About from "../pages/About";
import Contact from "../pages/Contact";
import SearchPage from "../pages/Search";
import Login from "../pages/Login";
import CGU from "../pages/CGU";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import LegalNotice from "../pages/LegalNotice";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import AdminProducts from "../pages/dashboard/AdminProducts";
import AdminOrders from "../pages/dashboard/AdminOrders";
import AdminSettings from "../pages/dashboard/AdminSettings";
import { authService } from "../services";

// Composant protégé pour les routes admin
function ProtectedAdminRoute({ element }) {
  const user = authService.getUser();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  return element;
}

function AppRoute() {
  return (
    <>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Login />} />

        {/* Admin Routes - Protégées */}
        <Route path="/admin" element={<ProtectedAdminRoute element={<AdminDashboard />} />} />
        <Route path="/admin/products" element={<ProtectedAdminRoute element={<AdminProducts />} />} />
        <Route path="/admin/orders" element={<ProtectedAdminRoute element={<AdminOrders />} />} />
        <Route path="/admin/settings" element={<ProtectedAdminRoute element={<AdminSettings />} />} />

        {/* Public Routes */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <Home />
              <Footer />
            </>
          }
        />
        <Route
          path="/search"
          element={
            <>
              <Header />
              <SearchPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/category/:category"
          element={
            <>
              <Header />
              <Products />
              <Footer />
            </>
          }
        />
        <Route
          path="/products/:category"
          element={
            <>
              <Header />
              <Products />
              <Footer />
            </>
          }
        />
        <Route
          path="/product/:productId"
          element={
            <>
              <Header />
              <ProductDetail />
              <Footer />
            </>
          }
        />
        <Route
          path="/favoris"
          element={
            <>
              <Header />
              <Favorites />
              <Footer />
            </>
          }
        />
        <Route
          path="/panier"
          element={
            <>
              <Header />
              <Cart />
              <Footer />
            </>
          }
        />
        <Route
          path="/checkout"
          element={
            <>
              <Header />
              <Checkout />
              <Footer />
            </>
          }
        />
        <Route
          path="/order"
          element={
            <>
              <Header />
              <Orders />
              <Footer />
            </>
          }
        />
        <Route
          path="/order-success"
          element={
            <>
              <Header />
              <OrderSuccess />
              <Footer />
            </>
          }
        />
        <Route
          path="/orders"
          element={
            <>
              <Header />
              <TrackOrders />
              <Footer />
            </>
          }
        />
        <Route
          path="/track"
          element={
            <>
              <Header />
              <TrackOrder />
              <Footer />
            </>
          }
        />
        <Route
          path="/track/:trackingCode"
          element={
            <>
              <Header />
              <TrackOrder />
              <Footer />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Header />
              <About />
              <Footer />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Header />
              <Contact />
              <Footer />
            </>
          }
        />
        <Route
          path="/cgu"
          element={
            <>
              <Header />
              <CGU />
              <Footer />
            </>
          }
        />
        <Route
          path="/conditions"
          element={
            <>
              <Header />
              <CGU />
              <Footer />
            </>
          }
        />
        <Route
          path="/politique-confidentialite"
          element={
            <>
              <Header />
              <PrivacyPolicy />
              <Footer />
            </>
          }
        />
        <Route
          path="/privacy"
          element={
            <>
              <Header />
              <PrivacyPolicy />
              <Footer />
            </>
          }
        />
        <Route
          path="/mentions-legales"
          element={
            <>
              <Header />
              <LegalNotice />
              <Footer />
            </>
          }
        />
        <Route
          path="/legal"
          element={
            <>
              <Header />
              <LegalNotice />
              <Footer />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default AppRoute;
