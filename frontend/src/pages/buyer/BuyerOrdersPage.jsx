import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import InvoiceModal from '../../components/InvoiceModal';
import ReturnClaimModal from '../../components/ReturnClaimModal';
import { StoreService } from '../../services/storeService';
import { getCurrentSession } from '../../services/authService';
import {
  Package,
  Truck,
  Printer,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye
} from 'lucide-react';

export default function BuyerOrdersPage() {
  const session = getCurrentSession();
  const allOrders = StoreService.getOrders();
  const buyerOrders = allOrders.filter(
    (o) => o.accountType === 'Buyer' || o.userEmail === session?.email
  );

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);
  const [activeReturnOrder, setActiveReturnOrder] = useState(null);

  const filteredOrders = buyerOrders.filter((o) => {
    if (statusFilter === 'ALL') return true;
    return o.status.toUpperCase() === statusFilter;
  });

  return (
    <DashboardLayout
      title="My Order History & Invoices"
      subtitle="View past purchases, download tax receipts, and report transit damage claims."
    >
      {/* Filter Tabs */}
      <div className="orders-filter-tabs-row mb-6">
        <button
          type="button"
          className={`filter-tab-pill ${statusFilter === 'ALL' ? 'active' : ''}`}
          onClick={() => setStatusFilter('ALL')}
        >
          All Orders ({buyerOrders.length})
        </button>
        <button
          type="button"
          className={`filter-tab-pill ${statusFilter === 'DELIVERED' ? 'active' : ''}`}
          onClick={() => setStatusFilter('DELIVERED')}
        >
          Delivered
        </button>
        <button
          type="button"
          className={`filter-tab-pill ${statusFilter === 'IN TRANSIT' ? 'active' : ''}`}
          onClick={() => setStatusFilter('IN TRANSIT')}
        >
          In Transit
        </button>
        <button
          type="button"
          className={`filter-tab-pill ${statusFilter === 'CONFIRMED' ? 'active' : ''}`}
          onClick={() => setStatusFilter('CONFIRMED')}
        >
          Confirmed
        </button>
      </div>

      {/* Orders List */}
      <div className="orders-cards-stack">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const isDelivered = order.status === 'Delivered';
            const daysSince = order.deliveryDate
              ? Math.floor((Date.now() - new Date(order.deliveryDate).getTime()) / (1000 * 60 * 60 * 24))
              : null;
            const canClaimDamage = isDelivered && daysSince !== null && daysSince <= 5;

            return (
              <div key={order.id} className="order-history-card">
                <div className="order-card-header-bar">
                  <div className="header-meta-group">
                    <span className="order-id-badge">#{order.id}</span>
                    <span className="order-date-text">
                      Placed on {new Date(order.orderDate).toLocaleDateString('en-IN')}
                    </span>
                    <span className="order-pay-method">
                      {order.paymentMethod === 'ONLINE_UPI' ? 'Online UPI' : 'UPI on Delivery'}
                    </span>
                  </div>

                  <div className="header-status-group">
                    <span className={`status-pill status-${order.status.toLowerCase().replace(/\s/g, '-')}`}>
                      {order.status}
                    </span>
                    <span className="order-grand-amount">
                      ₹{order.totalAmount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Items in Order */}
                <div className="order-line-items-list">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="order-line-item-row">
                      <img src={item.image} alt={item.name} className="line-item-thumb" />
                      <div className="line-item-details">
                        <h4>{item.name}</h4>
                        <p className="item-specs">
                          Quantity: {item.quantity || 1} • SKU: {item.sku}
                        </p>
                        <span className="item-price">₹{item.totalPrice?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card Action Footer */}
                <div className="order-card-actions-bar">
                  <div className="left-action-notes">
                    {canClaimDamage && (
                      <span className="damage-eligible-tag">
                        <Clock size={13} />
                        <span>Eligible for Damage Return ({5 - daysSince} days left)</span>
                      </span>
                    )}
                  </div>

                  <div className="right-action-buttons">
                    <Link to={`/buyer/track/${order.id}`} className="btn-track-action">
                      <Truck size={15} />
                      <span>Track Shipment</span>
                    </Link>

                    <button
                      type="button"
                      className="btn-invoice-action"
                      onClick={() => setActiveInvoiceOrder(order)}
                    >
                      <Printer size={15} />
                      <span>Invoice</span>
                    </button>

                    {isDelivered && (
                      <button
                        type="button"
                        className={`btn-damage-claim ${canClaimDamage ? 'active' : 'disabled'}`}
                        disabled={!canClaimDamage}
                        onClick={() => canClaimDamage && setActiveReturnOrder(order)}
                        title={!canClaimDamage ? 'Damage reporting window (5 days) has elapsed' : 'Report Damaged Product'}
                      >
                        <RotateCcw size={15} />
                        <span>Report Damaged Item</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="shop-empty-state-box">
            <Package size={44} className="text-muted" />
            <h3>No Orders Found</h3>
            <p>You have not placed any orders matching the current filter.</p>
            <Link to="/shop" className="btn-primary-navy mt-4">
              Browse Collections
            </Link>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        order={activeInvoiceOrder}
        isOpen={Boolean(activeInvoiceOrder)}
        onClose={() => setActiveInvoiceOrder(null)}
      />

      {/* Return Claim Modal */}
      <ReturnClaimModal
        order={activeReturnOrder}
        isOpen={Boolean(activeReturnOrder)}
        onClose={() => setActiveReturnOrder(null)}
      />
    </DashboardLayout>
  );
}
