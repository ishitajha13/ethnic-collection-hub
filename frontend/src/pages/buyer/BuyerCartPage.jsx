import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AppFooter from '../../components/AppFooter';
import { StoreService } from '../../services/storeService';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Tag,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function BuyerCartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(() => StoreService.getCart('Buyer'));
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const coupons = StoreService.getCoupons();

  const handleQuantityChange = (productId, newQty) => {
    if (newQty < 1) return;
    const updated = cartItems.map((item) => {
      if (item.productId === productId) {
        return {
          ...item,
          quantity: newQty,
          totalPrice: newQty * item.unitPrice,
        };
      }
      return item;
    });
    setCartItems(updated);
    StoreService.saveCart('Buyer', updated);
  };

  const handleRemoveItem = (productId) => {
    const updated = cartItems.filter((item) => item.productId !== productId);
    setCartItems(updated);
    StoreService.saveCart('Buyer', updated);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const found = coupons.find((c) => c.code.toUpperCase() === couponCode.trim().toUpperCase());

    if (!found) {
      setCouponError('Invalid coupon code. Try "ROYAL10".');
      return;
    }
    if (subtotal < found.minOrder) {
      setCouponError(`Coupon requires minimum order of ₹${found.minOrder.toLocaleString('en-IN')}.`);
      return;
    }
    setAppliedCoupon(found);
    setCouponCode('');
  };

  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;
  const deliveryFee = subtotal > 1999 || subtotal === 0 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  return (
    <div className="hub-site-wrapper">
      <Navbar />

      <section className="cart-page-section">
        <div className="site-container">
          <div className="cart-page-header">
            <h1 className="page-hero-title">Buyer Shopping Bag</h1>
            <p className="page-hero-subtitle">
              Review your luxury ethnic garments before proceeding to secure payment.
            </p>
          </div>

          {cartItems.length > 0 ? (
            <div className="cart-content-grid">
              {/* Items Column */}
              <div className="cart-items-column">
                <div className="cart-items-table-header">
                  <span>Product Details</span>
                  <span>Quantity</span>
                  <span>Total</span>
                  <span>Action</span>
                </div>

                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="cart-item-row">
                      <div className="cart-item-meta-cell">
                        <img src={item.image} alt={item.name} className="cart-thumb-img" />
                        <div>
                          <h4 className="cart-item-title">
                            <Link to={`/product/${item.productId}`}>{item.name}</Link>
                          </h4>
                          <p className="cart-item-spec">SKU: {item.sku} {item.color ? `• ${item.color}` : ''}</p>
                          <span className="cart-item-unit-price">₹{item.unitPrice?.toLocaleString('en-IN')} each</span>
                        </div>
                      </div>

                      <div className="cart-qty-cell">
                        <div className="qty-stepper-compact">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="cart-total-cell">
                        <strong>₹{item.totalPrice?.toLocaleString('en-IN')}</strong>
                      </div>

                      <div className="cart-action-cell">
                        <button
                          type="button"
                          className="btn-remove-item"
                          onClick={() => handleRemoveItem(item.productId)}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Return Policy Reminder */}
                <div className="cart-policy-notice-card mt-6">
                  <RotateCcw size={20} className="text-gold" />
                  <div>
                    <h4>Strict 5-Day Damage Return Policy</h4>
                    <p>
                      Returns are accepted strictly for clothing that arrives damaged during transit. You must report any damage within 5 days of delivery with photo proof.
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Column */}
              <div className="cart-summary-column">
                <div className="order-summary-card">
                  <h3>Order Financial Summary</h3>

                  <div className="summary-calc-rows">
                    <div className="summary-row">
                      <span>Bag Subtotal:</span>
                      <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
                    </div>

                    {appliedCoupon && (
                      <div className="summary-row text-success">
                        <span>Coupon ({appliedCoupon.code}):</span>
                        <strong>-₹{discountAmount.toLocaleString('en-IN')}</strong>
                      </div>
                    )}

                    <div className="summary-row">
                      <span>Delivery / Dispatch:</span>
                      <strong>{deliveryFee === 0 ? 'FREE (Orders > ₹1,999)' : `₹${deliveryFee}`}</strong>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-row grand-total">
                      <span>Final Payable:</span>
                      <strong>₹{grandTotal.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  {/* Coupon Form */}
                  <form onSubmit={handleApplyCoupon} className="coupon-apply-form mt-4">
                    <div className="coupon-input-wrap">
                      <Tag size={16} className="coupon-tag-icon" />
                      <input
                        type="text"
                        placeholder="Coupon (e.g. ROYAL10)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="coupon-input"
                      />
                    </div>
                    <button type="submit" className="btn-coupon-apply">Apply</button>
                  </form>

                  {couponError && <p className="text-danger text-xs mt-1">{couponError}</p>}
                  {appliedCoupon && <p className="text-success text-xs mt-1">✓ {appliedCoupon.description}</p>}

                  {/* Checkout CTA */}
                  <button
                    type="button"
                    className="btn-primary-navy block-btn py-3 mt-6"
                    onClick={() => navigate('/buyer/checkout')}
                  >
                    <span>Proceed to Delivery & Address</span>
                    <ArrowRight size={17} />
                  </button>

                  <div className="cashless-assurance-badge mt-4">
                    <ShieldCheck size={16} className="text-gold" />
                    <span>Online UPI & UPI on Delivery • No Cash on Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="shop-empty-state-box">
              <ShoppingBag size={52} className="text-muted" />
              <h3>Your Shopping Bag is Empty</h3>
              <p>Explore our handcrafted sarees, lehengas, and festival kurtis.</p>
              <Link to="/shop" className="btn-primary-navy mt-4">
                Shop Collections Now
              </Link>
            </div>
          )}
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
