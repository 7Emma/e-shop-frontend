import { Routes, Route } from "react-router-dom";
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
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import AdminProducts from "../pages/dashboard/AdminProducts";
import AdminOrders from "../pages/dashboard/AdminOrders";
import AdminUsers from "../pages/dashboard/AdminUsers";
import AdminReviews from "../pages/dashboard/AdminReviews";
import AdminSettings from "../pages/dashboard/AdminSettings";

function AppRoute() {
  return (
    <>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
        <Route path="/admin/settings" element={<AdminSettings />} />

        {/* Public Routes */}
        <Route
          path="*"
          element={
            <>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/category/:category" element={<Products />} />
                <Route path="/products/:category" element={<Products />} />
                <Route path="/product/:productId" element={<ProductDetail />} />
                <Route path="/favoris" element={<Favorites />} />
                <Route path="/panier" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order" element={<Orders />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/orders" element={<TrackOrders />} />
                <Route path="/track" element={<TrackOrder />} />
                <Route path="/track/:trackingCode" element={<TrackOrder />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
              <Footer />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default AppRoute;
