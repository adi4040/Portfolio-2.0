import React, { useEffect, useState } from 'react';

const About = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <section id="about" className="section-content py-20 animate-on-scroll slide-up">
      <div className="container mx-auto px-6">
        <h2 className="section-title text-3xl font-bold mb-12 font-display">
          About Me
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="glassmorphism-card p-8 animate-on-scroll fade-in">
              {!isMobile && (
                <>
                  <p className="text-slate-300 text-lg font-body mb-4">
                    Hello! I'm Aditya, a passionate developer with a knack for
                    turning ideas into tangible, high-performance applications.
                    My journey in tech started with a deep curiosity for how
                    things work, which led me to dive into full-stack
                    development and machine learning.
                  </p>
                  <p className="text-slate-300 text-lg font-body mb-4">
                    I am pursuing B.Tech in Computer Science with specialization
                    in IoT, Cyber Security including Blockchain Technology. I
                    have hands-on experience with modern technologies and always
                    eager to learn new skills.
                  </p>
                </>
              )}
              {isMobile && (
                <p className="text-slate-300 font-body mb-2" style={{ fontSize: '0.95rem', lineHeight: '1.55rem' }}>
                  I'm Aditya — full‑stack and AI/ML enthusiast. I build fast, clean apps and love solving real problems.
                </p>
              )}
              <div className="mt-4">
                <h3 className="text-xl font-bold text-green-400 mb-3">
                  Quick Facts
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <li className="flex items-center text-slate-300">
                    <i className="fas fa-check-circle text-green-400 mr-2"></i>
                    Full-Stack Developer
                  </li>
                  <li className="flex items-center text-slate-300">
                    <i className="fas fa-check-circle text-green-400 mr-2"></i>
                    AI/ML Enthusiast
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <div className="glassmorphism-card p-8 animate-on-scroll fade-in">
              <h3 className="text-xl font-bold text-green-400 mb-4">
                Technologies
              </h3>
              <div className="tech-stack">
                <span className="tech-tag">React.js</span>
                <span className="tech-tag">Node.js</span>
                <span className="tech-tag">Python</span>
                <span className="tech-tag">AWS</span>
                <span className="tech-tag">Docker</span>
                <span className="tech-tag">Kubernetes</span>
                <span className="tech-tag">TensorFlow</span>
                <span className="tech-tag">Blockchain</span>
                <span className="tech-tag">MongoDB</span>
                <span className="tech-tag">MySQL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
