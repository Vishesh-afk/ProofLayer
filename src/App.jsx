import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import Sidebar from './components/Sidebar/Sidebar';
import ImportScreen from './pages/ImportScreen/ImportScreen';
import './App.css';

function App() {
  // State to manage the sidebar visibility on mobile
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* The Sidebar now receives props to control its state */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      
      <main className="main-view">
        {/* This button will only be visible on mobile to toggle the sidebar */}
        <button 
          className="sidebar-toggle-button" 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        >
          <FaBars />
        </button>
        
        {/* Your main page content */}
        <ImportScreen />
      </main>

      {/* Optional: An overlay to close the sidebar when clicking outside of it */}
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
