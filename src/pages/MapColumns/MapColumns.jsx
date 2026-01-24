import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BsArrowUp } from 'react-icons/bs';
import './MapColumns.css';
import { TARGET_FIELDS, smartMapColumns } from '../../utils/columnMapper';
import { parseFullFile } from '../../utils/fileParser';
import { saveTestimonialsBatch } from '../../services/firestoreService'; 

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

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleUpload = async () => {
    setIsUploading(true);
    setUploadError('');

    try {
      // Collect the final mappings, translating the user-facing label back to the internal key
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

      // Get file data from sessionStorage
      const fileDataStr = sessionStorage.getItem('uploadedFile');
      if (!fileDataStr) {
        throw new Error('File data not found. Please upload the file again.');
      }

      const fileData = JSON.parse(fileDataStr);
      
      // Reconstruct file object from stored data
      let file;
      if (fileData.isArrayBuffer) {
        // For Excel files - convert base64 back to ArrayBuffer
        const binary = atob(fileData.data);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: fileData.type });
        file = new File([blob], fileData.name, { type: fileData.type });
      } else if (fileData.isText) {
        // For CSV files - convert base64 back to text
        const text = decodeURIComponent(escape(atob(fileData.data)));
        const blob = new Blob([text], { type: fileData.type });
        file = new File([blob], fileData.name, { type: fileData.type });
      } else {
        throw new Error('Invalid file data format');
      }

      // Parse the full file
      const rawData = await parseFullFile(file);
      console.log('Parsed file data:', rawData);

      // Transform data using mappings
      const transformedData = rawData.map(row => {
        const testimonial = {};
        
        // Map each field from the row to the testimonial object
        Object.entries(finalMapping).forEach(([dbKey, userColumn]) => {
          if (userColumn && row[userColumn] !== undefined) {
            const value = row[userColumn];
            // Only add non-empty values
            if (value && String(value).trim().length > 0) {
              testimonial[dbKey] = String(value).trim();
            }
          }
        });

        // Set default values for required fields if missing
        if (!testimonial.name) testimonial.name = 'Unknown';
        if (!testimonial.text) testimonial.text = '';
        if (!testimonial.date) testimonial.date = new Date().toISOString().split('T')[0];

        return testimonial;
      }).filter(item => Object.keys(item).length > 0); // Filter out completely empty items

      if (transformedData.length === 0) {
        throw new Error('No valid data to upload after transformation.');
      }

      console.log('Transformed data to upload:', transformedData);

      // Save to Firestore
      const docIds = await saveTestimonialsBatch(transformedData);
      console.log('Successfully saved testimonials. Document IDs:', docIds);

      // Clear sessionStorage
      sessionStorage.removeItem('uploadedFile');

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to upload data. Please try again.');
      setIsUploading(false);
    }
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

          {uploadError && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#fee2e2', 
              color: '#dc2626', 
              borderRadius: '8px', 
              marginBottom: '1rem' 
            }}>
              {uploadError}
            </div>
          )}

          <div className="map-columns-actions">
            <button 
              className="upload-btn" 
              onClick={handleUpload}
              disabled={isUploading}
            >
              <BsArrowUp /> {isUploading ? 'Uploading...' : 'Upload'}
            </button>
            <button 
              className="cancel-btn" 
              onClick={handleCancel}
              disabled={isUploading}
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MapColumns;