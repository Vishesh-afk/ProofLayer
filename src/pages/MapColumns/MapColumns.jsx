import React, { useState, useMemo } from 'react'; // <-- ADDED useMemo
import { useNavigate, useLocation } from 'react-router-dom';
import { BsArrowUp } from 'react-icons/bs';
import './MapColumns.css';
// NEW IMPORT: Import the target fields and smart mapping function
import { TARGET_FIELDS, smartMapColumns } from '../../utils/columnMapper'; 

const MapColumns = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileName = location.state?.fileName || 'spreadsheet.xlsx';
  const columnNames = location.state?.columnNames || []; // Get detected column names from uploaded file

  // Database fields (system fields)
  // UPDATED: Derive the list of labels from the central TARGET_FIELDS array
  const databaseFields = TARGET_FIELDS.map(field => field.label);

  // Use detected column names from the uploaded file, or show a message if none detected
  const inputFields = columnNames.length > 0 
    ? columnNames 
    : ['No columns detected - please upload a valid file'];

  // If no file was uploaded, show a message
  if (columnNames.length === 0 && !location.state) {
    return (
      <div className="map-columns-page">
        <header className="map-columns-header">
          <h1 className="map-columns-title">Upload spreadsheet</h1>
          <p className="map-columns-subtitle">Upload a CSV, XLS or XLSX file and ProofLayer will import your proof. See a sample CSV file with supported fields.</p>
        </header>
        <main className="map-columns-main">
          <div className="map-columns-card">
            <p style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              No file uploaded. Please go back and upload a spreadsheet file first.
            </p>
            <div className="map-columns-actions">
              <button className="cancel-btn" onClick={() => navigate('/upload-spreadsheet')}>
                Go to Upload Page
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 1. Calculate smart mapping once on initial render
  const initialMappings = useMemo(() => {
    if (columnNames.length === 0) {
      // Create empty mapping if no columns are present
      return databaseFields.reduce((acc, label) => ({ ...acc, [label]: '' }), {});
    }
    // Perform the smart mapping using the new utility
    return smartMapColumns(columnNames);
  }, [columnNames]); // Depend on columnNames

  // 2. Initialize state with the smart mapping result
  const [fieldMappings, setFieldMappings] = useState(initialMappings);
  
  // NOTE: The hardcoded fields initialization has been replaced by the smart mapping logic.
  // const [fieldMappings, setFieldMappings] = useState(() => { ... });

  const handleMappingChange = (databaseField, inputField) => {
    setFieldMappings(prev => ({
      ...prev,
      [databaseField]: inputField
    }));
  };

  const handleUpload = () => {
    // UPDATED: Collect the final mappings, translating the user-facing label back to the internal key
    const finalMapping = {};
    Object.entries(fieldMappings).forEach(([label, userColumn]) => {
      if (userColumn) {
        // Find the internal key (e.g., 'name') from the label (e.g., 'Customer Name')
        const targetField = TARGET_FIELDS.find(f => f.label === label);
        if (targetField) {
          finalMapping[targetField.key] = userColumn;
        }
      }
    });

    console.log('Final field mappings (Internal Key: User Column):', finalMapping);
    
    // Navigate to success page or back to dashboard
    navigate('/dashboard');
  };

  const handleCancel = () => {
    navigate('/upload-spreadsheet');
  };

  return (
    <div className="map-columns-page">
      <header className="map-columns-header">
        <h1 className="map-columns-title">Upload spreadsheet</h1>
        <p className="map-columns-subtitle">Upload a CSV, XLS or XLSX file and ProofLayer will import your proof. See a sample CSV file with supported fields.</p>
      </header>

      <main className="map-columns-main">
        <div className="map-columns-card">
          <h2 className="card-title">Map Columns</h2>
          
          <div className="mapping-table">
            <div className="mapping-header">
              <div className="header-cell database-header">Database Fields</div>
              <div className="header-cell input-header">Input Fields</div>
            </div>

            {databaseFields.map((dbField) => (
              <div key={dbField} className="mapping-row">
                <div className="mapping-cell database-cell">
                  {dbField}
                </div>
                <div className="mapping-cell input-cell">
                  <select
                    // The value is now pre-selected by the smart mapping function
                    value={fieldMappings[dbField] || ''}
                    onChange={(e) => handleMappingChange(dbField, e.target.value)}
                    className="field-select"
                  >
                    <option value="">Select field</option>
                    {inputFields.map((inputField) => (
                      <option key={inputField} value={inputField}>
                        {inputField}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="map-columns-actions">
            <button className="upload-btn" onClick={handleUpload}>
              <BsArrowUp /> Upload
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MapColumns;