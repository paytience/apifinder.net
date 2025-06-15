import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div className="static-page">
      <div className="static-page-container">
        <div className="static-page-header">
          <h1>About API Finder</h1>
          <p>Discover the perfect APIs for your next project</p>
        </div>

        <div className="static-page-content">
          <section className="about-section">
            <h2>Our Mission</h2>
            <p>
              API Finder is dedicated to making API discovery simple and efficient for developers worldwide. 
              We provide a comprehensive, searchable database of free APIs to help you build amazing applications 
              without the hassle of searching through countless resources.
            </p>
          </section>

          <section className="about-section">
            <h2>What We Offer</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>🔍 Smart Search</h3>
                <p>Find APIs quickly with our intelligent search and filtering system.</p>
              </div>
              <div className="feature-card">
                <h3>📊 Comprehensive Database</h3>
                <p>Access thousands of free APIs across multiple categories and use cases.</p>
              </div>
              <div className="feature-card">
                <h3>⚡ Regular Updates</h3>
                <p>Our database is constantly updated with the latest APIs and information.</p>
              </div>
              <div className="feature-card">
                <h3>💎 Premium Features</h3>
                <p>Unlock advanced search, favorites, and unlimited access with our Pro plan.</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Join Our Community</h2>
            <p>
              Ready to supercharge your development workflow? 
              <Link to="/register" className="inline-link"> Sign up for free</Link> and start discovering 
              amazing APIs today. For unlimited access and premium features, 
              <Link to="/subscribe" className="inline-link"> check out our Pro plan</Link>.
            </p>
          </section>
        </div>

        <div className="static-page-footer">
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
