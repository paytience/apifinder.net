import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPage: React.FC = () => {
  return (
    <div className="static-page">
      <div className="static-page-container">
        <div className="static-page-header">
          <h1>Privacy Policy</h1>
          <p>Last updated: January 2025</p>
        </div>

        <div className="static-page-content">
          <section className="privacy-section">
            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, 
              subscribe to our service, or contact us for support.
            </p>
            <ul>
              <li>Account information (email, name)</li>
              <li>Usage data (search queries, API interactions)</li>
              <li>Payment information (processed securely by third-party providers)</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and maintain our service</li>
              <li>Process transactions and send confirmations</li>
              <li>Improve our service and develop new features</li>
              <li>Communicate with you about updates and support</li>
              <li>Monitor usage and enforce our terms of service</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>3. Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              except as described in this policy. We may share information with:
            </p>
            <ul>
              <li>Service providers who assist in operating our platform</li>
              <li>Legal authorities when required by law</li>
              <li>Business partners with your explicit consent</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="privacy-section">
            <h2>5. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our 
              platform. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section className="privacy-section">
            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of marketing communications</li>
              <li>Request a copy of your data</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>7. Children's Privacy</h2>
            <p>
              Our service is not intended for children under 13 years of age. We do not knowingly 
              collect personal information from children under 13.
            </p>
          </section>

          <section className="privacy-section">
            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any 
              changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="privacy-section">
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at 
              <a href="mailto:privacy@apifinder.net"> privacy@apifinder.net</a>.
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

export default PrivacyPage;
