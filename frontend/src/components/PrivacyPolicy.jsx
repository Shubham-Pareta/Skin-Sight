import React, { useEffect } from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = ({ darkMode }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className={`privacy-page ${darkMode ? 'dark' : 'light'}`}>
      <div className="animated-bg">
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
        <div className="orb orb3"></div>
      </div>

      <div className="privacy-container">
        <div className="privacy-header">
          <div className="header-badge">Legal Document</div>
          <h1>Privacy <span className="highlight">Policy</span></h1>
          <div className="header-line"></div>
        </div>

        <div className="privacy-content">
          <div className="policy-section">
            <h2>Information We Collect</h2>
            <p>When you use SkinSight AI, we collect the following information to provide and improve our service:</p>
            <ul>
              <li><strong>Medical Images:</strong> Skin images you upload for analysis (temporarily stored for processing only)</li>
              <li><strong>Usage Data:</strong> Information about how you use our website for service improvement</li>
              <li><strong>Technical Data:</strong> IP address, browser type, and device information for security</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>How We Use Your Information</h2>
            <p>Your information is used solely for:</p>
            <ul>
              <li>Providing accurate skin disease detection results</li>
              <li>Improving our AI model and service accuracy</li>
              <li>Maintaining and securing our platform</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>Image Data Processing</h2>
            <p>We take your privacy seriously. Here's how we handle your medical images:</p>
            <ul>
              <li>Images are processed in real-time and never stored permanently</li>
              <li>Images are automatically deleted immediately after analysis</li>
              <li>We do not share your images with any third parties</li>
              <li>Images are encrypted during transmission using SSL/TLS</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>Data Security</h2>
            <p>We implement industry-standard security measures to protect your data:</p>
            <ul>
              <li>SSL/TLS encryption for all data transmission</li>
              <li>Secure server infrastructure with firewalls</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal data by authorized personnel only</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>Your Rights</h2>
            <p>You have the following rights regarding your data:</p>
            <ul>
              <li>Right to access your personal data</li>
              <li>Right to request deletion of your data</li>
              <li>Right to opt-out of data collection</li>
              <li>Right to know how your data is used</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>Medical Disclaimer</h2>
            <p>SkinSight AI is an informational tool only and not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
          </div>

          <div className="policy-section">
            <h2>Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
          </div>

          <div className="policy-footer-note">
            <p>By using SkinSight AI, you consent to the collection and use of information in accordance with this Privacy Policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;