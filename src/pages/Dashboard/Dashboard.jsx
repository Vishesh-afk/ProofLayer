import React, { useState } from 'react';
import './Dashboard.css';
import TestimonialCard from '../../components/TestimonialCard/TestimonialCard';
import { FaPlus, FaSearch, FaBell, FaEllipsisV } from 'react-icons/fa';
import { BsList } from 'react-icons/bs';
import userAvatar from '../../assets/avatar.png';

const mockProofs = [
  { id: 1, author: 'Sam', handle: '@sam', avatar: userAvatar, rating: 4, content: 'What is Android Studio solving and how is that benefiting you? hybrid development problem. I most likely about Android studio is faster build process in latest version, auto suggestion using pligin.', date: '2 mins ago' },
  { id: 2, author: 'Sam', handle: '@sam', avatar: userAvatar, rating: 5, content: 'What is Android Studio solving and how is that benefiting you? hybrid development problem. I most likely about Android studio is faster build process in latest version, auto suggestion using pligin.', date: '2 mins ago' },
  { id: 3, author: 'Sam', handle: '@sam', avatar: userAvatar, rating: 5, content: 'What is Android Studio solving and how is that benefiting you? hybrid development problem. I most likely about Android studio is faster build process in latest version, auto suggestion using pligin.', date: '2 mins ago' },
  { id: 4, author: 'Sam', handle: '@sam', avatar: userAvatar, rating: 4, content: 'What is Android Studio solving and how is that benefiting you? hybrid development problem. I most likely about Android studio is faster build process in latest version, auto suggestion using pligin.', date: '2 mins ago' },
  { id: 5, author: 'Sam', handle: '@sam', avatar: userAvatar, rating: 5, content: 'What is Android Studio solving and how is that benefiting you? hybrid development problem. I most likely about Android studio is faster build process in latest version, auto suggestion using pligin.', date: '2 mins ago' },
  { id: 6, author: 'Sam', handle: '@sam', avatar: userAvatar, rating: 4, content: 'What is Android Studio solving and how is that benefiting you? hybrid development problem. I most likely about Android studio is faster build process in latest version, auto suggestion using pligin.', date: '2 mins ago' },
];

const Dashboard = () => {
  const [selectedCards, setSelectedCards] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Update select all checkbox based on selected cards
  const allSelected = selectedCards.size === mockProofs.length && mockProofs.length > 0;

  const handleCreateProof = () => {
    console.log('Create a New Proof clicked');
    // Add navigation or modal logic here
  };

  const handleSelectAll = () => {
    if (allSelected) {
      // Deselect all
      setSelectedCards(new Set());
    } else {
      // Select all
      setSelectedCards(new Set(mockProofs.map(proof => proof.id)));
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

  const handleFilters = () => {
    console.log('Filters clicked');
    // Add filter modal logic here
  };

  const handleMoreOptions = () => {
    console.log('More options clicked');
    // Add dropdown menu logic here
  };

  const handleNotifications = () => {
    console.log('Notifications clicked');
    // Add notifications logic here
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    console.log('Search:', e.target.value);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-top">
          <h1 className="dashboard-title">Your Proofs</h1>
          <div className="dashboard-actions">
            <button className="more-options-btn" onClick={handleMoreOptions}>
              <FaEllipsisV />
            </button>
            <button className="create-proof-btn" onClick={handleCreateProof}>
              <FaPlus /> Create a New Proof
            </button>
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
        </div>
        <div className="proof-list">
          {mockProofs.map(proof => (
            <TestimonialCard 
              key={proof.id} 
              testimonial={proof}
              isSelected={selectedCards.has(proof.id)}
              onSelect={handleCardSelect}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;