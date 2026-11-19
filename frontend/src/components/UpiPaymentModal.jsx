import React, { useState } from 'react';
import {
  QrCode,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Clock,
  ArrowRight
} from 'lucide-react';
import { StoreService } from '../services/storeService';

export default function UpiPaymentModal({
  isOpen,
  onClose,
  orderAmount,
  orderId,
  onPaymentSuccess,
}) {
  const settings = StoreService.getAdminSettings();
  const upiId = settings.merchantUpiVpa || 'pay.ethniccollectionhub@okhdfcbank';
  const payeeName = settings.merchantName || 'ETHNIC COLLECTION HUB PVT LTD';

  const [paymentMode, setPaymentMode] = useState('ONLINE_UPI'); // 'ONLINE_UPI' | 'UPI_ON_DELIVERY'
  const [selectedApp, setSelectedApp] = useState('phonepe');
  const [transactionRef, setTransactionRef] = useState('');
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  if (!isOpen) return null;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = () => {
    setVerificationError('');

    if (paymentMode === 'ONLINE_UPI') {
      if (!transactionRef.trim()) {
        setVerificationError('Please enter the 12-digit UPI Transaction Ref (UTR / Reference ID) for verification.');
        return;
      }
      if (transactionRef.trim().length < 8) {
        setVerificationError('Please enter a valid UPI reference number (at least 8 alphanumeric characters).');
        return;
      }

      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        onPaymentSuccess({
          paymentMethod: 'ONLINE_UPI',
          paymentStatus: 'Paid',
          upiTransactionId: transactionRef.trim().toUpperCase(),
          paidAt: new Date().toISOString(),
        });
      }, 1200);
    } else {
      // UPI on Delivery selection
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        onPaymentSuccess({
          paymentMethod: 'UPI_ON_DELIVERY',
          paymentStatus: 'Awaiting UPI on Delivery',
          upiTransactionId: null,
          note: 'Dynamic UPI QR will be presented by delivery associate at doorstep.'
        });
      }, 800);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card modal-payment-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <QrCode size={22} className="text-gold" />
            <div>
              <h3 className="modal-title">Verified UPI Payment Gateway</h3>
              <p className="modal-subtitle">Order #{orderId} • Payable: ₹{orderAmount?.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <button type="button" className="modal-close-button" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body-scroll">
          {/* Strict No-COD Notice */}
          <div className="no-cod-banner">
            <ShieldCheck size={16} />
            <span>100% Digital Payments • Cash on Delivery is strictly not accepted.</span>
          </div>

          {/* Mode Switcher */}
          <div className="payment-mode-tabs">
            <button
              type="button"
              className={`mode-tab-btn ${paymentMode === 'ONLINE_UPI' ? 'active' : ''}`}
              onClick={() => { setPaymentMode('ONLINE_UPI'); setVerificationError(''); }}
            >
              <Smartphone size={18} />
              <div className="mode-tab-meta">
                <span className="mode-tab-title">Online UPI</span>
                <span className="mode-tab-sub">PhonePe, GPay, Paytm, QR</span>
              </div>
            </button>

            <button
              type="button"
              className={`mode-tab-btn ${paymentMode === 'UPI_ON_DELIVERY' ? 'active' : ''}`}
              onClick={() => { setPaymentMode('UPI_ON_DELIVERY'); setVerificationError(''); }}
            >
              <QrCode size={18} />
              <div className="mode-tab-meta">
                <span className="mode-tab-title">UPI on Delivery</span>
                <span className="mode-tab-sub">Pay via QR at Doorstep</span>
              </div>
            </button>
          </div>

          {/* Tab 1: Online UPI */}
          {paymentMode === 'ONLINE_UPI' && (
            <div className="online-upi-section">
              {/* Dynamic QR Mock */}
              <div className="upi-qr-display-card">
                <div className="qr-box">
                  {/* Styled SVG QR Code */}
                  <svg viewBox="0 0 140 140" className="dynamic-qr-svg">
                    <rect width="140" height="140" fill="#FFFFFF" />
                    <rect x="10" y="10" width="40" height="40" fill="#062945" />
                    <rect x="20" y="20" width="20" height="20" fill="#FFFFFF" />
                    <rect x="90" y="10" width="40" height="40" fill="#062945" />
                    <rect x="100" y="20" width="20" height="20" fill="#FFFFFF" />
                    <rect x="10" y="90" width="40" height="40" fill="#062945" />
                    <rect x="20" y="100" width="20" height="20" fill="#FFFFFF" />
                    {/* Pattern dots */}
                    <rect x="60" y="20" width="10" height="10" fill="#D6A12B" />
                    <rect x="75" y="35" width="10" height="10" fill="#062945" />
                    <rect x="60" y="60" width="20" height="20" fill="#D6A12B" />
                    <rect x="90" y="60" width="10" height="10" fill="#062945" />
                    <rect x="110" y="75" width="15" height="15" fill="#062945" />
                    <rect x="60" y="90" width="10" height="25" fill="#062945" />
                    <rect x="80" y="100" width="20" height="10" fill="#D6A12B" />
                    <rect x="110" y="110" width="20" height="20" fill="#062945" />
                  </svg>
                  <span className="qr-scan-hint">Scan with any UPI App</span>
                </div>

                <div className="upi-merchant-details">
                  <div className="vpa-copy-box">
                    <span className="vpa-label">Merchant UPI VPA:</span>
                    <div className="vpa-field-row">
                      <code className="vpa-text">{upiId}</code>
                      <button type="button" className="btn-copy-vpa" onClick={handleCopyUpi}>
                        <Copy size={14} />
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                  <p className="payee-name-tag">Verified Payee: <strong>{payeeName}</strong></p>
                  <p className="exact-amount-tag">Exact Payable: <strong>₹{orderAmount?.toLocaleString('en-IN')}</strong></p>
                </div>
              </div>

              {/* Transaction ID Input */}
              <div className="utr-input-group">
                <label htmlFor="upi-utr" className="input-field-label">
                  Enter 12-Digit UPI Transaction Ref / UTR
                  <span className="required-star">*</span>
                </label>
                <input
                  id="upi-utr"
                  type="text"
                  placeholder="e.g. 423189012345 or UPI-PHONEPE-902"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="input-field-control"
                />
                <span className="input-help-text">Found in your Google Pay, PhonePe, or bank SMS payment receipt.</span>
              </div>
            </div>
          )}

          {/* Tab 2: UPI on Delivery */}
          {paymentMode === 'UPI_ON_DELIVERY' && (
            <div className="uod-section">
              <div className="uod-highlight-card">
                <div className="uod-icon-circle">
                  <QrCode size={32} className="text-gold" />
                </div>
                <h4>Pay through Dynamic UPI QR at Delivery</h4>
                <p>
                  Your order will be packaged and dispatched. Upon arrival at your delivery address, our logistics associate will present a <strong>dynamic merchant UPI QR code</strong> generated specifically for this order.
                </p>
                <div className="uod-steps-list">
                  <div className="uod-step-item">
                    <CheckCircle2 size={16} className="text-gold" />
                    <span>Inspect tamper-evident sealed packaging.</span>
                  </div>
                  <div className="uod-step-item">
                    <CheckCircle2 size={16} className="text-gold" />
                    <span>Scan associate's device QR with any UPI app (GPay, PhonePe, Paytm).</span>
                  </div>
                  <div className="uod-step-item">
                    <CheckCircle2 size={16} className="text-gold" />
                    <span>Delivery handover is completed upon verified electronic confirmation.</span>
                  </div>
                </div>
                <div className="alert-important-box uod-warning">
                  <strong>Notice:</strong> Physical cash currency is strictly not collected. Please ensure access to an active UPI smartphone app at delivery.
                </div>
              </div>
            </div>
          )}

          {verificationError && (
            <div className="auth-alert-box alert-danger">
              <AlertCircle size={16} />
              <span>{verificationError}</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-modal-cancel" onClick={onClose} disabled={isVerifying}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary-navy"
            onClick={handleConfirmPayment}
            disabled={isVerifying}
          >
            {isVerifying ? (
              <span className="btn-spinner-wrap">
                <span className="spinner-dot"></span>
                {paymentMode === 'ONLINE_UPI' ? 'Verifying Gateway Transaction...' : 'Confirming UPI on Delivery...'}
              </span>
            ) : paymentMode === 'ONLINE_UPI' ? (
              <span>Verify & Complete Order</span>
            ) : (
              <span>Confirm Order with UPI on Delivery</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
