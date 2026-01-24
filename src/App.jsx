import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Components
import Sidebar from './components/Sidebar/Sidebar';
import { ProtectedRoute, PublicRoute, PrivilegedRoute } from './components/ProtectedRoute/ProtectedRoute';

// Pages
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Onboarding from './pages/Onboarding/Onboarding';
import Unauthorized from './pages/Unauthorized/Unauthorized';
import NewProof from './pages/NewProof/NewProof';
import Import from './pages/Import/Import';
import UploadSpreadsheet from './pages/UploadSpreadsheet/UploadSpreadsheet';
import ReviewDetails from './pages/ReviewDetails/ReviewDetails';
import Dashboard from './pages/Dashboard/Dashboard';
import ManualImport from './pages/ManualImport/ManualImport';
import MapColumns from './pages/MapColumns/MapColumns';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes - Only accessible when NOT logged in */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />

          {/* Onboarding - Semi-public (after signup, before profile complete) */}
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Unauthorized Page */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes - Require authentication - MUST BE LAST */}
          <Route path="/*" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

// Separate component for authenticated app layout
function AppLayout() {
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
          {/* Default route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Dashboard - All authenticated users */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* New Proof - All authenticated users */}
          <Route path="/new-proof" element={<NewProof />} />

          {/* Review Details - All authenticated users */}
          <Route path="/review/:id" element={<ReviewDetails />} />

          {/* Import Routes - Privileged users and admins only */}
          <Route path="/import" element={
            <PrivilegedRoute>
              <Import />
            </PrivilegedRoute>
          } />
          <Route path="/upload-spreadsheet" element={
            <PrivilegedRoute>
              <UploadSpreadsheet />
            </PrivilegedRoute>
          } />
          <Route path="/map-columns" element={
            <PrivilegedRoute>
              <MapColumns />
            </PrivilegedRoute>
          } />
          <Route path="/manual-import" element={
            <PrivilegedRoute>
              <ManualImport />
            </PrivilegedRoute>
          } />
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
