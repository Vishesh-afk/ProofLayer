import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaArrowDown, FaTimes, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { scrapeG2Reviews } from '../../utils/g2Scraper';
import { useAuth } from '../../contexts/AuthContext';
import './ImportModal.css';

const ImportModal = ({ source, onClose }) => {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

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
    if (e.target.className === 'modal-overlay' && !isLoading) {
      onClose();
    }
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || isLoading) return;

    if (source.title !== 'G2') {
      alert('Only G2 import is currently implemented properly.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setProgress('Starting scraper...');

      // 1. Scrape Data
      const reviews = await scrapeG2Reviews(url, (msg) => setProgress(msg));

      if (reviews.length === 0) {
        throw new Error('No reviews found. Please check the URL.');
      }

      setProgress(`Found ${reviews.length} reviews. Saving to database...`);

      // 2. Save to "imported" collection (Staging area)
      const importedRef = collection(db, 'imported');
      const batchPromises = reviews.map(review => {
        return addDoc(importedRef, {
          ...review,
          userId: currentUser.uid,
          companyId: userProfile?.company || '',
          status: 'pending',
          createdAt: new Date().toISOString()
        });
      });

      await Promise.all(batchPromises);

      setProgress('Done! Redirecting to Import page...');
      // Short delay to show completion
      setTimeout(() => {
        onClose();
        navigate('/import'); // Go to Import page to review them
      }, 1000);

    } catch (err) {
      console.error('Import failed:', err);
      setError(err.message || 'Failed to import reviews');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose} disabled={isLoading}>
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
              disabled={isLoading}
            />
            {isValid && !isLoading && <FaCheckCircle className="valid-icon" />}
          </div>

          <p className="example-text">
            For example, https://www.g2.com/products/senja
          </p>

          {error && (
            <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="text-blue-600 text-sm mt-2 p-2 bg-blue-50 rounded flex items-center gap-2">
              <FaSpinner className="animate-spin" />
              {progress}
            </div>
          )}

          <button
            type="submit"
            className="import-button disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isValid || isLoading}
          >
            {isLoading ? 'Importing...' : 'Import testimonials'} <FaArrowDown />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ImportModal;
