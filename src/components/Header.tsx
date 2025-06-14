import React from 'react';

interface HeaderProps {
  apiCount: number;
  categoryCount: number;
}

const Header: React.FC<HeaderProps> = ({ apiCount, categoryCount }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="logo">
            <span className="logo-icon">🔍</span>
            API Finder
          </h1>
          <p className="tagline">
            Search through {apiCount.toLocaleString()} APIs from {categoryCount} categories
          </p>
        </div>
        
        <div className="header-right">
          <nav className="nav-links">
            <a href="#pricing" className="nav-link">Pricing</a>
            <button className="nav-button login-btn">Login</button>
            <button className="nav-button register-btn">Register</button>
          </nav>
          
          <div className="language-selector">
            <select className="language-dropdown">
              <option value="en">🇺🇸 EN</option>
              <option value="es">🇪🇸 ES</option>
              <option value="fr">🇫🇷 FR</option>
              <option value="de">🇩🇪 DE</option>
              <option value="zh">🇨🇳 ZH</option>
              <option value="ja">🇯🇵 JA</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
