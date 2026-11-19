import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { StoreService } from '../../services/storeService';
import {
  SlidersHorizontal,
  Users,
  Package,
  FileText,
  RotateCcw,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Edit3,
  DollarSign
} from 'lucide-react';

export default function AdminDashboardPage() {
  const users = StoreService.getUsers();
  const products = StoreService.getProducts();
  const orders = StoreService.getOrders();
  const returns = StoreService.getReturns();
  const [settings, setSettings] = useState(() => StoreService.getAdminSettings());

  const wholesalersCount = users.filter((u) => u.accountType === 'Wholesaler').length;
  const retailersCount = users.filter((u) => u.accountType === 'Retailer').length;
  const buyersCount = users.filter((u) => u.accountType === 'Buyer').length;

  const totalGMV = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const totalSetsSold = orders.reduce((acc, o) => {
    return acc + (o.items?.reduce((sub, i) => sub + (i.quantitySets || 0), 0) || 0);
  }, 0);

  const [editMoq, setEditMoq] = useState(settings.wholesaleMinSets || 12);
  const [saveToast, setSaveToast] = useState('');

  const handleSaveMoq = (e) => {
    e.preventDefault();
    const updated = { ...settings, wholesaleMinSets: Number(editMoq) };
    setSettings(updated);
    StoreService.setAdminSettings(updated);
    setSaveToast(`Wholesale Minimum Order Quantity updated to ${editMoq} sets across platform!`);
    setTimeout(() => setSaveToast(''), 3000);
  };

  const handleApproveReturn = (returnId) => {
    const updated = returns.map((r) => {
      if (r.id === returnId) {
        return { ...r, status: 'Approved', adminRemarks: 'Approved by Senior Quality Inspector. Replacement dispatched.' };
      }
      return r;
    });
    StoreService.setReturns(updated);
  };

  const handleRejectReturn = (returnId) => {
    const updated = returns.map((r) => {
      if (r.id === returnId) {
        return { ...r, status: 'Rejected', adminRemarks: 'Claim rejected: Structural fabric damage not evident from photos.' };
      }
      return r;
    });
    StoreService.setReturns(updated);
  };

  return (
    <DashboardLayout
      title="Admin Executive Command & Operations"
      subtitle="Enterprise governance, user accounts, wholesale MOQ control, and 5-day damage claims desk."
    >
      {saveToast && (
        <div className="auth-alert-box alert-success mb-6">
          <CheckCircle2 size={18} />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Analytics KPI Row */}
      <div className="dash-metrics-grid">
        <div className="metric-stat-card">
          <div className="stat-icon-wrap bg-gold-light">
            <DollarSign size={24} className="text-gold" />
          </div>
          <div className="stat-meta">
            <span className="stat-label">Total Gross Merchandise (GMV)</span>
            <h3 className="stat-val">₹{totalGMV.toLocaleString('en-IN')}</h3>
          </div>
        </div>

        <div className="metric-stat-card">
          <div className="stat-icon-wrap bg-navy-light">
            <Package size={24} className="text-navy" />
          </div>
          <div className="stat-meta">
            <span className="stat-label">Total Clothing Sets Dispatched</span>
            <h3 className="stat-val">{totalSetsSold} Sets</h3>
          </div>
        </div>

        <div className="metric-stat-card">
          <div className="stat-icon-wrap bg-green-light">
            <Users size={24} className="text-green" />
          </div>
          <div className="stat-meta">
            <span className="stat-label">Active Users</span>
            <h3 className="stat-val">{users.length} ({wholesalersCount} Wholesalers, {retailersCount} Retailers, {buyersCount} Buyers)</h3>
          </div>
        </div>

        <div className="metric-stat-card">
          <div className="stat-icon-wrap bg-coral-light">
            <RotateCcw size={24} className="text-coral" />
          </div>
          <div className="stat-meta">
            <span className="stat-label">5-Day Damage Claims</span>
            <h3 className="stat-val">{returns.length} ({returns.filter((r) => r.status === 'Under Review').length} In Review)</h3>
          </div>
        </div>
      </div>

      {/* Dynamic MOQ Control & Policy Configuration */}
      <div className="admin-config-card my-8 p-6 bg-white rounded-lg shadow-sm border border-gold">
        <div className="flex items-center gap-2 mb-4">
          <Package size={22} className="text-gold" />
          <h3 className="font-bold text-lg">Wholesale Minimum Order Quantity (MOQ) Rule Control</h3>
        </div>
        <p className="text-sm text-muted mb-4">
          Configure the mandatory minimum clothing set purchase required for all Wholesaler checkouts across the marketplace.
        </p>

        <form onSubmit={handleSaveMoq} className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="font-semibold text-sm">Wholesaler MOQ (Sets):</label>
            <input
              type="number"
              min="1"
              max="100"
              value={editMoq}
              onChange={(e) => setEditMoq(e.target.value)}
              className="input-field-control w-24 text-center font-bold"
            />
          </div>
          <button type="submit" className="btn-primary-navy py-2 px-4 text-sm">
            Save Platform Policy
          </button>
        </form>
      </div>

      {/* 5-Day Damage Claims Desk */}
      <div className="admin-returns-desk-card p-6 bg-white rounded-lg shadow-sm border mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-lg">Transit Damage Inspection Claims Desk</h3>
            <p className="text-sm text-muted">Review photo evidence and approve/reject claims filed within 5 days of delivery.</p>
          </div>
        </div>

        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Order Ref</th>
                <th>Customer / Firm</th>
                <th>Role</th>
                <th>Defect Type</th>
                <th>Days Post Delivery</th>
                <th>Status</th>
                <th>Photo Evidence</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((claim) => (
                <tr key={claim.id}>
                  <td><strong>#{claim.id}</strong></td>
                  <td>#{claim.orderId}</td>
                  <td>{claim.userEmail}</td>
                  <td><span className="cat-accent-pill">{claim.accountType}</span></td>
                  <td>{claim.damageType}</td>
                  <td><strong>{claim.daysSinceDelivery || 1} day(s)</strong> (≤ 5 Days Window)</td>
                  <td>
                    <span className={`status-pill status-${claim.status.toLowerCase().replace(/\s/g, '-')}`}>
                      {claim.status}
                    </span>
                  </td>
                  <td>
                    {claim.photos?.[0] ? (
                      <a href={claim.photos[0]} target="_blank" rel="noreferrer" className="gold-text-link text-xs">
                        View Photo ({claim.photos.length})
                      </a>
                    ) : (
                      'No photo'
                    )}
                  </td>
                  <td>
                    {claim.status === 'Under Review' ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="btn-table-action bg-green text-white text-xs py-1 px-2"
                          onClick={() => handleApproveReturn(claim.id)}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="btn-table-action bg-danger text-white text-xs py-1 px-2"
                          onClick={() => handleRejectReturn(claim.id)}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted">Actioned</span>
                    )}
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
