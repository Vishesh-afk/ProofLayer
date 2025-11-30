import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPencilAlt, FaFileExcel, FaPlus } from 'react-icons/fa';
import ProofSourceCard from '../../components/ProofSourceCard/ProofSourceCard';
import ImportModal from '../../components/ImportModal/ImportModal'; // Import the new modal
import './NewProof.css';

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

const NewProof = () => {
  const [selectedSource, setSelectedSource] = useState(null);
  const [loadingCard, setLoadingCard] = useState(null);
  const [isBannerVisible, setBannerVisible] = useState(true);
  const navigate = useNavigate();

  const handleCardClick = (source) => {
    if (source.title === 'Upload Spreadsheet') {
      navigate('/upload-spreadsheet');
    } else if (source.title === 'Manual Import') {
      navigate('/manual-import');
    } else if (source.title !== 'Request a New Source') {
      setLoadingCard(source.id);
      setTimeout(() => {
        setSelectedSource(source);
        setLoadingCard(null);
      }, 400);
    }
  };

  const handleCloseModal = () => {
    setSelectedSource(null);
  };

  const handleCloseBanner = () => {
    setBannerVisible(false);
  };

  return (
    <>
      <div className="screen-container">
        {isBannerVisible && (
          <div className="upgrade-banner">
            <span>You are on Free Plan. <a href="#">Upgrade Now!</a></span>
            <button className="close-banner-btn" onClick={handleCloseBanner}>&times;</button>
          </div>
        )}
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
                onClick={() => handleCardClick(source)}
                isLoading={loadingCard === source.id}
              />
            ))}
            <ProofSourceCard
              icon={<FaPlus />}
              title="Request a New Source"
              isPrimary={true}
              onClick={() => console.log("Request new source clicked")}
            />
          </div>
        </main>
      </div>
      
      <ImportModal source={selectedSource} onClose={handleCloseModal} />
    </>
  );
};

export default NewProof;