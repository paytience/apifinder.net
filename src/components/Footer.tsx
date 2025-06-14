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
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#blog">Blog</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#cookies">Cookie Policy</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Support</h4>
              <ul>
                <li><a href="#help">Help Center</a></li>
                <li><a href="#docs">Documentation</a></li>
                <li><a href="#api">API Status</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-right">
          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#twitter" aria-label="Twitter">🐦</a>
              <a href="#github" aria-label="GitHub">🐙</a>
              <a href="#linkedin" aria-label="LinkedIn">💼</a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">
            © {currentYear} API Finder. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <a href="#terms">Terms</a>
            <a href="#privacy">Privacy</a>
            <a href="#about">About</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
