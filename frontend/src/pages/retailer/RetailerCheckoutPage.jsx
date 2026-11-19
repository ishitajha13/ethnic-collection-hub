import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { StoreService } from '../../services/storeService';
import { getCurrentSession } from '../../services/authService';
import { Building2, MapPin, ShieldCheck, RotateCcw, ArrowRight } from 'lucide-react';

export default function RetailerCheckoutPage() {
  const navigate = useNavigate();
  const session = getCurrentSession();

  const rawCheckout = sessionStorage.getItem('pending_retailer_checkout');
  const checkoutData = rawCheckout ? JSON.parse(rawCheckout) : null;

  const [businessName, setBusinessName] = useState(session?.businessName || 'Ananya Bridal & Couture Boutique');
  const [gstin, setGstin] = useState(session?.gstin || '27BBBBB1111B1Z9');
  const [shippingAddress, setShippingAddress] = useState(session?.address || 'Shop 12, Ground Floor, Phoenix Marketcity, Kurla, Mumbai 400070');
  const [policyConsent, setPolicyConsent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!checkoutData) {
    return (
      <DashboardLayout title="Checkout" subtitle="Commercial Procurement">
        <div className="text-center py-10">
          <h3>No active procurement cart found.</h3>
          <Link to="/retailer/cart" className="btn-primary-navy mt-4">Return to Cart</Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleProceed = () => {
    setErrorMsg('');
    if (!policyConsent) {
      setErrorMsg('Please confirm acknowledgement of the 5-Day Transit Damage Return Policy.');
      return;
    }

    sessionStorage.setItem('pending_retailer_checkout', JSON.stringify({
      ...checkoutData,
      businessName,
      gstin,
      shippingAddress,
    }));

    navigate('/retailer/payment');
  };

  return (
    <DashboardLayout
      title="Commercial Procurement Checkout"
      subtitle="Confirm boutique GSTIN and commercial dispatch destination."
    >
      <div className="checkout-grid-layout">
        <div className="checkout-main-col">
          {/* GSTIN & Firm Card */}
          <div className="checkout-card">
            <div className="card-heading-row">
              <Building2 size={20} className="text-gold" />
              <h3>B2B Tax Invoice Billing Credentials</h3>
            </div>

            <div className="form-row-dual mt-4">
              <div className="form-field-unit">
                <label className="input-field-label">Registered Enterprise / Store Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="input-field-control"
                  required
                />
              </div>
              <div className="form-field-unit">
                <label className="input-field-label">GSTIN (For Tax Credit)</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="input-field-control"
                  required
                />
              </div>
            </div>

            <div className="form-field-unit">
              <label className="input-field-label">Store Delivery Address</label>
              <textarea
                rows="2"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="input-field-control"
                required
              ></textarea>
            </div>
          </div>

          {/* Policy Consent */}
          <div className="checkout-card mt-6 border-gold">
            <div className="policy-checkbox-container">
              <RotateCcw size={22} className="text-gold flex-shrink-0" />
              <div>
                <h4>5-Day B2B Transit Damage Policy Agreement</h4>
                <p className="text-sm text-muted">
                  Commercial inventory returns are accepted exclusively for items arriving structurally damaged during transit. You must report damages within 5 days of delivery with photos of the damaged items and consignment packing.
                </p>
                <label className="checkbox-label mt-3" htmlFor="ret-check-ack">
                  <input
                    type="checkbox"
                    id="ret-check-ack"
                    checked={policyConsent}
                    onChange={(e) => setPolicyConsent(e.target.checked)}
                    className="custom-checkbox"
                  />
                  <span className="checkbox-text font-semibold">
                    I acknowledge and agree to the 5-Day Damage Inspection Window.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="auth-alert-box alert-danger mt-4">
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Financial Summary */}
        <div className="checkout-side-col">
          <div className="order-summary-card">
            <h3>Consignment Value</h3>
            <div className="summary-calc-rows">
              <div className="summary-row">
                <span>Items Subtotal:</span>
                <strong>₹{checkoutData.subtotal.toLocaleString('en-IN')}</strong>
              </div>
              <div className="summary-row">
                <span>GST (5%):</span>
                <strong>₹{checkoutData.gstTax.toLocaleString('en-IN')}</strong>
              </div>
              <div className="summary-row">
                <span>Freight:</span>
                <strong>{checkoutData.freight === 0 ? 'FREE' : `₹${checkoutData.freight}`}</strong>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row grand-total">
                <span>Total Payable:</span>
                <strong>₹{checkoutData.grandTotal.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary-navy block-btn py-3 mt-6"
              onClick={handleProceed}
            >
              <span>Proceed to UPI Payment</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
