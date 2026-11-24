import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2,
  ArrowLeft, Shield, KeyRound, X, Send
} from 'lucide-react';
import {
  bluecoreLogin,
  bluecoreRequestPasswordReset,
  validateBluecoreLoginForm,
  BC_ROLES,
  BC_DASHBOARD_ROUTES,
  getBluecoreSession,
} from '../../services/bluecoreAuthService';
import './BluecoreLoginPage.css';

/* ─── Forgot Password Modal ─────────────────────────────────────────────── */
function ForgotPasswordModal({ isOpen, onClose, prefillEmail }) {
  const [email, setEmail] = useState(prefillEmail || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setEmail(prefillEmail || '');
      setMessage('');
      setError('');
    }
  }, [isOpen, prefillEmail]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    try {
      const res = await bluecoreRequestPasswordReset(email);
      setMessage(res.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bc-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bc-modal-card" role="dialog" aria-modal="true" aria-labelledby="bc-modal-title">
        <button className="bc-modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="bc-modal-icon-wrap">
          <KeyRound size={26} />
        </div>

        <h2 className="bc-modal-heading" id="bc-modal-title">Reset Password</h2>
        <p className="bc-modal-subtext">
          Enter your registered work email. We'll send a secure reset link to your inbox.
        </p>

        {error && (
          <div className="bc-alert bc-alert-error" role="alert">
            <AlertCircle size={16} className="bc-alert-icon" />
            <span>{error}</span>
          </div>
        )}
        {message && (
          <div className="bc-alert bc-alert-success" role="status">
            <CheckCircle2 size={16} className="bc-alert-icon" />
            <span>{message}</span>
          </div>
        )}

        {!message && (
          <form onSubmit={handleSubmit}>
            <div className="bc-field-group">
              <label className="bc-field-label" htmlFor="bc-reset-email">
                Work Email <span className="bc-required-star">*</span>
              </label>
              <div className="bc-input-wrap">
                <span className="bc-input-icon"><Mail size={17} /></span>
                <input
                  id="bc-reset-email"
                  type="email"
                  className="bc-input"
                  placeholder="yourname@bluecore.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="bc-modal-submit-btn"
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? (
                <><span className="bc-spinner" /> Sending Reset Link…</>
              ) : (
                <><Send size={16} /> Send Reset Link</>
              )}
            </button>
          </form>
        )}

        {message && (
          <button className="bc-modal-submit-btn" onClick={onClose} style={{ marginTop: 0 }}>
            Back to Sign In
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── BLUECORE Logo SVG ──────────────────────────────────────────────────── */
function BluecoreLogo() {
  return (
    <svg className="bc-emblem-svg" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shield base */}
      <path
        d="M25 4L8 11V25C8 34.5 15.5 43.1 25 46C34.5 43.1 42 34.5 42 25V11L25 4Z"
        fill="none"
        stroke="#D6A12B"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* B letter */}
      <text
        x="17"
        y="32"
        fontFamily="Georgia, serif"
        fontSize="20"
        fontWeight="bold"
        fill="#D6A12B"
        letterSpacing="-1"
      >BC</text>
    </svg>
  );
}

/* ─── Corner SVG Decoration ──────────────────────────────────────────────── */
function CornerDecor({ position }) {
  const isTL = position === 'tl';
  return (
    <div className={`bc-corner ${isTL ? 'bc-corner-tl' : 'bc-corner-br'}`} aria-hidden="true">
      <svg
        viewBox="0 0 280 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={isTL ? {} : { transform: 'rotate(180deg)' }}
        width="280"
        height="280"
      >
        <path d="M0 0 Q280 0 280 280" stroke="rgba(214,161,43,0.12)" strokeWidth="1" fill="none" />
        <path d="M0 0 Q230 0 230 230" stroke="rgba(214,161,43,0.09)" strokeWidth="1" fill="none" />
        <path d="M0 0 Q180 0 180 180" stroke="rgba(214,161,43,0.07)" strokeWidth="1" fill="none" />
        <circle cx="20" cy="20" r="3" fill="rgba(214,161,43,0.3)" />
        <circle cx="40" cy="40" r="1.5" fill="rgba(214,161,43,0.2)" />
      </svg>
    </div>
  );
}

/* ─── Main Login Page ────────────────────────────────────────────────────── */
export default function BluecoreLoginPage() {
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Feedback state
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modal
  const [forgotOpen, setForgotOpen] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    const session = getBluecoreSession();
    if (session?.role) {
      navigate(BC_DASHBOARD_ROUTES[session.role] || '/bluecore/admin', { replace: true });
    }
  }, [navigate]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const clearErrors = () => {
    if (generalError) setGeneralError('');
    if (successMsg) setSuccessMsg('');
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: '' }));
    clearErrors();
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: '' }));
    clearErrors();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMsg('');

    // Client-side validation
    const { isValid, errors } = validateBluecoreLoginForm({ email, password });
    if (!isValid) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const user = await bluecoreLogin({ email, password });
      setSuccessMsg(`Welcome back, ${user.name}! Redirecting to your workspace…`);
      setTimeout(() => {
        const dest = BC_DASHBOARD_ROUTES[user.role] || '/bluecore/admin';
        navigate(dest, { replace: true });
      }, 900);
    } catch (err) {
      setGeneralError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick demo credential fill
  const handleDemoFill = (role) => {
    if (role === BC_ROLES.ADMIN) {
      setEmail('admin@bluecore.com');
      setPassword('Admin@2026!');
    } else {
      setEmail('staff@bluecore.com');
      setPassword('Staff@2026!');
    }
    setFieldErrors({});
    setGeneralError('');
    setSuccessMsg('');
  };

  return (
    <div className="bc-login-root">
      <div className="bc-login-layout">

        {/* ══════════════════════════════════════════════════
            LEFT — Brand Panel
            ══════════════════════════════════════════════════ */}
        <section className="bc-brand-panel" aria-label="BLUECORE Brand Presentation">
          <CornerDecor position="tl" />
          <CornerDecor position="br" />
          <div className="bc-brand-shimmer" aria-hidden="true" />

          <div className="bc-brand-content">
            {/* Logo */}
            <div className="bc-logo-mark">
              <div className="bc-logo-emblem">
                <BluecoreLogo />
              </div>
              <div className="bc-logo-wordmark">
                <span className="bc-wordmark-primary">
                  BLUE<span>CORE</span>
                </span>
                <span className="bc-wordmark-tagline">Employer & Staff Management</span>
              </div>
            </div>

            {/* Gold ornament divider */}
            <div className="bc-gold-divider" aria-hidden="true">
              <span className="bc-divider-line" />
              <span className="bc-divider-gem">◆</span>
              <span className="bc-divider-line" />
            </div>

            {/* Tagline */}
            <p className="bc-brand-tagline">
              "One Platform.
              <span className="bc-tagline-accent">Every Workforce Solution."</span>
            </p>

            {/* Gold ornament divider */}
            <div className="bc-gold-divider" aria-hidden="true">
              <span className="bc-divider-line" />
              <span className="bc-divider-gem">✦</span>
              <span className="bc-divider-line" />
            </div>

            {/* Trust pillars */}
            <div className="bc-trust-row">
              <div className="bc-trust-item">
                <span className="bc-trust-num">500+</span>
                <span className="bc-trust-label">Employees Managed</span>
              </div>
              <span className="bc-trust-sep">|</span>
              <div className="bc-trust-item">
                <span className="bc-trust-num">99.9%</span>
                <span className="bc-trust-label">System Uptime</span>
              </div>
              <span className="bc-trust-sep">|</span>
              <div className="bc-trust-item">
                <span className="bc-trust-num">Role</span>
                <span className="bc-trust-label">Based Access</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            RIGHT — Login Form Panel
            ══════════════════════════════════════════════════ */}
        <section className="bc-form-panel" aria-label="Sign In Panel">
          <div className="bc-form-inner">

            {/* Top bar */}
            <div className="bc-form-topbar">
              <Link to="/" className="bc-back-link">
                <ArrowLeft size={15} />
                Back to Storefront
              </Link>
              <span className="bc-portal-badge">
                <span className="bc-portal-dot" />
                Secure Portal
              </span>
            </div>

            {/* Heading */}
            <div className="bc-form-header">
              <h1 className="bc-form-heading">Welcome Back</h1>
              <p className="bc-form-subtitle">Sign in to access your workspace.</p>
            </div>

            {/* Error banner */}
            {generalError && (
              <div className="bc-alert bc-alert-error" role="alert">
                <AlertCircle size={17} className="bc-alert-icon" />
                <span>{generalError}</span>
              </div>
            )}

            {/* Success banner */}
            {successMsg && (
              <div className="bc-alert bc-alert-success" role="status">
                <CheckCircle2 size={17} className="bc-alert-icon" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form className="bc-auth-form" onSubmit={handleSubmit} noValidate>

              {/* Email field */}
              <div className={`bc-field-group${fieldErrors.email ? ' has-error' : ''}`}>
                <label className="bc-field-label" htmlFor="bc-email">
                  Email Address <span className="bc-required-star">*</span>
                </label>
                <div className="bc-input-wrap">
                  <span className="bc-input-icon"><Mail size={17} /></span>
                  <input
                    id="bc-email"
                    type="email"
                    className={`bc-input${fieldErrors.email ? ' bc-input-error' : ''}`}
                    placeholder="yourname@bluecore.com"
                    value={email}
                    onChange={handleEmailChange}
                    autoComplete="email"
                    required
                    aria-describedby={fieldErrors.email ? 'bc-email-error' : undefined}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="bc-field-error" id="bc-email-error" role="alert">
                    <AlertCircle size={13} />
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div className={`bc-field-group${fieldErrors.password ? ' has-error' : ''}`}>
                <label className="bc-field-label" htmlFor="bc-password">
                  Password <span className="bc-required-star">*</span>
                </label>
                <div className="bc-input-wrap">
                  <span className="bc-input-icon"><Lock size={17} /></span>
                  <input
                    id="bc-password"
                    type={showPassword ? 'text' : 'password'}
                    className={`bc-input${fieldErrors.password ? ' bc-input-error' : ''}`}
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    autoComplete="current-password"
                    required
                    style={{ paddingRight: '44px' }}
                    aria-describedby={fieldErrors.password ? 'bc-pw-error' : undefined}
                  />
                  <button
                    type="button"
                    className="bc-pw-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={0}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="bc-field-error" id="bc-pw-error" role="alert">
                    <AlertCircle size={13} />
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Remember + Forgot row */}
              <div className="bc-aux-row">
                <label className="bc-remember-label" htmlFor="bc-remember">
                  <input
                    id="bc-remember"
                    type="checkbox"
                    className="bc-remember-check"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="bc-forgot-btn"
                  onClick={() => setForgotOpen(true)}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Sign In button */}
              <button type="submit" className="bc-signin-btn" disabled={isLoading}>
                <span className="bc-signin-btn-gold-accent" />
                {isLoading ? (
                  <span className="bc-btn-loading">
                    <span className="bc-spinner" />
                    Authenticating…
                  </span>
                ) : (
                  <>
                    <Shield size={18} />
                    Sign In
                  </>
                )}
              </button>

              {/* Demo credentials */}
              <div className="bc-demo-strip">
                <span className="bc-demo-label">Demo Access:</span>
                <button
                  type="button"
                  className="bc-demo-pill"
                  onClick={() => handleDemoFill(BC_ROLES.ADMIN)}
                >
                  Admin / Employer
                </button>
                <button
                  type="button"
                  className="bc-demo-pill"
                  onClick={() => handleDemoFill(BC_ROLES.STAFF)}
                >
                  Staff / Employee
                </button>
              </div>

            </form>

            {/* Footer note */}
            <p className="bc-form-footer-note">
              New employee accounts are created by your administrator.
              <br />
              For access issues, contact{' '}
              <a href="mailto:hr@bluecore.com" className="bc-footer-link">
                hr@bluecore.com
              </a>
            </p>

          </div>
        </section>
      </div>

      {/* Page Footer */}
      <footer className="bc-login-footer">
        © {new Date().getFullYear()} BLUECORE · Employer & Staff Management System ·{' '}
        <a href="mailto:support@bluecore.com">support@bluecore.com</a>
      </footer>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={forgotOpen}
        onClose={() => setForgotOpen(false)}
        prefillEmail={email}
      />
    </div>
  );
}
