import React from 'react';

const Publications = () => {
  const publications = [
    {
      icon: "fas fa-newspaper",
      title: "Optimizing Neural Networks for Edge Computing",
      journal: "International Journal of Computer Science - 2024",
      description: "Co-authored research on neural network optimization techniques for IoT edge devices.",
      link: "#"
    },
    {
      icon: "fas fa-book-open",
      title: "Blockchain Applications in Supply Chain",
      journal: "Tech Conference Proceedings - 2024",
      description: "Survey paper on blockchain implementation in modern supply chain systems.",
      link: "#"
    }
  ];

  return (
    <section id="publications" className="section-content py-20 animate-on-scroll slide-up">
      <div className="container mx-auto px-6">
        <h2 className="section-title text-3xl font-bold mb-12 font-display">
          Publications
        </h2>
        <div className="publications-list">
          {publications.map((pub, index) => (
            <div key={index} className="publication-item glassmorphism-card p-6">
              <div className="pub-icon">
                <i className={pub.icon}></i>
              </div>
              <div className="pub-content">
                <h3 className="text-xl font-bold text-slate-200">
                  {pub.title}
                </h3>
                <p className="text-green-400 text-sm">
                  {pub.journal}
                </p>
                <p className="text-slate-300 mt-2">
                  {pub.description}
                </p>
                <div className="mt-3">
                  <a href={pub.link} className="pub-link">
                    <i className="fas fa-external-link-alt mr-2"></i>View Publication
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Publications;
