import React, { useState, useEffect } from 'react';
import SideNavigation from './components/SideNavigation';
import MobileHeader from './components/MobileHeader';
import MobileNavigation from './components/MobileNavigation';
import Background3D from './components/Background3D';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Education from './components/Education';
import Projects from './components/Projects';
import Research from './components/Research';
import Patents from './components/Patents';
import Achievements from './components/Achievements';
import Certifications from './components/Certifications';
import Skills from './components/Skills';
import Publications from './components/Publications';
import Volunteering from './components/Volunteering';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LeetCodeModal from './components/LeetCodeModal';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollY = window.scrollY + 100;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };

    // Trigger animations on page load
    const triggerAnimations = () => {
      const animatedElements = document.querySelectorAll('.animate-on-scroll');
      animatedElements.forEach(element => {
        element.classList.add('fade-in');
      });
    };

    // Initial setup
    handleResize();
    setTimeout(triggerAnimations, 100);

    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleNav = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - (isMobile ? 60 : 0);
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <div className="App">
      <Background3D />
      
      {/* Desktop Navigation */}
      {!isMobile && (
        <SideNavigation 
          activeSection={activeSection} 
          isCollapsed={isNavCollapsed}
          onToggle={toggleNav}
        />
      )}
      
      {/* Mobile Header */}
      {isMobile && (
        <MobileHeader onMenuClick={toggleMobileMenu} />
      )}
      
      {/* Mobile Navigation */}
      {isMobile && (
        <MobileNavigation
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
          activeSection={activeSection}
          onSectionClick={scrollToSection}
        />
      )}
      
      <div className={`main-content-wrapper ${isNavCollapsed && !isMobile ? 'nav-collapsed' : ''}`}>
        <main className="relative z-10">
          <Hero />
          <About />
          <Experience />
          <Education />
          <Projects />
          <Research />
          <Patents />
          <Achievements />
          <Skills />
          <Certifications />
          {/* <Publications /> */}
          <Volunteering />
          <Contact />
        </main>
        <Footer />
      </div>
      <LeetCodeModal />
    </div>
  );
}

export default App;
