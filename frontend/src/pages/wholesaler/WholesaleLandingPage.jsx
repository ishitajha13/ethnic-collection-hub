
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ecommerce.css';

export default function WholesaleLandingPage() {
  return (
    <div className="wholesale-landing">

      {/* Header */}
      <header className="wholesale-header">
        <Link to="/" className="wholesale-logo">
          ETHNIC COLLECTION HUB
        </Link>

        <Link
          to="/wholesaler/login"
          className="wholesale-header-login"
        >
          Login
        </Link>
      </header>

      {/* Hero Section */}
      <section className="wholesale-hero">
        <div className="wholesale-hero-content">

          <span className="wholesale-tag">
            WHOLESALE COLLECTION
          </span>

          <h1>
            Your Trusted Partner
            <br />
            in Ethnic Fashion
          </h1>

          <p>
            Discover beautiful ethnic wear at exclusive
            wholesale prices. Grow your business with
            our premium collections.
          </p>

          <div className="wholesale-hero-buttons">
            <Link
              to="/wholesaler/login"
              className="wholesale-btn wholesale-btn-primary"
            >
              Wholesaler Login
            </Link>

            <Link
              to="/wholesaler/register"
              className="wholesale-btn wholesale-btn-secondary"
            >
              Become a Wholesaler
            </Link>
          </div>

        </div>
      </section>

      {/* Benefits Section */}
      <section className="wholesale-benefits">
        <h2>Why Partner With Us?</h2>

        <div className="wholesale-benefit-grid">

          <div className="wholesale-benefit-card">
            <span className="wholesale-benefit-number">01</span>
            <h3>Premium Collections</h3>
            <p>
              Explore elegant ethnic wear collections
              designed for your customers.
            </p>
          </div>

          <div className="wholesale-benefit-card">
            <span className="wholesale-benefit-number">02</span>
            <h3>Exclusive Trade Pricing</h3>
            <p>
              Enjoy special wholesale pricing
              on bulk purchases.
            </p>
          </div>

          <div className="wholesale-benefit-card">
            <span className="wholesale-benefit-number">03</span>
            <h3>Easy Order Management</h3>
            <p>
              Manage your wholesale orders,
              payments and invoices conveniently.
            </p>
          </div>

        </div>
      </section>

      {/* Call to Action */}
      <section className="wholesale-bottom-cta">
        <span>YOUR BUSINESS, OUR COLLECTION</span>

        <h2>
          Ready to Grow
          <br />
          Your Business?
        </h2>

        <p>
          Join our wholesale network and discover
          a better way to source ethnic fashion.
        </p>

        <Link
          to="/wholesaler/register"
          className="wholesale-btn wholesale-btn-primary"
        >
          Register as Wholesaler
        </Link>
      </section>

      {/* Footer */}
      <footer className="wholesale-footer">
        <span>ETHNIC COLLECTION HUB</span>
        <p>
          © {new Date().getFullYear()} Ethnic Collection Hub.
          All rights reserved.
        </p>
      </footer>

    </div>
  );
}
