import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

import Home from '../pages/Home/Home';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminNumbers from '../pages/Admin/AdminNumbers';
import AdminCategories from '../pages/Admin/AdminCategories';
import AdminCoupons from '../pages/Admin/AdminCoupons';
import AdminBanners from '../pages/Admin/AdminBanners';
import Numbers from '../pages/Numbers/Numbers';
import NumberDetails from '../pages/NumberDetails/NumberDetails';
import Search from '../pages/Search/Search';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import ForgotPassword from '../pages/Login/ForgotPassword';
import Cart from '../pages/Cart/Cart';
import Checkout from '../pages/Checkout/Checkout';
import OrderSuccess from '../pages/Checkout/OrderSuccess';
import QRPayment from '../pages/Checkout/QRPayment';
import Contact from '../pages/Contact/Contact';
import About from '../pages/About/About';
import Plans from '../pages/Plans/Plans';
import Numerology from '../pages/Numerology';
import FAQ from '../pages/FAQ/FAQPage';
import Terms from '../pages/Terms/Terms';
import PrivacyPolicy from '../pages/PrivacyPolicy/PrivacyPolicy';
import RefundPolicy from '../pages/RefundPolicy/RefundPolicy';
import NotFound from '../pages/NotFound/NotFound';

import Profile from '../pages/Profile/Profile';
import Addresses from '../pages/Profile/Addresses';
import Orders from '../pages/Orders/Orders';
import Wishlist from '../pages/Wishlist/Wishlist';

import AdminOrders from '../pages/Admin/AdminOrders';
import AdminReviews from '../pages/Admin/AdminReviews';
import AdminMessages from '../pages/Admin/AdminMessages';
import AdminUsers from '../pages/Admin/AdminUsers';
import AdminSettings from '../pages/Admin/AdminSettings';

import { ROUTES } from '../constants/routes';

const AppRoutes = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.NUMBERS} element={<Numbers />} />
      <Route path="/numbers/:id" element={<NumberDetails />} />
      <Route path={ROUTES.SEARCH} element={<Search />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
      <Route path={ROUTES.CART} element={<Cart />} />
      <Route path={ROUTES.CONTACT} element={<Contact />} />
      <Route path={ROUTES.ABOUT} element={<About />} />
      <Route path={ROUTES.PLANS} element={<Plans />} />
      <Route path={ROUTES.NUMEROLOGY} element={<Numerology />} />
      <Route path={ROUTES.FAQ} element={<FAQ />} />
      <Route path={ROUTES.TERMS} element={<Terms />} />
      <Route path={ROUTES.PRIVACY} element={<PrivacyPolicy />} />
      <Route path={ROUTES.REFUND} element={<RefundPolicy />} />

      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
        <Route path="/order-success/:id" element={<OrderSuccess />} />
        <Route path="/pay/:orderId" element={<QRPayment />} />

        <Route element={<UserLayout />}>
          <Route path={ROUTES.ACCOUNT} element={<Navigate to={ROUTES.ACCOUNT_PROFILE} replace />} />
          <Route path={ROUTES.ACCOUNT_PROFILE} element={<Profile />} />
          <Route path={ROUTES.ACCOUNT_ORDERS} element={<Orders />} />
          <Route path={ROUTES.ACCOUNT_WISHLIST} element={<Wishlist />} />
          <Route path={ROUTES.ACCOUNT_ADDRESSES} element={<Addresses />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>

    <Route element={<AdminRoute />}>
      <Route element={<AdminLayout />}>
        <Route path={ROUTES.ADMIN} element={<AdminDashboard />} />
        <Route path={ROUTES.ADMIN_NUMBERS} element={<AdminNumbers />} />
        <Route path={ROUTES.ADMIN_CATEGORIES} element={<AdminCategories />} />
        <Route path={ROUTES.ADMIN_ORDERS} element={<AdminOrders />} />
        <Route path={ROUTES.ADMIN_COUPONS} element={<AdminCoupons />} />
        <Route path={ROUTES.ADMIN_REVIEWS} element={<AdminReviews />} />
        <Route path={ROUTES.ADMIN_CONTACTS} element={<AdminMessages />} />
        <Route path={ROUTES.ADMIN_USERS} element={<AdminUsers />} />
        <Route path={ROUTES.ADMIN_BANNERS} element={<AdminBanners />} />
        <Route path={ROUTES.ADMIN_SETTINGS} element={<AdminSettings />} />
      </Route>
    </Route>
  </Routes>
);

export default AppRoutes;
