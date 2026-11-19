import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { StoreService } from '../../services/storeService';
import { getCurrentSession } from '../../services/authService';
import {
  Package,
  Layers,
  Truck,
  CreditCard,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  ShoppingBag
} from 'lucide-react';

export default function WholesalerDashboardPage() {
  const session = getCurrentSession();
  const allOrders = StoreService.getOrders();
  const wholesaleOrders = allOrders.filter(
    (o) => o.accountType === 'Wholesaler' || o.userEmail === session?.email
  );

  const totalSetsProcured = wholesaleOrders.reduce((acc, ord) => {
    return acc + (ord.items?.reduce((sub, i) => sub + (i.quantitySets || 12), 0) || 0);
  }, 0);

  const cart = StoreService.getCart('Wholesaler');
  const cartSets = cart.reduce((acc, i) => acc + (i.quantitySets || 0), 0);

  return (
    <DashboardLayout
      title={`Wholesale B2B Command Hub • ${session?.businessName || 'Singhania Syndicate'}`}
      subtitle="Factory-direct bulk sourcing portal • Mandatory Minimum Order: 12 Clothing Sets"
    >
      {/* Mandatory MOQ Compliance Notice */}
      <div className="wholesale-rule-banner mb-6">
        <div className="flex items-center gap-3">
          <Package size={24} className="text-gold" />
          <div>
            <h4>Mandatory Wholesale Business Rule: Minimum 12 Sets per Order</h4>
            <p>
              In accordance with factory-direct supply agreements, all wholesale orders require a minimum of 12 clothing sets. Checkouts below 12 sets are strictly locked by the dispatch system. Orders of 24+ sets receive 5% volume rebate, and 36+ sets unlock 10% master pricing.
            </p>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="dash-metrics-grid">
        <div className="metric-stat-card">
          <div className="stat-icon-wrap bg-navy-light">
            <Package size={24} className="text-navy" />
          </div>
          <div className="stat-meta">
            <span className="stat-label">Total Sets Procured</span>
            <h3 className="stat-val">{totalSetsProcured} Sets</h3>
          </div>
        </div>

        <div className="metric-stat-card">
          <div className="stat-icon-wrap bg-gold-light">
            <Layers size={24} className="text-gold" />
          </div>
          <div className="stat-meta">
            <span className="stat-label">Active Wholesale Tier</span>
            <h3 className="stat-val">Tier 2 (5% Bulk Rebate)</h3>
          </div>
        </div>

        <div className="metric-stat-card">
          <div className="stat-icon-wrap bg-green-light">
            <CreditCard size={24} className="text-green" />
          </div>
          <div className="stat-meta">
            <span className="stat-label">B2B Tax Invoices</span>
            <h3 className="stat-val">{wholesaleOrders.length} Ready</h3>
          </div>
        </div>

        <div className="metric-stat-card">
          <div className="stat-icon-wrap bg-coral-light">
            <ShoppingBag size={24} className="text-coral" />
          </div>
          <div className="stat-meta">
            <span className="stat-label">Current Cart Sets</span>
            <h3 className="stat-val">{cartSets} / 12 Sets</h3>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="dash-quick-shortcuts-grid mt-6">
        <Link to="/wholesaler/catalogue" className="shortcut-card">
          <h4>Browse Wholesale Sets</h4>
          <p>Order assorted clothing sets with clear piece breakdowns.</p>
          <span className="shortcut-arrow">View Catalogue →</span>
        </Link>

        <Link to="/wholesaler/bulk-pricing" className="shortcut-card">
          <h4>Bulk Pricing Slabs Matrix</h4>
          <p>Review 12, 24, and 36+ set volume discounts across all 12 categories.</p>
          <span className="shortcut-arrow">View Pricing Slabs →</span>
        </Link>

        <Link to="/wholesaler/cart" className="shortcut-card">
          <h4>Wholesale Cart ({cartSets} Sets)</h4>
          <p>{cartSets >= 12 ? '✓ Minimum 12 Sets Met' : `⚠️ Need ${Math.max(0, 12 - cartSets)} more sets to checkout`}</p>
          <span className="shortcut-arrow">Open Cart →</span>
        </Link>

        <Link to="/wholesaler/invoices" className="shortcut-card">
          <h4>Commercial Tax Invoices</h4>
          <p>Download GST-compliant tax invoices with HSN codes.</p>
          <span className="shortcut-arrow">Invoices Desk →</span>
        </Link>
      </div>

      {/* Recent Orders Manifest */}
      <div className="recent-orders-card mt-8">
        <div className="card-header-bar flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Recent Commercial Bale Shipments</h3>
          <Link to="/wholesaler/orders" className="gold-text-link">View All Wholesale Orders →</Link>
        </div>

        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Order Date</th>
                <th>Sets (Pieces)</th>
                <th>Consignment Total</th>
                <th>Payment Mode</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {wholesaleOrders.map((ord) => {
                const totalSets = ord.items?.reduce((acc, i) => acc + (i.quantitySets || 12), 0);
                const totalPcs = ord.items?.reduce((acc, i) => acc + ((i.quantitySets || 12) * (i.piecesPerSet || 6)), 0);

                return (
                  <tr key={ord.id}>
                    <td><strong>#{ord.id}</strong></td>
                    <td>{new Date(ord.orderDate).toLocaleDateString('en-IN')}</td>
                    <td><strong>{totalSets} Sets</strong> ({totalPcs} pcs)</td>
                    <td><strong>₹{ord.totalAmount?.toLocaleString('en-IN')}</strong></td>
                    <td>{ord.paymentMethod === 'ONLINE_UPI' ? 'Online UPI' : 'UPI on Delivery'}</td>
                    <td>
                      <span className={`status-pill status-${ord.status.toLowerCase().replace(/\s/g, '-')}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/wholesaler/track/${ord.id}`} className="btn-table-action">
                        Track Bale
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
