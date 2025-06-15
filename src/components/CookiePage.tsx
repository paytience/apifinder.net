import React from 'react';
import { Link } from 'react-router-dom';

const CookiePage: React.FC = () => {
  return (
    <div className="static-page">
      <div className="static-page-container">
        <div className="static-page-header">
          <h1>Cookie Policy</h1>
          <p>Last updated: January 2025</p>
        </div>

        <div className="static-page-content">
          <section className="cookie-section">
            <h2>What Are Cookies</h2>
            <p>
              Cookies are small text files that are placed on your computer or mobile device when 
              you visit our website. They help us provide you with a better experience by remembering 
              your preferences and improving our service.
            </p>
          </section>

          <section className="cookie-section">
            <h2>How We Use Cookies</h2>
            <p>We use cookies for the following purposes:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
              <li><strong>Authentication:</strong> To keep you logged in to your account</li>
              <li><strong>Preferences:</strong> To remember your settings and preferences</li>
              <li><strong>Analytics:</strong> To understand how visitors use our website</li>
              <li><strong>Performance:</strong> To improve website speed and functionality</li>
            </ul>
          </section>

          <section className="cookie-section">
            <h2>Types of Cookies We Use</h2>
            
            <div className="cookie-type">
              <h3>Strictly Necessary Cookies</h3>
              <p>
                These cookies are essential for the website to function and cannot be disabled. 
                They include authentication tokens and security features.
              </p>
            </div>

            <div className="cookie-type">
              <h3>Functional Cookies</h3>
              <p>
                These cookies enable enhanced functionality and personalization, such as 
                remembering your search preferences and favorite APIs.
              </p>
            </div>

            <div className="cookie-type">
              <h3>Analytics Cookies</h3>
              <p>
                We use analytics cookies to understand how visitors interact with our website, 
                helping us improve our service and user experience.
              </p>
            </div>
          </section>

          <section className="cookie-section">
            <h2>Third-Party Cookies</h2>
            <p>
              We may use third-party services that set their own cookies, including:
            </p>
            <ul>
              <li>Google Analytics for website analytics</li>
              <li>Authentication providers (Google, GitHub, Microsoft)</li>
              <li>Payment processors for subscription services</li>
            </ul>
          </section>

          <section className="cookie-section">
            <h2>Managing Cookies</h2>
            <p>
              You can control and manage cookies in several ways:
            </p>
            <ul>
              <li>Through your browser settings to block or delete cookies</li>
              <li>Using browser extensions that manage cookie preferences</li>
              <li>Opting out of analytics tracking through our privacy settings</li>
            </ul>
            <p>
              Please note that disabling certain cookies may affect the functionality of our website.
            </p>
          </section>

          <section className="cookie-section">
            <h2>Cookie Retention</h2>
            <p>
              Different cookies have different retention periods:
            </p>
            <ul>
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain for a set period (typically 30 days to 2 years)</li>
              <li><strong>Authentication Cookies:</strong> Expire based on your login preferences</li>
            </ul>
          </section>

          <section className="cookie-section">
            <h2>Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our 
              practices or for other operational, legal, or regulatory reasons.
            </p>
          </section>

          <section className="cookie-section">
            <h2>Contact Us</h2>
            <p>
              If you have any questions about our use of cookies, please contact us at 
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

export default CookiePage;
