import React, { useEffect, useState } from 'react';

const AchievementPhotoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Expose a global function to open this modal with a given image
    window.openAchievementPhotoModal = (src) => {
      const chosen = src || '/achievement_jspm.jpg';
      setImageSrc(chosen);
      setIsLoading(true);
      setHasError(false);
      setIsOpen(true);
      document.body.style.overflow = 'hidden';

      const img = new Image();
      img.onload = () => {
        setIsLoading(false);
        setHasError(false);
      };
      img.onerror = () => {
        setIsLoading(false);
        setHasError(true);
      };
      img.src = chosen;
    };

    return () => {
      delete window.openAchievementPhotoModal;
    };
  }, []);

  const closeModal = () => {
    const modal = document.getElementById('achievement-photo-modal');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => {
        setIsOpen(false);
        document.body.style.overflow = '';
      }, 600);
    } else {
      setIsOpen(false);
      document.body.style.overflow = '';
    }
  };

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape' && isOpen) closeModal();
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [isOpen]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="leetcode-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading photo...</p>
        </div>
      );
    }

    if (hasError) {
      return (
        <div className="leetcode-loading">
          <i className="fas fa-exclamation-triangle" style={{ color: '#EF4444' }}></i>
          <h3 style={{ margin: '0.5rem 0' }}>Unable to load image</h3>
          <p>Please ensure the image exists in the public folder.</p>
          <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>{imageSrc}</p>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <img 
          src={imageSrc} 
          alt="Achievement"
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '12px',
            border: '1px solid rgba(100, 255, 218, 0.2)'
          }}
        />
      </div>
    );
  };

  return (
    <div id="achievement-photo-modal" className={`leetcode-modal ${isOpen ? 'active' : ''}`}>
      <div className="leetcode-modal-overlay" onClick={closeModal}></div>
      <div className="leetcode-modal-card" style={{ maxWidth: '900px' }}>
        <div className="leetcode-modal-header">
          <h2 className="leetcode-modal-title">
            <i className="fas fa-image"></i>
            Achievement Photo
          </h2>
          <button className="leetcode-modal-close" onClick={closeModal}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="leetcode-modal-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AchievementPhotoModal;


