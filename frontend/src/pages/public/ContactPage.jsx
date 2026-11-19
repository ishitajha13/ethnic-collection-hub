import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AppFooter from '../../components/AppFooter';
import {
  HelpCircle,
  RotateCcw,
  Package,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  ExternalLink
} from 'lucide-react';

export default function ContactPage() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [faqSearch, setFaqSearch] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderId: '',
    topic: 'Order & Shipment Self-Service',
    message: ''
  });

  const faqs = [
    {
      q: 'What is the minimum order quantity (MOQ) for Wholesalers?',
      a: 'Wholesale accounts are subject to a strict minimum order quantity of 12 clothing sets per order. Checkouts below 12 sets are automatically disabled by the order engine. Wholesalers ordering 24+ sets receive 5% volume rebate, and 36+ sets unlock 10% master volume pricing.',
      category: 'Wholesale'
    },
    {
      q: 'What is the return and refund policy for damaged clothing?',
      a: 'Returns are accepted EXCLUSIVELY for items that arrive damaged or defective during transit/manufacturing. Damage claims must be filed within 5 calendar days of recorded delivery through your account dashboard with clear photographs of the damage. Non-damaged returns (change of mind, size/color preference) are strictly prohibited.',
      category: 'Returns'
    },
    {
      q: 'Why is Cash on Delivery (COD) not available?',
      a: 'ETHNIC COLLECTION HUB operates on an entirely cashless infrastructure to prevent courier handling discrepancies and ensure rapid dispatch. We accept all verified Online UPI apps (GPay, PhonePe, Paytm, BHIM) as well as Dynamic UPI QR on Delivery at your doorstep.',
      category: 'Payments'
    },
    {
      q: 'How does UPI on Delivery work?',
      a: 'If you choose "UPI on Delivery" at checkout, our courier associate will present an authenticated dynamic merchant UPI QR code at delivery. You simply scan and pay via any smartphone UPI app after inspecting the sealed packaging.',
      category: 'Payments'
    },
    {
      q: 'How do I download my GST Tax Invoice?',
      a: 'Every order generates an automated, GST-compliant tax invoice with HSN codes, available in your dashboard under "Order History" or "Invoices". You can view, print, or download PDF receipts at any time.',
      category: 'Invoices'
    },
    {
      q: 'Is Aadhaar document scanning safe and compliant?',
      a: 'Yes. Our Aadhaar scanning feature is an optional convenience tool to assist form autofill under DPDP Act safeguards. Your 12-digit number is immediately masked (e.g. XXXX-XXXX-1234), document imagery is purged instantly from memory, and no biometric data is ever captured.',
      category: 'Security'
    }
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.a.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.category.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  return (
    <div className="hub-site-wrapper">
      <Navbar />

      {/* Header */}
      <section className="contact-hero-section">
        <div className="site-container text-center">
          <h1 className="page-hero-title">Self-Service Help Centre & Concierge</h1>
          <p className="page-hero-subtitle">
            Resolve queries instantly through automated tools, track shipments, or review policy guides.
          </p>

          {/* Quick Action Grid */}
          <div className="self-service-action-grid">
            <Link to="/buyer/orders" className="self-service-pill">
              <Package size={18} />
              <span>Track Active Shipment</span>
            </Link>
            <Link to="/buyer/returns" className="self-service-pill">
              <RotateCcw size={18} />
              <span>File 5-Day Damage Claim</span>
            </Link>
            <Link to="/wholesaler/bulk-pricing" className="self-service-pill">
              <HelpCircle size={18} />
              <span>Wholesale 12-Set Pricing Slabs</span>
            </Link>
            <Link to="/aadhaar-scan" className="self-service-pill">
              <CheckCircle2 size={18} />
              <span>Aadhaar Assisted KYC</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Search & Accordion */}
      <section className="contact-faq-section">
        <div className="site-container">
          <div className="section-title-wrap text-center">
            <span className="sub-title-accent">Instant Answers</span>
            <h2 className="section-main-heading">Frequently Asked Questions</h2>
          </div>

          <div className="faq-search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by topic (e.g. wholesale MOQ, return policy, UPI payments)..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="faq-search-input"
            />
          </div>

          <div className="faq-accordion-container">
            {filteredFaqs.map((faq, idx) => (
              <div
                key={idx}
                className={`faq-accordion-item ${activeFaq === idx ? 'expanded' : ''}`}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <div className="faq-question-row">
                  <span className="faq-badge">{faq.category}</span>
                  <h4 className="faq-question-text">{faq.q}</h4>
                  <div className="faq-toggle-icon">
                    {activeFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
                {activeFaq === idx && (
                  <div className="faq-answer-pane">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Corporate Headquarters */}
      <section className="contact-form-section">
        <div className="site-container">
          <div className="contact-split-grid">
            <div className="contact-hq-card">
              <h3>Corporate Headquarters</h3>
              <p className="hq-tagline">ETHNIC COLLECTION HUB PRIVATE LIMITED</p>

              <div className="hq-meta-list">
                <div className="hq-meta-item">
                  <MapPin size={20} className="text-gold" />
                  <div>
                    <strong>Delhi Corporate Office:</strong>
                    <p>Heritage Couture Plaza, Level 4, Connaught Place, New Delhi 110001, India</p>
                  </div>
                </div>

                <div className="hq-meta-item">
                  <Phone size={20} className="text-gold" />
                  <div>
                    <strong>Dedicated Telephone Desk:</strong>
                    <p>+91 11 4982 7700 (Mon–Sat, 9:30 AM – 6:30 PM IST)</p>
                  </div>
                </div>

                <div className="hq-meta-item">
                  <Mail size={20} className="text-gold" />
                  <div>
                    <strong>Electronic Inquiries:</strong>
                    <p>Wholesale: b2b@ethniccollectionhub.com</p>
                    <p>Customer Care: care@ethniccollectionhub.com</p>
                  </div>
                </div>
              </div>

              <div className="hq-gst-box">
                <span>CIN: U18101DL2026PTC398210</span>
                <span>GSTIN: 07AAACE0099P1Z3</span>
              </div>
            </div>

            <div className="contact-form-card">
              <h3>Need Specialized Assistance?</h3>
              <p>For escalation of complex consignment orders or factory-loom inquiries:</p>

              {contactSubmitted ? (
                <div className="auth-alert-box alert-success">
                  <CheckCircle2 size={24} />
                  <div>
                    <h4>Inquiry Dispatched</h4>
                    <p>Thank you! Your reference token is <strong>#ECH-CARE-{Math.floor(100000 + Math.random() * 900000)}</strong>. Our desk will follow up within 24 business hours.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-actual-form">
                  <div className="form-row-dual">
                    <div className="form-field-unit">
                      <label className="input-field-label">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-field-control"
                        placeholder="e.g. Ramesh Kothari"
                      />
                    </div>
                    <div className="form-field-unit">
                      <label className="input-field-label">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input-field-control"
                        placeholder="name@domain.com"
                      />
                    </div>
                  </div>

                  <div className="form-row-dual">
                    <div className="form-field-unit">
                      <label className="input-field-label">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="input-field-control"
                        placeholder="+91 98..."
                      />
                    </div>
                    <div className="form-field-unit">
                      <label className="input-field-label">Order ID (if applicable)</label>
                      <input
                        type="text"
                        value={formData.orderId}
                        onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                        className="input-field-control"
                        placeholder="e.g. ECH-ORD-88219"
                      />
                    </div>
                  </div>

                  <div className="form-field-unit">
                    <label className="input-field-label">Inquiry Department</label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="input-field-control"
                    >
                      <option value="Order & Shipment Self-Service">Order & Shipment Self-Service</option>
                      <option value="Wholesale Bulk Procurements (12+ Sets)">Wholesale Bulk Procurements (12+ Sets)</option>
                      <option value="Retailer Trade Terms & Margins">Retailer Trade Terms & Margins</option>
                      <option value="Damaged Goods 5-Day Claim Escalation">Damaged Goods 5-Day Claim Escalation</option>
                      <option value="Aadhaar KYC & DPDP Verification">Aadhaar KYC & DPDP Verification</option>
                    </select>
                  </div>

                  <div className="form-field-unit">
                    <label className="input-field-label">Message Details</label>
                    <textarea
                      rows="4"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="input-field-control"
                      placeholder="Please include relevant item SKUs, dates, or specifications..."
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary-navy block-btn">
                    Submit Inquiry Token
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
