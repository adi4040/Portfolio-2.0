import React, { useEffect, useRef } from 'react';

const Skills = () => {
  const skillsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressBars = entry.target.querySelectorAll('.skill-progress');
          progressBars.forEach(progressBar => {
            const width = progressBar.getAttribute('data-width');
            if (width) {
              progressBar.style.setProperty('--width', `${width}%`);
              progressBar.style.setProperty('--width', '0%');
              setTimeout(() => {
                progressBar.style.setProperty('--width', `${width}%`);
              }, 100);
            }
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    if (skillsRef.current) {
      observer.observe(skillsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const skillCategories = [
    {
      title: "Languages",
      skills: [
        { name: "C++", percentage: 90 },
        { name: "Python", percentage: 90 },
        { name: "HTML", percentage: 90 },
        { name: "JavaScript", percentage: 80 },
        { name: "CSS", percentage: 75 },
        { name: "SQL", percentage: 75 },
        { name: "PHP", percentage: 65 },
      ]
    },
    {
      title: "Frameworks",
      skills: [
        { name: "React.js", percentage: 90 },
        { name: "Node.js", percentage: 80 },
        { name: "Express.js", percentage: 80 },
        { name: "Custom Tkinter", percentage: 75 }
      ]
    },
    {
      title: "Tools & Platforms",
      skills: [
        { name: "Git/GitHub", percentage: 90 },
        { name: "AWS", percentage: 80 },
        { name: "Docker/K8s", percentage: 75 }
      ]
    },
    {
      title: "Databases and Feature Stores",
      skills: [
        { name: "MySQL", percentage: 80 },
        { name: "MongoDB", percentage: 75 },
        { name: "InfluxDB", percentage: 75 },
        { name: "Feast", percentage: 75 }
      ]
    }
  ];

  return (
    <section id="skills" className="section-content py-20 animate-on-scroll slide-up" ref={skillsRef}>
      <div className="container mx-auto px-6">
        <h2 className="section-title text-3xl font-bold mb-12 font-display">
          Technical Skills
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 skills-grid">
          {skillCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="skill-category glassmorphism-card p-6 animate-on-scroll fade-in">
              <h3 className="text-lg font-bold text-green-400 mb-4">
                {category.title}
              </h3>
              <div className="skill-items">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="skill-item">
                      <span>{skill.name}</span> <span>{skill.percentage}%</span>
                    </div>
                    <div 
                      className="skill-progress" 
                      data-width={skill.percentage}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
