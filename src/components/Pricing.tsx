import React from 'react';
import { Link } from 'react-router-dom';

interface PricingTier {
  name: string;
  price: string;
  searches: string;
  features: string[];
  buttonText: string;
  buttonClass: string;
  popular?: boolean;
}

const Pricing: React.FC = () => {
  const tiers: PricingTier[] = [
    {
      name: "Anonymous",
      price: "Free",
      searches: "2 searches/day",
      features: [
        "Browse all free APIs",
      ],
      buttonText: "Start Searching",
      buttonClass: "pricing-btn-free"
    },
    {
      name: "Registered",
      price: "Free",
      searches: "10 searches/day",
      features: [
        "Save favorite APIs",
        "Search history",
        "Advanced search filter",
      ],
      buttonText: "Register now",
      buttonClass: "pricing-btn-register",
    },
    {
      name: "Pro",
      price: "$9/month",
      searches: "Unlimited searches",
      features: [
        "Everything in Registered",
        "Unlimited daily searches"
        // "Export search results"
      ],
      buttonText: "Subscribe Now",
      buttonClass: "pricing-btn-pro",
      popular: true
    }
  ];

  const scrollToSearch = () => {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Highlight the search box after scrolling
    setTimeout(() => {
      const searchInput = document.querySelector('.search-input') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
        searchInput.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.3), 0 0 20px rgba(102, 126, 234, 0.2)';
        searchInput.style.borderColor = '#667eea';
        
        // Remove highlight after 2 seconds
        setTimeout(() => {
          searchInput.style.boxShadow = '';
          searchInput.style.borderColor = '';
        }, 2000);
      }
    }, 500);
  };

  return (
    <section className="pricing-section">
      <div className="pricing-container">
        <div className="pricing-header">
          <h2>Choose Your Plan</h2>
          <p>Find the perfect plan for your API discovery needs</p>
        </div>
        
        <div className="pricing-grid">
          {tiers.map((tier, index) => (
            <div key={tier.name} className={`pricing-card ${tier.popular ? 'popular' : ''}`}>
              {tier.popular && <div className="popular-badge">Most Popular</div>}
              
              <div className="pricing-card-header">
                <h3>{tier.name}</h3>
                <div className="price">{tier.price}</div>
                <div className="searches">{tier.searches}</div>
              </div>
              
              <div className="pricing-card-body">
                <ul className="features-list">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>
                      <span className="check-icon">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pricing-card-footer">
                {tier.buttonText === "Start Searching" ? (
                  <button 
                    className={`pricing-btn ${tier.buttonClass}`}
                    onClick={scrollToSearch}
                  >
                    {tier.buttonText}
                  </button>
                ) : tier.buttonText === "Register now" ? (
                  <Link 
                    to="/register"
                    className={`pricing-btn ${tier.buttonClass}`}
                  >
                    {tier.buttonText}
                  </Link>
                ) : tier.buttonText === "Subscribe Now" ? (
                  <Link 
                    to="/subscribe"
                    className={`pricing-btn ${tier.buttonClass}`}
                  >
                    {tier.buttonText}
                  </Link>
                ) : (
                  <button 
                    className={`pricing-btn ${tier.buttonClass}`}
                  >
                    {tier.buttonText}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="pricing-footer">
          <p>All plans include access to our complete database of {/* This will be dynamic */} APIs</p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
