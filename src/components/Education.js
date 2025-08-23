import React from 'react';

const Education = () => {
  return (
    <section id="education" className="section-content py-20 animate-on-scroll slide-up">
      <div className="container mx-auto px-6">
        <h2 className="section-title text-3xl font-bold mb-12 font-display">
          Education
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glassmorphism-card p-8">
            <div className="flex items-start">
              <div className="education-icon">
                <i className="fas fa-university"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-slate-200 font-display">
                  B.Tech in Computer Science
                </h3>
                <p className="text-green-400">
                  Vishwakarma Institute of Information Technology
                </p>
                <p className="text-sm text-slate-400 mb-2 font-mono">
                  2024 - Present
                </p>
                <p className="text-slate-300">
                  Specialization: IoT, Cyber Security & Blockchain
                </p>
                <p className="text-slate-300 font-bold mt-2">CGPA: 9.05/10</p>
              </div>
            </div>
          </div>

          <div className="glassmorphism-card p-8">
            <div className="flex items-start">
              <div className="education-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-slate-200 font-display">
                  Diploma in Computer Technology
                </h3>
                <p className="text-green-400">K.K Wagh Polytechnic</p>
                <p className="text-sm text-slate-400 mb-2 font-mono">
                  2021 - 2024
                </p>
                <p className="text-slate-300 font-bold mt-2">
                  Aggregate: 92.97%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
