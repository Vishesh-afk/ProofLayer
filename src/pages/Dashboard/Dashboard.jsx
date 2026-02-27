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
    <div className="flex flex-col w-full h-full bg-background animate-fadeIn">
      <header className="flex flex-col gap-6 px-6 py-8 md:px-10 md:py-8 border-b border-slate-200 bg-surface shadow-sm z-10 sticky top-0 md:static">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-slate-800 m-0 tracking-tight">Your Proofs</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Manage, approve, and organize your collected testimonials.</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button className="hidden md:flex p-2 items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" onClick={handleMoreOptions}>
              <FaEllipsisV />
            </button>
            {canCreate && (
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 py-2.5 font-semibold transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={handleCreateProof}>
                <FaPlus size={14} /> Create Proof
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
          <div className="relative w-full sm:max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by author or content..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-full text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all duration-200 shadow-inner-subtle"
            />
          </div>
          <div className="flex items-center gap-4 self-end sm:self-auto">
            <button className="p-2.5 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 relative" onClick={handleNotifications}>
              <FaBell className="text-[18px]" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-surface"></span>
            </button>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            <label className="flex items-center gap-2 text-slate-700 cursor-pointer select-none font-medium hover:text-indigo-600 transition-colors duration-200 group">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
                disabled={proofs.length === 0}
                className="w-4 h-4 cursor-pointer text-indigo-600 bg-slate-100 border-slate-300 rounded focus:ring-indigo-500 focus:ring-2 focus:ring-offset-1 transition duration-150 ease-in-out disabled:opacity-50"
              />
              <span className="group-hover:text-indigo-600">Select all</span>
            </label>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <button className="flex items-center gap-2.5 bg-surface border border-slate-200 rounded-full px-5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" onClick={handleFilters}>
            <BsList className="text-[16px]" /> Filters
          </button>
          {canDelete && selectedCards.size > 0 && (
            <button className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-full px-5 py-2 text-sm font-semibold hover:bg-red-100 hover:border-red-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm animate-fadeIn" onClick={handleDeleteSelected}>
              <FaTrash size={12} /> Delete ({selectedCards.size})
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center p-12 text-content-muted">
            <FaSpinner className="animate-spin text-2xl text-primary-500" />
            <span className="ml-3 font-medium">Loading proofs...</span>
          </div>
        ) : filteredProofs.length === 0 ? (
          <div className="text-center py-16 text-content-secondary bg-surface rounded-xl border border-border border-dashed">
            <p className="text-lg font-medium text-content-primary">No proofs found.</p>
            {proofs.length === 0 && (
              <p className="text-sm mt-2">
                Get started by clicking <strong>"Create a New Proof"</strong> or import from G2!
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
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