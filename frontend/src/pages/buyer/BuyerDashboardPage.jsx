import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { StoreService } from '../../services/storeService';
import { getCurrentSession } from '../../services/authService';
import {
  ShoppingBag,
  Heart,
  RotateCcw,
  Package,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck
} from 'lucide-react';

export default function BuyerDashboardPage() {
  const session = getCurrentSession();
  const allOrders = StoreService.getOrders();
  const buyerOrders = allOrders.filter(
    (o) => o.accountType === 'Buyer' || o.userEmail === session?.email
  );
  const wishlist = StoreService.getWishlist(session?.id || 'current');
  const allProducts = StoreService.getProducts();

  const recentOrder = buyerOrders[0];

  return (
    <DashboardLayout
      title={`Welcome back, ${session?.name || 'Prestige Shopper'}`}
      subtitle="Manage your personal ethnic couture orders, wishlists, and delivery tracking."
    >
      {/* Metric Cards Grid */}
      <div className="dash-metrics-grid">
        <div className="metric-stat-card">
          <div className="stat-icon-wrap bg-navy-light">
            <ShoppingBag size={24} className="text-navy" />
          </div>
          <div className="stat-meta">
            <span className="stat-label">Total Orders</span>
            <h3 className="stat-val">{buyerOrders.length}</h3>
          </div>
        </div>

        <div className="metric-stat-card">
          <div className="stat-icon-wrap bg-gold-light">
            <Truck size={24} className="text-gold" />
          </div>
          <div className="stat-meta">
            <span className="stat-label">Active Shipments</span>
            <h3 className="stat-val">
              {buyerOrders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length}
            </h3>
          </div>
        </div>

        <div className="metric-stat-card">
          <div className="stat-icon-wrap bg-coral-light">
            <Heart size={24} className="text-coral" />
          </div>
          <div className="stat-meta">
            <span className="stat-label">Saved to Wishlist</span>
            <h3 className="stat-val">{wishlist.length}</h3>
          </div>
        </div>

        <div className="metric-stat-card">
          <div className="stat-icon-wrap bg-green-light">
            <ShieldCheck size={24} className="text-green" />
          </div>
          <div className="stat-meta">
            <span className="stat-label">Aadhaar Status</span>
            <h3 className="stat-val">{session?.aadhaarVerificationStatus || 'Verified'}</h3>
          </div>
        </div>
      </div>

      {/* Active Shipment Focus Card */}
      {recentOrder && (
        <div className="active-shipment-banner mt-6">
          <div className="shipment-meta-col">
            <div className="flex items-center gap-2">
              <span className="status-pill status-delivered">{recentOrder.status}</span>
              <span className="order-id-label">Order #{recentOrder.id}</span>
            </div>
            <h3 className="shipment-item-name mt-2">{recentOrder.items[0]?.name}</h3>
            <p className="shipment-date">Ordered on {new Date(recentOrder.orderDate).toLocaleDateString('en-IN')}</p>
          </div>

          <div className="shipment-action-col">
            <Link to={`/buyer/track/${recentOrder.id}`} className="btn-gold-action">
              <Truck size={16} />
              <span>Track Live Delivery</span>
            </Link>
            <Link to="/buyer/orders" className="btn-outline-navy">
              View All Orders
            </Link>
          </div>
        </div>
      )}

      {/* Quick Shortcuts */}
      <div className="dash-quick-shortcuts-grid mt-6">
        <Link to="/shop" className="shortcut-card">
          <h4>Explore Ethnic Boutique</h4>
          <p>Browse sarees, lehengas, kurtis and accessories.</p>
          <span className="shortcut-arrow">Go to Shop →</span>
        </Link>

        <Link to="/buyer/returns" className="shortcut-card">
          <h4>Strict 5-Day Damage Claims</h4>
          <p>Report transit damage within 5 days of delivery.</p>
          <span className="shortcut-arrow">File Claim →</span>
        </Link>

        <Link to="/buyer/wishlist" className="shortcut-card">
          <h4>Saved Couture Wishlist</h4>
          <p>Move your curated pieces to your shopping cart.</p>
          <span className="shortcut-arrow">View Wishlist ({wishlist.length}) →</span>
        </Link>
      </div>
    </DashboardLayout>
  );
}
