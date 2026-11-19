import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AppFooter from '../../components/AppFooter';
import Logo from '../../components/Logo';
import { Smartphone, CheckCircle2, AlertCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import { getCurrentSession } from '../../services/authService';

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phone = searchParams.get('phone') || '+91 98XXX XXXXX';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const inputsRef = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleDigitChange = (index, value) => {
    if (value.length > 1) {
      value = value.charAt(value.length - 1);
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setError('');
    const fullCode = otp.join('');

    if (fullCode.length < 6) {
      setError('Please enter all 6 digits of the OTP verification code.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerified(true);
    }, 900);
  };

  const handleResend = () => {
    setTimer(60);
    setOtp(['', '', '', '', '', '']);
    setError('');
    inputsRef.current[0]?.focus();
  };

  return (
    <div className="hub-site-wrapper">
      <Navbar />

      <section className="auth-minimal-section">
        <div className="site-container">
          <div className="auth-minimal-card">
            <Link to="/login" className="back-link">
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>

            <div className="text-center mb-6">
              <div className="otp-icon-wrap mx-auto">
                <Smartphone size={32} className="text-gold" />
              </div>
              <h1 className="form-main-heading mt-4">Two-Factor OTP Verification</h1>
              <p className="form-sub-heading">
                We have dispatched a 6-digit one-time password to <strong>{phone}</strong> via SMS and WhatsApp.
              </p>
            </div>

            {error && (
              <div className="auth-alert-box alert-danger">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {verified ? (
              <div className="auth-alert-box alert-success flex-col items-center text-center py-6">
                <CheckCircle2 size={44} className="text-gold mb-2" />
                <h4>Phone Identity Verified</h4>
                <p>Your session has been securely validated.</p>
                <button
                  type="button"
                  className="btn-primary-navy mt-4"
                  onClick={() => {
                    const session = getCurrentSession();
                    const path =
                      session?.accountType === 'Wholesaler'
                        ? '/wholesaler/dashboard'
                        : session?.accountType === 'Retailer'
                        ? '/retailer/dashboard'
                        : '/buyer/dashboard';
                    navigate(path);
                  }}
                >
                  Proceed to Dashboard
                </button>
              </div>
            ) : (
              <form onSubmit={handleVerify} className="otp-form-actual">
                <div className="otp-inputs-row">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputsRef.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      className="otp-digit-box"
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                <div className="otp-resend-row text-center my-4">
                  {timer > 0 ? (
                    <span className="timer-text">Resend code in <strong>{timer}s</strong></span>
                  ) : (
                    <button type="button" className="resend-otp-btn" onClick={handleResend}>
                      <RotateCcw size={14} />
                      <span>Resend OTP Code</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-primary-navy block-btn py-3"
                  disabled={isVerifying}
                >
                  {isVerifying ? 'Validating Token...' : 'Verify & Continue'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
