import React from 'react';
import './Footer.css';

const Footer = ({ darkMode, onInsightsClick, onPrivacyClick }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`footer ${darkMode ? 'dark' : ''}`}>
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand fade-in-up">
            <h4 className="footer-logo">SkinSight <span>AI</span></h4>
            <p className="brand-description">
              AI-powered skin disease detection tool for preliminary analysis and educational purposes.
            </p>
          </div>

          {/* Navigation Column */}
          <div className="footer-group fade-in-up delay-1">
            <h5>Navigation</h5>
            <button onClick={scrollToTop} className="footer-link">
              Home
            </button>
            <button onClick={onInsightsClick} className="footer-link">
              Disease Insights
            </button>
            <button onClick={scrollToTop} className="footer-link">
              Back to Top
            </button>
          </div>

          {/* Legal Column */}
          <div className="footer-group fade-in-up delay-2">
            <h5>Legal</h5>
            <button onClick={onPrivacyClick} className="footer-link">
              Privacy Policy
            </button>
          </div>

          {/* Disclaimer Column */}
          <div className="footer-disclaimer fade-in-up delay-3">
            <h5>Medical Disclaimer</h5>
            <p>
              This tool is for <strong>educational purposes only</strong>. 
              Not a substitute for professional medical advice.
            </p>
            <p className="disclaimer-small">
              Always consult a qualified dermatologist.
            </p>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-copyright">
          <p>© {new Date().getFullYear()} SkinSight AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;