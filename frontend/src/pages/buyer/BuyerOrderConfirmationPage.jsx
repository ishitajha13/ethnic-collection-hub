import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AppFooter from '../../components/AppFooter';
import InvoiceModal from '../../components/InvoiceModal';
import { StoreService } from '../../services/storeService';
import {
  CheckCircle2,
  Package,
  Truck,
  Printer,
  RotateCcw,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export default function BuyerOrderConfirmationPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');

  const orders = StoreService.getOrders();
  const order = orders.find((o) => o.id === orderId) || orders[0];

  const [invoiceOpen, setInvoiceOpen] = useState(false);

  return (
    <div className="hub-site-wrapper">
      <Navbar />

      <section className="confirmation-page-section">
        <div className="site-container">
          <div className="confirmation-card-box text-center">
            <div className="confirm-icon-wrap mx-auto">
              <CheckCircle2 size={54} className="text-gold" />
            </div>

            <span className="badge-luxury-pill mx-auto mt-4">Order Placed Successfully</span>
            <h1 className="confirm-main-heading mt-2">Thank You for Your Order!</h1>
            <p className="confirm-order-id-label">
              Order ID: <strong>#{order?.id}</strong>
            </p>
            <p className="confirm-meta-sub">
              An automated confirmation and official GST tax receipt has been dispatched to <strong>{order?.userEmail}</strong>.
            </p>

            {/* Quick Summary Pill Bar */}
            <div className="confirm-metrics-strip my-6">
              <div className="c-metric">
                <span>Payment Mode:</span>
                <strong>{order?.paymentMethod === 'ONLINE_UPI' ? 'Online UPI (Verified)' : 'UPI on Delivery (Doorstep QR)'}</strong>
              </div>
              <div className="c-metric">
                <span>Total Amount:</span>
                <strong>₹{order?.totalAmount?.toLocaleString('en-IN')}</strong>
              </div>
              <div className="c-metric">
                <span>Estimated Arrival:</span>
                <strong>{order?.tracking?.estimatedDelivery || 'In 3-4 Days'}</strong>
              </div>
            </div>

            {/* Strict Return Policy Callout */}
            <div className="confirm-policy-callout">
              <RotateCcw size={20} className="text-gold flex-shrink-0" />
              <div>
                <h4>Important: 5-Day Damage Inspection Window</h4>
                <p>
                  Upon delivery, please inspect your sealed package promptly. In accordance with ETHNIC COLLECTION HUB policy, returns are accepted <strong>strictly for transit damage</strong> reported within 5 days of delivery with photographic evidence.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="confirm-actions-row mt-8">
              <Link to={`/buyer/track/${order?.id}`} className="btn-primary-navy">
                <Truck size={17} />
                <span>Track Live Delivery Status</span>
              </Link>

              <button
                type="button"
                className="btn-gold-action"
                onClick={() => setInvoiceOpen(true)}
              >
                <Printer size={17} />
                <span>Download GST Tax Invoice</span>
              </button>

              <Link to="/shop" className="btn-outline-navy">
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <InvoiceModal
        order={order}
        isOpen={invoiceOpen}
        onClose={() => setInvoiceOpen(false)}
      />

      <AppFooter />
    </div>
  );
}
