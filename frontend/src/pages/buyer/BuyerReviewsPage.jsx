import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { StoreService } from '../../services/storeService';
import { getCurrentSession } from '../../services/authService';
import { Star, CheckCircle2, MessageSquare, Plus } from 'lucide-react';

export default function BuyerReviewsPage() {
  const session = getCurrentSession();
  const [reviews, setReviews] = useState(() => StoreService.getReviews());
  const products = StoreService.getProducts();

  const [isWriting, setIsWriting] = useState(false);
  const [newReview, setNewReview] = useState({
    productId: products[0]?.id || '',
    rating: 5,
    comment: ''
  });
  const [successMsg, setSuccessMsg] = useState('');

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const created = {
      id: 'REV-' + Date.now(),
      productId: newReview.productId,
      userId: session?.id || 'current',
      userName: session?.name || 'Verified Buyer',
      rating: Number(newReview.rating),
      comment: newReview.comment.trim(),
      createdAt: new Date().toISOString(),
      verifiedPurchase: true,
    };

    const updated = [created, ...reviews];
    setReviews(updated);
    StoreService.setReviews(updated);
    setIsWriting(false);
    setNewReview({ productId: products[0]?.id || '', rating: 5, comment: '' });
    setSuccessMsg('Thank you! Your verified artisan review has been published.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <DashboardLayout
      title="My Reviews & Handloom Feedback"
      subtitle="Share your authentic styling experiences and rate artisan weaves."
    >
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted">You have submitted {reviews.length} couture reviews.</p>
        <button
          type="button"
          className="btn-primary-navy"
          onClick={() => setIsWriting(!isWriting)}
        >
          <Plus size={16} />
          <span>{isWriting ? 'Cancel Review' : 'Write Product Review'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="auth-alert-box alert-success mb-6">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {isWriting && (
        <div className="write-review-card mb-6">
          <h3>Write a Verified Customer Review</h3>
          <form onSubmit={handleReviewSubmit} className="mt-4">
            <div className="form-field-unit">
              <label className="input-field-label">Select Purchased Item</label>
              <select
                value={newReview.productId}
                onChange={(e) => setNewReview({ ...newReview, productId: e.target.value })}
                className="input-field-control"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.categoryName})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field-unit">
              <label className="input-field-label">Rating</label>
              <div className="star-rating-select flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="star-btn"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                  >
                    <Star
                      size={24}
                      fill={star <= newReview.rating ? '#D6A12B' : 'none'}
                      color={star <= newReview.rating ? '#D6A12B' : '#ccc'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="form-field-unit">
              <label className="input-field-label">Your Experience & Fabric Quality</label>
              <textarea
                rows="4"
                required
                placeholder="Share your thoughts on the drape, zari luster, occasion fit, and craftsmanship..."
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="input-field-control"
              ></textarea>
            </div>

            <button type="submit" className="btn-primary-navy mt-4">
              Publish Verified Review
            </button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-list-stack">
        {reviews.map((rev) => {
          const product = products.find((p) => p.id === rev.productId);
          return (
            <div key={rev.id} className="review-card">
              <div className="review-card-top flex justify-between items-center mb-2">
                <div>
                  <h4 className="font-bold text-base">{product?.name || 'Ethnic Garment'}</h4>
                  <span className="text-xs text-muted">
                    Reviewed on {new Date(rev.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <div className="review-stars-row flex items-center gap-1">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} size={15} fill="#D6A12B" color="#D6A12B" />
                  ))}
                </div>
              </div>

              <p className="review-comment text-sm">"{rev.comment}"</p>
              <div className="verified-buyer-badge-tag mt-2">
                <CheckCircle2 size={13} className="text-gold" />
                <span>Verified Buyer Purchase</span>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
