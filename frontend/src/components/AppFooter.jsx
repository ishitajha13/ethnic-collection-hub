import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, CreditCard, Sparkles, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';
import Logo from './Logo';

export default function AppFooter() {
  const [activeModal, setActiveModal] = useState(null);

  const categoriesList = [
    { name: 'Sarees', path: '/shop?cat=sarees' },
    { name: 'Kurtis', path: '/shop?cat=kurtis' },
    { name: 'Lehengas', path: '/shop?cat=lehengas' },
    { name: 'Dress Materials', path: '/shop?cat=dress-materials' },
    { name: 'Salwar Suits', path: '/shop?cat=salwar-suits' },
    { name: 'Ethnic Dresses', path: '/shop?cat=ethnic-dresses' },
    { name: "Men's Ethnic Wear", path: '/shop?cat=mens-ethnic-wear' },
    { name: 'Kids Ethnic Wear', path: '/shop?cat=kids-ethnic-wear' },
    { name: 'Dupattas', path: '/shop?cat=dupattas' },
    { name: 'Accessories', path: '/shop?cat=accessories' },
    { name: 'Festival Collections', path: '/shop?cat=festival-collections' },
    { name: 'Wedding Collections', path: '/shop?cat=wedding-collections' },
  ];

  return (
    <footer className="site-app-footer">
      {/* 1. Value Proposition Pillars */}
      <div className="footer-pillars-bar">
        <div className="footer-container">
          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <Sparkles size={24} className="pillar-icon" />
              </div>
              <div className="pillar-meta">
                <h4>Artisan Handcrafted Silks</h4>
                <p>100% verified master-weaver authenticity across Indian clusters.</p>
              </div>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box">
                <Truck size={24} className="pillar-icon" />
              </div>
              <div className="pillar-meta">
                <h4>Wholesale Minimum 12 Sets</h4>
                <p>Factory-direct commercial pricing with volume discount slabs.</p>
              </div>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box">
                <RotateCcw size={24} className="pillar-icon" />
              </div>
              <div className="pillar-meta">
                <h4>Strict 5-Day Damage Claims</h4>
                <p>Returns accepted exclusively for damaged goods reported within 5 days.</p>
              </div>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box">
                <CreditCard size={24} className="pillar-icon" />
              </div>
              <div className="pillar-meta">
                <h4>UPI Online & UPI on Delivery</h4>
                <p>Zero cash handling. Fast, verified UPI transactions across all orders.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation Links */}
      <div className="footer-main-content">
        <div className="footer-container">
          <div className="footer-columns-grid">
            {/* Column 1: Brand Info */}
            <div className="footer-col brand-col">
              <Logo size="compact" />
              <p className="footer-brand-bio">
                ETHNIC COLLECTION HUB is India’s definitive integrated B2B and B2C fashion marketplace, connecting handloom weavers and mills directly with Wholesalers, Retailers and Couture Shoppers.
              </p>
              <div className="footer-hq-details">
                <p><MapPin size={15} /> <span>Heritage Couture Plaza, Connaught Place, New Delhi 110001</span></p>
                <p><Phone size={15} /> <span>+91 11 4982 7700</span></p>
                <p><Mail size={15} /> <span>care@ethniccollectionhub.com</span></p>
              </div>
            </div>

            {/* Column 2: 12 Categories */}
            <div className="footer-col">
              <h4 className="footer-col-title">Ethnic Collections</h4>
              <ul className="footer-links-list">
                {categoriesList.slice(0, 6).map((c, i) => (
                  <li key={i}><Link to={c.path}>{c.name}</Link></li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Special Editions</h4>
              <ul className="footer-links-list">
                {categoriesList.slice(6).map((c, i) => (
                  <li key={i}><Link to={c.path}>{c.name}</Link></li>
                ))}
              </ul>
            </div>

            {/* Column 3: Multi-Role Portals */}
            <div className="footer-col">
              <h4 className="footer-col-title">Marketplace Portals</h4>
              <ul className="footer-links-list">
                <li><Link to="/wholesaler/dashboard">Wholesaler B2B Desk</Link></li>
                <li><Link to="/wholesaler/bulk-pricing">Wholesale 12-Set Slabs</Link></li>
                <li><Link to="/retailer/dashboard">Retailer Resale Hub</Link></li>
                <li><Link to="/buyer/dashboard">Buyer Boutique</Link></li>
                <li><Link to="/aadhaar-scan">Aadhaar Assisted KYC</Link></li>
                <li><Link to="/admin">Administrator Gateway</Link></li>
              </ul>
            </div>

            {/* Column 4: Self-Service & Policies */}
            <div className="footer-col">
              <h4 className="footer-col-title">Self-Service & Help</h4>
              <ul className="footer-links-list">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Help Centre & FAQs</Link></li>
                <li><Link to="/buyer/orders">Track Shipment</Link></li>
                <li><button type="button" className="footer-text-btn" onClick={() => setActiveModal('return-policy')}>5-Day Return Policy</button></li>
                <li><button type="button" className="footer-text-btn" onClick={() => setActiveModal('payment-policy')}>UPI Payment Protocol</button></li>
                <li><button type="button" className="footer-text-btn" onClick={() => setActiveModal('aadhaar-policy')}>Aadhaar & DPDP Privacy</button></li>
              </ul>
            </div>
          </div>

          {/* Payment Badges & Notice */}
          <div className="footer-payments-row">
            <div className="payment-modes-info">
              <span className="pay-label">Accepted Verified Payment Methods:</span>
              <span className="pay-badge">PhonePe</span>
              <span className="pay-badge">Google Pay</span>
              <span className="pay-badge">Paytm UPI</span>
              <span className="pay-badge">BHIM</span>
              <span className="pay-badge">Dynamic UPI QR on Delivery</span>
            </div>
            <div className="no-cod-warning">
              <span className="no-cod-pill">Strictly No Cash on Delivery (COD)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal Bar */}
      <div className="footer-bottom-bar">
        <div className="footer-container bottom-bar-inner">
          <p className="bottom-copy">
            © 2026 ETHNIC COLLECTION HUB PVT LTD. All rights reserved. GSTIN: 07AAACE0099P1Z3.
          </p>
          <div className="bottom-links">
            <button type="button" onClick={() => setActiveModal('terms')}>Terms & Conditions</button>
            <span>•</span>
            <button type="button" onClick={() => setActiveModal('privacy')}>Privacy Policy</button>
            <span>•</span>
            <button type="button" onClick={() => setActiveModal('security')}>Security & DPDP</button>
          </div>
        </div>
      </div>

      {/* Policy Modals */}
      {activeModal && (
        <div className="modal-backdrop" onClick={() => setActiveModal(null)} role="dialog" aria-modal="true">
          <div className="modal-card modal-legal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-with-icon">
                <ShieldCheck size={20} className="text-gold" />
                <h3 className="modal-title">
                  {activeModal === 'return-policy' && 'Strict Return & Damage Policy'}
                  {activeModal === 'payment-policy' && 'UPI Payment & Zero-Cash Protocol'}
                  {activeModal === 'aadhaar-policy' && 'Aadhaar Scanning & DPDP Safeguards'}
                  {activeModal === 'terms' && 'Commercial Terms & Conditions'}
                  {activeModal === 'privacy' && 'Digital Privacy Policy'}
                  {activeModal === 'security' && 'Security & Data Governance'}
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-button"
                onClick={() => setActiveModal(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="modal-body-scroll">
              {activeModal === 'return-policy' && (
                <div className="policy-text-wrap">
                  <div className="alert-important-box">
                    <strong>CRITICAL POLICY NOTICE:</strong> Returns on ETHNIC COLLECTION HUB are accepted <u>EXCLUSIVELY FOR DAMAGED CLOTHING</u> reported within 5 calendar days of recorded delivery.
                  </div>
                  <h4>Mandatory Conditions for Claim Acceptance:</h4>
                  <ol>
                    <li>Product must have arrived damaged, defective, or torn during transit or factory manufacturing.</li>
                    <li>Customer must report the damage within <strong>5 calendar days</strong> from delivery confirmation.</li>
                    <li>Customer must upload high-resolution photographic evidence showing the exact damage.</li>
                    <li>The valid Order ID and detailed description of the defect are required.</li>
                    <li>Our Quality Inspection Desk will review the photographic submission within 24 business hours.</li>
                    <li>Approved claims will be eligible for free replacement or refund to original UPI source.</li>
                  </ol>
                  <h4>Strictly Non-Acceptable Reasons:</h4>
                  <ul>
                    <li>Change of mind or personal preference.</li>
                    <li>Wrong size or color chosen during checkout.</li>
                    <li>Items ordered by mistake.</li>
                    <li>Products without verifiable structural damage.</li>
                    <li>Any claim submitted after the 5-day window has elapsed.</li>
                  </ul>
                </div>
              )}

              {activeModal === 'payment-policy' && (
                <div className="policy-text-wrap">
                  <h4>Zero Cash on Delivery (COD) Policy</h4>
                  <p>To prevent courier reconciliation delays and enhance transaction security, ETHNIC COLLECTION HUB operates on a 100% digital payment infrastructure.</p>
                  <h4>Supported Payment Methods:</h4>
                  <ol>
                    <li><strong>Online UPI:</strong> Pay instantly using Google Pay, PhonePe, Paytm, BHIM or any UPI VPA with automated verification.</li>
                    <li><strong>UPI on Delivery:</strong> Pay digitally at your doorstep. Our verified logistics associate will present an authenticated dynamic UPI QR code. The order is marked paid only upon electronic gateway confirmation.</li>
                  </ol>
                  <p className="text-danger font-semibold">Note: Delivery personnel are prohibited from accepting physical currency or screenshots.</p>
                </div>
              )}

              {activeModal === 'aadhaar-policy' && (
                <div className="policy-text-wrap">
                  <h4>Aadhaar Assisted Profile Registration & DPDP Safeguards</h4>
                  <p>In compliance with the Digital Personal Data Protection (DPDP) Act and Indian UIDAI regulatory circulars:</p>
                  <ul>
                    <li>Aadhaar scanning is an <strong>optional convenience feature</strong> to assist form auto-fill. Manual registration is always available.</li>
                    <li>The 12-digit Aadhaar UID is <u>strictly masked</u> (e.g. <code>XXXX-XXXX-8921</code>). The unmasked number is never saved or stored in any database.</li>
                    <li>Document imagery is purged from client memory immediately after OCR parsing.</li>
                    <li>No biometric data is captured, requested, or extracted.</li>
                    <li>OCR scanning facilitates profile details autofill and does not represent official biometric UIDAI e-KYC.</li>
                  </ul>
                </div>
              )}

              {activeModal === 'terms' && (
                <div className="policy-text-wrap">
                  <h4>Commercial Terms & Wholesaler Minimum Quantity</h4>
                  <p>By using ETHNIC COLLECTION HUB, Wholesalers, Retailers, and Buyers agree to all platform conditions.</p>
                  <ul>
                    <li><strong>Wholesaler MOQ:</strong> Wholesalers must order a minimum of <strong>12 clothing sets</strong> per order. Checkouts below 12 sets are strictly locked by the automated dispatch engine.</li>
                    <li><strong>Retailer Margin Pricing:</strong> Retailers must possess valid GSTIN for commercial tax input credit.</li>
                    <li><strong>Couture Accuracy:</strong> Handloom silks and brocades feature unique artisan weave characteristics that are celebrated as hallmarks of craftsmanship.</li>
                  </ul>
                </div>
              )}

              {(activeModal === 'privacy' || activeModal === 'security') && (
                <div className="policy-text-wrap">
                  <h4>Data Governance & Information Security</h4>
                  <p>We implement end-to-end encryption for all sessions, tokenized authentication, secure Firestore security rules, and role-based access control (RBAC). No financial credentials or unmasked identification numbers are ever stored on our servers.</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-primary-navy"
                onClick={() => setActiveModal(null)}
              >
                Understood & Acknowledged
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
