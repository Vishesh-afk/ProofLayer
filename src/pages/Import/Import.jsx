import React, { useState } from "react";
import "./Import.css";
import TestimonialCard from "../../components/TestimonialCard/TestimonialCard";
import { testimonials } from "../../data/testimonials";
import ImportSuccessModal from "../../components/ImportSuccessModal/ImportSuccessModal";

const Import = () => {
  const [selectedTestimonials, setSelectedTestimonials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectTestimonial = (id) => {
    setSelectedTestimonials((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTestimonials.length === testimonials.length) {
      setSelectedTestimonials([]);
    } else {
      setSelectedTestimonials(testimonials.map((t) => t.id));
    }
  };

  const handleImport = () => {
    if (selectedTestimonials.length > 0) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTestimonials([]);
  };

  return (
    <div className="import-page">
      <div className="import-header">
        <h1>Select Testimonials</h1>
        <p>Choose testimonials you want to import</p>
        <div className="import-actions">
          <button className="select-all-button" onClick={handleSelectAll}>Select all</button>
          <button className="import-button" onClick={handleImport}>Import Testimonials</button>
        </div>
      </div>
      <div className="import-filters">
        <button className="filters-button">Filters</button>
      </div>
      <div className="testimonial-list">
        {testimonials.map((testimonial) => (
          <TestimonialCard 
            key={testimonial.id} 
            testimonial={testimonial} 
            onSelect={handleSelectTestimonial}
            isSelected={selectedTestimonials.includes(testimonial.id)}
          />
        ))}
      </div>
      <ImportSuccessModal 
        count={selectedTestimonials.length} 
        source="G2" 
        onClose={handleCloseModal} 
        isOpen={isModalOpen} 
      />
    </div>
  );
};

export default Import;