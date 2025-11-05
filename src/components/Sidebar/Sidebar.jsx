// src/components/Sidebar/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { BsList, BsDownload, BsHeart, BsGraphUp, BsLink45Deg } from 'react-icons/bs';
import './Sidebar.css';
// Note the updated path to the assets folder
import userAvatar from '../../assets/avatar.png';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-header">
          <div className="logo">◆ ProofLayer</div>
          <div className="user-profile">
            <img src={userAvatar} alt="User Avatar" />
            <span>Sam</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">
            <p className="nav-title">COLLECT</p>
            <Link to="/" className="nav-item active"><BsList /> New Proof</Link>
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
            <p className="nav-title">COMPITATIVE</p>
            <Link to="#" className="nav-item"><BsLink45Deg /> Compitative Insights</Link>
          </div>
        </nav>
      </div>
      <div className="sidebar-footer">
        {/* The upgrade button has been moved to the top banner */}
      </div>
    </aside>
  );
};

export default Sidebar;