import React from 'react';

const Patents = () => {
  return (
    <section id="patents" className="section-content py-20 animate-on-scroll slide-up">
      <div className="container mx-auto px-6">
        <h2 className="section-title text-3xl font-bold mb-12 font-display">
          Patents & Innovations
        </h2>
        <div className="patents-grid">
          <div className="glassmorphism-card p-8 text-center animate-on-scroll fade-in">
            <div className="patent-icon">
              <i className="fas fa-lightbulb"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-200 mb-2">
              Smart Tracking & Recovery System using NFC and QR codes
            </h3>
            <span className="text-orange-400 text-sm sm:text-base">
              <i className="fas fa-pause-circle mr-2"></i>Pending - 2025
            </span>
            <p className="text-slate-300">
              Innovative approach for tracking your lost devices
            </p>
            <div className="mt-4">
              <span className="badge-patent">Application No: 202441XXXXX</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Patents;
