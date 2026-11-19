import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import ReturnClaimModal from '../../components/ReturnClaimModal';
import { StoreService } from '../../services/storeService';
import { getCurrentSession } from '../../services/authService';
import { RotateCcw, AlertTriangle, CheckCircle2, Plus, ShieldAlert } from 'lucide-react';

export default function WholesaleReturnsPage() {
  const session = getCurrentSession();
  const allReturns = StoreService.getReturns();
  const wholesaleReturns = allReturns.filter(
    (r) => r.accountType === 'Wholesaler' || r.userEmail === session?.email
  );

  const allOrders = StoreService.getOrders();
  const deliveredWholesaleOrders = allOrders.filter(
    (o) => (o.accountType === 'Wholesaler' || o.userEmail === session?.email) && o.status === 'Delivered'
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(deliveredWholesaleOrders[0] || null);

  return (
    <DashboardLayout
      title="Wholesale Master Bale Defect Claims"
      subtitle="Report transit crushing or manufacturing defects on bulk bales within 5 calendar days."
    >
      <div className="return-policy-notice-box mb-6">
        <div className="policy-notice-header">
          <ShieldAlert size={20} className="text-gold" />
          <strong>COMMERCIAL 5-DAY BALE DAMAGE PROTOCOL:</strong>
        </div>
        <p className="mt-1">
          Wholesale orders are packed in reinforced master bales. Claims for torn bales or internal fabric defect must be lodged within <strong>5 calendar days of carrier delivery</strong> with high-resolution photos of the damaged goods and shipping bill. Non-damaged returns or unsold stock returns are strictly not accepted.
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">Reported Bale Defect Claims ({wholesaleReturns.length})</h3>
        {deliveredWholesaleOrders.length > 0 && (
          <button
            type="button"
            className="btn-primary-navy"
            onClick={() => {
              setSelectedOrder(deliveredWholesaleOrders[0]);
              setIsModalOpen(true);
            }}
          >
            <Plus size={16} />
            <span>File New Bale Defect Claim</span>
          </button>
        )}
      </div>

      <div className="returns-list-stack">
        {wholesaleReturns.length > 0 ? (
          wholesaleReturns.map((claim) => (
            <div key={claim.id} className="return-claim-card wholesale-card-border">
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
                  <p className="claim-defect-type">Defect Classification: <strong>{claim.damageType}</strong></p>
                  <p className="claim-desc-text">"{claim.damageDescription}"</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="shop-empty-state-box">
            <CheckCircle2 size={44} className="text-success" />
            <h3>No Active Defect Claims</h3>
            <p>All delivered wholesale bales have been accepted in sound, undamaged condition.</p>
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
