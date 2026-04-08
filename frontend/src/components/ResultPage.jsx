import React, { useState, useEffect } from 'react';
import './ResultPage.css';

const ResultPage = ({ prediction, predictionImage, onNewAnalysis, darkMode, diseaseDetails }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reset loading when new prediction comes in
    setLoading(true);
    
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => {
        const items = document.querySelectorAll('.animate-item');
        items.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('animated');
          }, index * 100);
        });
      }, 100);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [prediction, predictionImage]); // Re-run when prediction or image changes

  const getUrgencyClass = (urgency) => {
    switch(urgency?.toLowerCase()) {
      case 'immediate': return 'urgency-immediate';
      case 'urgent': return 'urgency-urgent';
      default: return 'urgency-routine';
    }
  };

  return (
    <div className={`result-page ${darkMode ? 'dark' : 'light'}`}>
      <div className="animated-bg-particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>

      <div className="result-container">
        <div className="result-header">
          <div className="header-badge">
            <span className="badge-icon"></span>
            Analysis Complete
          </div>
          <h1 className="glitch-text">Diagnosis <span className="highlight">Result</span></h1>
          <div className="header-line"></div>
        </div>

        <div className="result-content">
          <div className="result-image-section">
            <div className="image-card">
              <div className="image-badge">
                <span className="badge-pulse"></span>
                Analyzed Image
              </div>
              <div className="image-wrapper">
                {predictionImage ? (
                  <img src={predictionImage} alt="Analyzed" className="analyzed-image" />
                ) : (
                  <div className="no-image-placeholder">No image available</div>
                )}
                <div className="image-scan-overlay">
                  <div className="scan-line-horizontal"></div>
                  <div className="scan-line-vertical"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="result-details-section">
            <div className="prediction-card">
              <div className="prediction-header">
                <div className="prediction-icon">AI</div>
                <h3>Medical Insights</h3>
              </div>
              
              <div className="disease-name animate-item">
                <label>Detected Condition</label>
                <div className="disease-value-wrapper">
                  <h2>{prediction || "No prediction"}</h2>
                  <div className="verification-badge">
                    <span className="check-mark"></span>
                    AI Prediction
                  </div>
                </div>
              </div>
              
              {loading ? (
                <div className="skeleton-loader">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                  <div className="skeleton-line medium"></div>
                </div>
              ) : (
                diseaseDetails && (
                  <>
                    <div className="info-section animate-item">
                      <label>Description</label>
                      <div className="info-content">
                        <p>{diseaseDetails.description || "Information not available"}</p>
                      </div>
                    </div>

                    <div className="info-section animate-item">
                      <label>Key Symptoms</label>
                      <div className="symptoms-grid">
                        {diseaseDetails.symptoms && diseaseDetails.symptoms.map((symptom, index) => (
                          <div key={index} className="symptom-chip">
                            <span className="symptom-dot"></span>
                            {symptom}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="info-grid-simple animate-item">
                      <div className="info-card">
                        <div className="card-content">
                          <label>Primary Treatment</label>
                          <p>{diseaseDetails.treatment || "Consult a dermatologist"}</p>
                        </div>
                      </div>
                      
                      <div className="info-card">
                        <div className="card-content">
                          <label>Urgency Level</label>
                          <span className={`urgency-tag ${getUrgencyClass(diseaseDetails.urgency)}`}>
                            {diseaseDetails.urgency || "Routine"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )
              )}

              <button className="btn-new-analysis" onClick={onNewAnalysis}>
                Analyze Another Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;