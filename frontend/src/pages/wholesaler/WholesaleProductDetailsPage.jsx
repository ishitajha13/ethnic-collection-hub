import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { StoreService } from '../../services/storeService';
import { calculateWholesaleTier } from '../../services/businessService';
import {
  Package,
  Layers,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export default function WholesaleProductDetailsPage() {
  const { id } = useParams();
  const products = StoreService.getProducts();
  const product = products.find((p) => p.id === id) || products[0];

  const [activeImg, setActiveImg] = useState(0);
  const [setsCount, setSetsCount] = useState(12); // Mandatory MOQ default
  const [toastMsg, setToastMsg] = useState('');

  const tierInfo = calculateWholesaleTier(setsCount);

  // Dynamic set price based on slab
  const getUnitSetPrice = () => {
    if (setsCount >= 36) return Math.round(product.wholesalePricePerSet * 0.90);
    if (setsCount >= 24) return Math.round(product.wholesalePricePerSet * 0.95);
    return product.wholesalePricePerSet;
  };

  const currentSetPrice = getUnitSetPrice();
  const totalAmount = currentSetPrice * setsCount;
  const totalPieces = setsCount * product.piecesPerSet;

  const handleAddWholesaleCart = () => {
    if (setsCount < 12) {
      alert('Wholesale orders strictly require a minimum of 12 sets.');
      return;
    }

    const cart = StoreService.getCart('Wholesaler');
    const existingIndex = cart.findIndex((i) => i.productId === product.id);

    if (existingIndex !== -1) {
      cart[existingIndex].quantitySets = (cart[existingIndex].quantitySets || 0) + setsCount;
      cart[existingIndex].unitPricePerSet = currentSetPrice;
      cart[existingIndex].totalPrice = cart[existingIndex].quantitySets * currentSetPrice;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        sku: product.sku,
        image: product.images[0],
        fabric: product.fabric,
        piecesPerSet: product.piecesPerSet,
        quantitySets: setsCount,
        unitPricePerSet: currentSetPrice,
        totalPrice: totalAmount,
      });
    }

    StoreService.saveCart('Wholesaler', cart);
    setToastMsg(`Added ${setsCount} Sets (${totalPieces} pieces) to Wholesale Cart!`);
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <DashboardLayout
      title={`Wholesale Set Procurement • ${product.name}`}
      subtitle={`SKU: ${product.sku} • Mandatory Minimum: 12 Clothing Sets`}
    >
      <Link to="/wholesaler/catalogue" className="back-link mb-4">
        <ArrowLeft size={16} />
        <span>Back to Wholesale Catalogue</span>
      </Link>

      {toastMsg && (
        <div className="auth-alert-box alert-success mb-4">
          <CheckCircle2 size={18} />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="product-details-grid">
        {/* Left Column: Media */}
        <div className="product-gallery-column">
          <div className="main-zoom-image-wrapper">
            <img src={product.images[activeImg] || product.images[0]} alt={product.name} className="main-view-image" />
          </div>
          {product.images.length > 1 && (
            <div className="gallery-thumbs-row">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  className={`thumb-button ${activeImg === i ? 'active-thumb' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt="" className="thumb-img" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Pricing & Slabs */}
        <div className="product-info-column">
          <span className="cat-accent-pill">{product.categoryName}</span>
          <h1 className="product-main-name">{product.name}</h1>
          <p className="product-fabric-highlight">Fabric: <strong>{product.fabric}</strong></p>
          <p className="product-lead-description">{product.description}</p>

          {/* Wholesale Pricing Box */}
          <div className="product-pricing-card border-gold">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">Current Set Price ({tierInfo.badge}):</span>
              <strong className="text-2xl font-bold text-navy">₹{currentSetPrice.toLocaleString('en-IN')}</strong>
            </div>

            <div className="piece-breakdown-row text-xs text-muted mb-3">
              <span>1 Set = <strong>{product.piecesPerSet} pieces</strong> (assorted colors/sizes)</span>
              <span>≈ <strong>₹{Math.round(currentSetPrice / product.piecesPerSet).toLocaleString('en-IN')}</strong> / piece</span>
            </div>

            {/* Set Stepper */}
            <div className="quantity-order-row">
              <div className="qty-control-box">
                <label className="qty-label">Order Quantity (Sets):</label>
                <div className="qty-stepper">
                  <button
                    type="button"
                    onClick={() => setSetsCount((s) => Math.max(12, s - 1))}
                    disabled={setsCount <= 12}
                    className="stepper-btn"
                  >
                    -
                  </button>
                  <span className="stepper-value">{setsCount} Sets</span>
                  <button type="button" onClick={() => setSetsCount((s) => s + 1)} className="stepper-btn">
                    +
                  </button>
                </div>
              </div>

              <div className="total-calculation-box">
                <span className="total-label">Total Pieces:</span>
                <span className="font-bold text-navy">{totalPieces} pcs</span>
              </div>
            </div>

            <div className="total-payable-strip mt-3 pt-3 border-t flex justify-between items-center">
              <span className="font-semibold">Consignment Subtotal:</span>
              <strong className="text-xl text-navy">₹{totalAmount.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          {/* Volume Slab Matrix */}
          <div className="slabs-matrix-card mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Layers size={18} className="text-gold" />
              <h4 className="font-bold text-sm">Wholesale Slab Structure:</h4>
            </div>
            <div className="slabs-mini-table">
              <div className={`slab-mini-row ${setsCount >= 12 && setsCount <= 23 ? 'active-slab' : ''}`}>
                <span>12 – 23 Sets:</span>
                <strong>Base Wholesale Rate</strong>
              </div>
              <div className={`slab-mini-row ${setsCount >= 24 && setsCount <= 35 ? 'active-slab' : ''}`}>
                <span>24 – 35 Sets:</span>
                <strong className="text-green">5% Bulk Rebate Applied</strong>
              </div>
              <div className={`slab-mini-row ${setsCount >= 36 ? 'active-slab' : ''}`}>
                <span>36+ Sets:</span>
                <strong className="text-gold font-bold">10% Master Volume Rebate</strong>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-primary-navy block-btn py-3 mt-6"
            onClick={handleAddWholesaleCart}
          >
            <ShoppingBag size={18} />
            <span>Add {setsCount} Sets ({totalPieces} pieces) to Wholesale Cart</span>
          </button>

          {/* Policy */}
          <div className="details-trust-grid mt-6">
            <div className="trust-item">
              <Package size={18} className="text-gold" />
              <div>
                <strong>Commercial Bale Strapping</strong>
                <span>Reinforced carton packing for heavy transit</span>
              </div>
            </div>
            <div className="trust-item">
              <RotateCcw size={18} className="text-gold" />
              <div>
                <strong>5-Day Defect Window</strong>
                <span>Transit damage claims accepted within 5 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
