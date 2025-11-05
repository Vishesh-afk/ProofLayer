import React from 'react';
import './ProofCard.css';
import userAvatar from '../../assets/avatar.png';

const ProofCard = ({ proof }) => {
  const { user, date, text, source } = proof;

  return (
    <div className="proof-card">
      <div className="proof-card-header">
        <div className="proof-card-user">
          <img src={userAvatar} alt="User Avatar" />
          <span>{user}</span>
        </div>
        <div className="proof-card-date">{date}</div>
      </div>
      <div className="proof-card-body">
        <p>{text}</p>
      </div>
      <div className="proof-card-footer">
        <div className="proof-card-source">Source: {source}</div>
        <div className="proof-card-actions">
          <button>View</button>
          <button>Share</button>
        </div>
      </div>
    </div>
  );
};

export default ProofCard;