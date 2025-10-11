import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaArrowDown, FaTimes } from 'react-icons/fa';
import './ImportModal.css';

const ImportModal = ({ source, onClose }) => {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(false);

  // When the modal opens, pre-fill the example URL if the source is G2
  useEffect(() => {
    if (source && source.title === 'G2') {
      setUrl('https://www.g2.com/products/android-studio/reviews');
    } else {
      setUrl('');
    }
  }, [source]);

  // Simple validation to check if the URL looks plausible
  useEffect(() => {
    setIsValid(url.length > 10 && (url.startsWith('http://') || url.startsWith('https://')));
  }, [url]);

  // Don't render the component if no source is selected
  if (!source) {
    return null;
  }

  const handleOverlayClick = (e) => {
    // Close the modal only if the dark overlay is clicked, not the content
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };
  
  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      // This is where you would call your backend to fetch the data
      console.log(`Fetching from ${source.title} with URL: ${url}`);
      onClose(); // Close modal after submission
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        
        <form onSubmit={handleSubmit}>
          <h2 className="modal-title">{source.title} product URL</h2>
          
          <div className="input-wrapper">
            <input 
              type="text"
              value={url}
              onChange={handleUrlChange}
              placeholder={`Enter ${source.title} URL...`}
            />
            {isValid && <FaCheckCircle className="valid-icon" />}
          </div>
          
          <p className="example-text">
            For example, https://www.g2.com/products/senja
          </p>
          
          <button type="submit" className="import-button" disabled={!isValid}>
            Import testimonials <FaArrowDown />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ImportModal;
