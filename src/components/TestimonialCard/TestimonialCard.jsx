import React from "react";
import { useNavigate } from "react-router-dom";

const TestimonialCard = ({ testimonial, onSelect, isSelected }) => {
  const navigate = useNavigate();

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(testimonial.id);
    }
  };

  const handleCardClick = (e) => {
    if (!e.target.closest('.testimonial-checkbox-wrapper')) {
      navigate(`/review/${testimonial.id}`);
    }
  };

  return (
    <div className="relative mb-6 group">
      <div className="testimonial-checkbox-wrapper absolute top-4 right-4 z-10 cursor-pointer">
        <input
          type="checkbox"
          className="w-5 h-5 cursor-pointer accent-primary-600 rounded focus:ring-primary-500 focus:ring-2 focus:ring-offset-1 transition duration-150 ease-in-out"
          checked={isSelected || false}
          onChange={handleCheckboxChange}
        />
      </div>

      <div
        className={`bg-surface rounded-xl p-6 shadow-sm border-2 transition-all duration-300 ease-in-out cursor-pointer hover:shadow-float hover:-translate-y-1 ${isSelected ? 'border-primary-600 ring-4 ring-primary-50' : 'border-transparent'}`}
        onClick={handleCardClick}
      >
        <div className="flex items-center mb-4">
          {testimonial.avatar ? (
            <img src={testimonial.avatar} alt={testimonial.author} className="w-12 h-12 rounded-full mr-4 object-cover shadow-sm" onError={(e) => e.target.style.display = 'none'} />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-700 mr-4 flex items-center justify-center text-lg font-bold shadow-sm">
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
            {testimonial.isDistributed && (
              <span className="shared-badge">Shared</span>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <span className="text-yellow-400 text-lg">{"★".repeat(Math.round(testimonial.rating || 0))}</span>
          <span className="text-gray-200 text-lg">{"★".repeat(5 - Math.round(testimonial.rating || 0))}</span>
        </div>

        <div className="mb-4 text-content-primary leading-relaxed">
          <p className="m-0">{testimonial.content}</p>
        </div>

        <div className="flex justify-between items-center text-sm text-content-muted mt-auto pt-4 border-t border-border/50">
          <p className="m-0">{testimonial.date || new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;