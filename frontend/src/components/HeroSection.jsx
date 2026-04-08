import React, { useEffect, useRef } from 'react';
import './HeroSection.css';

const HeroSection = ({ darkMode }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 1;
        this.speedX = Math.random() * 0.8 - 0.4;
        this.speedY = Math.random() * 0.8 - 0.4;
        // Brighter colors for light mode, softer for dark mode
        if (darkMode) {
          this.color = `rgba(139, 92, 246, ${Math.random() * 0.4 + 0.2})`;
        } else {
          this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`;
        }
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const numberOfParticles = 100;
      for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(new Particle(x, y));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            let lineColor;
            if (darkMode) {
              lineColor = `rgba(139, 92, 246, ${0.25 * (1 - distance / 100)})`;
            } else {
              lineColor = `rgba(255, 255, 255, ${0.4 * (1 - distance / 100)})`;
            }
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      setCanvasSize();
      initParticles();
    };

    setCanvasSize();
    initParticles();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [darkMode]);

  return (
    <section className={`hero-animated ${darkMode ? 'dark' : 'light'}`}>
      <canvas ref={canvasRef} className="hero-canvas"></canvas>
      
      <div className="hero-animated-content">
        <div className="hero-badge">
          <span className="badge-pulse"></span>
          AI-Powered Diagnosis
        </div>
        
        <h1 className="hero-animated-title">
          <span className="title-word">Advanced</span>
          <span className="title-word">Skin Disease</span>
          <span className="title-gradient">Detection</span>
        </h1>
        
        <p className="hero-animated-description">
          Leveraging cutting-edge deep learning technology to provide accurate<br />
          skin condition analysis from medical-grade images
        </p>
        
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-number">10</div>
            <div className="stat-label">Diseases Detected</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Available</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">Instant</div>
            <div className="stat-label">Results</div>
          </div>
        </div>
        
        <div className="hero-cta">
          <button 
            className="cta-primary"
            onClick={() => document.querySelector('.upload-container')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Start Analysis
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button 
            className="cta-secondary"
            onClick={() => window.dispatchEvent(new CustomEvent('scrollToDiseases'))}
          >
            Learn More
          </button>
        </div>
      </div>
      
      <div className="hero-wave">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 64L60 69.3C120 75 240 85 360 80C480 75 600 53 720 48C840 43 960 53 1080 58.7C1200 64 1320 64 1380 64L1440 64L1440 120L1380 120C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120L0 120Z" fill="currentColor"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;