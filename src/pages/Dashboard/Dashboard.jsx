import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import './Dashboard.css';
import TestimonialCard from '../../components/TestimonialCard/TestimonialCard';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../constants/roles';
import { FaPlus, FaSearch, FaBell, FaEllipsisV, FaTrash, FaSpinner } from 'react-icons/fa';
import { BsList } from 'react-icons/bs';

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
      const q = query(
        collection(db, 'testimonials'),
        where('status', '==', 'active')
        // Order by needs index, so might fail if not created. 
        // orderBy('createdAt', 'desc') 
      );

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setProofs(data);
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

  const handleDeleteSelected = () => {
    if (!canDelete) return;
    console.log('Deleting selected:', [...selectedCards]);
    // TODO: implement actual delete logic (batch delete)
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