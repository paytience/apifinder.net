import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-logo">
            <span className="footer-logo-icon">🔍</span>
            <span className="footer-logo-text">API Finder</span>
          </div>
          <p className="footer-description">
            Discover and explore free APIs from the public-apis repository
          </p>
        </div>
        
        <div className="footer-center">
          <div className="footer-links">
            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li><a href="/terms">Terms of Service</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/cookies">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-copyright">
        <p>&copy; {currentYear} API Finder. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
