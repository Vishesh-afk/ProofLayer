import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

import Sidebar from './components/Sidebar/Sidebar';
import NewProof from './pages/NewProof/NewProof';
import Import from './pages/Import/Import';
import UploadSpreadsheet from './pages/UploadSpreadsheet/UploadSpreadsheet';
import Dashboard from './pages/Dashboard/Dashboard';
import './App.css';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="main-view">
        <button className="sidebar-toggle-button" onClick={toggleSidebar}>
          <FaBars />
        </button>

        <Routes>
          <Route path="/" element={<NewProof />} />
          <Route path="/import" element={<Import />} />
          <Route path="/upload-spreadsheet" element={<UploadSpreadsheet />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>

      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default App;
