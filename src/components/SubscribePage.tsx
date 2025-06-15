import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SubscribePage: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);

  const handleSubscribe = () => {
    // TODO: Implement subscription logic
    console.log('Subscribe to Pro plan:', isYearly ? 'yearly' : 'monthly');
  };

  const monthlyPrice = 9.99;
  const yearlyPrice = monthlyPrice * 10; // 10x monthly cost as requested
  const currentPrice = isYearly ? yearlyPrice : monthlyPrice;
  const period = isYearly ? '/year' : '/month';
  const searches = 'Unlimited searches';

  return (
    <div className="subscribe-page">
      <div className="subscribe-container">
        <div className="subscribe-header">
          <h1>Subscribe to API Finder Pro</h1>
          <p>Unlock unlimited API searches and premium features</p>
        </div>

        <div className="billing-toggle">
          <span className={`billing-option ${!isYearly ? 'active' : ''}`}>Monthly</span>
          <button 
            className="toggle-switch"
            onClick={() => setIsYearly(!isYearly)}
          >
            <div className={`toggle-slider ${isYearly ? 'yearly' : 'monthly'}`}></div>
          </button>
          <span className={`billing-option ${isYearly ? 'active' : ''}`}>
            Yearly
            <span className="savings-badge">Save 17%</span>
          </span>
        </div>

        <div className="subscribe-plan">
          <div className="plan-card pro-plan">
            <div className="plan-badge">Most Popular</div>
            
            <div className="plan-header">
              <h2>Pro Plan</h2>
              <div className="plan-price">
                <span className="price">${currentPrice.toFixed(2)}</span>
                <span className="period">{period}</span>
              </div>
              {isYearly && (
                <div className="yearly-note">
                  <span className="monthly-equivalent">${monthlyPrice.toFixed(2)}/month when billed annually</span>
                </div>
              )}
              <div className="plan-searches">{searches}</div>
            </div>

            <div className="plan-features">
              <h3>Everything you get:</h3>
              <ul>
                <li>
                  <span className="check-icon">✓</span>
                  Unlimited API searches
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Save unlimited favorite APIs
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Advanced search filters and sorting
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Complete search history
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Early access to new features
                </li>
              </ul>
            </div>

            <button className="subscribe-btn" onClick={handleSubscribe}>
              Subscribe Now - ${currentPrice.toFixed(2)}{period}
            </button>

            <div className="subscription-details">
              <p>✓ Cancel anytime</p>
              <p>✓ 7-day free trial</p>
              <p>✓ Secure payment processing</p>
            </div>
          </div>
        </div>

        <div className="subscribe-faq">
          <h3>Frequently Asked Questions</h3>
          <div className="faq-item">
            <h4>Can I cancel my subscription anytime?</h4>
            <p>Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.</p>
          </div>
          <div className="faq-item">
            <h4>Is there a free trial?</h4>
            <p>Yes! We offer a 7-day free trial so you can explore all Pro features before committing.</p>
          </div>
          <div className="faq-item">
            <h4>What payment methods do you accept?</h4>
            <p>We accept all major credit cards, PayPal, and other secure payment methods through our payment processor.</p>
          </div>
        </div>

        <div className="subscribe-footer">
          <p>
            Not ready to subscribe? <Link to="/" className="back-link">Continue browsing for free</Link>
          </p>
          <p>
            Need help? <a href="/contact" className="contact-link">Contact our support team</a>
          </p>
          <p className="terms-text">
            By subscribing, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscribePage;
