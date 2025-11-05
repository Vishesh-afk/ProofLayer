import React from 'react';
import './Dashboard.css';
import ProofCard from '../../components/ProofCard/ProofCard';

const mockProofs = [
  { id: 1, user: 'Sam', date: '2 mins ago', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', source: 'Facebook' },
  { id: 2, user: 'Sam', date: '2 mins ago', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', source: 'Facebook' },
  { id: 3, user: 'Sam', date: '2 mins ago', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', source: 'Facebook' },
  { id: 4, user: 'Sam', date: '2 mins ago', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', source: 'Facebook' },
  { id: 5, user: 'Sam', date: '2 mins ago', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', source: 'Facebook' },
  { id: 6, user: 'Sam', date: '2 mins ago', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', source: 'Facebook' },
];

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Your Proofs</h1>
        <div className="dashboard-actions">
          <div className="search-bar">
            <input type="text" placeholder="Search your proofs" />
          </div>
          <button className="create-proof-btn">Create a New Proof</button>
        </div>
      </header>
      <main className="dashboard-main">
        <div className="dashboard-toolbar">
          <button className="toolbar-btn">Select all</button>
          <button className="toolbar-btn">Filters</button>
        </div>
        <div className="proof-grid">
          {mockProofs.map(proof => (
            <ProofCard key={proof.id} proof={proof} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;