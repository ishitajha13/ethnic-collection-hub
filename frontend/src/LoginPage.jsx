import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Sparkles, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import Logo from './components/Logo';
import CornerDecorations from './components/CornerDecorations';
import AccountCard from './components/AccountCard';
import InputField from './components/InputField';
import GoogleAuthButton from './components/GoogleAuthButton';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import RegisterForm from './components/RegisterForm';
import RoleDashboardPreview from './components/RoleDashboardPreview';
import Footer from './components/Footer';

import {
  ACCOUNT_TYPES,
  validateLoginForm,
  loginUser,
  googleSignIn,
  getRememberedEmail,
  getCurrentSession,
  logoutUser,
} from './services/authService';

export default function LoginPage() {
  // Navigation state: 'login' | 'register'
  const [currentView, setCurrentView] = useState('login');

  // Selected account type (Default: Wholesaler)
  const [selectedAccount, setSelectedAccount] = useState(ACCOUNT_TYPES.WHOLESALER);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Validation & feedback state
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [successBanner, setSuccessBanner] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Modals state
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  // Initialize Remembered Email or Active Session on Mount
  useEffect(() => {
    const remembered = getRememberedEmail();
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  // Account Type Configuration
  const accountCardsData = [
    {
      type: ACCOUNT_TYPES.WHOLESALER,
      title: 'Wholesaler',
      description: 'Access your wholesale business account.',
    },
    {
      type: ACCOUNT_TYPES.RETAILER,
      title: 'Retailer',
      description: 'Manage your purchases and resale business.',
    },
    {
      type: ACCOUNT_TYPES.BUYER,
      title: 'Buyer',
      description: 'Discover and shop ethnic fashion.',
    },
  ];

  // Handle Account Type Selection
  const handleAccountSelect = (type) => {
    setSelectedAccount(type);
    if (generalError) setGeneralError('');
    if (successBanner) setSuccessBanner('');
  };

  // Handle Field Input
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: '' }));
    }
    if (generalError) setGeneralError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: '' }));
    }
    if (generalError) setGeneralError('');
  };

  // Form Submit Handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessBanner('');

    // Form Validation
    const validation = validateLoginForm({ email, password });
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      const user = await loginUser({
        email,
        password,
        accountType: selectedAccount,
        rememberMe,
      });

      setSuccessBanner(`Welcome back to your ${selectedAccount} workspace!`);
      setAuthenticatedUser(user);
    } catch (err) {
      setGeneralError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth Handler
  const handleGoogleAuth = async () => {
    setGeneralError('');
    setSuccessBanner('');
    setIsGoogleLoading(true);

    try {
      const user = await googleSignIn(selectedAccount);
      setSuccessBanner(`Authenticated via Google for ${selectedAccount} profile.`);
      setAuthenticatedUser(user);
    } catch (err) {
      setGeneralError(err.message || 'Google authentication was cancelled.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Quick Demo Auto-fill Helper
  const handleQuickFill = (role) => {
    setSelectedAccount(role);
    const domain = 'ethniccollectionhub.com';
    const roleSlug = role.toLowerCase();
    setEmail(`${roleSlug}@${domain}`);
    setPassword('HauteCouture2026!');
    setFieldErrors({});
    setGeneralError('');
  };

  return (
    <div className="hub-page-wrapper">
      {/* Main Two-Section Split Layout */}
      <main className="hub-split-layout">
        
        {/* ========================================================= */}
        {/* LEFT SECTION – BRANDING PANEL (40%)                       */}
        {/* ========================================================= */}
        <section className="branding-panel" aria-label="Brand Presentation">
          {/* Subtle Curved Golden Decorative Lines in Top-Left & Bottom-Right */}
          <CornerDecorations />

          <div className="branding-content-wrap">
            {/* Centered Logo with Golden Silhouette in Letterform */}
            <div className="branding-logo-box">
              <Link to="/" style={{ textDecoration: 'none' }} title="ETHNIC COLLECTION HUB Storefront">
                <Logo size="large" />
              </Link>
            </div>

            {/* Subtle Gold Decorative Separator */}
            <div className="golden-divider" aria-hidden="true">
              <span className="gold-ornament-line"></span>
              <span className="gold-ornament-gem">◆</span>
              <span className="gold-ornament-line"></span>
            </div>

            {/* Slogan in Elegant Italic White Serif Typography */}
            <div className="branding-tagline-box">
              <p className="branding-slogan">
                “Your Fashion. Your Business.<br />
                <span className="slogan-emphasis">One Marketplace.”</span>
              </p>
            </div>

            {/* Subtle Gold Decorative Separator */}
            <div className="golden-divider" aria-hidden="true">
              <span className="gold-ornament-line"></span>
              <span className="gold-ornament-gem">✦</span>
              <span className="gold-ornament-line"></span>
            </div>

            {/* Subtle Royal Trust Pillars */}
            <div className="branding-trust-pillars">
              <div className="trust-pillar-item">
                <span className="pillar-num">50,000+</span>
                <span className="pillar-label">Ethnic Designs</span>
              </div>
              <div className="pillar-sep">|</div>
              <div className="trust-pillar-item">
                <span className="pillar-num">100%</span>
                <span className="pillar-label">Artisan Verified</span>
              </div>
              <div className="pillar-sep">|</div>
              <div className="trust-pillar-item">
                <span className="pillar-num">B2B & B2C</span>
                <span className="pillar-label">Integrated Hub</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* RIGHT SECTION – LOGIN PANEL (60%)                        */}
        {/* ========================================================= */}
        <section className="login-panel" aria-label="Sign In Panel">
          <div className="login-panel-inner">
            
            {/* View Switcher: Login or Register */}
            {currentView === 'register' ? (
              <RegisterForm
                selectedAccountType={selectedAccount}
                onNavigateToLogin={() => setCurrentView('login')}
                onRegistrationSuccess={(newUser) => {
                  setAuthenticatedUser(newUser);
                  setCurrentView('login');
                }}
              />
            ) : (
              <div className="auth-form-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <Link to="/" style={{ color: '#D6A12B', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <ArrowLeft size={15} /> Return to Storefront
                  </Link>
                  <Link to="/aadhaar-scan" style={{ color: '#062945', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none', background: '#F7E7C4', padding: '3px 10px', borderRadius: '12px' }}>
                    Aadhaar KYC Scan
                  </Link>
                </div>
                
                {/* 1. Main Heading & Subtitle */}
                <div className="form-header-group">
                  <h2 className="form-main-heading">Welcome Back</h2>
                  <p className="form-sub-heading">
                    Sign in to continue to your account.
                  </p>
                </div>

                {/* Feedback Banners */}
                {generalError && (
                  <div className="auth-alert-box alert-danger" role="alert">
                    <AlertCircle size={18} className="alert-icon" />
                    <span>{generalError}</span>
                  </div>
                )}

                {successBanner && (
                  <div className="auth-alert-box alert-success" role="status">
                    <CheckCircle2 size={18} className="alert-icon" />
                    <span>{successBanner}</span>
                  </div>
                )}

                {/* 2. Account Type Selection */}
                <div className="account-type-section">
                  <div className="account-type-header-row">
                    <h3 className="account-type-heading">Select your account type</h3>
                    <span className="active-type-pill">
                      Active: <strong>{selectedAccount}</strong>
                    </span>
                  </div>

                  <div
                    className="account-cards-grid"
                    role="radiogroup"
                    aria-label="Account Types"
                  >
                    {accountCardsData.map((item) => (
                      <AccountCard
                        key={item.type}
                        type={item.type}
                        title={item.title}
                        description={item.description}
                        isSelected={selectedAccount === item.type}
                        onSelect={handleAccountSelect}
                      />
                    ))}
                  </div>
                </div>

                {/* 3. Login Form */}
                <form onSubmit={handleLoginSubmit} className="auth-actual-form" noValidate>
                  {/* Email Address Field */}
                  <InputField
                    id="login-email"
                    name="email"
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={handleEmailChange}
                    error={fieldErrors.email}
                    leftIcon={Mail}
                    autoComplete="email"
                    required
                  />

                  {/* Password Field */}
                  <InputField
                    id="login-password"
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    error={fieldErrors.password}
                    leftIcon={Lock}
                    isPassword
                    autoComplete="current-password"
                    required
                  />

                  {/* Remember Me & Forgot Password Row */}
                  <div className="form-aux-row">
                    <label className="checkbox-label" htmlFor="remember-me-checkbox">
                      <input
                        type="checkbox"
                        id="remember-me-checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="custom-checkbox"
                      />
                      <span className="checkbox-text">Remember Me</span>
                    </label>

                    <button
                      type="button"
                      className="forgot-password-link"
                      onClick={() => setIsForgotPasswordOpen(true)}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* 4. Login Button */}
                  <button
                    type="submit"
                    className="btn-primary-navy"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="btn-spinner-wrap">
                        <span className="spinner-dot"></span> Authenticating...
                      </span>
                    ) : (
                      'Log In'
                    )}
                  </button>

                  {/* Quick Role Fill Hint Bar */}
                  <div className="demo-credentials-bar">
                    <span className="demo-label">Quick Demo Access:</span>
                    <button
                      type="button"
                      className={`demo-pill ${selectedAccount === ACCOUNT_TYPES.WHOLESALER ? 'active' : ''}`}
                      onClick={() => handleQuickFill(ACCOUNT_TYPES.WHOLESALER)}
                    >
                      Wholesaler
                    </button>
                    <button
                      type="button"
                      className={`demo-pill ${selectedAccount === ACCOUNT_TYPES.RETAILER ? 'active' : ''}`}
                      onClick={() => handleQuickFill(ACCOUNT_TYPES.RETAILER)}
                    >
                      Retailer
                    </button>
                    <button
                      type="button"
                      className={`demo-pill ${selectedAccount === ACCOUNT_TYPES.BUYER ? 'active' : ''}`}
                      onClick={() => handleQuickFill(ACCOUNT_TYPES.BUYER)}
                    >
                      Buyer
                    </button>
                  </div>

                  {/* 5. Google Authentication */}
                  <GoogleAuthButton
                    onGoogleClick={handleGoogleAuth}
                    isLoading={isGoogleLoading}
                  />

                  {/* 6. Registration Link */}
                  <div className="registration-prompt-row">
                    <span className="prompt-text">Don't have an account? </span>
                    <button
                      type="button"
                      className="create-account-link"
                      onClick={() => setCurrentView('register')}
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ========================================================= */}
      {/* 8. FOOTER                                                 */}
      {/* ========================================================= */}
      <Footer />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        defaultEmail={email}
      />

      {/* Authenticated Dashboard / Authorization Preview Modal */}
      <RoleDashboardPreview
        user={authenticatedUser}
        onLogout={() => {
          logoutUser();
          setAuthenticatedUser(null);
          setSuccessBanner('');
        }}
      />
    </div>
  );
}
