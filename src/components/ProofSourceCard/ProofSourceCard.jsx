// src/components/ProofSourceCard/ProofSourceCard.jsx
import React from 'react';
import './ProofSourceCard.css';

// Add onClick to the component's props
const ProofSourceCard = ({ icon, title, isPrimary = false, onClick, isLoading = false }) => {
  // The isPrimary class is kept for the "Request a New Source" card styling
  const cardClass = isPrimary ? 'proof-card primary' : 'proof-card';

  return (
    // Add the onClick handler to the main div, making the whole card clickable
    <div className={`${cardClass} ${isLoading ? 'loading' : ''}`} onClick={onClick}>
      {/* This is the glassy top part */}
      <div className="card-icon-area">
        {/* This is the circular frame inside the top part */}
        <div className="icon-frame">
          {icon}
        </div>
      </div>

      {/* This is the solid white bottom part */}
      <div className="card-info">
        <h3>{title}</h3>
      </div>
    </div>
  );
};

export default ProofSourceCard;

