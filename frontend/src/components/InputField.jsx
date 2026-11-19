import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

/**
 * Reusable Luxury Input Field Component
 */
export default function InputField({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  leftIcon: LeftIcon,
  isPassword = false,
  required = false,
  autoComplete,
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`form-field-group ${error ? 'has-error' : ''}`}>
      {label && (
        <label htmlFor={id} className="form-field-label">
          {label} {required && <span className="required-star">*</span>}
        </label>
      )}

      <div className="input-control-wrapper">
        {LeftIcon && (
          <span className="input-icon-left" aria-hidden="true">
            <LeftIcon size={19} strokeWidth={1.8} />
          </span>
        )}

        <input
          id={id}
          name={name}
          type={resolvedType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`input-element ${LeftIcon ? 'has-left-icon' : ''} ${
            isPassword ? 'has-right-icon' : ''
          }`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />

        {isPassword && (
          <button
            type="button"
            className="input-password-toggle-btn"
            onClick={togglePasswordVisibility}
            tabIndex={0}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff size={18} strokeWidth={1.8} />
            ) : (
              <Eye size={18} strokeWidth={1.8} />
            )}
          </button>
        )}
      </div>

      {error && (
        <div id={`${id}-error`} className="form-error-msg" role="alert">
          <AlertCircle size={14} className="error-icon" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
