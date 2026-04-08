import React, { useEffect, useRef } from 'react';
import './DiseasesPage.css';

const DiseasesPage = ({ darkMode }) => {
  const cardsRef = useRef([]);

  const diseases = [
    { 
      id: 1, 
      name: "Atopic Dermatitis", 
      alsoKnown: "Eczema", 
      symptoms: ["Dry, sensitive skin", "Intense itching", "Red to brownish-gray patches", "Small raised bumps that may leak fluid", "Thickened, cracked, scaly skin"], 
      treatment: "Moisturizers, corticosteroid creams, antihistamines, avoiding irritants, wet dressings", 
      description: "A chronic condition that causes dry, itchy and inflamed skin. Common in children but can occur at any age.",
      severity: "Moderate to Severe",
      duration: "Chronic (Long-term)",
      triggeredBy: "Allergens, stress, weather changes, irritants"
    },
    { 
      id: 2, 
      name: "Basal Cell Carcinoma", 
      alsoKnown: "BCC", 
      symptoms: ["Pearl-like bump", "Flat, flesh-colored lesion", "Bleeding or scabbing sore", "Waxy scar-like area", "Pink growth with raised border"], 
      treatment: "Surgical removal, Mohs surgery, radiation therapy, topical medications, cryotherapy", 
      description: "The most common type of skin cancer. Rarely spreads but can be destructive locally if untreated.",
      severity: "Low",
      duration: "Slow Growing",
      triggeredBy: "UV radiation, sun exposure, tanning beds"
    },
    { 
      id: 3, 
      name: "Benign Keratosis", 
      alsoKnown: "Seborrheic Keratosis", 
      symptoms: ["Waxy, scaly bump", "Brown to black growth", "Rough texture", "Stuck-on appearance", "Round or oval shape"], 
      treatment: "Observation, cryotherapy, curettage, laser removal, electrocautery", 
      description: "Non-cancerous skin growth that appears as a waxy, scaly bump. Very common with aging.",
      severity: "Benign",
      duration: "Permanent",
      triggeredBy: "Aging, genetics, sun exposure"
    },
    { 
      id: 4, 
      name: "Eczema", 
      alsoKnown: "Atopic Dermatitis", 
      symptoms: ["Intense itching", "Red inflamed patches", "Dry sensitive skin", "Dark colored patches", "Small raised bumps", "Oozing or crusting"], 
      treatment: "Moisturizers, steroid creams, immunosuppressants, light therapy, antihistamines", 
      description: "A condition where patches of skin become inflamed, itchy, and rough. Often runs in families.",
      severity: "Mild to Severe",
      duration: "Chronic",
      triggeredBy: "Dry skin, irritants, stress, heat, sweating"
    },
    { 
      id: 5, 
      name: "Melanoma", 
      alsoKnown: "Malignant Melanoma", 
      symptoms: ["Asymmetrical mole", "Irregular borders", "Color changes", "Large diameter", "Evolving size", "Itching or bleeding"], 
      treatment: "Surgical excision, immunotherapy, targeted therapy, chemotherapy, radiation", 
      description: "The most serious type of skin cancer. Develops in melanocytes.",
      severity: "High",
      duration: "Aggressive",
      triggeredBy: "UV radiation, sunburns, genetics, many moles"
    },
    { 
      id: 6, 
      name: "Nevus", 
      alsoKnown: "Mole", 
      symptoms: ["Brown or black spot", "Flat or raised", "Round shape", "Uniform color", "Clear borders"], 
      treatment: "Regular monitoring, biopsy if changes occur, surgical removal", 
      description: "A benign growth on the skin, commonly known as a mole. Most are harmless.",
      severity: "Benign",
      duration: "Permanent",
      triggeredBy: "Genetics, sun exposure, hormones"
    },
    { 
      id: 7, 
      name: "Psoriasis", 
      alsoKnown: "Plaque Psoriasis", 
      symptoms: ["Red patches of skin", "Thick silvery scales", "Dry cracked skin", "Itching and burning", "Thickened nails", "Swollen joints"], 
      treatment: "Topical treatments, phototherapy, systemic medications, biologics", 
      description: "An autoimmune condition that causes rapid skin cell buildup.",
      severity: "Mild to Severe",
      duration: "Chronic",
      triggeredBy: "Stress, infections, cold weather, medications"
    },
    { 
      id: 8, 
      name: "Seborrheic Keratoses", 
      alsoKnown: "SK", 
      symptoms: ["Waxy appearance", "Brown to black color", "Round or oval shape", "Rough surface", "Gradual appearance"], 
      treatment: "Observation, cryotherapy, curettage, laser ablation", 
      description: "Common non-cancerous skin growth that appears with age.",
      severity: "Benign",
      duration: "Permanent",
      triggeredBy: "Aging, family history, sun exposure"
    },
    { 
      id: 9, 
      name: "Tinea Infections", 
      alsoKnown: "Ringworm", 
      symptoms: ["Ring-shaped rash", "Itching and burning", "Scaly patches", "Hair loss", "Cracked skin", "Redness"], 
      treatment: "Antifungal creams, oral antifungals, medicated shampoos", 
      description: "Fungal infections affecting skin, hair, or nails. Highly contagious but treatable.",
      severity: "Mild to Moderate",
      duration: "Weeks to Months",
      triggeredBy: "Warm moist environments, contact with infected people"
    },
    { 
      id: 10, 
      name: "Warts Molluscum", 
      alsoKnown: "Molluscum Contagiosum", 
      symptoms: ["Small raised bumps", "Flesh-colored or pink", "Dimple in center", "Painless", "Clusters of bumps"], 
      treatment: "Observation, cryotherapy, curettage, topical medications", 
      description: "Viral skin infection causing small, firm bumps on the skin.",
      severity: "Benign",
      duration: "Months to Years",
      triggeredBy: "Direct skin contact, contaminated objects"
    }
  ];

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
        }
      });
    }, observerOptions);

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`diseases-page ${darkMode ? 'dark' : 'light'}`}>
      <div className="animated-bg">
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
        <div className="orb orb3"></div>
        <div className="orb orb4"></div>
      </div>

      <div className="diseases-grid">
        {diseases.map((disease, index) => (
          <div 
            key={disease.id} 
            className="disease-card"
            ref={el => cardsRef.current[index] = el}
            style={{ transitionDelay: `${index * 0.05}s` }}
          >
            <div className="disease-card-header">
              <h2>{disease.name}</h2>
              <span className="also-known">{disease.alsoKnown}</span>
              <div className="header-shine"></div>
            </div>
            <div className="disease-card-body">
              <div className="disease-section">
                <strong>Description</strong>
                <p>{disease.description}</p>
              </div>
              <div className="disease-section">
                <strong>Symptoms</strong>
                <ul>
                  {disease.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="disease-section">
                <strong>Treatment Options</strong>
                <p>{disease.treatment}</p>
              </div>
              <div className="disease-info-grid">
                <div className="info-item">
                  <span className="info-label">Severity</span>
                  <span className={`info-value severity-${disease.severity.toLowerCase().replace(' ', '-')}`}>{disease.severity}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Duration</span>
                  <span className="info-value">{disease.duration}</span>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">Common Triggers</span>
                  <span className="info-value">{disease.triggeredBy}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiseasesPage;