import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { StoreService } from '../../services/storeService';
import { getCurrentSession } from '../../services/authService';
import { Building2, Package, RotateCcw, ShieldCheck, ArrowRight } from 'lucide-react';

export default function WholesaleCheckoutPage() {
  const navigate = useNavigate();
  const session = getCurrentSession();

  const raw = sessionStorage.getItem('pending_wholesale_checkout');
  const checkoutData = raw ? JSON.parse(raw) : null;

  const [firmName, setFirmName] = useState(session?.businessName || 'Singhania Silk & Sarees Syndicate');
  const [gstin, setGstin] = useState(session?.gstin || '07AAAAA0000A1Z5');
  const [depotAddress, setDepotAddress] = useState(session?.address || 'Bale Depot 4, Gali Paranthe Wali, Chandni Chowk, Delhi 110006');
  const [policyConsent, setPolicyConsent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!checkoutData || checkoutData.totalSets < 12) {
    return (
      <DashboardLayout title="Checkout" subtitle="Wholesale Bulk Dispatch">
        <div className="text-center py-10">
          <h3 className="text-danger">Wholesale Minimum of 12 Sets Required</h3>
          <p className="text-muted mt-2">You cannot proceed to checkout without at least 12 sets in your cart.</p>
          <Link to="/wholesaler/cart" className="btn-primary-navy mt-4">Return to Cart</Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleProceed = () => {
    setErrorMsg('');
    if (!policyConsent) {
      setErrorMsg('Please acknowledge the 5-Day Transit Damage Inspection Window.');
      return;
    }

    sessionStorage.setItem('pending_wholesale_checkout', JSON.stringify({
      ...checkoutData,
      firmName,
      gstin,
      depotAddress,
    }));

    navigate('/wholesaler/payment');
  };

  return (
    <DashboardLayout
      title="Wholesale Commercial Dispatch Checkout"
      subtitle={`Verified Consignment: ${checkoutData.totalSets} Sets (${checkoutData.totalPieces} Pieces)`}
    >
      <div className="checkout-grid-layout">
        <div className="checkout-main-col">
          {/* Commercial Depot & Tax Details */}
          <div className="checkout-card">
            <div className="card-heading-row">
              <Building2 size={20} className="text-gold" />
              <h3>B2B Corporate Invoice & Dispatch Destination</h3>
            </div>

            <div className="form-row-dual mt-4">
              <div className="form-field-unit">
                <label className="input-field-label">Firm / Mill Syndicate Name</label>
                <input
                  type="text"
                  required
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  className="input-field-control"
                />
              </div>
              <div className="form-field-unit">
                <label className="input-field-label">Firm GSTIN (For Commercial ITC)</label>
                <input
                  type="text"
                  required
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="input-field-control"
                />
              </div>
            </div>

            <div className="form-field-unit">
              <label className="input-field-label">Commercial Bale Depot / Warehouse Address</label>
              <textarea
                rows="2"
                required
                value={depotAddress}
                onChange={(e) => setDepotAddress(e.target.value)}
                className="input-field-control"
              ></textarea>
            </div>
          </div>

          {/* Consignment Items */}
          <div className="checkout-card mt-6">
            <h3>Consignment Bale Manifest ({checkoutData.cart.length} lines)</h3>
            <div className="checkout-items-mini-list mt-4">
              {checkoutData.cart.map((item) => (
                <div key={item.productId} className="mini-item-row">
                  <img src={item.image} alt={item.name} className="mini-thumb" />
                  <div className="mini-meta">
                    <h4>{item.name}</h4>
                    <p>Sets: <strong>{item.quantitySets} Sets</strong> ({item.quantitySets * (item.piecesPerSet || 6)} pieces)</p>
                  </div>
                  <span className="mini-price">₹{item.totalPrice?.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5-Day Policy Agreement */}
          <div className="checkout-card mt-6 border-gold">
            <div className="policy-checkbox-container">
              <RotateCcw size={22} className="text-gold flex-shrink-0" />
              <div>
                <h4>Mandatory 5-Day Commercial Damage Window</h4>
                <p className="text-sm text-muted">
                  Wholesale returns are accepted exclusively for master bales compromised or damaged during freight transit. Defect claims must be filed within <strong>5 calendar days of carrier delivery confirmation</strong> with photos of the damaged goods and transport bill.
                </p>
                <label className="checkbox-label mt-3" htmlFor="whl-check-ack">
                  <input
                    type="checkbox"
                    id="whl-check-ack"
                    checked={policyConsent}
                    onChange={(e) => setPolicyConsent(e.target.checked)}
                    className="custom-checkbox"
                  />
                  <span className="checkbox-text font-semibold">
                    I agree to the 5-Day Freight Damage Claim Protocol.
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
            <h3>Commercial Valuation</h3>
            <div className="summary-calc-rows">
              <div className="summary-row"><span>Total Sets:</span> <strong>{checkoutData.totalSets} Sets</strong></div>
              <div className="summary-row"><span>Total Garments:</span> <strong>{checkoutData.totalPieces} Pieces</strong></div>
              <div className="summary-row"><span>Gross Valuation:</span> <strong>₹{checkoutData.grossTotal.toLocaleString('en-IN')}</strong></div>
              {checkoutData.rebateAmount > 0 && (
                <div className="summary-row text-success"><span>Volume Slab Rebate:</span> <strong>-₹{checkoutData.rebateAmount.toLocaleString('en-IN')}</strong></div>
              )}
              <div className="summary-row"><span>Freight Logistics:</span> <strong>{checkoutData.freight === 0 ? 'FREE' : `₹${checkoutData.freight}`}</strong></div>
              <div className="summary-divider"></div>
              <div className="summary-row grand-total"><span>Consignment Total:</span> <strong>₹{checkoutData.grandTotal.toLocaleString('en-IN')}</strong></div>
            </div>

            <button
              type="button"
              className="btn-primary-navy block-btn py-3 mt-6"
              onClick={handleProceed}
            >
              <span>Proceed to Wholesale UPI Payment</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
