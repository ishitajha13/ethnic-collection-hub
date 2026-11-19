import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AppFooter from '../../components/AppFooter';
import Logo from '../../components/Logo';
import InputField from '../../components/InputField';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { requestPasswordReset } from '../../services/authService';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const res = await requestPasswordReset(email);
      setSuccess(res.message);
    } catch (err) {
      setError(err.message || 'Failed to dispatch reset instructions.');
    } finally {
      setIsLoading(false);
    }
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
              <Logo size="compact" />
              <h1 className="form-main-heading mt-4">Recover Password</h1>
              <p className="form-sub-heading">
                Enter your registered email address to receive password reset instructions.
              </p>
            </div>

            {error && (
              <div className="auth-alert-box alert-danger">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {success ? (
              <div className="auth-alert-box alert-success flex-col items-center text-center py-6">
                <CheckCircle2 size={36} className="text-gold mb-2" />
                <h4>Reset Email Dispatched</h4>
                <p>{success}</p>
                <div className="mt-4 flex gap-3">
                  <Link to={`/reset-password?email=${encodeURIComponent(email)}`} className="btn-primary-navy">
                    Proceed to Reset Screen
                  </Link>
                  <Link to="/login" className="btn-modal-cancel">
                    Return to Login
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="auth-actual-form">
                <InputField
                  id="forgot-email"
                  name="email"
                  type="email"
                  label="Registered Email Address"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={Mail}
                  required
                />

                <button
                  type="submit"
                  className="btn-primary-navy block-btn py-3"
                  disabled={isLoading}
                >
                  {isLoading ? 'Dispatching Instructions...' : 'Send Password Reset Link'}
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
