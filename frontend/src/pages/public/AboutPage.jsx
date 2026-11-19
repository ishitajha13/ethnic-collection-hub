import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AppFooter from '../../components/AppFooter';
import Logo from '../../components/Logo';
import { Sparkles, ShieldCheck, Award, HeartHandshake, MapPin, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="hub-site-wrapper">
      <Navbar />

      {/* Hero Header */}
      <section className="about-hero-section">
        <div className="site-container text-center">
          <div className="badge-luxury-pill mx-auto">
            <Sparkles size={14} className="pill-sparkle" />
            <span>Heritage • Integrity • Craftsmanship</span>
          </div>
          <h1 className="page-hero-title">Preserving India’s Regal Weaving Legacy</h1>
          <p className="page-hero-subtitle">
            “Your Fashion. Your Business. One Marketplace.”
          </p>
        </div>
      </section>

      {/* Main Story */}
      <section className="about-content-section">
        <div className="site-container">
          <div className="about-story-grid">
            <div className="about-text-column">
              <h2>The Genesis of ETHNIC COLLECTION HUB</h2>
              <p>
                Founded in New Delhi, ETHNIC COLLECTION HUB was conceived to bridge the historic chasm between remote master-weaving clusters and modern commercial supply chains. For centuries, Indian ethnic wear—from the gold-gilded kadhwa brocades of Varanasi to the temple-bordered silks of Kanchipuram—has represented the zenith of textile artistry.
              </p>
              <p>
                Yet, the industry has long remained fragmented across layers of intermediaries, inflating retail costs while shrinking weaver livelihoods. ETHNIC COLLECTION HUB establishes an open, digital marketplace providing specialized commercial channels for <strong>Wholesalers</strong>, <strong>Retailers</strong>, and <strong>Couture Shoppers</strong>.
              </p>

              <div className="about-pillars-list">
                <div className="about-pillar-row">
                  <Award size={24} className="text-gold" />
                  <div>
                    <h4>100% Certified Artisan Provenance</h4>
                    <p>Every handloom product carries Silk Mark and Handloom Mark authenticity accreditation.</p>
                  </div>
                </div>

                <div className="about-pillar-row">
                  <ShieldCheck size={24} className="text-gold" />
                  <div>
                    <h4>Wholesale MOQ Discipline</h4>
                    <p>Enforcing a strict 12-set minimum for wholesale accounts protects trade margins for registered merchants.</p>
                  </div>
                </div>

                <div className="about-pillar-row">
                  <HeartHandshake size={24} className="text-gold" />
                  <div>
                    <h4>Cashless Integrity & Strict Damage Policy</h4>
                    <p>All-digital UPI transactions and a clear 5-day damage-only return window ensure fair, transparent commerce.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-media-column">
              <div className="about-imagery-card">
                <img
                  src="https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80"
                  alt="Weaving loom in Varanasi"
                  className="about-showcase-img"
                />
                <div className="about-card-stat">
                  <span className="stat-large">12,000+</span>
                  <span className="stat-label">Artisan Weaving Looms Empowered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clusters Showcase */}
      <section className="about-clusters-section">
        <div className="site-container">
          <div className="section-title-wrap text-center">
            <span className="sub-title-accent">Indian Weaving Geographies</span>
            <h2 className="section-main-heading">Direct Cluster Partnerships</h2>
          </div>

          <div className="clusters-grid">
            <div className="cluster-card">
              <span className="cluster-state">Uttar Pradesh</span>
              <h3>Varanasi & Lucknow</h3>
              <p>Kadhwa brocades, Tanchoi silks, and GI-certified Chikankari embroidery.</p>
            </div>
            <div className="cluster-card">
              <span className="cluster-state">Tamil Nadu</span>
              <h3>Kanchipuram & Arani</h3>
              <p>Heavy mulberry Korvai silk sarees with temple motifs and tested zari.</p>
            </div>
            <div className="cluster-card">
              <span className="cluster-state">Rajasthan</span>
              <h3>Jaipur & Kota</h3>
              <p>Hand-embroidered zardozi bridal lehengas, gota patti, and bandhej drapes.</p>
            </div>
            <div className="cluster-card">
              <span className="cluster-state">Madhya Pradesh</span>
              <h3>Chanderi & Maheshwar</h3>
              <p>Featherlight silk-cotton weaves with gold zari booti accents.</p>
            </div>
          </div>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
