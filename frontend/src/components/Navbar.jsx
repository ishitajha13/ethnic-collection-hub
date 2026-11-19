import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ShieldCheck,
  Package,
  Store,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  LogOut,
  SlidersHorizontal,
  FileText,
  RotateCcw
} from 'lucide-react';
import Logo from './Logo';
import { getCurrentSession, logoutUser, ACCOUNT_TYPES } from '../services/authService';
import { StoreService } from '../services/storeService';
import { validateWholesaleCart } from '../services/businessService';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [session, setSession] = useState(getCurrentSession());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wholesaleWarning, setWholesaleWarning] = useState(null);

  // Sync auth session and cart count
  useEffect(() => {
    const updateHeaderState = () => {
      const cur = getCurrentSession();
      setSession(cur);
      const role = cur?.accountType || 'Buyer';
      const cart = StoreService.getCart(role);
      const wishlist = StoreService.getWishlist(cur?.id || 'current');

      if (role === 'Wholesaler') {
        const val = validateWholesaleCart(cart);
        setCartCount(val.totalSets);
        if (val.totalSets > 0 && !val.isValid) {
          setWholesaleWarning(`Min 12 Sets Required: Have ${val.totalSets} set${val.totalSets === 1 ? '' : 's'}`);
        } else {
          setWholesaleWarning(null);
        }
      } else {
        const count = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
        setCartCount(count);
        setWholesaleWarning(null);
      }
      setWishlistCount(wishlist.length);
    };

    updateHeaderState();
    window.addEventListener('ech_auth_change', updateHeaderState);
    window.addEventListener('ech_db_change', updateHeaderState);
    return () => {
      window.removeEventListener('ech_auth_change', updateHeaderState);
      window.removeEventListener('ech_db_change', updateHeaderState);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!session) return '/login';
    switch (session.accountType) {
      case ACCOUNT_TYPES.WHOLESALER:
        return '/wholesaler/dashboard';
      case ACCOUNT_TYPES.RETAILER:
        return '/retailer/dashboard';
      case ACCOUNT_TYPES.ADMIN:
        return '/admin';
      case ACCOUNT_TYPES.BUYER:
      default:
        return '/buyer/dashboard';
    }
  };

  const getCartPath = () => {
    if (!session) return '/buyer/cart';
    switch (session.accountType) {
      case ACCOUNT_TYPES.WHOLESALER:
        return '/wholesaler/cart';
      case ACCOUNT_TYPES.RETAILER:
        return '/retailer/cart';
      case ACCOUNT_TYPES.BUYER:
      default:
        return '/buyer/cart';
    }
  };

  return (
    <header className="site-header-root">
      {/* 1. Regal Announcement Bar */}
      <div className="site-topbar-banner">
        <div className="site-topbar-inner">
          <div className="topbar-item">
            <Sparkles size={13} className="text-gold" />
            <span>Artisan Handloom Silks & Bridal Couture</span>
          </div>
          <div className="topbar-center-item">
            <span>Wholesale B2B Minimum 12 Sets</span>
            <span className="dot-sep">•</span>
            <span>Online UPI & UPI on Delivery (No COD)</span>
            <span className="dot-sep">•</span>
            <span>Strict 5-Day Damage Return Window</span>
          </div>
          <div className="topbar-right-item">
            <Link to="/contact" className="topbar-link">24/7 Self-Service Desk</Link>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <nav className="site-main-navbar" aria-label="Main Navigation">
        <div className="nav-container">
          
          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Official Brand Logo */}
          <Link to="/" className="nav-logo-link" title="Ethnic Collection Hub Home">
            <Logo size="nav" />
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="nav-search-form" role="search">
            <input
              type="text"
              placeholder="Search Sarees, Lehengas, Kurtis, Sherwanis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="nav-search-input"
            />
            <button type="submit" className="nav-search-button" aria-label="Search">
              <Search size={18} />
            </button>
          </form>

          {/* Desktop Links */}
          <div className="nav-desktop-links">
            <Link to="/shop" className={`nav-link ${location.pathname === '/shop' ? 'active' : ''}`}>
              Shop All
            </Link>
            <Link to="/categories" className={`nav-link ${location.pathname === '/categories' ? 'active' : ''}`}>
              Categories
            </Link>
            <Link to="/new-arrivals" className={`nav-link ${location.pathname === '/new-arrivals' ? 'active' : ''}`}>
              New Arrivals
            </Link>
            <Link to="/featured-collections" className={`nav-link ${location.pathname === '/featured-collections' ? 'active' : ''}`}>
              Featured
            </Link>
            <Link to="/wholesaler/bulk-pricing" className="nav-link nav-bulk-link">
              Bulk Slabs
            </Link>
          </div>

          {/* Right Action Icons & Auth */}
          <div className="nav-actions-group">
            {/* Wishlist Link */}
            <Link to="/buyer/wishlist" className="nav-icon-action" title="Wishlist">
              <Heart size={22} />
              {wishlistCount > 0 && <span className="nav-badge gold-badge">{wishlistCount}</span>}
            </Link>

            {/* Shopping Cart Link */}
            <Link to={getCartPath()} className="nav-icon-action cart-action-wrap" title="Shopping Cart">
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className={`nav-badge ${wholesaleWarning ? 'warning-badge' : 'navy-badge'}`}>
                  {cartCount} {session?.accountType === 'Wholesaler' ? 'Sets' : ''}
                </span>
              )}
            </Link>

            {/* User Account / Role Dropdown */}
            {session ? (
              <div className="nav-user-dropdown-wrap">
                <button
                  type="button"
                  className="nav-user-pill-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <div className="user-avatar-circle">
                    {session.name ? session.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="user-pill-meta">
                    <span className="user-pill-name">{session.name.split(' ')[0]}</span>
                    <span className="user-pill-role">{session.accountType}</span>
                  </div>
                  <ChevronDown size={14} className="chevron-icon" />
                </button>

                {userDropdownOpen && (
                  <div className="nav-dropdown-menu" onClick={() => setUserDropdownOpen(false)}>
                    <div className="dropdown-user-header">
                      <p className="dropdown-user-name">{session.name}</p>
                      <p className="dropdown-user-email">{session.email}</p>
                      <span className="dropdown-role-tag">
                        <ShieldCheck size={12} />
                        {session.accountType} Account
                      </span>
                    </div>

                    <div className="dropdown-divider"></div>

                    <Link to={getDashboardPath()} className="dropdown-item">
                      <SlidersHorizontal size={16} />
                      <span>{session.accountType} Dashboard</span>
                    </Link>

                    {session.accountType === ACCOUNT_TYPES.WHOLESALER && (
                      <>
                        <Link to="/wholesaler/catalogue" className="dropdown-item">
                          <Package size={16} />
                          <span>Wholesale Catalog (Min 12 Sets)</span>
                        </Link>
                        <Link to="/wholesaler/orders" className="dropdown-item">
                          <FileText size={16} />
                          <span>Wholesale Bulk Orders</span>
                        </Link>
                        <Link to="/wholesaler/invoices" className="dropdown-item">
                          <FileText size={16} />
                          <span>Commercial Tax Invoices</span>
                        </Link>
                      </>
                    )}

                    {session.accountType === ACCOUNT_TYPES.RETAILER && (
                      <>
                        <Link to="/retailer/catalogue" className="dropdown-item">
                          <Store size={16} />
                          <span>Retailer Catalog & Margins</span>
                        </Link>
                        <Link to="/retailer/orders" className="dropdown-item">
                          <FileText size={16} />
                          <span>Store Orders & Deliveries</span>
                        </Link>
                        <Link to="/retailer/invoices" className="dropdown-item">
                          <FileText size={16} />
                          <span>GST Tax Invoices</span>
                        </Link>
                      </>
                    )}

                    {session.accountType === ACCOUNT_TYPES.BUYER && (
                      <>
                        <Link to="/buyer/orders" className="dropdown-item">
                          <ShoppingBag size={16} />
                          <span>My Orders & Tracking</span>
                        </Link>
                        <Link to="/buyer/returns" className="dropdown-item">
                          <RotateCcw size={16} />
                          <span>5-Day Damage Claims</span>
                        </Link>
                      </>
                    )}

                    <Link to="/aadhaar-scan" className="dropdown-item">
                      <ShieldCheck size={16} />
                      <span>Aadhaar KYC Verification</span>
                    </Link>

                    <div className="dropdown-divider"></div>

                    <button type="button" className="dropdown-item text-danger" onClick={handleLogout}>
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="nav-auth-buttons">
                <Link to="/login" className="btn-nav-login">Sign In</Link>
                <Link to="/register" className="btn-nav-register">Register</Link>
              </div>
            )}
          </div>
        </div>

        {/* Wholesale Warning Bar if sets < 12 */}
        {wholesaleWarning && (
          <div className="wholesale-warning-strip">
            <div className="warning-strip-content">
              <AlertTriangle size={15} />
              <span>{wholesaleWarning} — Wholesalers must order 12 sets or more to checkout.</span>
              <Link to="/wholesaler/cart" className="warning-link">View Cart</Link>
            </div>
          </div>
        )}
      </nav>

      {/* 3. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-body" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <Logo size="compact" />
              <button
                type="button"
                className="close-drawer-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="mobile-search-form">
              <input
                type="text"
                placeholder="Search ethnic wear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mobile-search-input"
              />
              <button type="submit" className="mobile-search-btn">
                <Search size={18} />
              </button>
            </form>

            <div className="mobile-drawer-links">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="mobile-link">Home</Link>
              <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="mobile-link">Shop All Catalog</Link>
              <Link to="/categories" onClick={() => setMobileMenuOpen(false)} className="mobile-link">12 Categories</Link>
              <Link to="/new-arrivals" onClick={() => setMobileMenuOpen(false)} className="mobile-link">New Arrivals</Link>
              <Link to="/featured-collections" onClick={() => setMobileMenuOpen(false)} className="mobile-link">Featured Collections</Link>
              <Link to="/wholesaler/bulk-pricing" onClick={() => setMobileMenuOpen(false)} className="mobile-link">Wholesale Slabs Matrix</Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="mobile-link">About Brand</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="mobile-link">Contact & Self-Service</Link>
              <Link to="/aadhaar-scan" onClick={() => setMobileMenuOpen(false)} className="mobile-link">Aadhaar KYC Scan</Link>
            </div>

            <div className="mobile-drawer-auth">
              {session ? (
                <>
                  <Link to={getDashboardPath()} onClick={() => setMobileMenuOpen(false)} className="btn-primary-navy block-btn">
                    Go to {session.accountType} Dashboard
                  </Link>
                  <button type="button" onClick={handleLogout} className="btn-outline-danger block-btn">
                    Sign Out ({session.email})
                  </button>
                </>
              ) : (
                <div className="mobile-auth-grid">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-primary-navy">
                    Log In
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-gold-action">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
