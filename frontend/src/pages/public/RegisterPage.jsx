import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AppFooter from '../../components/AppFooter';
import Logo from '../../components/Logo';
import AccountCard from '../../components/AccountCard';
import InputField from '../../components/InputField';
import {
  ACCOUNT_TYPES,
  registerUser,
  validateRegistrationForm
} from '../../services/authService';
import {
  User,
  Mail,
  Lock,
  Building2,
  Phone,
  FileText,
  ShieldCheck,
  Camera,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import AadhaarScannerModal from '../../components/AadhaarScannerModal';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [selectedAccount, setSelectedAccount] = useState(ACCOUNT_TYPES.BUYER);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    businessName: '',
    gstin: '',
    phone: '',
    address: '',
    aadhaarMasked: null,
  });
  const [isAadhaarModalOpen, setIsAadhaarModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCommercial =
    selectedAccount === ACCOUNT_TYPES.WHOLESALER ||
    selectedAccount === ACCOUNT_TYPES.RETAILER;

  const accountCardsData = [
    {
      type: ACCOUNT_TYPES.WHOLESALER,
      title: 'Wholesaler',
      description: 'Bulk B2B sourcing • Min 12 Sets • Tiered Pricing Slabs',
    },
    {
      type: ACCOUNT_TYPES.RETAILER,
      title: 'Retailer',
      description: 'Resale & Boutique • 35-45% Margins • GST Invoices',
    },
    {
      type: ACCOUNT_TYPES.BUYER,
      title: 'Buyer',
      description: 'Personal Haute Couture • Direct Artisan Silks',
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (generalError) setGeneralError('');
  };

  const handleAadhaarVerificationDone = (verifiedData) => {
    setFormData((prev) => ({
      ...prev,
      fullName: verifiedData.name || prev.fullName,
      address: verifiedData.address || prev.address,
      aadhaarMasked: verifiedData.aadhaarMasked,
    }));
    setIsAadhaarModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    const validation = validateRegistrationForm({
      ...formData,
      accountType: selectedAccount,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await registerUser({
        ...formData,
        accountType: selectedAccount,
      });

      const target =
        selectedAccount === ACCOUNT_TYPES.WHOLESALER
          ? '/wholesaler/dashboard'
          : selectedAccount === ACCOUNT_TYPES.RETAILER
          ? '/retailer/dashboard'
          : '/buyer/dashboard';

      navigate(target);
    } catch (err) {
      setGeneralError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="hub-site-wrapper">
      <Navbar />

      <section className="register-page-section">
        <div className="site-container">
          <div className="register-card-container">
            <div className="register-header-box text-center">
              <h1 className="form-main-heading">Create {selectedAccount} Account</h1>
              <p className="form-sub-heading">
                Join India's premiere integrated ethnic fashion marketplace.
              </p>
            </div>

            {/* Aadhaar Fast-Track Autofill Banner */}
            <div className="aadhaar-fasttrack-card">
              <div className="fasttrack-content">
                <div className="fasttrack-icon-wrap">
                  <Camera size={24} className="text-gold" />
                </div>
                <div>
                  <h4>Aadhaar Assisted Profile Autofill</h4>
                  <p>Scan your Aadhaar card via camera or upload to auto-populate your legal name and address in compliance with DPDP data privacy standards.</p>
                </div>
              </div>
              <button
                type="button"
                className="btn-gold-action"
                onClick={() => setIsAadhaarModalOpen(true)}
              >
                Scan Aadhaar Card
              </button>
            </div>

            {formData.aadhaarMasked && (
              <div className="auth-alert-box alert-success mb-4">
                <CheckCircle2 size={18} />
                <span>Aadhaar Verified ({formData.aadhaarMasked}) • Legal name & address auto-filled.</span>
              </div>
            )}

            {/* Account Type Selector */}
            <div className="account-type-selection-block">
              <h3 className="selector-title">Select Account Type:</h3>
              <div className="account-cards-grid">
                {accountCardsData.map((item) => (
                  <AccountCard
                    key={item.type}
                    type={item.type}
                    title={item.title}
                    description={item.description}
                    isSelected={selectedAccount === item.type}
                    onSelect={(t) => setSelectedAccount(t)}
                  />
                ))}
              </div>
            </div>

            {generalError && (
              <div className="auth-alert-box alert-danger">
                <AlertCircle size={18} />
                <span>{generalError}</span>
              </div>
            )}

            {/* Actual Registration Form */}
            <form onSubmit={handleSubmit} className="auth-actual-form">
              <div className="form-row-dual">
                <InputField
                  id="reg-fullName"
                  name="fullName"
                  label="Full Legal Name"
                  placeholder="e.g. Aditi Singhania"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  leftIcon={User}
                  required
                />

                <InputField
                  id="reg-phone"
                  name="phone"
                  label="Mobile Contact (for WhatsApp OTP)"
                  placeholder="+91 98..."
                  value={formData.phone}
                  onChange={handleChange}
                  leftIcon={Phone}
                  required
                />
              </div>

              {isCommercial && (
                <div className="form-row-dual">
                  <InputField
                    id="reg-businessName"
                    name="businessName"
                    label={selectedAccount === ACCOUNT_TYPES.WHOLESALER ? 'Wholesale Firm / Syndicate Name' : 'Retail Boutique / Enterprise Name'}
                    placeholder="e.g. Royal Heritage Weaves Pvt Ltd"
                    value={formData.businessName}
                    onChange={handleChange}
                    error={errors.businessName}
                    leftIcon={Building2}
                    required
                  />

                  <InputField
                    id="reg-gstin"
                    name="gstin"
                    label="GSTIN Number (for Tax Invoices)"
                    placeholder="e.g. 07AAAAA0000A1Z5"
                    value={formData.gstin}
                    onChange={handleChange}
                    leftIcon={FileText}
                  />
                </div>
              )}

              <div className="form-row-dual">
                <InputField
                  id="reg-email"
                  name="email"
                  type="email"
                  label="Official Email Address"
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  leftIcon={Mail}
                  required
                />

                <InputField
                  id="reg-password"
                  name="password"
                  label="Create Security Password"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  leftIcon={Lock}
                  isPassword
                  required
                />
              </div>

              <div className="form-field-unit">
                <label className="input-field-label">Primary Billing / Dispatch Address</label>
                <textarea
                  name="address"
                  rows="2"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field-control"
                  placeholder="Street, City, State, Pincode..."
                ></textarea>
              </div>

              {/* Commercial Perks Summary */}
              <div className="registration-perk-summary">
                <ShieldCheck size={18} className="text-gold" />
                <span>
                  {selectedAccount === ACCOUNT_TYPES.WHOLESALER && 'Wholesaler orders require a minimum of 12 sets per order. Automatic volume slabs applied.'}
                  {selectedAccount === ACCOUNT_TYPES.RETAILER && 'Retailer resale prices unlocked with downloadable GST input invoices.'}
                  {selectedAccount === ACCOUNT_TYPES.BUYER && 'Full access to luxury silk collections with online UPI and doorstep UPI on delivery.'}
                </span>
              </div>

              <button
                type="submit"
                className="btn-primary-navy block-btn py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering Account...' : `Complete ${selectedAccount} Registration`}
              </button>
            </form>

            <div className="register-footer-switch text-center mt-4">
              <span>Already registered on ETHNIC COLLECTION HUB? </span>
              <Link to="/login" className="gold-text-link">Sign In to Workspace</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Aadhaar Scanner Modal */}
      <AadhaarScannerModal
        isOpen={isAadhaarModalOpen}
        onClose={() => setIsAadhaarModalOpen(false)}
        onVerificationSuccess={handleAadhaarVerificationDone}
      />

      <AppFooter />
    </div>
  );
}
