import React from 'react';

const SideNavigation = ({ activeSection, isCollapsed, onToggle }) => {
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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - (window.innerWidth <= 768 ? 60 : 0);
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <nav className={`side-navigation ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="nav-header">
        <div className="nav-logo">
          <span className="logo-text">Portfolio</span>
        </div>
        <button className="nav-toggle-btn" onClick={onToggle}>
          <i className="fas fa-bars"></i>
        </button>
      </div>

      <ul className="nav-menu">
        {navItems.map((item) => (
          <li key={item.id} className="nav-item">
            <a
              href={`#${item.id}`}
              className={`nav-link-side ${activeSection === item.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.id);
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
  );
};

export default SideNavigation;
