import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { StoreService } from '../../services/storeService';
import { getCurrentSession } from '../../services/authService';
import { QrCode, Smartphone, ShieldCheck, CheckCircle2, Copy, AlertCircle, Package } from 'lucide-react';

export default function WholesalePaymentPage() {
  const navigate = useNavigate();
  const session = getCurrentSession();

  const raw = sessionStorage.getItem('pending_wholesale_checkout');
  const checkoutData = raw ? JSON.parse(raw) : null;

  const settings = StoreService.getAdminSettings();
  const upiId = settings.merchantUpiVpa || 'pay.ethniccollectionhub@okhdfcbank';

  const [paymentMode, setPaymentMode] = useState('ONLINE_UPI');
  const [transactionRef, setTransactionRef] = useState('');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!checkoutData) {
    return (
      <DashboardLayout title="Payment" subtitle="Wholesale Gateway">
        <div className="text-center py-10">
          <h3>No active wholesale checkout session.</h3>
          <Link to="/wholesaler/cart" className="btn-primary-navy mt-4">Return to Cart</Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCompleteWholesaleOrder = () => {
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
        userId: session?.id || 'user_wholesaler_01',
        userEmail: session?.email || 'wholesaler@ethniccollectionhub.com',
        userName: checkoutData.firmName || session?.businessName || 'Singhania Syndicate',
        accountType: 'Wholesaler',
        orderDate: new Date().toISOString(),
        deliveryDate: null,
        status: 'Confirmed',
        paymentMethod: paymentMode,
        paymentStatus: paymentMode === 'ONLINE_UPI' ? 'Paid' : 'Awaiting UPI on Delivery',
        upiTransactionId: paymentMode === 'ONLINE_UPI' ? transactionRef.trim().toUpperCase() : null,
        subtotal: checkoutData.grossTotal,
        discount: checkoutData.rebateAmount,
        deliveryFee: checkoutData.freight,
        totalAmount: checkoutData.grandTotal,
        shippingAddress: {
          fullName: checkoutData.firmName,
          phone: session?.phone || '+91 98110 23456',
          addressLine1: checkoutData.depotAddress,
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110006',
        },
        items: checkoutData.cart,
        tracking: {
          courier: 'V-Trans Logistics Heavy Freight',
          trackingNumber: 'VT-CON-' + Math.floor(100000 + Math.random() * 900000),
          currentStage: 'Confirmed',
          estimatedDelivery: 'In 3-5 Commercial Days',
          timeline: [
            { title: 'Bulk Order Created & Minimum 12 Sets Validated', time: 'Just now', done: true },
            { title: 'Bale Strapping & Master Carton Palletizing', time: 'Pending', done: false },
            { title: 'Loaded onto Commercial Freight Carrier Truck', time: 'Pending', done: false },
            { title: 'Depot Handover & Verified Dynamic UPI Handover', time: 'Pending', done: false },
          ]
        }
      };

      const existing = StoreService.getOrders();
      StoreService.setOrders([newOrder, ...existing]);

      // Clear wholesale cart
      StoreService.saveCart('Wholesaler', []);
      sessionStorage.removeItem('pending_wholesale_checkout');

      setIsProcessing(false);
      navigate(`/wholesaler/orders?new=${orderId}`);
    }, 1200);
  };

  return (
    <DashboardLayout
      title="Commercial High-Limit UPI Gateway"
      subtitle={`Consignment Valuation: ₹${checkoutData.grandTotal.toLocaleString('en-IN')} (${checkoutData.totalSets} Sets)`}
    >
      <div className="payment-layout-grid">
        <div className="payment-methods-card">
          <div className="no-cod-banner">
            <ShieldCheck size={18} />
            <span>Zero Cash on Delivery • 100% Verified Digital Wholesale Settlement</span>
          </div>

          <div className="payment-mode-tabs mt-4">
            <button
              type="button"
              className={`mode-tab-btn ${paymentMode === 'ONLINE_UPI' ? 'active' : ''}`}
              onClick={() => { setPaymentMode('ONLINE_UPI'); setErrorMsg(''); }}
            >
              <Smartphone size={20} />
              <div className="mode-tab-meta">
                <span className="mode-tab-title">Option A: Online Corporate UPI</span>
                <span className="mode-tab-sub">Immediate Bank RTGS / High-Limit UPI</span>
              </div>
            </button>

            <button
              type="button"
              className={`mode-tab-btn ${paymentMode === 'UPI_ON_DELIVERY' ? 'active' : ''}`}
              onClick={() => { setPaymentMode('UPI_ON_DELIVERY'); setErrorMsg(''); }}
            >
              <QrCode size={20} />
              <div className="mode-tab-meta">
                <span className="mode-tab-title">Option B: Dynamic UPI on Delivery</span>
                <span className="mode-tab-sub">Scan Freight Driver QR at Depot</span>
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
                  <span className="qr-scan-hint">Commercial Merchant QR</span>
                </div>

                <div className="upi-merchant-details">
                  <span className="vpa-label">Corporate UPI VPA:</span>
                  <div className="vpa-field-row">
                    <code className="vpa-text">{upiId}</code>
                    <button type="button" className="btn-copy-vpa" onClick={handleCopyUpi}>
                      <Copy size={13} />
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="payee-name-tag">Beneficiary: <strong>{settings.merchantName}</strong></p>
                  <p className="exact-amount-tag">Exact Valuation: <strong>₹{checkoutData.grandTotal.toLocaleString('en-IN')}</strong></p>
                </div>
              </div>

              <div className="utr-input-group mt-6">
                <label htmlFor="whl-utr" className="input-field-label">
                  Enter 12-Digit Commercial UPI Transaction UTR / Ref ID
                  <span className="required-star">*</span>
                </label>
                <input
                  id="whl-utr"
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
                <h4>Depot Freight Delivery via Dynamic UPI QR</h4>
                <p>
                  Your master bale shipment will be delivered via V-Trans Heavy Freight. Upon unloading at your commercial warehouse, our freight logistics supervisor will present a <strong>dynamic merchant UPI QR code</strong> for electronic settlement.
                </p>
                <div className="alert-important-box mt-3">
                  <strong>Notice:</strong> Physical currency/cash is strictly prohibited. Handover occurs upon electronic gateway confirmation.
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
            onClick={handleCompleteWholesaleOrder}
          >
            {isProcessing ? (
              <span className="btn-spinner-wrap">
                <span className="spinner-dot"></span> Authorizing B2B Freight Settlement...
              </span>
            ) : paymentMode === 'ONLINE_UPI' ? (
              <span>Confirm Verified Wholesale Settlement</span>
            ) : (
              <span>Authorize Dispatch with UPI on Delivery</span>
            )}
          </button>
        </div>

        <div className="payment-side-col">
          <div className="order-summary-card">
            <h3>Bale Manifest Valuation</h3>
            <div className="summary-calc-rows">
              <div className="summary-row"><span>Firm:</span> <strong>{checkoutData.firmName}</strong></div>
              <div className="summary-row"><span>GSTIN:</span> <strong>{checkoutData.gstin}</strong></div>
              <div className="summary-row"><span>Sets Count:</span> <strong>{checkoutData.totalSets} Sets</strong></div>
              <div className="summary-row"><span>Garments:</span> <strong>{checkoutData.totalPieces} Pieces</strong></div>
              <div className="summary-row grand-total"><span>Total Payable:</span> <strong>₹{checkoutData.grandTotal.toLocaleString('en-IN')}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
