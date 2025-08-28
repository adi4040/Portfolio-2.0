import React, { useState, useEffect, useRef } from 'react';

// Keep phrases outside component to avoid re-creating array and breaking typing effect
const TYPING_PHRASES = [
  "I build things for the web.",
  "I create intelligent solutions.",
  "I solve complex problems.",
  "I turn ideas into reality."
];

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const isDeletingRef = useRef(false);
  const phraseIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const timerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    // Robust typewriter that avoids StrictMode double-invoke glitches
    const mounted = { current: true };

    const tick = () => {
      if (!mounted.current) return;

      const currentPhrase = TYPING_PHRASES[phraseIndexRef.current];
      const isDeleting = isDeletingRef.current;
      let nextCharIndex = charIndexRef.current + (isDeleting ? -1 : 1);

      // Clamp
      nextCharIndex = Math.max(0, Math.min(currentPhrase.length, nextCharIndex));
      charIndexRef.current = nextCharIndex;
      setDisplayText(currentPhrase.substring(0, nextCharIndex));

      let delay = isDeleting ? 35 : 85;

      if (!isDeleting && nextCharIndex === currentPhrase.length) {
        // Pause at end, then start deleting
        delay = 1200;
        isDeletingRef.current = true;
      } else if (isDeleting && nextCharIndex === 0) {
        // Move to next phrase and start typing
        isDeletingRef.current = false;
        phraseIndexRef.current = (phraseIndexRef.current + 1) % TYPING_PHRASES.length;
        delay = 350; // small pause before typing next
      }

      timerRef.current = setTimeout(tick, delay);
    };

    // Kick off
    timerRef.current = setTimeout(tick, 200);

    return () => {
      mounted.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return (
    <section id="home" className="section-content min-h-screen flex items-center">
      <div className="container mx-auto px-6">
        <div className={`hero-content ${isMobile ? 'hero-card glassmorphism-card animate-on-scroll fade-in' : ''}`}>
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
          <p className="mt-4 text-lg text-slate-400 max-w-xl animate-on-scroll fade-in delay-3 font-body hero-intro">
            I'm a tech enthusiast specializing in full-stack development and
            AI/ML. I have a strong foundation in creating robust
            applications and a keen interest in IoT and blockchain
            technology.
          </p>
          <div className="mt-8 flex gap-4 animate-on-scroll fade-in delay-4 hero-cta-wrap">
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
