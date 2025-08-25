import React, { useEffect, useState } from 'react';

const Experience = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <section id="experience" className="section-content py-20 animate-on-scroll slide-up">
      <div className="container mx-auto px-6">
        <h2 className="section-title text-3xl font-bold mb-12 font-display">
          Professional Experience
        </h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-date">June 2023 - July 2023</div>
            <div className="glassmorphism-card p-8 animate-on-scroll fade-in experience-card-wide">
              <h3 className="text-xl font-bold text-slate-200 font-display">
                AWS & Linux Administrator Intern
                <span className="text-green-400">@ Arrow Technologies</span>
              </h3>
              {!isMobile && (
                <ul className="list-disc list-inside text-slate-300 space-y-2 font-body mt-4">
                  <li>
                    Improved client-server performance by deploying and
                    managing applications on AWS EC2 instances
                  </li>
                  <li>
                    Utilized Red Hat Linux for system administration and
                    service configuration
                  </li>
                  <li>
                    Hosted and maintained e-commerce website infrastructure
                  </li>
                </ul>
              )}
              {isMobile && (
                <p className="text-slate-300 font-body mt-3" style={{ fontSize: '0.95rem', lineHeight: '1.55rem' }}>
                  Deployed apps on AWS EC2, managed Linux servers, and maintained e‑commerce infra.
                </p>
              )}
              <div className="mt-4 experience-skill-tags">
                <span className="skill-tag">AWS</span>
                <span className="skill-tag">Linux</span>
                <span className="skill-tag">DevOps</span>
              </div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-date">2021 - 2024</div>
            <div className="glassmorphism-card p-8 animate-on-scroll fade-in experience-card-wide">
              <h3 className="text-xl font-bold text-slate-200 font-display">
                Practical Experience
                <span className="text-green-400">@ Diploma Program</span>
              </h3>
              {!isMobile && (
                <ul className="list-disc list-inside text-slate-300 space-y-2 font-body mt-4">
                  <li>
                    Applied diverse computer technologies to develop dynamic
                    web applications
                  </li>
                  <li>
                    Delivered projects with responsive designs and
                    cross-browser compatibility
                  </li>
                  <li>
                    Participated in code reviews and learned industry best
                    practices
                  </li>
                </ul>
              )}
              {isMobile && (
                <p className="text-slate-300 font-body mt-3" style={{ fontSize: '0.95rem', lineHeight: '1.55rem' }}>
                  Built responsive apps, ensured cross‑browser support, and practiced clean code.
                </p>
              )}
              <div className="mt-4 experience-skill-tags">
                <span className="skill-tag">Web Development</span>
                <span className="skill-tag">Team Collaboration</span>
                <span className="skill-tag">Project Management</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
