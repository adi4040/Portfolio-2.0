import React from 'react';

const MobileNavigation = ({ isOpen, onClose, activeSection, onSectionClick }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: 'fas fa-home' },
    { id: 'about', label: 'About', icon: 'fas fa-user' },
    { id: 'experience', label: 'Experience', icon: 'fas fa-briefcase' },
    { id: 'education', label: 'Education', icon: 'fas fa-graduation-cap' },
    { id: 'projects', label: 'Projects', icon: 'fas fa-code' },
    { id: 'research', label: 'Research', icon: 'fas fa-flask' },
    { id: 'patents', label: 'Patents', icon: 'fas fa-lightbulb' },
    { id: 'achievements', label: 'Achievements', icon: 'fas fa-trophy' },
    { id: 'certifications', label: 'Certifications', icon: 'fas fa-certificate' },
    { id: 'skills', label: 'Skills', icon: 'fas fa-tools' },
    { id: 'publications', label: 'Publications', icon: 'fas fa-book' },
    { id: 'volunteering', label: 'Volunteering', icon: 'fas fa-hands-helping' },
    { id: 'contact', label: 'Contact', icon: 'fas fa-envelope' }
  ];

  const handleItemClick = (sectionId) => {
    onSectionClick(sectionId);
    onClose();
  };

  return (
    <>
      {/* Mobile Navigation Overlay */}
      <div 
        className={`mobile-nav-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />
      
      {/* Mobile Navigation Menu */}
      <nav className={`mobile-nav ${isOpen ? 'active' : ''}`}>
        <div className="mobile-nav-header">
          <div className="mobile-header-logo">Portfolio</div>
          <button className="mobile-nav-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <ul className="mobile-nav-menu">
          {navItems.map((item) => (
            <li key={item.id} className="mobile-nav-item">
              <a
                href={`#${item.id}`}
                className={`mobile-nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleItemClick(item.id);
                }}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
        
        <div className="nav-footer">
          <div className="social-links-vertical">
            <a
              href="https://github.com/adi4040"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-github"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/aditya-suryawanshi-4783832b3"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="mailto:adityasuryawanshi4040@gmail.com">
              <i className="fas fa-envelope"></i>
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default MobileNavigation;
