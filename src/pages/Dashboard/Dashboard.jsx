import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, writeBatch, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import './Dashboard.css';
import TestimonialCard from '../../components/TestimonialCard/TestimonialCard';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../constants/roles';
import { FaPlus, FaSearch, FaBell, FaEllipsisV, FaTrash, FaSpinner, FaShareAlt } from 'react-icons/fa';
import { BsList } from 'react-icons/bs';
import { fetchedReviews } from '../../data/fetchedReviews';

const Dashboard = () => {
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCards, setSelectedCards] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { userRole, userProfile } = useAuth();

  // Role-based permissions
  const canCreate = hasPermission(userRole, 'canCreateTestimonials');
  const canDelete = hasPermission(userRole, 'canDeleteOwnTestimonials');

  useEffect(() => {
    fetchProofs();
  }, [userProfile]);

  const fetchProofs = async () => {
    try {
      setLoading(true);
      let allData = [];

      // 1. Try Firebase
      try {
        const q = query(
          collection(db, 'testimonials'),
          where('status', '==', 'active')
        );
        const querySnapshot = await getDocs(q);
        allData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (fbError) {
        console.warn("Dashboard: Firebase fetch failed:", fbError);
      }

      // 2. Add Local Storage (temp/scraped but not approved)
      // Note: Approved items from Import page should have moved to 'testimonials' in Firebase
      // But if Firebase failed during Import, they might still be in localStorage
      const localData = JSON.parse(localStorage.getItem('temp_scraped_reviews') || '[]');

      // 3. Fallback to Mocks if everything else is empty
      if (allData.length === 0 && localData.length === 0) {
        allData = [...fetchedReviews];
      } else {
        allData = [...allData, ...localData];
      }

      setProofs(allData);
    } catch (error) {
      console.error("Error fetching proofs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update select all checkbox based on selected cards
  const allSelected = selectedCards.size === proofs.length && proofs.length > 0;

  const handleCreateProof = () => {
    navigate('/new-proof');
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedCards(new Set());
    } else {
      setSelectedCards(new Set(proofs.map(proof => proof.id)));
    }
  };

  const handleCardSelect = (cardId) => {
    setSelectedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const handleDeleteSelected = async () => {
    if (!canDelete || selectedCards.size === 0) return;

    if (!window.confirm(`Are you sure you want to delete ${selectedCards.size} selected testimonial(s)?`)) {
      return;
    }

    try {
      setLoading(true);
      const batch = writeBatch(db);
      const idsToDelete = [...selectedCards];
      const firebaseIds = [];
      const localIds = [];

      idsToDelete.forEach(id => {
        const idStr = id.toString();
        if (idStr.startsWith('local-')) {
          localIds.push(id);
        } else if (idStr.startsWith('mock-')) {
          // Mock data doesn't need persistent deletion, we just remove from state
        } else {
          firebaseIds.push(id);
        }
      });

      // 1. Delete from Firebase
      if (firebaseIds.length > 0) {
        firebaseIds.forEach(id => {
          const docRef = doc(db, 'testimonials', id);
          batch.delete(docRef);
        });
        await batch.commit();
      }

      // 2. Delete from LocalStorage
      if (localIds.length > 0) {
        const currentLocal = JSON.parse(localStorage.getItem('temp_scraped_reviews') || '[]');
        const updatedLocal = currentLocal.filter(t => !localIds.includes(t.id));
        localStorage.setItem('temp_scraped_reviews', JSON.stringify(updatedLocal));
      }

      // Update local state for all types
      setProofs(prev => prev.filter(proof => !selectedCards.has(proof.id)));
      setSelectedCards(new Set());

      console.log('Successfully deleted:', idsToDelete);
    } catch (error) {
      console.error("Error deleting testimonials:", error);
      alert("Failed to delete selected testimonials. " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShareSelected = async () => {
    if (selectedCards.size === 0) return;

    if (!window.confirm(`Share ${selectedCards.size} selected testimonial(s) to your public API endpoint?`)) {
      return;
    }

    try {
      setLoading(true);
      const batch = writeBatch(db);
      const idsToShare = [...selectedCards];
      const firebaseIds = [];
      const localIds = [];

      idsToShare.forEach(id => {
        const idStr = id.toString();
        if (idStr.startsWith('local-')) {
          localIds.push(id);
        } else if (idStr.startsWith('mock-')) {
          // Mock data can't be shared via Firebase
        } else {
          firebaseIds.push(id);
        }
      });

      // 1. Update in Firebase
      if (firebaseIds.length > 0) {
        firebaseIds.forEach(id => {
          const docRef = doc(db, 'testimonials', id);
          batch.update(docRef, {
            isDistributed: true,
            sharedAt: new Date().toISOString()
          });
        });
        await batch.commit();
      }

      // 2. Update in LocalStorage (optional, but keep consistent)
      if (localIds.length > 0) {
        const currentLocal = JSON.parse(localStorage.getItem('temp_scraped_reviews') || '[]');
        const updatedLocal = currentLocal.map(t => {
          if (localIds.includes(t.id)) {
            return { ...t, isDistributed: true };
          }
          return t;
        });
        localStorage.setItem('temp_scraped_reviews', JSON.stringify(updatedLocal));
      }

      // Refresh data
      await fetchProofs();
      setSelectedCards(new Set());
      alert(`Successfully shared ${idsToShare.length} reviews! They are now available on your Distribution endpoint.`);

    } catch (error) {
      console.error("Error sharing testimonials:", error);
      alert("Failed to share selected testimonials. " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilters = () => {
    console.log('Filters clicked');
  };

  const handleMoreOptions = () => {
    console.log('More options clicked');
  };

  const handleNotifications = () => {
    console.log('Notifications clicked');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProofs = proofs.filter(p =>
    p.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-top">
          <h1 className="dashboard-title">Your Proofs</h1>
          <div className="dashboard-actions">
            <button className="more-options-btn" onClick={handleMoreOptions}>
              <FaEllipsisV />
            </button>
            {canCreate && (
              <button className="create-proof-btn" onClick={handleCreateProof}>
                <FaPlus /> Create a New Proof
              </button>
            )}
          </div>
        </div>
        <div className="dashboard-search-section">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search your proofs"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <button className="notifications-btn" onClick={handleNotifications}>
            <FaBell />
          </button>
          <label className="select-all-checkbox">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAll}
              disabled={proofs.length === 0}
            />
            <span>Select all</span>
          </label>
        </div>
      </header>
      <main className="dashboard-main">
        <div className="dashboard-toolbar">
          <button className="toolbar-btn filters-btn" onClick={handleFilters}>
            <BsList className="filter-icon" /> Filters
          </button>
          {selectedCards.size > 0 && (
            <button className="toolbar-btn share-btn" onClick={handleShareSelected}>
              <FaShareAlt /> Share ({selectedCards.size})
            </button>
          )}
          {canDelete && selectedCards.size > 0 && (
            <button className="toolbar-btn delete-btn" onClick={handleDeleteSelected}>
              <FaTrash /> Delete ({selectedCards.size})
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center p-12 text-gray-400">
            <FaSpinner className="animate-spin text-2xl" />
            <span className="ml-2">Loading proofs...</span>
          </div>
        ) : filteredProofs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No proofs found.</p>
            {proofs.length === 0 && (
              <p className="text-sm mt-2">
                Get started by clicking "Create a New Proof" or import from G2!
              </p>
            )}
          </div>
        ) : (
          <div className="proof-list">
            {filteredProofs.map(proof => (
              <TestimonialCard
                key={proof.id}
                testimonial={proof}
                isSelected={selectedCards.has(proof.id)}
                onSelect={handleCardSelect}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;