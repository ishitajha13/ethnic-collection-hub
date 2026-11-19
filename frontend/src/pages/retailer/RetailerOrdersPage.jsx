import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import InvoiceModal from '../../components/InvoiceModal';
import ReturnClaimModal from '../../components/ReturnClaimModal';
import { StoreService } from '../../services/storeService';
import { getCurrentSession } from '../../services/authService';
import { Truck, Printer, RotateCcw, Package, Clock } from 'lucide-react';

export default function RetailerOrdersPage() {
  const session = getCurrentSession();
  const allOrders = StoreService.getOrders();
  const retailerOrders = allOrders.filter(
    (o) => o.accountType === 'Retailer' || o.userEmail === session?.email
  );

  const [activeInvoice, setActiveInvoice] = useState(null);
  const [activeReturn, setActiveReturn] = useState(null);

  return (
    <DashboardLayout
      title="Store Consignments & Orders"
      subtitle="Track all boutique stock procurements, logistics manifests, and tax receipts."
    >
      <div className="orders-cards-stack">
        {retailerOrders.map((ord) => {
          const isDelivered = ord.status === 'Delivered';
          const daysSince = ord.deliveryDate
            ? Math.floor((Date.now() - new Date(ord.deliveryDate).getTime()) / (1000 * 60 * 60 * 24))
            : null;
          const canClaim = isDelivered && daysSince !== null && daysSince <= 5;

          return (
            <div key={ord.id} className="order-history-card">
              <div className="order-card-header-bar">
                <div className="header-meta-group">
                  <span className="order-id-badge">#{ord.id}</span>
                  <span className="order-date-text">
                    Ordered on {new Date(ord.orderDate).toLocaleDateString('en-IN')}
                  </span>
                  <span className="order-pay-method">{ord.paymentMethod === 'ONLINE_UPI' ? 'Online UPI' : 'UPI on Delivery'}</span>
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
                      <p className="item-specs">Procured: {item.quantity} units • SKU: {item.sku}</p>
                      <span className="item-price">₹{item.totalPrice?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="order-card-actions-bar">
                <div className="left-action-notes">
                  {canClaim && (
                    <span className="damage-eligible-tag">
                      <Clock size={13} />
                      <span>Transit Damage Claim Active ({5 - daysSince} days left)</span>
                    </span>
                  )}
                </div>

                <div className="right-action-buttons">
                  <Link to={`/retailer/track/${ord.id}`} className="btn-track-action">
                    <Truck size={15} />
                    <span>Track Cargo</span>
                  </Link>

                  <button
                    type="button"
                    className="btn-invoice-action"
                    onClick={() => setActiveInvoice(ord)}
                  >
                    <Printer size={15} />
                    <span>GST Tax Invoice</span>
                  </button>

                  {isDelivered && (
                    <button
                      type="button"
                      className={`btn-damage-claim ${canClaim ? 'active' : 'disabled'}`}
                      disabled={!canClaim}
                      onClick={() => canClaim && setActiveReturn(ord)}
                    >
                      <RotateCcw size={15} />
                      <span>Report Damaged Stock</span>
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
