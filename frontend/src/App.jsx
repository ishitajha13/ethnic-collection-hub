import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Public Pages (1 - 15)
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import ShopPage from './pages/public/ShopPage';
import CategoriesPage from './pages/public/CategoriesPage';
import NewArrivalsPage from './pages/public/NewArrivalsPage';
import FeaturedCollectionsPage from './pages/public/FeaturedCollectionsPage';
import ProductDetailsPage from './pages/public/ProductDetailsPage';
import SearchResultsPage from './pages/public/SearchResultsPage';
import LoginPageWrapper from './pages/public/LoginPageWrapper';
import RegisterPage from './pages/public/RegisterPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import ResetPasswordPage from './pages/public/ResetPasswordPage';
import VerifyOtpPage from './pages/public/VerifyOtpPage';
import AadhaarScanPage from './pages/public/AadhaarScanPage';

// Buyer Pages (16 - 27)
import BuyerDashboardPage from './pages/buyer/BuyerDashboardPage';
import BuyerProfilePage from './pages/buyer/BuyerProfilePage';
import BuyerAddressPage from './pages/buyer/BuyerAddressPage';
import BuyerWishlistPage from './pages/buyer/BuyerWishlistPage';
import BuyerCartPage from './pages/buyer/BuyerCartPage';
import BuyerCheckoutPage from './pages/buyer/BuyerCheckoutPage';
import BuyerPaymentPage from './pages/buyer/BuyerPaymentPage';
import BuyerOrderConfirmationPage from './pages/buyer/BuyerOrderConfirmationPage';
import BuyerOrdersPage from './pages/buyer/BuyerOrdersPage';
import BuyerOrderTrackingPage from './pages/buyer/BuyerOrderTrackingPage';
import BuyerReturnsPage from './pages/buyer/BuyerReturnsPage';
import BuyerReviewsPage from './pages/buyer/BuyerReviewsPage';

// Retailer Pages (28 - 38)
import RetailerDashboardPage from './pages/retailer/RetailerDashboardPage';
import RetailerProfilePage from './pages/retailer/RetailerProfilePage';
import RetailerCataloguePage from './pages/retailer/RetailerCataloguePage';
import RetailerProductDetailsPage from './pages/retailer/RetailerProductDetailsPage';
import RetailerCartPage from './pages/retailer/RetailerCartPage';
import RetailerCheckoutPage from './pages/retailer/RetailerCheckoutPage';
import RetailerPaymentPage from './pages/retailer/RetailerPaymentPage';
import RetailerOrdersPage from './pages/retailer/RetailerOrdersPage';
import RetailerOrderTrackingPage from './pages/retailer/RetailerOrderTrackingPage';
import RetailerInvoicesPage from './pages/retailer/RetailerInvoicesPage';
import RetailerReturnsPage from './pages/retailer/RetailerReturnsPage';

// Wholesaler Pages (39 - 50)
import WholesalerDashboardPage from './pages/wholesaler/WholesalerDashboardPage';
import WholesalerProfilePage from './pages/wholesaler/WholesalerProfilePage';
import WholesaleCataloguePage from './pages/wholesaler/WholesaleCataloguePage';
import WholesaleProductDetailsPage from './pages/wholesaler/WholesaleProductDetailsPage';
import BulkPricingMatrixPage from './pages/wholesaler/BulkPricingMatrixPage';
import WholesaleCartPage from './pages/wholesaler/WholesaleCartPage';
import WholesaleCheckoutPage from './pages/wholesaler/WholesaleCheckoutPage';
import WholesalePaymentPage from './pages/wholesaler/WholesalePaymentPage';
import WholesaleOrdersPage from './pages/wholesaler/WholesaleOrdersPage';
import WholesaleOrderTrackingPage from './pages/wholesaler/WholesaleOrderTrackingPage';
import WholesaleInvoicesPage from './pages/wholesaler/WholesaleInvoicesPage';
import WholesaleReturnsPage from './pages/wholesaler/WholesaleReturnsPage';

