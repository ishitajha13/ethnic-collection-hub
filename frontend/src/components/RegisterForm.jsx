import React, { useState } from 'react';
import { User, Mail, Lock, Building2, ArrowLeft, Sparkles, CheckCircle2, Camera } from 'lucide-react';
import InputField from './InputField';
import AadhaarScannerModal from './AadhaarScannerModal';
import { ACCOUNT_TYPES, registerUser, validateRegistrationForm } from '../services/authService';

export default function RegisterForm({
  selectedAccountType,
  onNavigateToLogin,
  onRegistrationSuccess,
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    businessName: '',
    accountType: selectedAccountType,
    aadhaarMasked: null,
    address: '',
  });

  const [isAadhaarOpen, setIsAadhaarOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const isCommercial =
    formData.accountType === ACCOUNT_TYPES.WHOLESALER ||
    formData.accountType === ACCOUNT_TYPES.RETAILER;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (generalError) setGeneralError('');
  };

  const handleAadhaarDone = (verified) => {
    setFormData((prev) => ({
      ...prev,
      fullName: verified.name || prev.fullName,
      address: verified.address || prev.address,
      aadhaarMasked: verified.aadhaarMasked || prev.aadhaarMasked,
    }));
    setIsAadhaarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    const validation = validateRegistrationForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await registerUser(formData);
      onRegistrationSuccess(user);
    } catch (err) {
      setGeneralError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registration-container">
      <button
        type="button"
        className="back-to-login-link"
        onClick={onNavigateToLogin}
        aria-label="Back to sign in"
      >
        <ArrowLeft size={16} />
        <span>Back to Sign In</span>
      </button>

      <div className="form-header-group">
        <div className="badge-luxury-pill">
          <Sparkles size={13} className="pill-sparkle" />
          <span>New Account Registration</span>
        </div>
        <h2 className="form-main-heading">Create {formData.accountType} Account</h2>
        <p className="form-sub-heading">
          Join India's premier high-fashion ethnic marketplace.
        </p>
      </div>

      {generalError && (
        <div className="auth-alert-box alert-danger">
          <span>{generalError}</span>
        </div>
      )}

      {/* Aadhaar Autofill Option */}
      <div className="aadhaar-autofill-banner">
        <div className="aadhaar-autofill-info">
          <Camera size={18} className="aadhaar-cam-icon" />
          <div>
            <p className="aadhaar-autofill-title">Autofill with Aadhaar Card</p>
            <p className="aadhaar-autofill-sub">Scan to instantly fill name &amp; address fields</p>
          </div>
        </div>
        <button
          type="button"
          className="btn-aadhaar-scan"
          onClick={() => setIsAadhaarOpen(true)}
        >
          Scan Card
        </button>
      </div>

      {formData.aadhaarMasked && (
        <div className="aadhaar-verified-badge">
          <CheckCircle2 size={15} />
          <span>Aadhaar linked: {formData.aadhaarMasked} — fields autofilled</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-actual-form">
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

        {isCommercial && (
          <InputField
            id="reg-businessName"
            name="businessName"
            label={formData.accountType === ACCOUNT_TYPES.WHOLESALER ? 'Wholesale Firm / Mill Name' : 'Retail Enterprise / Store Name'}
            placeholder="e.g. Royal Heritage Weaves Pvt Ltd"
            value={formData.businessName}
            onChange={handleChange}
            error={errors.businessName}
            leftIcon={Building2}
            required
          />
        )}

        <InputField
          id="reg-email"
          name="email"
          type="email"
          label="Business / Personal Email"
          placeholder="name@company.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          leftIcon={Mail}
          required
        />

        <InputField
          id="reg-password"
          name="password"
          label="Create Master Password"
          placeholder="At least 6 characters"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          leftIcon={Lock}
          isPassword
          required
        />

        <div className="registration-perk-summary">
          <CheckCircle2 size={16} className="perk-check" />
          <span>
            {formData.accountType === ACCOUNT_TYPES.WHOLESALER && 'Includes bulk price matrix, instant catalog syndication, and digital invoice generation.'}
            {formData.accountType === ACCOUNT_TYPES.RETAILER && 'Unlocks verified wholesale rates, credit line terms, and direct factory dispatch.'}
            {formData.accountType === ACCOUNT_TYPES.BUYER && 'Access luxury couture runways, artisan handloom certificates, and member-only showcases.'}
          </span>
        </div>

        <button
          type="submit"
          className="btn-primary-navy"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="btn-spinner-wrap">
              <span className="spinner-dot"></span> Creating Account...
            </span>
          ) : (
            'Complete Registration'
          )}
        </button>
      </form>

      <div className="auth-bottom-switch">
        <span>Already have an account? </span>
        <button
          type="button"
          className="create-account-link"
          onClick={onNavigateToLogin}
        >
          Sign In
        </button>
      </div>

      <AadhaarScannerModal
        isOpen={isAadhaarOpen}
        onClose={() => setIsAadhaarOpen(false)}
        onVerificationSuccess={handleAadhaarDone}
      />
    </div>
  );
}
