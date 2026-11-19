import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import InvoiceModal from '../../components/InvoiceModal';
import ReturnClaimModal from '../../components/ReturnClaimModal';
import { StoreService } from '../../services/storeService';
import { getCurrentSession } from '../../services/authService';
import { Package, Truck, Printer, RotateCcw, Clock } from 'lucide-react';

export default function WholesaleOrdersPage() {
  const session = getCurrentSession();
  const allOrders = StoreService.getOrders();
  const wholesaleOrders = allOrders.filter(
    (o) => o.accountType === 'Wholesaler' || o.userEmail === session?.email
  );

  const [activeInvoice, setActiveInvoice] = useState(null);
  const [activeReturn, setActiveReturn] = useState(null);

  return (
    <DashboardLayout
      title="Wholesale Consignments & Master Orders"
      subtitle="Heavy bale shipments, commercial freight manifests, and digital invoices."
    >
      <div className="orders-cards-stack">
        {wholesaleOrders.map((ord) => {
          const isDelivered = ord.status === 'Delivered';
          const daysSince = ord.deliveryDate
            ? Math.floor((Date.now() - new Date(ord.deliveryDate).getTime()) / (1000 * 60 * 60 * 24))
            : null;
          const canClaim = isDelivered && daysSince !== null && daysSince <= 5;

          const totalSets = ord.items?.reduce((acc, i) => acc + (i.quantitySets || 12), 0);
          const totalPcs = ord.items?.reduce((acc, i) => acc + ((i.quantitySets || 12) * (i.piecesPerSet || 6)), 0);

          return (
            <div key={ord.id} className="order-history-card wholesale-card-border">
              <div className="order-card-header-bar">
                <div className="header-meta-group">
                  <span className="order-id-badge">#{ord.id}</span>
                  <span className="order-date-text">
                    Ordered on {new Date(ord.orderDate).toLocaleDateString('en-IN')}
                  </span>
                  <span className="order-pay-method">{ord.paymentMethod === 'ONLINE_UPI' ? 'Online Corporate UPI' : 'UPI on Delivery'}</span>
                </div>

                <div className="header-status-group">
                  <span className={`status-pill status-${ord.status.toLowerCase().replace(/\s/g, '-')}`}>
                    {ord.status}
                  </span>
                  <span className="order-grand-amount">₹{ord.totalAmount?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Items */}
              <div className="order-line-items-list">
                {ord.items?.map((item, i) => (
                  <div key={i} className="order-line-item-row">
                    <img src={item.image} alt={item.name} className="line-item-thumb" />
                    <div className="line-item-details">
                      <h4>{item.name}</h4>
                      <p className="item-specs">
                        Sets Procured: <strong>{item.quantitySets || 12} Sets</strong> ({ (item.quantitySets || 12) * (item.piecesPerSet || 6) } garments) • SKU: {item.sku}
                      </p>
                      <span className="item-price">₹{item.totalPrice?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions Bar */}
              <div className="order-card-actions-bar">
                <div className="left-action-notes">
                  <span className="text-xs text-muted">
                    Total Volume: <strong>{totalSets} Sets ({totalPcs} pieces)</strong>
                  </span>
                  {canClaim && (
                    <span className="damage-eligible-tag ml-3">
                      <Clock size={13} />
                      <span>5-Day Bale Claim Window Active ({5 - daysSince} days left)</span>
                    </span>
                  )}
                </div>

                <div className="right-action-buttons">
                  <Link to={`/wholesaler/track/${ord.id}`} className="btn-track-action">
                    <Truck size={15} />
                    <span>Track Freight</span>
                  </Link>

                  <button
                    type="button"
                    className="btn-invoice-action"
                    onClick={() => setActiveInvoice(ord)}
                  >
                    <Printer size={15} />
                    <span>Tax Invoice</span>
                  </button>

                  {isDelivered && (
                    <button
                      type="button"
                      className={`btn-damage-claim ${canClaim ? 'active' : 'disabled'}`}
                      disabled={!canClaim}
                      onClick={() => canClaim && setActiveReturn(ord)}
                    >
                      <RotateCcw size={15} />
                      <span>Report Damaged Bale</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <InvoiceModal
        order={activeInvoice}
        isOpen={Boolean(activeInvoice)}
        onClose={() => setActiveInvoice(null)}
      />

      <ReturnClaimModal
        order={activeReturn}
        isOpen={Boolean(activeReturn)}
        onClose={() => setActiveReturn(null)}
      />
    </DashboardLayout>
  );
}
