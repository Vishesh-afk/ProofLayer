import React from 'react';
import './ImportSuccessModal.css';
import { FaCheckCircle } from 'react-icons/fa';
import { BsArrowRight } from 'react-icons/bs';

import { useNavigate } from 'react-router-dom';

const ImportSuccessModal = ({ count, source, onClose, isOpen }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const handleDistribute = () => {
    onClose();
    navigate('/distribute');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <FaCheckCircle className="success-icon" />
        </div>
        <div className="modal-body text-center">
          <h2 className="text-xl font-bold mb-2">Success!</h2>
          <p>Imported {count} testimonials from {source}</p>
        </div>
        <div className="modal-footer flex flex-col gap-2 w-full mt-4">
          <button className="dashboard-button w-full py-3 bg-[#6C5CE7] text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity" onClick={handleDistribute}>
            Distribute Now <BsArrowRight />
          </button>
          <button className="text-gray-500 text-sm hover:underline" onClick={onClose}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportSuccessModal;