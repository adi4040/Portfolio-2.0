import React, { useState, useEffect } from 'react';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const phrases = [
    "I build things for the web.",
    "I create intelligent solutions.",
    "I solve complex problems.",
    "I turn ideas into reality."
  ];

  useEffect(() => {
    const typeEffect = () => {
      const currentPhrase = phrases[phraseIndex];
      
      if (isDeleting) {
        setDisplayText(currentPhrase.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
      } else {
        setDisplayText(currentPhrase.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      }

      let typeSpeed = isDeleting ? 30 : 80; // Faster typing speeds
      
      if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 1500; // Reduced pause time
        setIsDeleting(true);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setPhraseIndex(prev => (prev + 1) % phrases.length);
      }

      const timer = setTimeout(typeEffect, typeSpeed);
      return () => clearTimeout(timer);
    };

    const timer = setTimeout(typeEffect, 100);
    return () => clearTimeout(timer);
  }, [phraseIndex, charIndex, isDeleting, phrases]);

  return (
    <section id="home" className="section-content min-h-screen flex items-center">
      <div className="container mx-auto px-6">
        <div className="hero-content">
          <p className="text-lg text-green-400 mb-2 animate-on-scroll fade-in font-mono">
            Hi, my name is
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-200 font-display animate-on-scroll fade-in delay-1">
            Aditya Suryawanshi.
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-400 mt-2 animate-on-scroll fade-in delay-2 font-display">
            <span>{displayText}</span>
            <span className="typing-cursor"></span>
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-xl animate-on-scroll fade-in delay-3 font-body">
            I'm a tech enthusiast specializing in full-stack development and
            AI/ML. I have a strong foundation in creating robust
            applications and a keen interest in IoT and blockchain
            technology.
          </p>
          <div className="mt-8 flex gap-4 animate-on-scroll fade-in delay-4">
            <a href="#projects" className="cta-button primary">
              View My Work
            </a>
            <a href="resume.pdf" download className="cta-button secondary">
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
