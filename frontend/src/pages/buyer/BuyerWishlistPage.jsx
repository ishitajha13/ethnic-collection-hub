import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { StoreService } from '../../services/storeService';
import { getCurrentSession } from '../../services/authService';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export default function BuyerWishlistPage() {
  const session = getCurrentSession();
  const userId = session?.id || 'current';

  const [wishlistIds, setWishlistIds] = useState(() => StoreService.getWishlist(userId));
  const products = StoreService.getProducts();
  const wishlistItems = products.filter((p) => wishlistIds.includes(p.id));

  const [toastMsg, setToastMsg] = useState('');

  const handleRemove = (productId) => {
    const updated = wishlistIds.filter((id) => id !== productId);
    setWishlistIds(updated);
    StoreService.saveWishlist(userId, updated);
  };

  const handleMoveToCart = (product) => {
    const cart = StoreService.getCart('Buyer');
    const existingIndex = cart.findIndex((i) => i.productId === product.id);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
      cart[existingIndex].totalPrice = cart[existingIndex].quantity * product.retailPrice;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        sku: product.sku,
        image: product.images[0],
        fabric: product.fabric,
        quantity: 1,
        unitPrice: product.retailPrice,
        totalPrice: product.retailPrice,
      });
    }

    StoreService.saveCart('Buyer', cart);
    handleRemove(product.id);
    setToastMsg(`Moved "${product.name}" to cart!`);
    setTimeout(() => setToastMsg(''), 2500);
  };

  return (
    <DashboardLayout
      title="Saved Haute Couture"
      subtitle="Your curated wishlist of artisan silks and bridal garments."
    >
      {toastMsg && (
        <div className="auth-alert-box alert-success mb-4">
          <span>{toastMsg}</span>
        </div>
      )}

      {wishlistItems.length > 0 ? (
        <div className="wishlist-items-grid">
          {wishlistItems.map((prod) => (
            <div key={prod.id} className="wishlist-item-card">
              <div className="wishlist-img-frame">
                <img src={prod.images[0]} alt={prod.name} className="wishlist-thumb" />
              </div>

              <div className="wishlist-body">
                <span className="cat-accent-pill">{prod.categoryName}</span>
                <h3 className="wishlist-title">
                  <Link to={`/product/${prod.id}`}>{prod.name}</Link>
                </h3>
                <p className="wishlist-fabric">{prod.fabric}</p>
                <div className="wishlist-price-tag">
                  ₹{prod.retailPrice.toLocaleString('en-IN')}
                </div>

                <div className="wishlist-actions mt-4">
                  <button
                    type="button"
                    className="btn-primary-navy add-cart-btn"
                    onClick={() => handleMoveToCart(prod)}
                  >
                    <ShoppingBag size={16} />
                    <span>Move to Cart</span>
                  </button>
                  <button
                    type="button"
                    className="btn-delete-addr"
                    onClick={() => handleRemove(prod.id)}
                    title="Remove from Wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="shop-empty-state-box">
          <Heart size={48} className="text-muted" />
          <h3>Your Wishlist is Empty</h3>
          <p>Explore our artisan handlooms and save your favourite silhouettes.</p>
          <Link to="/shop" className="btn-primary-navy mt-4">
            Discover Collections
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
}
