import React, { useState, useEffect } from 'react';

const LeetCodeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [error, setError] = useState(null);

  const LEETCODE_CONFIG = {
    username: 'ZDt3Xwkjvl',
    displayName: 'Aditya Suryawanshi',
    enableUnofficialAPI: true,
    cacheDuration: 5 * 60 * 1000,
    rateLimitDelay: 1000,
    maxRetries: 3,
    enableOfflineMode: true
  };

  // Function to open modal from outside (will be called by parent component)
  useEffect(() => {
    console.log('LeetCodeModal: Setting up global function');
    window.openLeetCodeModal = () => {
      console.log('LeetCodeModal: Opening modal');
      setIsOpen(true);
      document.body.style.overflow = 'hidden';
      if (!leetcodeData) {
        fetchLeetCodeData();
      }
    };
    
    return () => {
      delete window.openLeetCodeModal;
    };
  }, [leetcodeData]);

  // Debug modal state changes
  useEffect(() => {
    console.log('LeetCodeModal: Modal state changed to:', isOpen);
  }, [isOpen]);

  const openModal = () => {
    console.log('LeetCodeModal: openModal called');
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
    if (!leetcodeData) {
      fetchLeetCodeData();
    }
  };

  const closeModal = () => {
    console.log('LeetCodeModal: closeModal called');
    // Add a small delay to allow the closing animation to complete
    const modal = document.getElementById('leetcode-modal');
    if (modal) {
      modal.classList.remove('active');
      // Wait for animation to complete before hiding
      setTimeout(() => {
        setIsOpen(false);
        document.body.style.overflow = '';
      }, 600); // Match the longest animation duration
    } else {
      setIsOpen(false);
      document.body.style.overflow = '';
    }
  };

  const fetchLeetCodeData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '3000';
      const base = isLocal ? 'http://localhost:8888' : '';
      const url = `${base}/.netlify/functions/leetcode?username=${encodeURIComponent(LEETCODE_CONFIG.username)}`;
      const response = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } });
      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Proxy returned ${response.status}`);
      }

      const data = await response.json();
      const normalizedData = {
        totalSolved: data.totalSolved || 0,
        easySolved: data.easySolved || 0,
        mediumSolved: data.mediumSolved || 0,
        hardSolved: data.hardSolved || 0,
        ranking: data.ranking || 'N/A',
        contributionPoints: data.contributionPoints || 0,
        reputation: data.reputation || 0
      };

      setLeetcodeData(normalizedData);
    } catch (err) {
      console.error('Error fetching LeetCode data:', err);
      setError(err.message || 'Failed to fetch data from all endpoints');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const renderLeetCodeContent = () => {
    if (isLoading) {
      return (
        <div className="leetcode-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading LeetCode statistics...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="leetcode-loading">
          <i className="fas fa-exclamation-triangle" style={{ color: '#EF4444' }}></i>
          <h3 style={{ margin: '0.5rem 0' }}>Unable to Load Statistics</h3>
          <p>There was an error loading your LeetCode data.</p>
          <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>{error}</p>
          <button 
            onClick={fetchLeetCodeData}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    if (!leetcodeData) return null;

    const { totalSolved, easySolved, mediumSolved, hardSolved, ranking, contributionPoints, reputation } = leetcodeData;
    const total = easySolved + mediumSolved + hardSolved;

    return (
      <div className="leetcode-content">
        <div className="leetcode-profile">
          <div className="leetcode-avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          <div className="leetcode-info">
            <h3>{LEETCODE_CONFIG.displayName}</h3>
            <p>@{LEETCODE_CONFIG.username}</p>
          </div>
        </div>
        
        <div className="leetcode-stats-grid">
          <div className="leetcode-stat-card">
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-content">
              <h4>Total Solved</h4>
              <p>{totalSolved || 0}</p>
            </div>
          </div>
          
          <div className="leetcode-stat-card">
            <div className="stat-icon">
              <i className="fas fa-trophy"></i>
            </div>
            <div className="stat-content">
              <h4>Ranking</h4>
              <p>{ranking || 'N/A'}</p>
            </div>
          </div>
          
          <div className="leetcode-stat-card">
            <div className="stat-icon">
              <i className="fas fa-star"></i>
            </div>
            <div className="stat-content">
              <h4>Contribution Points</h4>
              <p>{contributionPoints || 0}</p>
            </div>
          </div>
          
          <div className="leetcode-stat-card">
            <div className="stat-icon">
              <i className="fas fa-calendar"></i>
            </div>
            <div className="stat-content">
              <h4>Reputation</h4>
              <p>{reputation || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="leetcode-difficulty-breakdown">
          <h4>Problems by Difficulty</h4>
          <div className="difficulty-bars">
            <div className="difficulty-bar">
              <span className="difficulty-label">Easy</span>
              <div className="difficulty-progress">
                <div 
                  className="difficulty-fill easy-fill"
                  style={{ width: total > 0 ? `${(easySolved / total) * 100}%` : '0%' }}
                ></div>
              </div>
              <span className="difficulty-count">{easySolved || 0}</span>
            </div>
            <div className="difficulty-bar">
              <span className="difficulty-label">Medium</span>
              <div className="difficulty-progress">
                <div 
                  className="difficulty-fill medium-fill"
                  style={{ width: total > 0 ? `${(mediumSolved / total) * 100}%` : '0%' }}
                ></div>
              </div>
              <span className="difficulty-count">{mediumSolved || 0}</span>
            </div>
            <div className="difficulty-bar">
              <span className="difficulty-label">Hard</span>
              <div className="difficulty-progress">
                <div 
                  className="difficulty-fill hard-fill"
                  style={{ width: total > 0 ? `${(hardSolved / total) * 100}%` : '0%' }}
                ></div>
              </div>
              <span className="difficulty-count">{hardSolved || 0}</span>
            </div>
          </div>
        </div>
        
        <div className="leetcode-recent-activity">
          <h4>Recent Activity</h4>
          <div className="recent-list">
            <div className="recent-item">
              <i className="fas fa-chart-line" style={{ color: '#10B981' }}></i>
              <div className="recent-item-content">
                <div className="recent-item-title">Performance Stats</div>
                <div className="recent-item-details">
                  <strong>{totalSolved || 0}</strong> problems solved
                  <br />
                  <a 
                    href={`https://leetcode.com/${LEETCODE_CONFIG.username}/`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#3B82F6', textDecoration: 'none' }}
                  >
                    View detailed activity on LeetCode →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div id="leetcode-modal" className={`leetcode-modal ${isOpen ? 'active' : ''}`}>
        <div className="leetcode-modal-overlay" onClick={closeModal}></div>
        <div className="leetcode-modal-card">
          <div className="leetcode-modal-header">
            <h2 className="leetcode-modal-title">
              <i className="fas fa-code"></i>
              LeetCode Statistics
            </h2>
            <button className="leetcode-modal-close" onClick={closeModal}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="leetcode-modal-content">
            {renderLeetCodeContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default LeetCodeModal;
