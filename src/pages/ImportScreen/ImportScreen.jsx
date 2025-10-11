import React, { useState } from 'react';
import { FaPencilAlt, FaFileExcel, FaPlus } from 'react-icons/fa';
import ProofSourceCard from '../../components/ProofSourceCard/ProofSourceCard';
import ImportModal from '../../components/ImportModal/ImportModal'; // Import the new modal
import './ImportScreen.css';

// Import the logos from your assets folder
import g2Logo from '../../assets/image-49.png';
import capterraLogo from '../../assets/image-50.png';
import trustradiusLogo from '../../assets/image-51.png';
import getappLogo from '../../assets/image-54.png';

const BrandLogo = ({ src, alt }) => (
  <img src={src} alt={alt} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
);

const sources = [
  { id: 1, icon: <FaPencilAlt style={{ fontSize: '2.5rem' }} />, title: 'Manual Import' },
  { id: 2, icon: <FaFileExcel style={{ fontSize: '2.5rem' }} />, title: 'Upload Spreadsheet' },
  { id: 3, icon: <BrandLogo src={g2Logo} alt="G2" />, title: 'G2' },
  { id: 4, icon: <BrandLogo src={capterraLogo} alt="Capterra" />, title: 'Capterra' },
  { id: 5, icon: <BrandLogo src={trustradiusLogo} alt="Trustradius" />, title: 'Trustradius' },
  { id: 6, icon: <BrandLogo src={getappLogo} alt="Getapp" />, title: 'Getapp' },
];

const ImportScreen = () => {
  // State to manage which source is selected to show the modal
  const [selectedSource, setSelectedSource] = useState(null);

  const handleCardClick = (source) => {
    // Only open the modal for cards that are actual sources
    if (source.title !== 'Request a New Source') {
      setSelectedSource(source);
    }
  };

  const handleCloseModal = () => {
    setSelectedSource(null);
  };

  return (
    <> {/* Use a Fragment to render modal outside the main layout flow */}
      <div className="screen-container">
        <header className="main-header">
          <h1 className="header-title">Add proof to your account</h1>
          <p className="header-subtitle">Connect your sources and import proofs to ProofLayer.</p>
        </header>

        <main className="main-section">
          <div className="options-list">
            {sources.map((source) => (
              <ProofSourceCard 
                key={source.id} 
                icon={source.icon} 
                title={source.title}
                // Pass the click handler to each card
                onClick={() => handleCardClick(source)}
              />
            ))}
            <ProofSourceCard
              icon={<FaPlus />}
              title="Request a New Source"
              isPrimary={true}
              // You can add a specific handler for this button if needed
              onClick={() => console.log("Request new source clicked")}
            />
          </div>

          <button className="request-button">
            <span className="button-text">Request a New Source</span>
            <FaPlus />
          </button>
        </main>
      </div>
      
      {/* Render the modal conditionally based on the selectedSource state */}
      <ImportModal source={selectedSource} onClose={handleCloseModal} />
    </>
  );
};

export default ImportScreen;

