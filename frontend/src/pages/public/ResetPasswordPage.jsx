import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AppFooter from '../../components/AppFooter';
import Logo from '../../components/Logo';
import InputField from '../../components/InputField';
import { Lock, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || 'your account';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please retype carefully.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 800);
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
              <h1 className="form-main-heading mt-4">Reset Account Password</h1>
              <p className="form-sub-heading">
                Create a new strong password for {emailParam}.
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
                <CheckCircle2 size={40} className="text-gold mb-2" />
                <h4>Password Updated Successfully</h4>
                <p>Your master security credentials have been updated.</p>
                <Link to="/login" className="btn-primary-navy mt-4">
                  Sign In with New Password
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="auth-actual-form">
                <InputField
                  id="reset-password"
                  name="password"
                  label="New Password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={Lock}
                  isPassword
                  required
                />

                <InputField
                  id="reset-confirmPassword"
                  name="confirmPassword"
                  label="Confirm New Password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  leftIcon={Lock}
                  isPassword
                  required
                />

                <button
                  type="submit"
                  className="btn-primary-navy block-btn py-3"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating Password...' : 'Update Password & Access Account'}
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
