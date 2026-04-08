import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = ({ onHomeClick, onDiseasesClick, onLogout, activeButton, scrollToFooter, scrollToUpload, darkMode, toggleDarkMode, user }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themePopupOpen, setThemePopupOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleThemePopup = () => {
    setThemePopupOpen(!themePopupOpen);
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themePopupOpen && !event.target.closest('.theme-popup-container')) {
        setThemePopupOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [themePopupOpen]);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''} ${darkMode ? 'dark' : ''}`}>
      <div className="nav-container">
        <div className="logo" onClick={onHomeClick}>
          <div className="rotating-icon">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#667eea" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#667eea" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#667eea" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="2" fill="#667eea"/>
            </svg>
          </div>
          <span className="logo-text">SkinSight</span>
          <span className="logo-ai">AI</span>
        </div>
        
        <button className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <button 
            className={`nav-link ${activeButton === 'home' ? 'active' : ''}`}
            onClick={() => {
              setMobileMenuOpen(false);
              onHomeClick();
            }}
          >
            Home
          </button>
          <button 
            className={`nav-link ${activeButton === 'diseases' ? 'active' : ''}`}
            onClick={() => {
              setMobileMenuOpen(false);
              onDiseasesClick();
            }}
          >
            Insights
          </button>
          <button 
            className={`nav-link ${activeButton === 'upload' ? 'active' : ''}`}
            onClick={() => {
              setMobileMenuOpen(false);
              scrollToUpload();
            }}
          >
            Analyze
          </button>
          <button 
            className={`nav-link ${activeButton === 'footer' ? 'active' : ''}`}
            onClick={() => {
              setMobileMenuOpen(false);
              scrollToFooter();
            }}
          >
            About
          </button>
          
          {/* Dark Mode Button with Popup - MOVED BEFORE USER INFO */}
          <div className="theme-popup-container">
            <button 
              className="nav-link dark-mode-btn"
              onClick={toggleThemePopup}
            >
              Dark Mode
            </button>
            
            {themePopupOpen && (
              <div className="theme-popup">
                <div className="theme-popup-header">
                  <span>Dark Mode</span>
                </div>
                <div className="theme-popup-content">
                  <label className="theme-switch-label">
                    <span className="theme-switch-text">Off</span>
                    <div className="theme-switch">
                      <input 
                        type="checkbox" 
                        checked={darkMode} 
                        onChange={toggleDarkMode}
                      />
                      <span className="theme-slider"></span>
                    </div>
                    <span className="theme-switch-text">On</span>
                  </label>
                </div>
              </div>
            )}
          </div>
          
          {/* User Info Section - MOVED AFTER DARK MODE */}
          {user && (
            <div className="user-info">
              {user.photoURL ? (
                <img src={user.photoURL} alt="User" className="user-avatar" />
              ) : (
                <div className="user-avatar-placeholder">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
                </div>
              )}
              <span className="user-name">{user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'User'}</span>
            </div>
          )}
          
          <button 
            className="nav-link logout"
            onClick={() => {
              setMobileMenuOpen(false);
              onLogout();
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;