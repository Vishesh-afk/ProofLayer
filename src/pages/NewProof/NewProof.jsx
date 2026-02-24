import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPencilAlt, FaFileExcel, FaPlus, FaLock } from 'react-icons/fa';
import ProofSourceCard from '../../components/ProofSourceCard/ProofSourceCard';
import ImportModal from '../../components/ImportModal/ImportModal';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../constants/roles';
import './NewProof.css';

// Import the logos from your assets folder
import g2Logo from '../../assets/image-49.png';
import capterraLogo from '../../assets/image-50.png';
import trustradiusLogo from '../../assets/image-51.png';
import getappLogo from '../../assets/image-54.png';

const BrandLogo = ({ src, alt }) => (
  <img src={src} alt={alt} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
);

// All available sources with their required permission
const allSources = [
  { id: 1, icon: <FaPencilAlt style={{ fontSize: '2.5rem' }} />, title: 'Manual Import', requiresImport: false },
  { id: 2, icon: <FaFileExcel style={{ fontSize: '2.5rem' }} />, title: 'Upload Spreadsheet', requiresImport: true },
  { id: 3, icon: <BrandLogo src={g2Logo} alt="G2" />, title: 'G2', requiresImport: true },
  { id: 4, icon: <BrandLogo src={capterraLogo} alt="Capterra" />, title: 'Capterra', requiresImport: true },
  { id: 5, icon: <BrandLogo src={trustradiusLogo} alt="Trustradius" />, title: 'Trustradius', requiresImport: true },
  { id: 6, icon: <BrandLogo src={getappLogo} alt="Getapp" />, title: 'Getapp', requiresImport: true },
];

const NewProof = () => {
  const [selectedSource, setSelectedSource] = useState(null);
  const [loadingCard, setLoadingCard] = useState(null);
  const [isBannerVisible, setBannerVisible] = useState(true);
  const navigate = useNavigate();
  const { userRole } = useAuth();

  const canImport = hasPermission(userRole, 'canImportTestimonials');

  const handleCardClick = (source) => {
    // Block click if source requires import permission and user doesn't have it
    if (source.requiresImport && !canImport) {
      return;
    }

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
            {allSources.map((source) => {
              const isLocked = source.requiresImport && !canImport;
              return (
                <div key={source.id} className={`source-card-wrapper ${isLocked ? 'locked' : ''}`}>
                  <ProofSourceCard
                    icon={source.icon}
                    title={source.title}
                    onClick={() => handleCardClick(source)}
                    isLoading={loadingCard === source.id}
                  />
                  {isLocked && (
                    <div className="locked-overlay">
                      <FaLock className="lock-icon" />
                      <span className="locked-text">Privileged access required</span>
                    </div>
                  )}
                </div>
              );
            })}
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