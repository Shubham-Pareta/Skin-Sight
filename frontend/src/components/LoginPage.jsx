// frontend/src/components/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  signInWithGoogle, 
  signInWithEmail,
  registerWithEmail
} from '../firebase';
import './LoginPage.css';

const LoginPage = ({ onLoginSuccess, darkMode }) => {
  const [name, setName] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [animateTitle, setAnimateTitle] = useState(false);

  useEffect(() => {
    setAnimateTitle(true);
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await signInWithGoogle();
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      let user;
      if (isSignUp) {
        user = await registerWithEmail(email, password, name);
      } else {
        user = await signInWithEmail(email, password);
      }
      onLoginSuccess(user);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Email already registered');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`login-page ${darkMode ? 'dark' : 'light'}`}>
      {/* Stars Background */}
      <div className="stars-container">
        <div className="star star-large s1"></div>
        <div className="star star-medium s2"></div>
        <div className="star star-small s3"></div>
        <div className="star star-large s4"></div>
        <div className="star star-medium s5"></div>
        <div className="star star-small s6"></div>
        <div className="star star-large s7"></div>
        <div className="star star-medium s8"></div>
        <div className="star star-small s9"></div>
        <div className="star star-large s10"></div>
        <div className="star star-medium s11"></div>
        <div className="star star-small s12"></div>
        <div className="star star-large s13"></div>
        <div className="star star-medium s14"></div>
        <div className="star star-small s15"></div>
        <div className="star star-large s16"></div>
        <div className="star star-medium s17"></div>
        <div className="star star-small s18"></div>
        <div className="star star-large s19"></div>
        <div className="star star-medium s20"></div>
        <div className="star star-small s21"></div>
        <div className="star star-large s22"></div>
        <div className="star star-medium s23"></div>
        <div className="star star-small s24"></div>
        <div className="star star-large s25"></div>
      </div>

      {/* Shooting Stars - Left to Right */}
      <div className="shooting-star shooting-star-left shooting-star-l1"></div>
      <div className="shooting-star shooting-star-left shooting-star-l2"></div>
      <div className="shooting-star shooting-star-left shooting-star-l3"></div>
      <div className="shooting-star shooting-star-left shooting-star-l4"></div>
      <div className="shooting-star shooting-star-left shooting-star-l5"></div>

      {/* Shooting Stars - Right to Left */}
      <div className="shooting-star shooting-star-right shooting-star-r1"></div>
      <div className="shooting-star shooting-star-right shooting-star-r2"></div>
      <div className="shooting-star shooting-star-right shooting-star-r3"></div>
      <div className="shooting-star shooting-star-right shooting-star-r4"></div>
      <div className="shooting-star shooting-star-right shooting-star-r5"></div>

      {/* Floating Orbs */}
      <div className="floating-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="login-container">
        <div className={`login-card ${animateTitle ? 'animate' : ''}`}>
          {/* Logo Section */}
          <div className="login-logo">
            <div className="logo-icon">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="2" fill="white"/>
              </svg>
            </div>
            <h1 className="login-title">
              <span className="title-word">Skin</span>
              <span className="title-word">Sight</span>
              <span className="title-highlight">AI</span>
            </h1>
          </div>

          {/* Welcome Text */}
          <div className="login-welcome">
            <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            <p>{isSignUp ? 'Sign up to continue your skin health journey' : 'Sign in to continue your skin health journey'}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="login-error">
              <span className="error-icon">!</span>
              <span>{error}</span>
            </div>
          )}

          {/* Google Login Button */}
          <div className="login-buttons">
            <button 
              className="login-btn google-btn"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <div className="btn-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="login-divider">
            <span className="divider-line"></span>
            <span className="divider-text">OR</span>
            <span className="divider-line"></span>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailSubmit} className="email-login-form">
            {isSignUp && (
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            )}
            <div className="input-group">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {isSignUp && (
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            )}
            <button type="submit" className="email-login-btn" disabled={isLoading}>
              {isLoading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </form>

          {/* Toggle between Sign In and Sign Up */}
          <div className="login-toggle">
            <p>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button 
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setName('');
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="toggle-link"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;