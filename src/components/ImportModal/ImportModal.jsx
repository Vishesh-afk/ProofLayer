import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaArrowDown, FaTimes, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { scrapeG2Reviews } from '../../utils/g2Scraper';
import { scrapeCapterraReviews } from '../../utils/capterraScraper';
import { scrapeTrustRadiusReviews } from '../../utils/trustRadiusScraper';
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
    if (source) {
      if (source.title === 'G2') {
        setUrl('https://www.g2.com/products/android-studio/reviews');
      } else if (source.title === 'Capterra') {
        setUrl('https://www.capterra.in/software/179251/paypal');
      } else if (source.title === 'Trustradius') {
        setUrl('https://www.trustradius.com/products/druva-cloud-platform/reviews/all');
      } else {
        setUrl('');
      }
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

    try {
      setIsLoading(true);
      setError('');
      setProgress('Starting scraper...');

      // 1. Scrape Data
      let reviews = [];
      if (source.title === 'G2') {
        reviews = await scrapeG2Reviews(url, (msg) => setProgress(msg));
      } else if (source.title === 'Capterra') {
        reviews = await scrapeCapterraReviews(url, (msg) => setProgress(msg));
      } else if (source.title === 'Trustradius') {
        reviews = await scrapeTrustRadiusReviews(url, (msg) => setProgress(msg));
      } else {
        throw new Error('This source is not yet implemented for auto-import.');
      }

      if (reviews.length === 0) {
        throw new Error('No reviews found. Please check the URL.');
      }

      setProgress(`Found ${reviews.length} reviews. Saving locally...`);

      // 2. Save to localStorage (Temporary fallback/Staging)
      const tempReviews = reviews.map(review => ({
        ...review,
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: currentUser?.uid || 'anonymous',
        companyId: userProfile?.company || '',
        status: 'pending',
        createdAt: new Date().toISOString()
      }));

      const existingLocal = JSON.parse(localStorage.getItem('temp_scraped_reviews') || '[]');
      localStorage.setItem('temp_scraped_reviews', JSON.stringify([...tempReviews, ...existingLocal]));

      // 3. Try to save to Firebase (keep it but handle error gracefully)
      try {
        const importedRef = collection(db, 'imported');
        const batchPromises = reviews.map(review => {
          return addDoc(importedRef, {
            ...review,
            userId: currentUser?.uid || 'anonymous',
            companyId: userProfile?.company || '',
            status: 'pending',
            createdAt: new Date().toISOString()
          });
        });
        await Promise.all(batchPromises);
      } catch (fbErr) {
        console.warn('Firebase save failed, using local storage only:', fbErr);
        // We don't throw here so the user still proceeds to the import page
      }

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
            For example, {url || 'https://www.example.com/product'}
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

          {/* New helper button for manual backup */}
          {url && !isLoading && !error && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
              <p className="text-xs text-gray-500 text-center">Firebase error? Download the scraped data as a file instead:</p>
              <button
                type="button"
                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    setProgress('Scraping for download...');
                    let reviews = [];
                    if (source.title === 'G2') reviews = await scrapeG2Reviews(url);
                    else if (source.title === 'Capterra') reviews = await scrapeCapterraReviews(url);
                    else if (source.title === 'Trustradius') reviews = await scrapeTrustRadiusReviews(url);

                    if (reviews.length > 0) {
                      const blob = new Blob([JSON.stringify(reviews, null, 2)], { type: 'application/json' });
                      const url_blob = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url_blob;
                      a.download = `${source.title.toLowerCase()}_reviews.json`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url_blob);
                      setProgress('File downloaded!');
                    } else {
                      setError('No reviews found to download.');
                    }
                  } catch (e) {
                    setError('Failed to generate file: ' + e.message);
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                Download Scraped JSON
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ImportModal;
