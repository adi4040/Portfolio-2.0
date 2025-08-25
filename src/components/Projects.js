import React from 'react';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "Engine Health Prognostics Analysis",
      description: "Built ML pipeline for engine health prediction using NASA's dataset with 95% accuracy.",
      icon: "fas fa-cogs",
      technologies: ["Python", "ML", "Pandas"],
      githubLink: "https://github.com/adi4040/Engine-Health-Prognostics-Analysis"
    },
    {
      id: 2,
      title: "Smart Tracking & Recovery System (Contributor)",
      description: "IoT system using NFC and QR codes for lost item recovery with ML analytics.",
      icon: "fas fa-search",
      technologies: ["IoT", "NFC", "ML"],
      githubLink: "https://github.com/AdityaVyavhare/Reclaim"
    },
    {
      id: 3,
      title: "AI-Powered Attendance System",
      description: "Real-time attendance monitoring using facial recognition with 99% accuracy.",
      icon: "fas fa-user-check",
      technologies: ["Python", "OpenCV", "AI"],
      githubLink: "https://github.com/adi4040/AI-powered-Student-Attendance-System"
    }
  ];

  return (
    <section id="projects" className="section-content py-20 animate-on-scroll slide-up">
      <div className="container mx-auto px-6">
        <h2 className="section-title text-3xl font-bold mb-12 font-display">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card glassmorphism-card p-6 animate-on-scroll fade-in">
              <div className="project-icon mb-4">
                <i className={project.icon}></i>
              </div>
              <h3 className="text-xl font-bold text-slate-200 font-display">
                {project.title}
              </h3>
              <p className="text-slate-300 mt-2 font-body">
                {project.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="tech-tag-small">{tech}</span>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <a href={project.githubLink} className="project-btn github-btn">
                  <i className="fab fa-github"></i> Code
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
