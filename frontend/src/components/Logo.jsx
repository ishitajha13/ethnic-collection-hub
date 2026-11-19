import React, { useState } from 'react';
import logoImg from '../assets/logo.jpg';

/**
 * Official ETHNIC COLLECTION HUB Brand Logo
 * Uses the user's official gold-embossed brandmark with woman silhouette,
 * floral jhumka, draped saree pallu, royal 'E' monogram, and lotus emblem.
 */
export default function Logo({ size = 'large', showTagline = false, className = '' }) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    large: 'logo-large-wrap',
    medium: 'logo-medium-wrap',
    compact: 'logo-compact-wrap',
    nav: 'logo-nav-wrap',
    icon: 'logo-icon-wrap',
  };

  const wrapClass = sizeClasses[size] || 'logo-medium-wrap';

  return (
    <div className={`ethnic-logo-container ${wrapClass} ${className}`}>
      <div className="logo-official-frame">
        {!imageError ? (
          <img
            src={logoImg}
            alt="ETHNIC COLLECTION HUB - Your Fashion. Your Business. One Marketplace."
            className="logo-official-img"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="logo-fallback-emblem">
            <span className="logo-fallback-initial">E</span>
            <div className="logo-fallback-texts">
              <span className="logo-fallback-title">ETHNIC</span>
              <span className="logo-fallback-sub">COLLECTION HUB</span>
            </div>
          </div>
        )}
      </div>

      {showTagline && (
        <div className="logo-tagline-text">
          <span>Your Fashion. Your Business. One Marketplace.</span>
        </div>
      )}
    </div>
  );
}
