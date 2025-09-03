import React from 'react';

const MobileNotice = () => {
  return (
    <section className="section-content py-6 animate-on-scroll slide-up" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
      <div className="container mx-auto px-6">
        <div className="glassmorphism-card" style={{ padding: '0.875rem 1rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ fontSize: '1.25rem', color: '#60A5FA' }}>
            <i className="fas fa-info-circle" aria-hidden="true"></i>
          </div>
          <div style={{ lineHeight: 1.35 }}>
            <div style={{ fontWeight: 700, color: '#E5E7EB' }}>Best viewed on desktop</div>
            <div style={{ fontSize: '0.9rem', color: '#9CA3AF' }}>
              For the full 3D and research section experience, open this site on a PC or laptop.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileNotice;


