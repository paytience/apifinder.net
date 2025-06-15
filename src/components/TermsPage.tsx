import React from 'react';
import { Link } from 'react-router-dom';

const TermsPage: React.FC = () => {
  return (
    <div className="static-page">
      <div className="static-page-container">
        <div className="static-page-header">
          <h1>Terms of Service</h1>
          <p>Last updated: January 2025</p>
        </div>

        <div className="static-page-content">
          <section className="terms-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using API Finder, you accept and agree to be bound by the terms and 
              provision of this agreement. If you do not agree to abide by the above, please do not 
              use this service.
            </p>
          </section>

          <section className="terms-section">
            <h2>2. Description of Service</h2>
            <p>
              API Finder is a web-based platform that provides users with access to a searchable 
              database of free APIs. We offer both free and premium subscription services with 
              varying levels of access and features.
            </p>
          </section>

          <section className="terms-section">
            <h2>3. User Accounts</h2>
            <p>
              To access certain features of our service, you may be required to create an account. 
              You are responsible for maintaining the confidentiality of your account and password 
              and for restricting access to your computer.
            </p>
          </section>

          <section className="terms-section">
            <h2>4. Subscription Services</h2>
            <p>
              Our premium subscription services are billed on a recurring basis. You may cancel 
              your subscription at any time. Cancellation will take effect at the end of your 
              current billing period.
            </p>
          </section>

          <section className="terms-section">
            <h2>5. Usage Limits</h2>
            <p>
              Different service tiers have different usage limits:
            </p>
            <ul>
              <li>Anonymous users: 2 searches per day</li>
              <li>Registered users: 10 searches per day</li>
              <li>Premium subscribers: Unlimited searches</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>6. Prohibited Uses</h2>
            <p>
              You may not use our service for any illegal or unauthorized purpose. You must not 
              violate any laws in your jurisdiction when using our service.
            </p>
          </section>

          <section className="terms-section">
            <h2>7. Disclaimer</h2>
            <p>
              The information on this website is provided on an "as is" basis. To the fullest 
              extent permitted by law, this Company excludes all representations, warranties, 
              conditions and terms.
            </p>
          </section>

          <section className="terms-section">
            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of 
              any significant changes via email or through our service.
            </p>
          </section>

          <section className="terms-section">
            <h2>9. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at 
              <a href="mailto:legal@apifinder.net"> legal@apifinder.net</a>.
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

export default TermsPage;
