import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { StoreService } from '../../services/storeService';
import { getCurrentSession } from '../../services/authService';
import {
  QrCode,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Copy,
  AlertCircle
} from 'lucide-react';

export default function RetailerPaymentPage() {
  const navigate = useNavigate();
  const session = getCurrentSession();

  const rawCheckout = sessionStorage.getItem('pending_retailer_checkout');
  const checkoutData = rawCheckout ? JSON.parse(rawCheckout) : null;

  const settings = StoreService.getAdminSettings();
  const upiId = settings.merchantUpiVpa || 'pay.ethniccollectionhub@okhdfcbank';

  const [paymentMode, setPaymentMode] = useState('ONLINE_UPI');
  const [transactionRef, setTransactionRef] = useState('');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!checkoutData) {
    return (
      <DashboardLayout title="Payment" subtitle="Commercial Gateway">
        <div className="text-center py-10">
          <h3>No active checkout session.</h3>
          <Link to="/retailer/cart" className="btn-primary-navy mt-4">Return to Cart</Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCompleteOrder = () => {
    setErrorMsg('');
    if (paymentMode === 'ONLINE_UPI' && (!transactionRef.trim() || transactionRef.trim().length < 8)) {
      setErrorMsg('Please enter your 12-digit commercial UPI transaction UTR reference.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const orderId = 'ECH-ORD-' + Math.floor(10000 + Math.random() * 90000);
      const newOrder = {
        id: orderId,
        userId: session?.id || 'user_retailer_01',
        userEmail: session?.email || 'retailer@ethniccollectionhub.com',
        userName: checkoutData.businessName || session?.businessName || 'Retail Boutique',
        accountType: 'Retailer',
        orderDate: new Date().toISOString(),
        deliveryDate: null,
        status: 'Confirmed',
        paymentMethod: paymentMode,
        paymentStatus: paymentMode === 'ONLINE_UPI' ? 'Paid' : 'Awaiting UPI on Delivery',
        upiTransactionId: paymentMode === 'ONLINE_UPI' ? transactionRef.trim().toUpperCase() : null,
        subtotal: checkoutData.subtotal,
        discount: 0,
        deliveryFee: checkoutData.freight,
        totalAmount: checkoutData.grandTotal,
        shippingAddress: {
          fullName: checkoutData.businessName,
          phone: session?.phone || '+91 98220 87654',
          addressLine1: checkoutData.shippingAddress,
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400070',
        },
        items: checkoutData.cart,
        tracking: {
          courier: 'Delhivery Express B2B',
          trackingNumber: 'DLV-B2B-' + Math.floor(100000 + Math.random() * 900000),
          currentStage: 'Confirmed',
          estimatedDelivery: 'In 2-3 Days',
          timeline: [
            { title: 'Commercial Order Created & GST Verified', time: 'Just now', done: true },
            { title: 'Boutique Security Packaging & Hologram Sealing', time: 'Pending', done: false },
            { title: 'Dispatched via Express B2B Freight Logistics', time: 'Pending', done: false },
            { title: 'Store Delivery & Verified UPI Gateway Handover', time: 'Pending', done: false },
          ]
        }
      };

      const existing = StoreService.getOrders();
      StoreService.setOrders([newOrder, ...existing]);

      // Clear retailer cart
      StoreService.saveCart('Retailer', []);
      sessionStorage.removeItem('pending_retailer_checkout');

      setIsProcessing(false);
      navigate(`/retailer/orders?new=${orderId}`);
    }, 1200);
  };

  return (
    <DashboardLayout
      title="Commercial UPI Gateway"
      subtitle={`Consignment Value: ₹${checkoutData.grandTotal.toLocaleString('en-IN')} (Incl. GST)`}
    >
      <div className="payment-layout-grid">
        <div className="payment-methods-card">
          <div className="no-cod-banner">
            <ShieldCheck size={18} />
            <span>Zero Cash on Delivery • 100% Verified Digital Business Settlements</span>
          </div>

          <div className="payment-mode-tabs mt-4">
            <button
              type="button"
              className={`mode-tab-btn ${paymentMode === 'ONLINE_UPI' ? 'active' : ''}`}
              onClick={() => { setPaymentMode('ONLINE_UPI'); setErrorMsg(''); }}
            >
              <Smartphone size={20} />
              <div className="mode-tab-meta">
                <span className="mode-tab-title">Option A: Online UPI</span>
                <span className="mode-tab-sub">Immediate Bank Settlement & Verification</span>
              </div>
            </button>

            <button
              type="button"
              className={`mode-tab-btn ${paymentMode === 'UPI_ON_DELIVERY' ? 'active' : ''}`}
              onClick={() => { setPaymentMode('UPI_ON_DELIVERY'); setErrorMsg(''); }}
            >
              <QrCode size={20} />
              <div className="mode-tab-meta">
                <span className="mode-tab-title">Option B: UPI on Delivery</span>
                <span className="mode-tab-sub">Pay via Dynamic QR at Store Doorstep</span>
              </div>
            </button>
          </div>

          {paymentMode === 'ONLINE_UPI' && (
            <div className="online-upi-content mt-6">
              <div className="upi-qr-display-card">
                <div className="qr-box">
                  <svg viewBox="0 0 140 140" className="dynamic-qr-svg">
                    <rect width="140" height="140" fill="#FFFFFF" />
                    <rect x="10" y="10" width="40" height="40" fill="#062945" />
                    <rect x="20" y="20" width="20" height="20" fill="#FFFFFF" />
                    <rect x="90" y="10" width="40" height="40" fill="#062945" />
                    <rect x="100" y="20" width="20" height="20" fill="#FFFFFF" />
                    <rect x="10" y="90" width="40" height="40" fill="#062945" />
                    <rect x="20" y="100" width="20" height="20" fill="#FFFFFF" />
                    <rect x="60" y="60" width="20" height="20" fill="#D6A12B" />
                  </svg>
                  <span className="qr-scan-hint">Scan with Commercial UPI App</span>
                </div>

                <div className="upi-merchant-details">
                  <span className="vpa-label">Merchant UPI VPA:</span>
                  <div className="vpa-field-row">
                    <code className="vpa-text">{upiId}</code>
                    <button type="button" className="btn-copy-vpa" onClick={handleCopyUpi}>
                      <Copy size={13} />
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="payee-name-tag">Beneficiary: <strong>{settings.merchantName}</strong></p>
                  <p className="exact-amount-tag">Exact Amount: <strong>₹{checkoutData.grandTotal.toLocaleString('en-IN')}</strong></p>
                </div>
              </div>

              <div className="utr-input-group mt-6">
                <label htmlFor="ret-utr" className="input-field-label">
                  Enter 12-Digit Commercial UPI Transaction UTR / Ref ID
                  <span className="required-star">*</span>
                </label>
                <input
                  id="ret-utr"
                  type="text"
                  placeholder="e.g. 423189012345 or UPI-PHONEPE-902"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="input-field-control"
                />
              </div>
            </div>
          )}

          {paymentMode === 'UPI_ON_DELIVERY' && (
            <div className="uod-content mt-6">
              <div className="uod-highlight-card">
                <div className="uod-icon-circle">
                  <QrCode size={36} className="text-gold" />
                </div>
                <h4>Store Handover via Dynamic UPI QR</h4>
                <p>
                  Your store consignment will be dispatched via Delhivery Express B2B. Upon arrival at your retail boutique, our freight associate will present an <strong>authenticated dynamic UPI QR code</strong> on their handheld terminal.
                </p>
                <div className="alert-important-box mt-3">
                  <strong>Notice:</strong> Physical cash currency cannot be accepted by freight drivers. Please ensure an authorized store associate with UPI app is present.
                </div>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="auth-alert-box alert-danger mt-4">
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="button"
            className="btn-primary-navy block-btn py-3 mt-6"
            disabled={isProcessing}
            onClick={handleCompleteOrder}
          >
            {isProcessing ? (
              <span className="btn-spinner-wrap">
                <span className="spinner-dot"></span> Verifying Commercial Settlement...
              </span>
            ) : paymentMode === 'ONLINE_UPI' ? (
              <span>Confirm Verified B2B Settlement</span>
            ) : (
              <span>Confirm Consignment with UPI on Delivery</span>
            )}
          </button>
        </div>

        <div className="payment-side-col">
          <div className="order-summary-card">
            <h3>Invoice Snapshot</h3>
            <div className="summary-calc-rows">
              <div className="summary-row"><span>Billed To:</span> <strong>{checkoutData.businessName}</strong></div>
              <div className="summary-row"><span>GSTIN:</span> <strong>{checkoutData.gstin}</strong></div>
              <div className="summary-row"><span>Subtotal:</span> <strong>₹{checkoutData.subtotal.toLocaleString('en-IN')}</strong></div>
              <div className="summary-row"><span>GST (5%):</span> <strong>₹{checkoutData.gstTax.toLocaleString('en-IN')}</strong></div>
              <div className="summary-row grand-total"><span>Total Payable:</span> <strong>₹{checkoutData.grandTotal.toLocaleString('en-IN')}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
