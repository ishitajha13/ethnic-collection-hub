import React from 'react';

/**
 * Subtle curved golden decorative lines for branding panel corners
 * Intricately crafted ethnic / luxury motif curves
 */
export default function CornerDecorations() {
  return (
    <>
      {/* Top Left Golden Curved Lines */}
      <div className="corner-decor corner-top-left" aria-hidden="true">
        <svg
          viewBox="0 0 280 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="corner-svg"
        >
          <defs>
            <linearGradient id="cornerGoldGradTL" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D6A12B" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#E5B84A" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#D6A12B" stopOpacity="0.02" />
            </linearGradient>
            <radialGradient id="cornerGlowTL" cx="0%" cy="0%" r="80%">
              <stop offset="0%" stopColor="#D6A12B" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#062945" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Corner Ambient Glow */}
          <rect width="280" height="280" fill="url(#cornerGlowTL)" />

          {/* Concentric Decorative Arcs */}
          <path
            d="M 0 50 C 70 50, 110 70, 140 100 C 170 130, 190 170, 190 240"
            stroke="url(#cornerGoldGradTL)"
            strokeWidth="1.2"
          />
          <path
            d="M 0 90 C 60 90, 95 105, 120 130 C 145 155, 160 190, 160 250"
            stroke="url(#cornerGoldGradTL)"
            strokeWidth="0.8"
            strokeDasharray="3 3"
          />
          <path
            d="M 0 130 C 50 130, 80 145, 100 165 C 120 185, 130 215, 130 260"
            stroke="url(#cornerGoldGradTL)"
            strokeWidth="1"
          />
          <path
            d="M 0 180 C 40 180, 60 190, 75 205 C 90 220, 95 240, 95 270"
            stroke="url(#cornerGoldGradTL)"
            strokeWidth="0.75"
          />

          {/* Elegant Paisley / Floral Flourish Tendril */}
          <path
            d="M 0 15 C 45 15, 95 35, 135 75 C 175 115, 195 165, 195 210 C 195 240, 175 255, 155 240 C 135 225, 145 195, 165 190 C 180 185, 190 195, 185 210"
            stroke="url(#cornerGoldGradTL)"
            strokeWidth="1.4"
          />

          {/* Small Star & Dot Ornaments */}
          <circle cx="50" cy="50" r="1.5" fill="#D6A12B" opacity="0.6" />
          <circle cx="100" cy="95" r="1.5" fill="#D6A12B" opacity="0.7" />
          <circle cx="140" cy="140" r="2" fill="#E5B84A" opacity="0.8" />
          <circle cx="170" cy="190" r="1.5" fill="#D6A12B" opacity="0.6" />
        </svg>
      </div>

      {/* Bottom Right Golden Curved Lines */}
      <div className="corner-decor corner-bottom-right" aria-hidden="true">
        <svg
          viewBox="0 0 280 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="corner-svg"
        >
          <defs>
            <linearGradient id="cornerGoldGradBR" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#D6A12B" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#E5B84A" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#D6A12B" stopOpacity="0.02" />
            </linearGradient>
            <radialGradient id="cornerGlowBR" cx="100%" cy="100%" r="80%">
              <stop offset="0%" stopColor="#D6A12B" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#062945" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Corner Ambient Glow */}
          <rect width="280" height="280" fill="url(#cornerGlowBR)" />

          {/* Concentric Decorative Arcs */}
          <path
            d="M 280 230 C 210 230, 170 210, 140 180 C 110 150, 90 110, 90 40"
            stroke="url(#cornerGoldGradBR)"
            strokeWidth="1.2"
          />
          <path
            d="M 280 190 C 220 190, 185 175, 160 150 C 135 125, 120 90, 120 30"
            stroke="url(#cornerGoldGradBR)"
            strokeWidth="0.8"
            strokeDasharray="3 3"
          />
          <path
            d="M 280 150 C 230 150, 200 135, 180 115 C 160 95, 150 65, 150 20"
            stroke="url(#cornerGoldGradBR)"
            strokeWidth="1"
          />
          <path
            d="M 280 100 C 240 100, 220 90, 205 75 C 190 60, 185 40, 185 10"
            stroke="url(#cornerGoldGradBR)"
            strokeWidth="0.75"
          />

          {/* Flowing Paisley Tendril */}
          <path
            d="M 280 265 C 235 265, 185 245, 145 205 C 105 165, 85 115, 85 70 C 85 40, 105 25, 125 40 C 145 55, 135 85, 115 90 C 100 95, 90 85, 95 70"
            stroke="url(#cornerGoldGradBR)"
            strokeWidth="1.4"
          />

          {/* Dot Ornaments */}
          <circle cx="230" cy="230" r="1.5" fill="#D6A12B" opacity="0.6" />
          <circle cx="180" cy="185" r="1.5" fill="#D6A12B" opacity="0.7" />
          <circle cx="140" cy="140" r="2" fill="#E5B84A" opacity="0.8" />
          <circle cx="110" cy="90" r="1.5" fill="#D6A12B" opacity="0.6" />
        </svg>
      </div>
    </>
  );
}
