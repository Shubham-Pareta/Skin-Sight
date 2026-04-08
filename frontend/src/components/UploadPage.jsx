import React, { useRef, useState } from 'react';
import './UploadPage.css';

const UploadPage = ({ previewUrl, onImageSelect, onPredict, loading, error, darkMode }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
      const preview = URL.createObjectURL(file);
      onImageSelect(file, preview);
    } else {
      alert('Please upload a valid image (JPEG or PNG)');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
      const preview = URL.createObjectURL(file);
      onImageSelect(file, preview);
    } else {
      alert('Please upload a valid image (JPEG or PNG)');
    }
  };

  return (
    <div className={`upload-page ${darkMode ? 'dark' : ''}`}>
      <div className="upload-container">
        <div className="upload-card">
          <div className="upload-header">
            <div className="header-badge">Medical Image Analysis</div>
            <h3>Upload Skin Image</h3>
            <p className="subtitle">Supported formats: JPG, PNG (Max 10MB)</p>
          </div>

          <div 
            className={`upload-area ${isDragging ? 'dragging' : ''}`}
            onClick={() => fileInputRef.current.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/jpg"
              style={{ display: 'none' }}
            />
            
            {previewUrl ? (
              <div className="preview-container">
                <img src={previewUrl} alt="Preview" className="preview-image" />
                <div className="preview-overlay">
                  <span>Change Image</span>
                </div>
              </div>
            ) : (
              <div className="placeholder">
                <div className="upload-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16V4M12 4L8 8M12 4L16 8" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 16V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V16" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p>Click to upload or drag and drop</p>
                <small>Upload a clear skin lesion image for analysis</small>
              </div>
            )}
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">!</span>
              {error}
            </div>
          )}

          {previewUrl && (
            <div className="button-group">
              <button className="btn-predict" onClick={onPredict} disabled={loading}>
                {loading ? (
                  <span className="loading-text">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </span>
                ) : (
                  'Analyze Image'
                )}
              </button>
            </div>
          )}
        </div>

        <div className="upload-features">
          <div className="feature-item">
            <div className="feature-icon"></div>
            <span>AI Powered</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon"></div>
            <span>Instant Results</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon"></div>
            <span>Secure & Private</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;