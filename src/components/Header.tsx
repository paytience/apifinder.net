import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo">
          <span className="logo-icon">🔍</span>
          API Finder
        </h1>
        <p className="tagline">Discover free APIs from the public-apis repository</p>
      </div>
    </header>
  );
};

export default Header;
