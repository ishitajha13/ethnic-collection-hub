import React, { useState, useRef } from 'react';
import {
  RotateCcw,
  AlertTriangle,
  Upload,
  CheckCircle2,
  FileCheck,
  Camera,
  Calendar,
  ShieldAlert
} from 'lucide-react';
import { validateReturnRequest } from '../services/businessService';
import { StoreService } from '../services/storeService';

export default function ReturnClaimModal({ order, isOpen, onClose, onSuccess }) {
  const fileInputRef = useRef(null);

  const [selectedProductId, setSelectedProductId] = useState('');
  const [damageType, setDamageType] = useState('Torn Fabric / Broken Stitch');
  const [description, setDescription] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen || !order) return null;

  // Validate 5-day delivery window
  const validation = validateReturnRequest({
    order,
    damageType,
    photos: ['dummy_check'], // pre-check time window
    description: 'pre_check'
  });

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Convert file to local preview URL
    const newPhotos = files.map((file) => URL.createObjectURL(file));
    setUploadedPhotos((prev) => [...prev, ...newPhotos]);
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedProductId && order.items?.length > 1) {
      setErrorMsg('Please select which specific product in this order arrived damaged.');
      return;
    }

    if (uploadedPhotos.length === 0) {
      setErrorMsg('Clear photographic evidence of the damaged clothing is mandatory.');
      return;
    }

    if (!description.trim() || description.trim().length < 15) {
      setErrorMsg('Please provide a descriptive explanation of the damage (at least 15 characters).');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const targetItem = order.items?.find((i) => i.productId === selectedProductId) || order.items[0];
      const newReturn = {
        id: 'RET-' + Math.floor(1000 + Math.random() * 9000),
        orderId: order.id,
        userId: order.userId,
        userEmail: order.userEmail,
        accountType: order.accountType,
        productName: targetItem.name,
        damageType,
        damageDescription: description.trim(),
        photos: uploadedPhotos,
        reportDate: new Date().toISOString(),
        daysSinceDelivery: validation.daysSinceDelivery || 1,
        status: 'Under Review',
        adminRemarks: 'Assigned to Quality Inspection Team. Photographic review in progress.',
      };

      const existingReturns = StoreService.getReturns();
      StoreService.setReturns([newReturn, ...existingReturns]);

      setIsSubmitting(false);
      setSuccessMsg(`Damage claim ${newReturn.id} registered successfully. Our inspection desk will review your photos within 24 business hours.`);
      if (onSuccess) onSuccess(newReturn);
    }, 1000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card modal-return-claim-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <RotateCcw size={20} className="text-gold" />
            <div>
              <h3 className="modal-title">File Transit Damage Return Claim</h3>
              <p className="modal-subtitle">Order #{order.id} • Strict 5-Day Delivery Window</p>
            </div>
          </div>
          <button type="button" className="modal-close-button" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body-scroll">
          {/* Policy Banner */}
          <div className="return-policy-notice-box">
            <div className="policy-notice-header">
              <ShieldAlert size={18} className="text-gold" />
              <strong>STRICT RETURN POLICY NOTICE:</strong>
            </div>
            <p>
              Returns are accepted <strong>EXCLUSIVELY FOR DAMAGED CLOTHING</strong> reported within 5 days of delivery. Change of mind, wrong size, or non-damaged products will be automatically rejected.
            </p>
            {validation.isEligible && (
              <div className="remaining-window-tag">
                <Calendar size={14} />
                <span>Delivered {validation.daysSinceDelivery} day(s) ago • <strong>{validation.remainingDays} day(s) remaining</strong> to file claim.</span>
              </div>
            )}
          </div>

          {!validation.isEligible ? (
            <div className="return-ineligible-box">
              <AlertTriangle size={36} className="text-danger" />
              <h4>Claim Ineligible</h4>
              <p className="ineligible-reason">{validation.error}</p>
              <button type="button" className="btn-primary-navy mt-4" onClick={onClose}>
                Close Dialog
              </button>
            </div>
          ) : successMsg ? (
            <div className="return-success-box">
              <CheckCircle2 size={48} className="text-gold" />
              <h4>Claim Submitted for Review</h4>
              <p>{successMsg}</p>
              <button type="button" className="btn-primary-navy mt-4" onClick={onClose}>
                View Return Status in Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="return-claim-form">
              {/* Product Selector */}
              {order.items?.length > 1 && (
                <div className="form-field-unit">
                  <label className="input-field-label">Select Damaged Item</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="input-field-control"
                    required
                  >
                    <option value="">-- Choose item from this order --</option>
                    {order.items.map((item, idx) => (
                      <option key={idx} value={item.productId}>
                        {item.name} ({item.quantitySets || item.quantity} {order.accountType === 'Wholesaler' ? 'Sets' : 'pcs'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Damage Category */}
              <div className="form-field-unit">
                <label className="input-field-label">Damage Classification</label>
                <select
                  value={damageType}
                  onChange={(e) => setDamageType(e.target.value)}
                  className="input-field-control"
                >
                  <option value="Torn Fabric / Broken Stitch">Torn Fabric / Broken Stitch</option>
                  <option value="Dye Stain / Bleed on Silk">Dye Stain / Discoloration</option>
                  <option value="Damaged Zari / Loose Brocade Weft">Damaged Zari / Defective Brocade</option>
                  <option value="Crushed / Compromised Master Bale (B2B)">Crushed Transit Master Bale</option>
                  <option value="Missing / Slashed Blouse Fabric">Missing / Slashed Fabric Portion</option>
                </select>
              </div>

              {/* Photo Evidence Uploader */}
              <div className="form-field-unit">
                <label className="input-field-label">
                  Upload Clear Damage Photographs (Mandatory)
                  <span className="required-star">*</span>
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden-file-input"
                />

                <div
                  className="photo-dropzone-box"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera size={28} className="dropzone-icon" />
                  <p>Click to upload or snap damage photos</p>
                  <span>Supports JPG, PNG (Maximum 5MB per photo)</span>
                </div>

                {uploadedPhotos.length > 0 && (
                  <div className="photo-preview-grid">
                    {uploadedPhotos.map((src, i) => (
                      <div key={i} className="photo-thumb-wrap">
                        <img src={src} alt={`Damage Evidence ${i + 1}`} className="damage-thumb-img" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="form-field-unit">
                <label className="input-field-label">
                  Detailed Description of Damage
                  <span className="required-star">*</span>
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe where the tear/defect is located and how it was discovered upon opening the package..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field-control"
                  required
                ></textarea>
              </div>

              {errorMsg && (
                <div className="auth-alert-box alert-danger">
                  <AlertTriangle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="modal-footer">
                <button type="button" className="btn-modal-cancel" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-navy" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting Claim...' : 'Submit Damage Claim for Review'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
