import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import Sidebar from './components/Sidebar/Sidebar';
import ImportScreen from './pages/ImportScreen/ImportScreen';
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
        <ImportScreen />
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
