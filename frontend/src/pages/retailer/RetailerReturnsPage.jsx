import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import ReturnClaimModal from '../../components/ReturnClaimModal';
import { StoreService } from '../../services/storeService';
import { getCurrentSession } from '../../services/authService';
import { RotateCcw, AlertTriangle, CheckCircle2, Plus, ShieldAlert, FileCheck } from 'lucide-react';

export default function RetailerReturnsPage() {
  const session = getCurrentSession();
  const allReturns = StoreService.getReturns();
  const retailerReturns = allReturns.filter(
    (r) => r.accountType === 'Retailer' || r.userEmail === session?.email
  );

  const allOrders = StoreService.getOrders();
  const deliveredRetailerOrders = allOrders.filter(
    (o) => (o.accountType === 'Retailer' || o.userEmail === session?.email) && o.status === 'Delivered'
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(deliveredRetailerOrders[0] || null);

  return (
    <DashboardLayout
      title="B2B Transit Damage & Defect Claims"
      subtitle="Report transit damage on boutique consignments within the mandatory 5-day window."
    >
      <div className="return-policy-notice-box mb-6">
        <div className="policy-notice-header">
          <ShieldAlert size={20} className="text-gold" />
          <strong>COMMERCIAL 5-DAY TRANSIT DAMAGE POLICY:</strong>
        </div>
        <p className="mt-1">
          B2B store consignments are insured against transit tearing, dye bleeding, and bale crushing. Claims must be submitted within <strong>5 calendar days of recorded delivery</strong> with clear photographic documentation.
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">Reported Transit Claims ({retailerReturns.length})</h3>
        {deliveredRetailerOrders.length > 0 && (
          <button
            type="button"
            className="btn-primary-navy"
            onClick={() => {
              setSelectedOrder(deliveredRetailerOrders[0]);
              setIsModalOpen(true);
            }}
          >
            <Plus size={16} />
            <span>File New Transit Damage Claim</span>
          </button>
        )}
      </div>

      <div className="returns-list-stack">
        {retailerReturns.length > 0 ? (
          retailerReturns.map((claim) => (
            <div key={claim.id} className="return-claim-card">
              <div className="claim-card-header">
                <div className="claim-meta-group">
                  <span className="claim-id-pill">Claim #{claim.id}</span>
                  <span className="claim-order-ref">Order Ref: <strong>#{claim.orderId}</strong></span>
                  <span className="claim-date">Filed on {new Date(claim.reportDate).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="claim-status-group">
                  <span className={`status-pill status-${claim.status.toLowerCase().replace(/\s/g, '-')}`}>
                    {claim.status}
                  </span>
                </div>
              </div>

              <div className="claim-card-body">
                <div className="claim-info-col">
                  <h4 className="claim-item-name">{claim.productName}</h4>
                  <p className="claim-defect-type">Defect: <strong>{claim.damageType}</strong></p>
                  <p className="claim-desc-text">"{claim.damageDescription}"</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="shop-empty-state-box">
            <CheckCircle2 size={44} className="text-success" />
            <h3>No Transit Damage Claims</h3>
            <p>All delivered boutique consignments have arrived in flawless condition.</p>
          </div>
        )}
      </div>

      <ReturnClaimModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setIsModalOpen(false)}
      />
    </DashboardLayout>
  );
}
