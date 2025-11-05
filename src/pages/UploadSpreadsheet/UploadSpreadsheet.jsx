import React from 'react';
import './UploadSpreadsheet.css';
import { FaUpload } from 'react-icons/fa';

const UploadSpreadsheet = () => {
  return (
    <div className="upload-spreadsheet-page">
      <header className="upload-header">
        <h1 className="upload-title">Upload spreadsheet</h1>
        <p className="upload-subtitle">Upload a CSV, XLS or XLSX file and ProofLayer will import your proof. See a sample CSV file with supported fields.</p>
      </header>

      <main className="upload-main">
        <div className="upload-box">
          <FaUpload className="upload-icon" />
          <p>Drag and drop spreadsheet here or <label htmlFor="file-upload" className="choose-file-link">Choose file</label></p>
          <input type="file" id="file-upload" hidden />
        </div>
        <div className="upload-info">
          <span className="supported-formats">Supported formats: CVS, XLSX, XLS</span>
          <span className="maximum-size">Maximum size: 5MB</span>
        </div>
      </main>
    </div>
  );
};



export default UploadSpreadsheet;