import React from "react";
import { useNavigate } from "react-router-dom";
import "./TestimonialCard.css";

const TestimonialCard = ({ testimonial, onSelect, isSelected }) => {
  const navigate = useNavigate();

  const handleCheckboxChange = (e) => {
    // STOP propagation so the Card click (navigation) doesn't trigger
    e.stopPropagation();

    // DO NOT use e.preventDefault() here; it stops the checkbox from working

    if (onSelect) {
      onSelect(testimonial.id);
    }
  };

  const handleCardClick = (e) => {
    // Navigate only if we didn't click the checkbox wrapper
    if (!e.target.closest('.testimonial-checkbox-wrapper')) {
      navigate(`/review/${testimonial.id}`);
    }
  };

  return (
    <div className={`testimonial-card-wrapper ${isSelected ? 'selected' : ''}`}>
      {/* Removed onClick from this wrapper; let the input handle the event */}
      <div className="testimonial-checkbox-wrapper">
        <input
          type="checkbox"
          className="testimonial-checkbox"
          checked={isSelected || false}
          onChange={handleCheckboxChange} // Use onChange for React checkboxes
        // Removed onClick (redundant)
        // Removed readOnly (prevented interaction)
        />
      </div>

      <div
        className={`testimonial-card ${isSelected ? 'selected' : ''}`}
        onClick={handleCardClick}
      >
        <div className="testimonial-card-header">
          {testimonial.avatar ? (
            <img src={testimonial.avatar} alt={testimonial.author} className="testimonial-avatar" onError={(e) => e.target.style.display = 'none'} />
          ) : (
            <div className="testimonial-avatar-fallback" style={{
              width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eee',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', color: '#666'
            }}>
              {testimonial.author?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="testimonial-author">
            <p className="testimonial-author-name">{testimonial.author}</p>
            <p className="testimonial-author-handle">{testimonial.handle || testimonial.role}</p>
          </div>
          <div className="testimonial-rating">
            <span style={{ color: '#FFB800' }}>{"★".repeat(Math.round(testimonial.rating || 0))}</span>
            <span style={{ color: '#E0E0E0' }}>{"★".repeat(5 - Math.round(testimonial.rating || 0))}</span>
          </div>
        </div>
        <div className="testimonial-body">
          <p>{testimonial.content}</p>
        </div>
        <div className="testimonial-footer">
          <p className="testimonial-date">{testimonial.date || new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;