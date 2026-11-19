import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Package,
  Store,
  ShoppingBag,
  User,
  MapPin,
  Heart,
  FileText,
  RotateCcw,
  Star,
  Layers,
  SlidersHorizontal,
  LogOut,
  Bell,
  ShieldCheck,
  AlertCircle,
  Menu,
  X,
  CreditCard,
  ChevronRight,
  Truck
} from 'lucide-react';
import { getCurrentSession, logoutUser, ACCOUNT_TYPES } from '../services/authService';
import { StoreService } from '../services/storeService';
import Logo from './Logo';

export default function DashboardLayout({ title, subtitle, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const session = getCurrentSession() || {
    name: 'Guest Business Member',
    email: 'member@ethniccollectionhub.com',
    accountType: ACCOUNT_TYPES.BUYER,
    aadhaarVerificationStatus: 'Not Verified',
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifications = StoreService.getNotifications(session.id || 'current');

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  // Role-specific navigation items
  const getNavLinks = () => {
    if (session.accountType === ACCOUNT_TYPES.WHOLESALER) {
      return [
        { label: 'Overview Dashboard', path: '/wholesaler/dashboard', icon: SlidersHorizontal },
        { label: 'Wholesale Catalogue', path: '/wholesaler/catalogue', icon: Package },
        { label: 'Bulk Pricing Slabs', path: '/wholesaler/bulk-pricing', icon: Layers },
        { label: 'Wholesale Cart (Min 12)', path: '/wholesaler/cart', icon: ShoppingBag },
        { label: 'Bulk Order History', path: '/wholesaler/orders', icon: FileText },
        { label: 'Tax & Export Invoices', path: '/wholesaler/invoices', icon: CreditCard },
        { label: 'Bale Damage Requests', path: '/wholesaler/returns', icon: RotateCcw },
        { label: 'Firm Profile & KYC', path: '/wholesaler/profile', icon: User },
      ];
    } else if (session.accountType === ACCOUNT_TYPES.RETAILER) {
      return [
        { label: 'Retailer Dashboard', path: '/retailer/dashboard', icon: SlidersHorizontal },
        { label: 'Retailer Catalogue', path: '/retailer/catalogue', icon: Store },
        { label: 'Store Bulk Cart', path: '/retailer/cart', icon: ShoppingBag },
        { label: 'Purchase History', path: '/retailer/orders', icon: FileText },
        { label: 'GST Tax Invoices', path: '/retailer/invoices', icon: CreditCard },
        { label: 'Store Return Requests', path: '/retailer/returns', icon: RotateCcw },
        { label: 'Boutique Profile', path: '/retailer/profile', icon: User },
      ];
    } else if (session.accountType === ACCOUNT_TYPES.ADMIN) {
      return [
        { label: 'Executive Analytics', path: '/admin', icon: SlidersHorizontal },
        { label: 'User & KYC Approvals', path: '/admin/users', icon: User },
        { label: 'Product & MOQ Rules', path: '/admin/products', icon: Package },
        { label: 'Orders & Payments', path: '/admin/orders', icon: FileText },
        { label: '5-Day Damage Claims Desk', path: '/admin/returns', icon: RotateCcw },
      ];
    } else {
      // Buyer Navigation
      return [
        { label: 'Buyer Dashboard', path: '/buyer/dashboard', icon: SlidersHorizontal },
        { label: 'My Orders & Tracking', path: '/buyer/orders', icon: FileText },
        { label: 'Saved Wishlist', path: '/buyer/wishlist', icon: Heart },
        { label: 'Shopping Cart', path: '/buyer/cart', icon: ShoppingBag },
        { label: 'Address Management', path: '/buyer/addresses', icon: MapPin },
        { label: '5-Day Damage Claims', path: '/buyer/returns', icon: RotateCcw },
        { label: 'My Reviews & Ratings', path: '/buyer/reviews', icon: Star },
        { label: 'Personal Profile', path: '/buyer/profile', icon: User },
      ];
    }
  };

  const navLinks = getNavLinks();

  const getKycBadge = () => {
    const status = session.aadhaarVerificationStatus || 'Not Verified';
    if (status === 'Verified') {
      return (
        <span className="kyc-badge-pill kyc-verified" title="Identity Verified via Aadhaar">
          <ShieldCheck size={13} />
          <span>Aadhaar Verified</span>
        </span>
      );
    } else if (status === 'Pending Review') {
      return (
        <span className="kyc-badge-pill kyc-pending" title="Aadhaar Document Pending Verification">
          <AlertCircle size={13} />
          <span>KYC In Review</span>
        </span>
      );
    } else {
      return (
        <Link to="/aadhaar-scan" className="kyc-badge-pill kyc-unverified" title="Scan Aadhaar to Verify">
          <span>+ Verify Aadhaar</span>
        </Link>
      );
    }
  };

  return (
    <div className="dashboard-shell-layout">
      {/* Mobile Header Bar */}
      <div className="dashboard-mobile-bar">
        <button
          type="button"
          className="dashboard-menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <Link to="/">
          <Logo size="compact" />
        </Link>
        <div className="dash-mobile-user">
          <span className="mobile-role-tag">{session.accountType}</span>
        </div>
      </div>

      <div className="dashboard-body-container">
        {/* Left Sidebar */}
        <aside className={`dashboard-sidebar ${sidebarOpen ? 'sidebar-mobile-visible' : ''}`}>
          <div className="sidebar-header-card">
            <div className="sidebar-user-avatar">
              {session.name ? session.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="sidebar-user-meta">
              <h3 className="sidebar-user-name">{session.name}</h3>
              <p className="sidebar-user-email">{session.email}</p>
              <div className="sidebar-role-row">
                <span className="sidebar-account-role">{session.accountType}</span>
                {getKycBadge()}
              </div>
            </div>
          </div>

          <div className="sidebar-nav-scroller">
            <nav className="sidebar-nav-menu">
              <span className="sidebar-group-title">Portal Navigation</span>
              {navLinks.map((item, idx) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={idx}
                    to={item.path}
                    className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <IconComponent size={18} className="sidebar-nav-icon" />
                    <span>{item.label}</span>
                    <ChevronRight size={14} className="sidebar-chevron" />
                  </Link>
                );
              })}

              <div className="sidebar-divider"></div>
              <span className="sidebar-group-title">Public Boutique</span>
              <Link to="/shop" className="sidebar-nav-item">
                <ShoppingBag size={18} className="sidebar-nav-icon" />
                <span>Browse All Collections</span>
              </Link>
              <Link to="/wholesaler/bulk-pricing" className="sidebar-nav-item">
                <Layers size={18} className="sidebar-nav-icon" />
                <span>Bulk Pricing Matrix</span>
              </Link>
            </nav>
          </div>

          <div className="sidebar-bottom-actions">
            <button type="button" className="sidebar-logout-btn" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Sign Out Workspace</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-main-viewport">
          <header className="viewport-top-header">
            <div className="viewport-title-group">
              <h1 className="viewport-page-title">{title}</h1>
              {subtitle && <p className="viewport-page-subtitle">{subtitle}</p>}
            </div>

            <div className="viewport-actions-group">
              <div className="notification-bell-wrap">
                <button
                  type="button"
                  className="notification-bell-btn"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  <span className="notif-pulse-dot"></span>
                </button>

                {notificationsOpen && (
                  <div className="notifications-popup-card">
                    <div className="notif-popup-header">
                      <h4>Automated System Updates</h4>
                      <span>{notifications.length} updates</span>
                    </div>
                    <div className="notif-popup-list">
                      {notifications.map((n) => (
                        <div key={n.id} className="notif-popup-item">
                          <p className="notif-item-title">{n.title}</p>
                          <p className="notif-item-msg">{n.message}</p>
                          <span className="notif-item-time">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link to="/" className="btn-return-boutique">
                Visit Storefront
              </Link>
            </div>
          </header>

          <div className="viewport-content-canvas">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
