import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AppFooter from '../../components/AppFooter';
import { StoreService } from '../../services/storeService';
import { getCurrentSession } from '../../services/authService';
import {
  QrCode,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function BuyerPaymentPage() {
  const navigate = useNavigate();
  const session = getCurrentSession();

  // Retrieve pending checkout details
  const rawCheckout = sessionStorage.getItem('pending_checkout');
  const checkoutData = rawCheckout ? JSON.parse(rawCheckout) : null;

  const settings = StoreService.getAdminSettings();
  const upiId = settings.merchantUpiVpa || 'pay.ethniccollectionhub@okhdfcbank';

  const [paymentMode, setPaymentMode] = useState('ONLINE_UPI'); // 'ONLINE_UPI' | 'UPI_ON_DELIVERY'
  const [transactionRef, setTransactionRef] = useState('');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!checkoutData) {
    return (
      <div className="hub-site-wrapper">
        <Navbar />
        <div className="site-container py-16 text-center">
          <h3>No active checkout session found.</h3>
          <Link to="/buyer/cart" className="btn-primary-navy mt-4">
            Return to Cart
          </Link>
        </div>
        <AppFooter />
      </div>
    );
  }

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlaceOrder = () => {
    setErrorMsg('');

    if (paymentMode === 'ONLINE_UPI') {
      if (!transactionRef.trim() || transactionRef.trim().length < 8) {
        setErrorMsg('Please enter your 12-digit UPI Transaction Ref (UTR / Reference ID) for verification.');
        return;
      }
    }

    setIsProcessing(true);

    setTimeout(() => {
      const newOrderId = 'ECH-ORD-' + Math.floor(10000 + Math.random() * 90000);
      const newOrder = {
        id: newOrderId,
        userId: session?.id || 'user_buyer_01',
        userEmail: session?.email || 'buyer@ethniccollectionhub.com',
        userName: session?.name || checkoutData.shippingAddress.fullName,
        accountType: 'Buyer',
        orderDate: new Date().toISOString(),
        deliveryDate: null,
        status: 'Confirmed',
        paymentMethod: paymentMode,
        paymentStatus: paymentMode === 'ONLINE_UPI' ? 'Paid' : 'Awaiting UPI on Delivery',
        upiTransactionId: paymentMode === 'ONLINE_UPI' ? transactionRef.trim().toUpperCase() : null,
        subtotal: checkoutData.subtotal,
        discount: 0,
        deliveryFee: checkoutData.deliveryFee,
        totalAmount: checkoutData.grandTotal,
        shippingAddress: checkoutData.shippingAddress,
        items: checkoutData.cart,
        tracking: {
          courier: 'BlueDart Express',
          trackingNumber: 'BD-DEL-' + Math.floor(1000000 + Math.random() * 9000000),
          currentStage: 'Confirmed',
          estimatedDelivery: 'In 3-4 Days',
          timeline: [
            { title: 'Order Placed & Digital Payment Verified', time: 'Just now', done: true },
            { title: 'Quality Inspection & Silk Mark Tagging', time: 'Pending', done: false },
            { title: 'Dispatched from Central Logistics Hub', time: 'Pending', done: false },
            { title: 'Out for Delivery', time: 'Pending', done: false },
            { title: 'Delivered (5-Day Damage Window Starts)', time: 'Pending', done: false },
          ]
        }
      };

      // Save order
      const existingOrders = StoreService.getOrders();
      StoreService.setOrders([newOrder, ...existingOrders]);

      // Clear buyer cart
      StoreService.saveCart('Buyer', []);
      sessionStorage.removeItem('pending_checkout');

      setIsProcessing(false);
      navigate(`/buyer/order-confirmation?id=${newOrderId}`);
    }, 1200);
  };

  return (
    <div className="hub-site-wrapper">
      <Navbar />

      <section className="payment-page-section">
        <div className="site-container">
          <div className="payment-header-bar">
            <h1 className="page-hero-title">Verified UPI Payment Gateway</h1>
            <p className="page-hero-subtitle">
              Step 2 of 2 • Total Payable: <strong>₹{checkoutData.grandTotal.toLocaleString('en-IN')}</strong>
            </p>
          </div>

          <div className="payment-layout-grid">
            <div className="payment-methods-card">
              {/* No COD Banner */}
              <div className="no-cod-banner">
                <ShieldCheck size={18} />
                <span>Zero Cash on Delivery (COD) • Verified Digital UPI Infrastructure Only</span>
              </div>

              {/* Mode Selection Tabs */}
              <div className="payment-mode-tabs mt-4">
                <button
                  type="button"
                  className={`mode-tab-btn ${paymentMode === 'ONLINE_UPI' ? 'active' : ''}`}
                  onClick={() => { setPaymentMode('ONLINE_UPI'); setErrorMsg(''); }}
                >
                  <Smartphone size={20} />
                  <div className="mode-tab-meta">
                    <span className="mode-tab-title">Option A: Online UPI</span>
                    <span className="mode-tab-sub">Pay via PhonePe, GPay, Paytm, UPI QR</span>
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
                    <span className="mode-tab-sub">Scan Dynamic QR at Doorstep</span>
                  </div>
                </button>
              </div>

              {/* ONLINE UPI TAB */}
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
                        <rect x="60" y="20" width="10" height="10" fill="#D6A12B" />
                        <rect x="75" y="35" width="10" height="10" fill="#062945" />
                        <rect x="60" y="60" width="20" height="20" fill="#D6A12B" />
                        <rect x="90" y="60" width="10" height="10" fill="#062945" />
                        <rect x="60" y="90" width="10" height="25" fill="#062945" />
                        <rect x="80" y="100" width="20" height="10" fill="#D6A12B" />
                      </svg>
                      <span className="qr-scan-hint">Scan with any UPI App</span>
                    </div>

                    <div className="upi-merchant-details">
                      <span className="vpa-label">Payee VPA:</span>
                      <div className="vpa-field-row">
                        <code className="vpa-text">{upiId}</code>
                        <button type="button" className="btn-copy-vpa" onClick={handleCopyUpi}>
                          <Copy size={13} />
                          <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="payee-name-tag">Merchant: <strong>{settings.merchantName}</strong></p>
                      <p className="exact-amount-tag">Exact Amount: <strong>₹{checkoutData.grandTotal.toLocaleString('en-IN')}</strong></p>
                    </div>
                  </div>

                  <div className="utr-input-group mt-6">
                    <label htmlFor="buyer-utr" className="input-field-label">
                      Enter 12-Digit UPI Transaction UTR / Ref ID
                      <span className="required-star">*</span>
                    </label>
                    <input
                      id="buyer-utr"
                      type="text"
                      placeholder="e.g. 423189012345 or UPI-PHONEPE-902"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      className="input-field-control"
                    />
                    <span className="input-help-text">Found in your payment app receipt upon completing the transfer.</span>
                  </div>
                </div>
              )}

              {/* UPI ON DELIVERY TAB */}
              {paymentMode === 'UPI_ON_DELIVERY' && (
                <div className="uod-content mt-6">
                  <div className="uod-highlight-card">
                    <div className="uod-icon-circle">
                      <QrCode size={36} className="text-gold" />
                    </div>
                    <h4>Doorstep Dynamic UPI QR Handover</h4>
                    <p>
                      Our BlueDart logistics associate will present an <strong>authenticated dynamic UPI QR code</strong> on their terminal when delivering your sealed couture box.
                    </p>
                    <div className="uod-steps-list my-4">
                      <div className="uod-step-item">
                        <CheckCircle2 size={16} className="text-gold" />
                        <span>Inspect the tamper-proof royal seal before initiating payment.</span>
                      </div>
                      <div className="uod-step-item">
                        <CheckCircle2 size={16} className="text-gold" />
                        <span>Scan the associate's QR code via Google Pay, PhonePe, Paytm, or BHIM.</span>
                      </div>
                      <div className="uod-step-item">
                        <CheckCircle2 size={16} className="text-gold" />
                        <span>Doorstep delivery is marked complete upon verified electronic gateway confirmation.</span>
                      </div>
                    </div>
                    <div className="alert-important-box">
                      <strong>Important:</strong> Physical cash currency cannot be accepted by courier associates under any circumstances.
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
                onClick={handlePlaceOrder}
              >
                {isProcessing ? (
                  <span className="btn-spinner-wrap">
                    <span className="spinner-dot"></span>
                    {paymentMode === 'ONLINE_UPI' ? 'Verifying Online Transaction...' : 'Generating Doorstep Dispatch Token...'}
                  </span>
                ) : paymentMode === 'ONLINE_UPI' ? (
                  <span>Verify Payment & Place Order</span>
                ) : (
                  <span>Confirm Order with UPI on Delivery</span>
                )}
              </button>
            </div>

            {/* Sidebar Summary */}
            <div className="payment-side-col">
              <div className="order-summary-card">
                <h3>Order Snapshot</h3>
                <div className="summary-calc-rows">
                  <div className="summary-row">
                    <span>Items Count:</span>
                    <strong>{checkoutData.cart.length} item(s)</strong>
                  </div>
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <strong>₹{checkoutData.subtotal.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Delivery:</span>
                    <strong>{checkoutData.deliveryFee === 0 ? 'FREE' : `₹${checkoutData.deliveryFee}`}</strong>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row grand-total">
                    <span>Total Payable:</span>
                    <strong>₹{checkoutData.grandTotal.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <div className="mt-4 border-t pt-4">
                  <span className="text-xs text-muted block mb-1">Shipping To:</span>
                  <p className="text-sm font-semibold">{checkoutData.shippingAddress.fullName}</p>
                  <p className="text-xs text-muted">{checkoutData.shippingAddress.addressLine1}, {checkoutData.shippingAddress.city} - {checkoutData.shippingAddress.pincode}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
