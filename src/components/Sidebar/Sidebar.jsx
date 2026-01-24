import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROLE_LABELS } from '../../constants/roles';
import { BsList, BsDownload, BsHeart, BsGraphUp, BsLink45Deg, BsBoxArrowRight } from 'react-icons/bs';
import './Sidebar.css';
import userAvatar from '../../assets/avatar.png';

const Sidebar = () => {
  const { currentUser, userProfile, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-header">
          <div className="logo">◆ ProofLayer</div>
          <div className="user-profile">
            <img
              src={userProfile?.photoURL || userAvatar}
              alt={userProfile?.displayName || 'User'}
            />
            <div className="user-info">
              <span className="user-name">
                {userProfile?.displayName || currentUser?.email?.split('@')[0] || 'User'}
              </span>
              {userRole && (
                <span className="user-role-badge">
                  {ROLE_LABELS[userRole]}
                </span>
              )}
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">
            <p className="nav-title">COLLECT</p>
            <Link to="/new-proof" className="nav-item"><BsList /> New Proof</Link>
            <Link to="/import" className="nav-item"><BsDownload /> Import</Link>
          </div>
          <div className="nav-section">
            <p className="nav-title">MANAGE</p>
            <Link to="/dashboard" className="nav-item"><BsHeart /> Dashboard</Link>
          </div>
          <div className="nav-section">
            <p className="nav-title">SHARE</p>
            <Link to="#" className="nav-item"><BsGraphUp /> Distribute</Link>
          </div>
          <div className="nav-section">
            <p className="nav-title">COMPETITIVE</p>
            <Link to="#" className="nav-item"><BsLink45Deg /> Competitive Insights</Link>
          </div>
        </nav>
      </div>
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <BsBoxArrowRight />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;