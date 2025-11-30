import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { FaBars } from 'react-icons/fa';
import Sidebar from './components/Sidebar/Sidebar';
import NewProof from './pages/NewProof/NewProof';
import Import from './pages/Import/Import';
import UploadSpreadsheet from './pages/UploadSpreadsheet/UploadSpreadsheet';
import ReviewDetails from './pages/ReviewDetails/ReviewDetails';
import Dashboard from './pages/Dashboard/Dashboard';
import ManualImport from './pages/ManualImport/ManualImport';
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
          <button
            className="sidebar-toggle-button"
            onClick={toggleSidebar}
          >
            <FaBars />
          </button>
          <Routes>
            <Route path="/" element={<NewProof />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/import" element={<Import />} />
            <Route path="/upload-spreadsheet" element={<UploadSpreadsheet />} />
            <Route path="/manual-import" element={<ManualImport />} />
            <Route path="/review/:id" element={<ReviewDetails />} />
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
