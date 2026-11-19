import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import ReturnClaimModal from '../../components/ReturnClaimModal';
import { StoreService } from '../../services/storeService';
import { getCurrentSession } from '../../services/authService';
import {
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Camera,
  FileCheck,
  Plus,
  ShieldAlert
} from 'lucide-react';

export default function BuyerReturnsPage() {
  const session = getCurrentSession();
  const allReturns = StoreService.getReturns();
  const buyerReturns = allReturns.filter(
    (r) => r.accountType === 'Buyer' || r.userEmail === session?.email
  );

  const allOrders = StoreService.getOrders();
  const deliveredOrders = allOrders.filter(
    (o) => (o.accountType === 'Buyer' || o.userEmail === session?.email) && o.status === 'Delivered'
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState(deliveredOrders[0] || null);

  const handleClaimSuccess = (newReturn) => {
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout
      title="Damaged Clothing Return Requests"
      subtitle="Track status of reported transit defects and file new 5-day claims."
    >
      {/* Strict Policy Banner */}
      <div className="return-policy-notice-box mb-6">
        <div className="policy-notice-header">
          <ShieldAlert size={20} className="text-gold" />
          <strong>STRICT 5-DAY DAMAGE RETURN POLICY:</strong>
        </div>
        <p className="mt-1">
          Returns on ETHNIC COLLECTION HUB are accepted <u>EXCLUSIVELY FOR DAMAGED CLOTHING</u> reported within 5 days of delivery.
          Change of mind, wrong size, or non-damaged products will be automatically rejected. High-resolution photographs are mandatory.
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-lg">My Return Claims ({buyerReturns.length})</h3>
          <p className="text-sm text-muted">All claims are reviewed by Senior Quality Inspectors within 24 business hours.</p>
        </div>

        {deliveredOrders.length > 0 && (
          <button
            type="button"
            className="btn-primary-navy"
            onClick={() => {
              setSelectedOrderForReturn(deliveredOrders[0]);
              setIsModalOpen(true);
            }}
          >
            <Plus size={16} />
            <span>File New Damage Claim</span>
          </button>
        )}
      </div>

      {/* Claims List */}
      <div className="returns-list-stack">
        {buyerReturns.length > 0 ? (
          buyerReturns.map((claim) => (
            <div key={claim.id} className="return-claim-card">
              <div className="claim-card-header">
                <div className="claim-meta-group">
                  <span className="claim-id-pill">Claim #{claim.id}</span>
                  <span className="claim-order-ref">Order Ref: <strong>#{claim.orderId}</strong></span>
                  <span className="claim-date">
                    Filed on {new Date(claim.reportDate).toLocaleDateString('en-IN')} ({claim.daysSinceDelivery} day after delivery)
                  </span>
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

                  <div className="admin-remarks-box mt-3">
                    <FileCheck size={16} className="text-gold flex-shrink-0" />
                    <div>
                      <strong>Inspection Desk Assessment:</strong>
                      <p>{claim.adminRemarks || 'Evidence under optical verification.'}</p>
                    </div>
                  </div>
                </div>

                {/* Submitted Photos */}
                {claim.photos && claim.photos.length > 0 && (
                  <div className="claim-photos-col">
                    <span className="photos-label">Photographic Proof:</span>
                    <div className="claim-photos-grid">
                      {claim.photos.map((src, i) => (
                        <div key={i} className="claim-photo-frame">
                          <img src={src} alt={`Damage Evidence ${i + 1}`} className="claim-photo-thumb" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="shop-empty-state-box">
            <CheckCircle2 size={44} className="text-success" />
            <h3>No Active Return Claims</h3>
            <p>You have not filed any damage claims. All past delivered orders are in sound condition.</p>
          </div>
        )}
      </div>

      {/* Return Claim Modal */}
      <ReturnClaimModal
        order={selectedOrderForReturn}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleClaimSuccess}
      />
    </DashboardLayout>
  );
}
