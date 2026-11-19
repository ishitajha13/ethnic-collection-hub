import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { StoreService } from '../../services/storeService';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, RotateCcw, TrendingUp } from 'lucide-react';

export default function RetailerCartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(() => StoreService.getCart('Retailer'));

  const handleQtyChange = (productId, newQty) => {
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
    StoreService.saveCart('Retailer', updated);
  };

  const handleRemove = (productId) => {
    const updated = cartItems.filter((i) => i.productId !== productId);
    setCartItems(updated);
    StoreService.saveCart('Retailer', updated);
  };

  const subtotal = cartItems.reduce((acc, i) => acc + i.totalPrice, 0);
  const totalUnits = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const gstTax = Math.round(subtotal * 0.05); // 5% GST
  const freight = subtotal > 20000 || subtotal === 0 ? 0 : 450;
  const grandTotal = subtotal + gstTax + freight;

  return (
    <DashboardLayout
      title="Store Stock Procurement Bag"
      subtitle="Review multi-pack units and GST input credit breakdown."
    >
      {cartItems.length > 0 ? (
        <div className="cart-content-grid">
          {/* Items Column */}
          <div className="cart-items-column">
            <div className="cart-items-table-header">
              <span>Boutique Item</span>
              <span>Units</span>
              <span>Total Trade Price</span>
              <span>Action</span>
            </div>

            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.productId} className="cart-item-row">
                  <div className="cart-item-meta-cell">
                    <img src={item.image} alt={item.name} className="cart-thumb-img" />
                    <div>
                      <h4 className="cart-item-title">
                        <Link to={`/retailer/product/${item.productId}`}>{item.name}</Link>
                      </h4>
                      <p className="cart-item-spec">SKU: {item.sku} • Trade: ₹{item.unitPrice?.toLocaleString('en-IN')}/unit</p>
                    </div>
                  </div>

                  <div className="cart-qty-cell">
                    <div className="qty-stepper-compact">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item.productId, item.quantity + 1)}
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
                      onClick={() => handleRemove(item.productId)}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-policy-notice-card mt-6">
              <RotateCcw size={20} className="text-gold" />
              <div>
                <h4>5-Day B2B Transit Damage Protection</h4>
                <p>
                  Defective or transit-damaged items must be flagged within 5 days of delivery. High-resolution photographs are mandatory for direct replacement.
                </p>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="cart-summary-column">
            <div className="order-summary-card">
              <h3>B2B Commercial Tax Invoice Preview</h3>

              <div className="summary-calc-rows">
                <div className="summary-row">
                  <span>Procurement Subtotal ({totalUnits} units):</span>
                  <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
                </div>
                <div className="summary-row">
                  <span>GST (5% CGST + SGST):</span>
                  <strong>₹{gstTax.toLocaleString('en-IN')}</strong>
                </div>
                <div className="summary-row">
                  <span>Commercial Freight:</span>
                  <strong>{freight === 0 ? 'FREE (B2B Orders > ₹20k)' : `₹${freight}`}</strong>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row grand-total">
                  <span>Total Payable:</span>
                  <strong>₹{grandTotal.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <button
                type="button"
                className="btn-primary-navy block-btn py-3 mt-6"
                onClick={() => {
                  sessionStorage.setItem('pending_retailer_checkout', JSON.stringify({
                    cart: cartItems,
                    subtotal,
                    gstTax,
                    freight,
                    grandTotal,
                  }));
                  navigate('/retailer/checkout');
                }}
              >
                <span>Proceed to Commercial Checkout</span>
                <ArrowRight size={17} />
              </button>

              <div className="cashless-assurance-badge mt-4">
                <ShieldCheck size={16} className="text-gold" />
                <span>GST Tax Invoices with Full Input Credit • Online UPI & Doorstep UPI on Delivery</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="shop-empty-state-box">
          <ShoppingBag size={52} className="text-muted" />
          <h3>Retailer Bag is Empty</h3>
          <p>Browse our preferential trade catalogue to replenish store inventory.</p>
          <Link to="/retailer/catalogue" className="btn-primary-navy mt-4">
            View Retailer Catalogue
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
}
