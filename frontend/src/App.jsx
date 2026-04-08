// frontend/src/App.jsx
import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import UploadPage from './components/UploadPage';
import ResultPage from './components/ResultPage';
import DiseasesPage from './components/DiseasesPage';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import LoginPage from './components/LoginPage';
import { onAuthStateChange, logOut } from './firebase';

function App() {
  const [user, setUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [activeButton, setActiveButton] = useState('home');
  const [predictionImage, setPredictionImage] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });
  const [diseaseDetails, setDiseaseDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const footerRef = useRef(null);
  const uploadSectionRef = useRef(null);
  const isManualScrolling = useRef(false);

  // Check if user is already logged in with Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setCurrentPage('home');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  useEffect(() => {
    if (currentPage !== 'home') return;

    const options = {
      root: null,
      rootMargin: '-40% 0px -40% 0px', 
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      if (isManualScrolling.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === uploadSectionRef.current) {
            setActiveButton('upload');
          } else if (entry.target === footerRef.current) {
            setActiveButton('footer');
          }
        }
      });
    }, options);

    if (uploadSectionRef.current) observer.observe(uploadSectionRef.current);
    if (footerRef.current) observer.observe(footerRef.current);

    const handleScroll = () => {
      if (isManualScrolling.current) return;
      if (window.scrollY < 200) {
        setActiveButton('home');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      if (uploadSectionRef.current) observer.unobserve(uploadSectionRef.current);
      if (footerRef.current) observer.unobserve(footerRef.current);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentPage]);

  useEffect(() => {
    const handleScrollToDiseases = () => {
      goToDiseases();
    };
    
    window.addEventListener('scrollToDiseases', handleScrollToDiseases);
    return () => window.removeEventListener('scrollToDiseases', handleScrollToDiseases);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setCurrentPage('home');
  };

  const handleLogout = async () => {
    try {
      await logOut();
      setUser(null);
      setCurrentPage('login');
      // Reset all states on logout
      setSelectedImage(null);
      setPreviewUrl(null);
      setPrediction(null);
      setError(null);
      setDiseaseDetails(null);
      setPredictionImage(null);
      setShowPopup(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleImageSelect = (file, preview) => {
    if (previewUrl && previewUrl !== preview) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedImage(file);
    setPreviewUrl(preview);
    setPrediction(null);
    setError(null);
    setDiseaseDetails(null);
  };

  const handlePredict = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);
    setShowPopup(false);
    setPrediction(null);
    setDiseaseDetails(null);

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (data.error === 'invalid_image') {
          setPopupMessage(data.message || 'Please upload a clear skin image');
          setShowPopup(true);
          setLoading(false);
          return;
        } else if (data.error === 'low_confidence') {
          setPopupMessage(data.message || 'Image quality too low. Please upload a clearer photo.');
          setShowPopup(true);
          setLoading(false);
          return;
        } else {
          throw new Error(data.message || 'Prediction failed');
        }
      }

      setPrediction(data.prediction);
      setPredictionImage(previewUrl);
      setDiseaseDetails(data.details);
      setCurrentPage('result');
      setActiveButton('result');
    } catch (err) {
      setError(err.message || 'Something went wrong');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedImage(null);
    setPreviewUrl(null);
    setPrediction(null);
    setError(null);
    setDiseaseDetails(null);
    setPredictionImage(null);
    setCurrentPage('home');
    setActiveButton('home');
    setShowPopup(false);
  };

  const goToHome = () => {
    isManualScrolling.current = true;
    setCurrentPage('home');
    setActiveButton('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => { isManualScrolling.current = false; }, 800);
  };

  const goToDiseases = () => {
    setCurrentPage('diseases');
    setActiveButton('diseases');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrivacyPolicy = () => {
    setCurrentPage('privacy');
    setActiveButton('privacy');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToFooter = () => {
    isManualScrolling.current = true;
    if (currentPage !== 'home') setCurrentPage('home');
    setActiveButton('footer');
    setTimeout(() => {
      if (footerRef.current) {
        footerRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      setTimeout(() => { isManualScrolling.current = false; }, 800);
    }, 100);
  };

  const scrollToUpload = () => {
    isManualScrolling.current = true;
    if (currentPage !== 'home') setCurrentPage('home');
    setActiveButton('upload');
    setTimeout(() => {
      if (uploadSectionRef.current) {
        uploadSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      setTimeout(() => { isManualScrolling.current = false; }, 800);
    }, 100);
  };

  // Show login page if not logged in
  if (currentPage === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} darkMode={darkMode} />;
  }

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-icon">⚠️</div>
            <h3>Unable to Analyze</h3>
            <p>{popupMessage}</p>
            <button className="popup-button" onClick={() => setShowPopup(false)}>
              OK
            </button>
          </div>
        </div>
      )}

      <Header 
        onHomeClick={goToHome}
        onDiseasesClick={goToDiseases}
        onLogout={handleLogout}
        activeButton={activeButton}
        scrollToFooter={scrollToFooter}
        scrollToUpload={scrollToUpload}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        user={user}
      />
      
      {currentPage === 'home' && (
        <>
          <HeroSection darkMode={darkMode} />
          <div ref={uploadSectionRef}>
            <UploadPage
              previewUrl={previewUrl}
              onImageSelect={handleImageSelect}
              onPredict={handlePredict}
              loading={loading}
              error={error}
              darkMode={darkMode}
            />
          </div>
          <div ref={footerRef}>
            <Footer 
              darkMode={darkMode} 
              onInsightsClick={goToDiseases}
              onPrivacyClick={goToPrivacyPolicy}
            />
          </div>
        </>
      )}
      
      {currentPage === 'result' && (
        <ResultPage
          prediction={prediction}
          predictionImage={predictionImage}
          onNewAnalysis={handleReset}
          darkMode={darkMode}
          diseaseDetails={diseaseDetails}
        />
      )}
      
      {currentPage === 'diseases' && (
        <DiseasesPage darkMode={darkMode} />
      )}

      {currentPage === 'privacy' && (
        <PrivacyPolicy darkMode={darkMode} />
      )}
    </div>
  );
}

export default App;