// Admin Page
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// Styles
import './LoginPage.css';
import './index.css';
import './styles/ecommerce.css';

// Scroll to top helper on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        {/* SECTION A: PUBLIC WEBSITE AND AUTHENTICATION (1 - 15) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/new-arrivals" element={<NewArrivalsPage />} />
        <Route path="/featured-collections" element={<FeaturedCollectionsPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/login" element={<LoginPageWrapper />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/aadhaar-scan" element={<AadhaarScanPage />} />

        {/* SECTION B: BUYER PAGES (16 - 27) */}
        <Route path="/buyer/dashboard" element={<BuyerDashboardPage />} />
        <Route path="/buyer/profile" element={<BuyerProfilePage />} />
        <Route path="/buyer/addresses" element={<BuyerAddressPage />} />
        <Route path="/buyer/wishlist" element={<BuyerWishlistPage />} />
        <Route path="/buyer/cart" element={<BuyerCartPage />} />
        <Route path="/buyer/checkout" element={<BuyerCheckoutPage />} />
        <Route path="/buyer/payment" element={<BuyerPaymentPage />} />
        <Route path="/buyer/order-confirmation" element={<BuyerOrderConfirmationPage />} />
        <Route path="/buyer/orders" element={<BuyerOrdersPage />} />
        <Route path="/buyer/track/:id" element={<BuyerOrderTrackingPage />} />
        <Route path="/buyer/returns" element={<BuyerReturnsPage />} />
        <Route path="/buyer/reviews" element={<BuyerReviewsPage />} />

        {/* SECTION C: RETAILER PAGES (28 - 38) */}
        <Route path="/retailer/dashboard" element={<RetailerDashboardPage />} />
        <Route path="/retailer/profile" element={<RetailerProfilePage />} />
        <Route path="/retailer/catalogue" element={<RetailerCataloguePage />} />
        <Route path="/retailer/product/:id" element={<RetailerProductDetailsPage />} />
        <Route path="/retailer/cart" element={<RetailerCartPage />} />
        <Route path="/retailer/checkout" element={<RetailerCheckoutPage />} />
        <Route path="/retailer/payment" element={<RetailerPaymentPage />} />
        <Route path="/retailer/orders" element={<RetailerOrdersPage />} />
        <Route path="/retailer/track/:id" element={<RetailerOrderTrackingPage />} />
        <Route path="/retailer/invoices" element={<RetailerInvoicesPage />} />
        <Route path="/retailer/returns" element={<RetailerReturnsPage />} />

        {/* SECTION D: WHOLESALER PAGES (39 - 50) */}
        <Route path="/wholesaler/dashboard" element={<WholesalerDashboardPage />} />
        <Route path="/wholesaler/profile" element={<WholesalerProfilePage />} />
        <Route path="/wholesaler/catalogue" element={<WholesaleCataloguePage />} />
        <Route path="/wholesaler/product/:id" element={<WholesaleProductDetailsPage />} />
        <Route path="/wholesaler/bulk-pricing" element={<BulkPricingMatrixPage />} />
        <Route path="/wholesaler/cart" element={<WholesaleCartPage />} />
        <Route path="/wholesaler/checkout" element={<WholesaleCheckoutPage />} />
        <Route path="/wholesaler/payment" element={<WholesalePaymentPage />} />
        <Route path="/wholesaler/orders" element={<WholesaleOrdersPage />} />
        <Route path="/wholesaler/track/:id" element={<WholesaleOrderTrackingPage />} />
        <Route path="/wholesaler/invoices" element={<WholesaleInvoicesPage />} />
        <Route path="/wholesaler/returns" element={<WholesaleReturnsPage />} />

        {/* SUPPLEMENTARY PROTECTED ADMIN PANEL */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/*" element={<AdminDashboardPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
