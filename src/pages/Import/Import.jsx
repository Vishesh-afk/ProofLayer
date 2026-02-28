import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import "./Import.css";
import TestimonialCard from "../../components/TestimonialCard/TestimonialCard";
import ImportSuccessModal from "../../components/ImportSuccessModal/ImportSuccessModal";
import { useAuth } from "../../contexts/AuthContext";
import { FaSpinner } from 'react-icons/fa';

import { fetchedReviews } from "../../data/fetchedReviews";

const Import = () => {
  const [scrapedTestimonials, setScrapedTestimonials] = useState([]);
  const [selectedTestimonials, setSelectedTestimonials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  const { userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchScrapedTestimonials();
  }, [userProfile]); // Refresh when profile loads

  const fetchScrapedTestimonials = async () => {
    try {
      setLoading(true);
      let allData = [];

      // 1. Fetch from Firebase (Staging)
      try {
        const q = query(
          collection(db, 'imported')
        );
        const querySnapshot = await getDocs(q);
        const fbData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        allData = [...fbData];
      } catch (fbError) {
        console.warn("Firebase fetch failed, falling back to local:", fbError);
      }

      // 2. Fetch from LocalStorage
      const localData = JSON.parse(localStorage.getItem('temp_scraped_reviews') || '[]');

      // 3. Add Mock Data if nothing else exists (for demo)
      if (allData.length === 0 && localData.length === 0) {
        allData = [...fetchedReviews];
      } else {
        // Merge them, avoiding duplicates if possible (simple merge for now)
        allData = [...allData, ...localData];
      }

      setScrapedTestimonials(allData);
    } catch (error) {
      console.error("Error fetching imported testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTestimonial = (id) => {
    setSelectedTestimonials((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTestimonials.length === scrapedTestimonials.length) {
      setSelectedTestimonials([]);
    } else {
      setSelectedTestimonials(scrapedTestimonials.map((t) => t.id));
    }
  };

  const handleImport = async () => {
    if (selectedTestimonials.length === 0) return;

    try {
      setImporting(true);
      const batch = writeBatch(db);

      // Get the full data objects for selected IDs
      const toImport = scrapedTestimonials.filter(t => selectedTestimonials.includes(t.id));
      const firebaseIdsToDelete = [];
      const localIdsToRemove = [];

      toImport.forEach(item => {
        // 1. Create new doc in 'testimonials' (Live)
        // Note: Even if we got the review from local, we try to save to Firebase 'testimonials'
        const newRef = doc(collection(db, 'testimonials'));
        const { id, ...data } = item; // Remove the old ID

        batch.set(newRef, {
          ...data,
          status: 'active',
          approvedAt: new Date().toISOString()
        });

        // 2. Track where to delete from
        if (id.toString().startsWith('local-')) {
          localIdsToRemove.push(id);
        } else if (id.toString().startsWith('mock-')) {
          // Mock data doesn't need to be deleted from anywhere persistent
        } else {
          firebaseIdsToDelete.push(id);
        }
      });

      // Commit Firebase batch (creates new testimonials and deletes from 'imported')
      firebaseIdsToDelete.forEach(id => {
        const oldRef = doc(db, 'imported', id);
        batch.delete(oldRef);
      });

      await batch.commit();

      // Clean up localStorage
      if (localIdsToRemove.length > 0) {
        const currentLocal = JSON.parse(localStorage.getItem('temp_scraped_reviews') || '[]');
        const updatedLocal = currentLocal.filter(t => !localIdsToRemove.includes(t.id));
        localStorage.setItem('temp_scraped_reviews', JSON.stringify(updatedLocal));
      }

      setIsModalOpen(true);
      fetchScrapedTestimonials(); // Refresh list
    } catch (error) {
      console.error("Error approving testimonials:", error);
      alert("Failed to import selected testimonials to live database. " + error.message);
    } finally {
      setImporting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTestimonials([]);
    navigate('/dashboard'); // Go to dashboard to see active proof
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-purple-600" />
      </div>
    );
  }

  return (
    <div className="import-page">
      <div className="import-header">
        <h1>Review Imported Testimonials</h1>
        <p>Select testimonials to add to your dashboard ({scrapedTestimonials.length} pending)</p>
        <div className="import-actions">
          <button
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={handleSelectAll}
            disabled={scrapedTestimonials.length === 0}
          >
            {selectedTestimonials.length === scrapedTestimonials.length && scrapedTestimonials.length > 0 ? 'Deselect All' : 'Select All'}
          </button>
          <button
            className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={handleImport}
            disabled={selectedTestimonials.length === 0 || importing}
          >
            {importing && <FaSpinner className="animate-spin" />}
            Approve & Import ({selectedTestimonials.length})
          </button>
        </div>
      </div>

      {scrapedTestimonials.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300 mt-4">
          <p className="text-lg mb-2">No pending imports found.</p>
          <p className="text-sm">Use "New Proof" to import from G2 or other sources.</p>
          <button
            onClick={() => navigate('/new-proof')}
            className="mt-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200"
          >
            Start New Import
          </button>
        </div>
      ) : (
        <div className="testimonial-list">
          {scrapedTestimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              onSelect={handleSelectTestimonial}
              isSelected={selectedTestimonials.includes(testimonial.id)}
            />
          ))}
        </div>
      )}

      <ImportSuccessModal
        count={selectedTestimonials.length}
        source="G2" // Or dynamic based on selection
        onClose={handleCloseModal}
        isOpen={isModalOpen}
      />
    </div>
  );
};

export default Import;