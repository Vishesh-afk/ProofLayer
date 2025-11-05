// src/components/Sidebar/Sidebar.jsx
import React from 'react';
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
            <a href="#" className="nav-item"><BsList /> New Proof</a>
            <a href="#" className="nav-item active"><BsDownload /> Import</a>
          </div>
          <div className="nav-section">
            <p className="nav-title">MANAGE</p>
            <a href="#" className="nav-item"><BsHeart /> Dashboard</a>
          </div>
          <div className="nav-section">
            <p className="nav-title">SHARE</p>
            <a href="#" className="nav-item"><BsGraphUp /> Distribute</a>
          </div>
          <div className="nav-section">
            <p className="nav-title">COMPITATIVE</p>
            <a href="#" className="nav-item"><BsLink45Deg /> Compitative Insights</a>
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