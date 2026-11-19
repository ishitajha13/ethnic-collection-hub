import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { StoreService } from '../../services/storeService';
import { getCurrentSession } from '../../services/authService';
import {
  Store,
  FileText,
  CreditCard,
  RotateCcw,
  ShoppingBag,
  TrendingUp,
  Truck,
  ShieldCheck,
  Package
} from 'lucide-react';

export default function RetailerDashboardPage() {
  const session = getCurrentSession();
  const allOrders = StoreService.getOrders();
  const retailerOrders = allOrders.filter(
    (o) => o.accountType === 'Retailer' || o.userEmail === session?.email
  );
  const cart = StoreService.getCart('Retailer');

  return (
    <DashboardLayout
      title={`Retailer Resale Portal • ${session?.businessName || 'Ananya Boutique'}`}
      subtitle="Manage boutique stock procurement, profit margins, and GST tax input credits."
    >
      {/* Metric Cards Grid */}
      <div className="dash-metrics-grid">
        <div className="metric-stat-card">
          <div className="stat-icon-wrap bg-navy-light">
            <Store size={24} className="text-navy" />
          </div>
          <div className="stat-meta">
            <span className="stat-label">Stock Orders</span>
            <h3 className="stat-val">{retailerOrders.length}</h3>
          </div>
        </div>

        <div className="metric-stat-card">
          <div className="stat-icon-wrap bg-gold-light">
            <TrendingUp size={24} className="text-gold" />
          </div>
          <div className="stat-meta">
            <span className="stat-label">Avg Resale Margin</span>
            <h3 className="stat-val">38.5%</h3>
          </div>
        </div>

        <div className="metric-stat-card">
          <div className="stat-icon-wrap bg-green-light">
            <CreditCard size={24} className="text-green" />
          </div>
          <div className="stat-meta">
            <span className="stat-label">GST Tax Invoices</span>
            <h3 className="stat-val">{retailerOrders.length} Available</h3>
          </div>
        </div>

        <div className="metric-stat-card">
          <div className="stat-icon-wrap bg-coral-light">
            <ShieldCheck size={24} className="text-coral" />
          </div>
          <div className="stat-meta">
            <span className="stat-label">GSTIN Status</span>
            <h3 className="stat-val">Verified (Input Tax Credit)</h3>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="dash-quick-shortcuts-grid mt-6">
        <Link to="/retailer/catalogue" className="shortcut-card">
          <h4>Retailer Trade Catalogue</h4>
          <p>Browse discounted inventory with high retail margins.</p>
          <span className="shortcut-arrow">View Catalogue & Margins →</span>
        </Link>

        <Link to="/retailer/invoices" className="shortcut-card">
          <h4>Download GST Invoices</h4>
          <p>Official tax invoices with HSN codes for your accountant.</p>
          <span className="shortcut-arrow">View Invoices ({retailerOrders.length}) →</span>
        </Link>

        <Link to="/retailer/returns" className="shortcut-card">
          <h4>Transit Damage Claims</h4>
          <p>Report damaged stock within 5 days of delivery.</p>
          <span className="shortcut-arrow">File B2B Claim →</span>
        </Link>
      </div>

      {/* Recent Purchases Table */}
      <div className="recent-orders-card mt-8">
        <div className="card-header-bar flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Recent Stock Replenishments</h3>
          <Link to="/retailer/orders" className="gold-text-link">View All Consignments →</Link>
        </div>

        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Order Date</th>
                <th>Units Ordered</th>
                <th>Total Value</th>
                <th>Payment Mode</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {retailerOrders.map((ord) => (
                <tr key={ord.id}>
                  <td><strong>#{ord.id}</strong></td>
                  <td>{new Date(ord.orderDate).toLocaleDateString('en-IN')}</td>
                  <td>{ord.items?.reduce((acc, i) => acc + (i.quantity || 1), 0)} pcs</td>
                  <td><strong>₹{ord.totalAmount?.toLocaleString('en-IN')}</strong></td>
                  <td>{ord.paymentMethod === 'ONLINE_UPI' ? 'Online UPI' : 'UPI on Delivery'}</td>
                  <td>
                    <span className={`status-pill status-${ord.status.toLowerCase().replace(/\s/g, '-')}`}>
                      {ord.status}
                    </span>
                  </td>
                  <td>
                    <Link to={`/retailer/track/${ord.id}`} className="btn-table-action">
                      Track
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
