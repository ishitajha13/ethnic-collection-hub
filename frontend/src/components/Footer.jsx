import React, { useState } from 'react';
import { X, ShieldCheck, FileText, LifeBuoy } from 'lucide-react';

/**
 * Full-width Footer Component
 * © 2026 ETHNIC COLLECTION HUB. All rights reserved.
 * Terms & Conditions | Privacy Policy | Help & Support
 */
export default function Footer() {
  const [activeModal, setActiveModal] = useState(null);

  const handleOpen = (type) => {
    setActiveModal(type);
  };

  const handleClose = () => {
    setActiveModal(null);
  };

  return (
    <>
      <footer className="hub-page-footer">
        <div className="footer-inner-container">
          <p className="footer-copyright">
            © 2026 ETHNIC COLLECTION HUB. All rights reserved.
          </p>

          <nav className="footer-nav" aria-label="Legal & Support">
            <button
              type="button"
              className="footer-nav-link"
              onClick={() => handleOpen('terms')}
            >
              Terms & Conditions
            </button>
            <span className="footer-separator" aria-hidden="true">|</span>
            <button
              type="button"
              className="footer-nav-link"
              onClick={() => handleOpen('privacy')}
            >
              Privacy Policy
            </button>
            <span className="footer-separator" aria-hidden="true">|</span>
            <button
              type="button"
              className="footer-nav-link"
              onClick={() => handleOpen('support')}
            >
              Help & Support
            </button>
          </nav>
        </div>
      </footer>

      {/* Info Modals */}
      {activeModal && (
        <div className="modal-backdrop" onClick={handleClose} role="dialog" aria-modal="true">
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                {activeModal === 'terms' && <FileText className="modal-icon" size={20} />}
                {activeModal === 'privacy' && <ShieldCheck className="modal-icon" size={20} />}
                {activeModal === 'support' && <LifeBuoy className="modal-icon" size={20} />}
                <h3 className="modal-title">
                  {activeModal === 'terms' && 'Terms & Conditions'}
                  {activeModal === 'privacy' && 'Privacy Policy'}
                  {activeModal === 'support' && 'Help & Support'}
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={handleClose}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {activeModal === 'terms' && (
                <div className="legal-content">
                  <p>Welcome to <strong>ETHNIC COLLECTION HUB</strong>. By accessing our platform as a Wholesaler, Retailer, or Buyer, you agree to our commercial trading covenants, verified artisan authenticity standards, and marketplace terms.</p>
                  <ul>
                    <li>All wholesale transactions adhere to verified minimum order quantities (MOQ).</li>
                    <li>Authenticity of handloom silk, chanderi, and handcrafted fabrics is certified.</li>
                    <li>Digital payment gateways utilize bank-grade encryption protocols.</li>
                  </ul>
                </div>
              )}

              {activeModal === 'privacy' && (
                <div className="legal-content">
                  <p>Your privacy and confidential business metrics are protected under strict encryption standards.</p>
                  <ul>
                    <li>Commercial business data and retail transactions are never shared with unauthorized third parties.</li>
                    <li>Two-factor authentication and tokenized session security protect buyer and merchant credentials.</li>
                    <li>GDPR and Digital Personal Data Protection compliant.</li>
                  </ul>
                </div>
              )}

              {activeModal === 'support' && (
                <div className="legal-content">
                  <p>Our dedicated Luxury Fashion Concierge and Merchant Support desks are available 24/7.</p>
                  <div className="support-contact-box">
                    <p><strong>B2B Merchant Concierge:</strong> partners@ethniccollectionhub.com</p>
                    <p><strong>Customer Care Hotline:</strong> +91 (0) 800-ETHNIC-HUB</p>
                    <p><strong>Operating Hours:</strong> 24/7 Priority Support for Registered Merchants</p>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="modal-action-btn" onClick={handleClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
