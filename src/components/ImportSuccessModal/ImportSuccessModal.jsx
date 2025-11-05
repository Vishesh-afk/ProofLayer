import React from 'react';
import './ImportSuccessModal.css';
import { FaCheckCircle } from 'react-icons/fa';
import { BsArrowRight } from 'react-icons/bs';

const ImportSuccessModal = ({ count, source, onClose, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <FaCheckCircle className="success-icon" />
        </div>
        <div className="modal-body">
          <h2>Imported {count} testimonials from {source}</h2>
        </div>
        <div className="modal-footer">
          <button className="dashboard-button" onClick={onClose}>
            View in Dashboard <BsArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportSuccessModal;