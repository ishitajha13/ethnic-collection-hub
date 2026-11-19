import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { StoreService } from '../../services/storeService';
import { validateWholesaleCart, calculateWholesaleTier } from '../../services/businessService';
import {
  Package,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Layers
} from 'lucide-react';

export default function WholesaleCartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(() => StoreService.getCart('Wholesaler'));

  const validation = validateWholesaleCart(cartItems);
  const tierInfo = calculateWholesaleTier(validation.totalSets);

  const handleSetsChange = (productId, newSets) => {
    if (newSets < 1) return;
    const updated = cartItems.map((item) => {
      if (item.productId === productId) {
        return {
          ...item,
          quantitySets: newSets,
          totalPrice: newSets * item.unitPricePerSet,
        };
      }
      return item;
    });
    setCartItems(updated);
    StoreService.saveCart('Wholesaler', updated);
  };

  const handleRemove = (productId) => {
    const updated = cartItems.filter((i) => i.productId !== productId);
    setCartItems(updated);
    StoreService.saveCart('Wholesaler', updated);
  };

  const grossTotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const rebateAmount = tierInfo.discountPercent > 0
    ? (grossTotal * tierInfo.discountPercent) / 100
    : 0;
  const freight = grossTotal > 100000 || grossTotal === 0 ? 0 : 1500;
  const grandTotal = Math.max(0, grossTotal - rebateAmount + freight);

  return (
    <DashboardLayout
      title="Wholesale Bulk Cart & MOQ Enforcement"
      subtitle="Strict Business Rule: Minimum 12 Clothing Sets Mandatory for Commercial Dispatch"
    >
      {/* Visual MOQ Status Strip */}
      <div className={`moq-compliance-bar ${validation.isValid ? 'moq-satisfied' : 'moq-deficient'}`}>
        <div className="flex items-center gap-3">
          {validation.isValid ? (
            <CheckCircle2 size={24} className="text-success flex-shrink-0" />
          ) : (
            <AlertTriangle size={24} className="text-danger flex-shrink-0" />
          )}
          <div>
            <h4 className="font-bold">
              {validation.isValid
                ? `Wholesale Minimum Quantity Satisfied (${validation.totalSets} Sets in Cart)`
                : `Wholesale Minimum Order Quantity (MOQ) Not Met: ${validation.totalSets} / 12 Sets`}
            </h4>
            <p className="text-xs mt-0.5">
              {validation.isValid
                ? `You have qualified for ${tierInfo.tierName} (${tierInfo.badge}). Total garments: ${validation.totalPieces} pieces.`
                : `Wholesalers must purchase at least 12 clothing sets. You need ${validation.missingSets} more set${validation.missingSets === 1 ? '' : 's'} to enable checkout.`}
            </p>
          </div>
        </div>

        {!validation.isValid && (
          <Link to="/wholesaler/catalogue" className="btn-gold-action py-2 px-3 text-xs whitespace-nowrap">
            + Add {validation.missingSets} More Sets
          </Link>
        )}
      </div>

      {cartItems.length > 0 ? (
        <div className="cart-content-grid mt-6">
          {/* Items Column */}
          <div className="cart-items-column">
            <div className="cart-items-table-header">
              <span>Bale / Set Details</span>
              <span>Sets Ordered</span>
              <span>Total Price</span>
              <span>Action</span>
            </div>

            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.productId} className="cart-item-row">
                  <div className="cart-item-meta-cell">
                    <img src={item.image} alt={item.name} className="cart-thumb-img" />
                    <div>
                      <h4 className="cart-item-title">
                        <Link to={`/wholesaler/product/${item.productId}`}>{item.name}</Link>
                      </h4>
                      <p className="cart-item-spec">
                        SKU: {item.sku} • <strong>1 Set = {item.piecesPerSet || 6} pieces</strong>
                      </p>
                      <span className="cart-item-unit-price">
                        ₹{item.unitPricePerSet?.toLocaleString('en-IN')} per Set (≈ ₹{Math.round(item.unitPricePerSet / (item.piecesPerSet || 6))} / piece)
                      </span>
                    </div>
                  </div>

                  <div className="cart-qty-cell">
                    <div className="qty-stepper-compact">
                      <button
                        type="button"
                        onClick={() => handleSetsChange(item.productId, item.quantitySets - 1)}
                        disabled={item.quantitySets <= 1}
                      >
                        -
                      </button>
                      <span className="font-bold">{item.quantitySets} Sets</span>
                      <button
                        type="button"
                        onClick={() => handleSetsChange(item.productId, item.quantitySets + 1)}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-muted block mt-1">
                      = {item.quantitySets * (item.piecesPerSet || 6)} pieces
                    </span>
                  </div>

                  <div className="cart-total-cell">
                    <strong>₹{item.totalPrice?.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="cart-action-cell">
                    <button
                      type="button"
                      className="btn-remove-item"
                      onClick={() => handleRemove(item.productId)}
                      title="Remove set"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Slab Rebate Progress Card */}
            <div className="tier-progress-card mt-6 p-4 bg-warm-ivory rounded border">
              <div className="flex items-center gap-2 mb-1">
                <Layers size={18} className="text-gold" />
                <h4 className="font-bold text-sm">Volume Slab Status: {tierInfo.badge}</h4>
              </div>
              {tierInfo.nextTierGoal && (
                <p className="text-xs text-muted">
                  Add <strong>{tierInfo.nextTierGoal.setsNeeded} more sets</strong> to reach next tier and unlock {tierInfo.nextTierGoal.discount} volume rebate!
                </p>
              )}
            </div>

            <div className="cart-policy-notice-card mt-4">
              <RotateCcw size={20} className="text-gold" />
              <div>
                <h4>5-Day Commercial Transit Damage Protection</h4>
                <p>
                  Defective master bales or transit tearing must be reported within 5 days of delivery.
                </p>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="cart-summary-column">
            <div className="order-summary-card">
              <h3>Wholesale Dispatch Valuation</h3>

              <div className="summary-calc-rows">
                <div className="summary-row">
                  <span>Total Sets in Cart:</span>
                  <strong className={validation.isValid ? 'text-success' : 'text-danger'}>
                    {validation.totalSets} Sets ({validation.totalPieces} pcs)
                  </strong>
                </div>

                <div className="summary-row">
                  <span>Gross Valuation:</span>
                  <strong>₹{grossTotal.toLocaleString('en-IN')}</strong>
                </div>

                {rebateAmount > 0 && (
                  <div className="summary-row text-success">
                    <span>Volume Slab Rebate ({tierInfo.discountPercent}%):</span>
                    <strong>-₹{rebateAmount.toLocaleString('en-IN')}</strong>
                  </div>
                )}

                <div className="summary-row">
                  <span>Commercial Pallet Freight:</span>
                  <strong>{freight === 0 ? 'FREE (Bale Orders > ₹1 Lakh)' : `₹${freight}`}</strong>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row grand-total">
                  <span>Consignment Total:</span>
                  <strong>₹{grandTotal.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Checkout Button with Strict MOQ Disable State */}
              <button
                type="button"
                className={`btn-primary-navy block-btn py-3 mt-6 ${!validation.isValid ? 'btn-disabled cursor-not-allowed opacity-50' : ''}`}
                disabled={!validation.isValid}
                onClick={() => {
                  sessionStorage.setItem('pending_wholesale_checkout', JSON.stringify({
                    cart: cartItems,
                    totalSets: validation.totalSets,
                    totalPieces: validation.totalPieces,
                    grossTotal,
                    rebateAmount,
                    freight,
                    grandTotal,
                  }));
                  navigate('/wholesaler/checkout');
                }}
              >
                <span>
                  {validation.isValid
                    ? 'Proceed to Wholesale Checkout'
                    : `Checkout Disabled (Need 12 Sets)`}
                </span>
                <ArrowRight size={17} />
              </button>

              {!validation.isValid && (
                <p className="text-danger text-xs text-center mt-2">
                  System strictly blocks checkout below 12 clothing sets.
                </p>
              )}

              <div className="cashless-assurance-badge mt-4">
                <ShieldCheck size={16} className="text-gold" />
                <span>Online UPI & Doorstep UPI on Delivery • No Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="shop-empty-state-box">
          <Package size={52} className="text-muted" />
          <h3>Wholesale Cart is Empty</h3>
          <p>Browse our manufacturer catalogue to select clothing sets (MOQ 12 sets).</p>
          <Link to="/wholesaler/catalogue" className="btn-primary-navy mt-4">
            Browse Wholesale Sets
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
}
