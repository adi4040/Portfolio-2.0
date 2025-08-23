import React from 'react';

const MobileHeader = ({ onMenuClick }) => {
  return (
    <header className="mobile-header">
      <div className="mobile-header-logo">Portfolio</div>
      <button className="mobile-menu-btn" onClick={onMenuClick}>
        <i className="fas fa-bars"></i>
      </button>
    </header>
  );
};

export default MobileHeader;
