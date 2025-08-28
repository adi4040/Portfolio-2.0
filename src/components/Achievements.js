import React from 'react';

const Achievements = () => {
  const openLeetCodeModal = () => {
    // Use the global function created by LeetCodeModal
    if (window.openLeetCodeModal) {
      window.openLeetCodeModal();
    } else {
      console.log('LeetCode modal not ready yet');
    }
  };

  return (
    <section id="achievements" className="section-content py-20 animate-on-scroll slide-up">
      <div className="container mx-auto px-6">
        <h2 className="section-title text-3xl font-bold mb-12 font-display">
          Achievements & Awards
        </h2>
        <div className="achievements-grid">
          <div className="achievement-card glassmorphism-card animate-on-scroll fade-in">
            <div className="achievement-icon gold">
              <i className="fas fa-trophy"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-200">
              1st Place - Software Domain
            </h3>
            <p className="text-slate-400">
              Projectioum Leviosa Technical Symposium, JSPM Pune
            </p>
            <button 
              className="leetcode-stats-button" 
              onClick={() => window.openAchievementPhotoModal && window.openAchievementPhotoModal('/achievement_jspm.jpg')}
              style={{ marginTop: '0.75rem' }}
            >
              View Photo
            </button>
          </div>

          <div className="achievement-card glassmorphism-card animate-on-scroll fade-in">
            <div className="achievement-icon silver">
              <i className="fas fa-medal"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-200">Finalist</h3>
            <p className="text-slate-400">CONVENE 2K25, SKNCOE Pune</p>
          </div>

          {/* <div className="achievement-card glassmorphism-card">
            <div className="achievement-icon bronze">
              <i className="fas fa-award"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-200">
              Best Project Award
            </h3>
            <p className="text-slate-400">Computer Science Department</p>
          </div> */}

          <div className="achievement-card glassmorphism-card animate-on-scroll fade-in">
            <div className="achievement-icon">
              <i className="fas fa-code"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-200">
              LeetCode Problems Solved
            </h3>
            <p className="text-slate-400">View my coding progress</p>
            <button onClick={openLeetCodeModal} className="leetcode-stats-button">
              View Detailed Statistics
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;
