import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AppFooter from '../../components/AppFooter';
import { StoreService } from '../../services/storeService';
import { getCurrentSession } from '../../services/authService';
import {
  MapPin,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  Plus
} from 'lucide-react';

export default function BuyerCheckoutPage() {
  const navigate = useNavigate();
  const session = getCurrentSession();
  const userId = session?.id || 'current';

  const cart = StoreService.getCart('Buyer');
  const addresses = StoreService.getAddresses(userId);

  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || ''
  );
  const [returnPolicyAcknowledged, setReturnPolicyAcknowledged] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const deliveryFee = subtotal > 1999 ? 0 : 99;
  const grandTotal = subtotal + deliveryFee;

  const handleProceedToPayment = () => {
    setErrorMsg('');

    if (!selectedAddressId) {
      setErrorMsg('Please select a shipping delivery address.');
      return;
    }

    if (!returnPolicyAcknowledged) {
      setErrorMsg('Please acknowledge the 5-day damage return policy to proceed.');
      return;
    }

    // Save pending checkout payload in sessionStorage
    const selectedAddr = addresses.find((a) => a.id === selectedAddressId);
    sessionStorage.setItem('pending_checkout', JSON.stringify({
      accountType: 'Buyer',
      cart,
      subtotal,
      deliveryFee,
      grandTotal,
      shippingAddress: selectedAddr,
    }));

    navigate('/buyer/payment');
  };

  return (
    <div className="hub-site-wrapper">
      <Navbar />

      <section className="checkout-page-section">
        <div className="site-container">
          <div className="checkout-header-bar">
            <h1 className="page-hero-title">Shipping & Order Review</h1>
            <p className="page-hero-subtitle">Step 1 of 2 • Confirm your delivery destination</p>
          </div>

          <div className="checkout-grid-layout">
            {/* Address Selection */}
            <div className="checkout-main-col">
              <div className="checkout-card">
                <div className="card-heading-row">
                  <MapPin size={20} className="text-gold" />
                  <h3>Select Delivery Address</h3>
                </div>

                <div className="checkout-addresses-grid mt-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`checkout-addr-card ${selectedAddressId === addr.id ? 'selected' : ''}`}
                      onClick={() => setSelectedAddressId(addr.id)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <strong>{addr.fullName}</strong>
                        <span className="addr-tag">{addr.type}</span>
                      </div>
                      <p className="addr-line">{addr.addressLine1}</p>
                      <p className="addr-line">{addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="addr-phone">Phone: {addr.phone}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <Link to="/buyer/addresses" className="add-new-addr-link">
                    <Plus size={14} />
                    <span>Manage or Add New Address</span>
                  </Link>
                </div>
              </div>

              {/* Items Review */}
              <div className="checkout-card mt-6">
                <h3>Review Items in Bag ({cart.length})</h3>
                <div className="checkout-items-mini-list mt-4">
                  {cart.map((item) => (
                    <div key={item.productId} className="mini-item-row">
                      <img src={item.image} alt={item.name} className="mini-thumb" />
                      <div className="mini-meta">
                        <h4>{item.name}</h4>
                        <p>Quantity: {item.quantity} • SKU: {item.sku}</p>
                      </div>
                      <span className="mini-price">₹{item.totalPrice?.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strict Return Policy Mandatory Consent */}
              <div className="checkout-card mt-6 border-gold">
                <div className="policy-checkbox-container">
                  <RotateCcw size={24} className="text-gold flex-shrink-0" />
                  <div>
                    <h4>Mandatory Return Policy Consent</h4>
                    <p className="text-sm text-muted">
                      ETHNIC COLLECTION HUB accepts returns <strong>EXCLUSIVELY FOR DAMAGED CLOTHING</strong> reported within 5 days of delivery with photographic evidence. Change of mind, size selection errors, or requests after 5 days are strictly not accepted.
                    </p>
                    <label className="checkbox-label mt-3" htmlFor="checkout-policy-ack">
                      <input
                        type="checkbox"
                        id="checkout-policy-ack"
                        checked={returnPolicyAcknowledged}
                        onChange={(e) => setReturnPolicyAcknowledged(e.target.checked)}
                        className="custom-checkbox"
                      />
                      <span className="checkbox-text font-semibold">
                        I acknowledge and accept the 5-Day Damage Return Policy.
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

            {/* Price Summary & Proceed */}
            <div className="checkout-side-col">
              <div className="order-summary-card">
                <h3>Payable Summary</h3>
                <div className="summary-calc-rows">
                  <div className="summary-row">
                    <span>Items Total:</span>
                    <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Express Dispatch:</span>
                    <strong>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</strong>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row grand-total">
                    <span>Payable:</span>
                    <strong>₹{grandTotal.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-primary-navy block-btn py-3 mt-6"
                  onClick={handleProceedToPayment}
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight size={17} />
                </button>

                <div className="cashless-assurance-badge mt-4">
                  <ShieldCheck size={16} className="text-gold" />
                  <span>Online UPI & UPI on Delivery • No COD</span>
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
