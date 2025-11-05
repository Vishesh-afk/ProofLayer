import React from "react";
import "./TestimonialCard.css";

const TestimonialCard = ({ testimonial, onSelect, isSelected }) => {
  return (
    <div className={`testimonial-card ${isSelected ? 'selected' : ''}`}>
        <input 
            type="checkbox" 
            className="testimonial-checkbox" 
            checked={isSelected}
            onChange={() => onSelect(testimonial.id)}
        />
      <div className="testimonial-card-header">
        <img src={testimonial.avatar} alt={testimonial.author} className="testimonial-avatar" />
        <div className="testimonial-author">
          <p className="testimonial-author-name">{testimonial.author}</p>
          <p className="testimonial-author-handle">{testimonial.handle}</p>
        </div>
        <div className="testimonial-rating">
          {"★".repeat(testimonial.rating)}
        </div>
      </div>
      <div className="testimonial-body">
        <p>{testimonial.content}</p>
      </div>
      <div className="testimonial-footer">
        <p className="testimonial-date">{testimonial.date}</p>
        <a href={testimonial.link} className="testimonial-link">Read more</a>
      </div>
    </div>
  );
};

export default TestimonialCard;