import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import './UploadSpreadsheet.css';
import { FaUpload } from 'react-icons/fa';

const UploadSpreadsheet = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const allowedFileTypes = ['.csv', '.xlsx', '.xls'];
  const allowedMimeTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  const validateFile = (file) => {
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
    
    // Check file extension
    if (!allowedFileTypes.includes(fileExtension)) {
      return 'Invalid file type. Please upload a CSV, XLS, or XLSX file.';
    }

    // Check file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return 'File size exceeds 5MB limit. Please upload a smaller file.';
    }

    return null;
  };

  const parseFileHeaders = (file) => {
    return new Promise((resolve, reject) => {
      const fileName = file.name.toLowerCase();
      const fileExtension = fileName.substring(fileName.lastIndexOf('.'));

      if (fileExtension === '.csv') {
        // Parse CSV file - read as text first
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const text = e.target.result;
            // Try parsing with headers first
            Papa.parse(text, {
              header: true,
              preview: 1, // Only read first row to get headers
              skipEmptyLines: true,
              complete: (results) => {
                // Check for parsing errors
                if (results.errors && results.errors.length > 0) {
                  // Some errors are warnings, check if they're critical
                  const criticalErrors = results.errors.filter(err => err.type === 'Quotes' || err.type === 'Delimiter');
                  if (criticalErrors.length > 0) {
                    // Try fallback: parse first line directly
                    try {
                      const firstLine = text.split('\n')[0].trim();
                      if (firstLine) {
                        const headers = firstLine.split(',').map(h => h.trim().replace(/^"|"$/g, ''));
                        const cleanHeaders = headers.filter(h => h.length > 0);
                        if (cleanHeaders.length > 0) {
                          resolve(cleanHeaders);
                          return;
                        }
                      }
                    } catch (fallbackError) {
                      // Fallback failed, use original error
                    }
                    reject(new Error('Failed to parse CSV file: ' + criticalErrors[0].message));
                    return;
                  }
                }
                
                // Get column names from the first row
                if (!results.data || results.data.length === 0) {
                  // Fallback: try to parse first line directly
                  try {
                    const firstLine = text.split('\n')[0].trim();
                    if (firstLine) {
                      const headers = firstLine.split(',').map(h => h.trim().replace(/^"|"$/g, ''));
                      const cleanHeaders = headers.filter(h => h.length > 0);
                      if (cleanHeaders.length > 0) {
                        resolve(cleanHeaders);
                        return;
                      }
                    }
                  } catch (fallbackError) {
                    // Fallback failed
                  }
                  reject(new Error('No data found in CSV file'));
                  return;
                }
                
                const headers = Object.keys(results.data[0] || {});
                if (headers.length === 0) {
                  // Fallback: try to parse first line directly
                  try {
                    const firstLine = text.split('\n')[0].trim();
                    if (firstLine) {
                      const headers = firstLine.split(',').map(h => h.trim().replace(/^"|"$/g, ''));
                      const cleanHeaders = headers.filter(h => h.length > 0);
                      if (cleanHeaders.length > 0) {
                        resolve(cleanHeaders);
                        return;
                      }
                    }
                  } catch (fallbackError) {
                    // Fallback failed
                  }
                  reject(new Error('No headers found in CSV file. Please ensure the first row contains column names.'));
                  return;
                }
                
                // Filter out empty headers
                const cleanHeaders = headers.filter(h => h && h.trim().length > 0);
                if (cleanHeaders.length === 0) {
                  reject(new Error('No valid headers found in CSV file'));
                  return;
                }
                
                resolve(cleanHeaders);
              },
              error: (error) => {
                // Try fallback: parse first line directly
                try {
                  const firstLine = text.split('\n')[0].trim();
                  if (firstLine) {
                    const headers = firstLine.split(',').map(h => h.trim().replace(/^"|"$/g, ''));
                    const cleanHeaders = headers.filter(h => h.length > 0);
                    if (cleanHeaders.length > 0) {
                      resolve(cleanHeaders);
                      return;
                    }
                  }
                } catch (fallbackError) {
                  // Fallback failed, use original error
                }
                reject(new Error('Failed to parse CSV file: ' + (error.message || 'Unknown error')));
              }
            });
          } catch (error) {
            reject(new Error('Failed to read CSV file: ' + error.message));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read CSV file'));
        reader.readAsText(file);
      } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
        // Parse Excel file
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            if (workbook.SheetNames.length === 0) {
              reject(new Error('No sheets found in Excel file'));
              return;
            }
            
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
            
            if (jsonData.length === 0) {
              reject(new Error('No data found in Excel file'));
              return;
            }
            
            // Get first row as headers
            const headers = jsonData[0] || [];
            // Filter out empty headers and convert to strings
            const cleanHeaders = headers
              .map(h => String(h).trim())
              .filter(h => h.length > 0);
            
            if (cleanHeaders.length === 0) {
              reject(new Error('No headers found in Excel file'));
              return;
            }
            
            resolve(cleanHeaders);
          } catch (error) {
            reject(new Error('Failed to parse Excel file: ' + error.message));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read Excel file'));
        reader.readAsArrayBuffer(file);
      } else {
        reject(new Error('Unsupported file type'));
      }
    });
  };

  const handleFileSelect = async (file) => {
    setError('');
    setIsProcessing(true);
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setIsProcessing(false);
      return;
    }

    try {
      // Parse file to get column names
      const columnNames = await parseFileHeaders(file);
      
      // Navigate to mapping page with file info and column names
      navigate('/map-columns', { 
        state: { 
          fileName: file.name,
          fileType: file.name.substring(file.name.lastIndexOf('.') + 1),
          columnNames: columnNames // Pass the detected column names
        } 
      });
    } catch (err) {
      console.error('File parsing error:', err);
      const errorMessage = err.message || 'Failed to parse file. Please ensure the file is not corrupted and contains headers in the first row.';
      setError(errorMessage);
      setIsProcessing(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleLabelClick = (e) => {
    e.stopPropagation(); // Prevent event from bubbling to parent div
    e.preventDefault(); // Prevent default label behavior
    if (!isProcessing) {
      document.getElementById('file-upload').click();
    }
  };

  const handleBoxClick = (e) => {
    // Only trigger if not clicking on the label or its parent paragraph
    if (e.target.tagName !== 'LABEL' && e.target.closest('label') === null && !isProcessing) {
      document.getElementById('file-upload').click();
    }
  };

  return (
    <div className="upload-spreadsheet-page">
      <header className="upload-header">
        <h1 className="upload-title">Upload spreadsheet</h1>
        <p className="upload-subtitle">Upload a CSV, XLS or XLSX file and ProofLayer will import your proof. See a sample CSV file with supported fields.</p>
      </header>

      <main className="upload-main">
        <div 
          className={`upload-box ${isDragging ? 'dragging' : ''} ${isProcessing ? 'processing' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleBoxClick}
        >
          {isProcessing ? (
            <>
              <div className="processing-spinner"></div>
              <p>Processing file...</p>
            </>
          ) : (
            <>
              <FaUpload className="upload-icon" />
              <p>Drag and drop spreadsheet here or <label className="choose-file-link" onClick={handleLabelClick}>Choose file</label></p>
            </>
          )}
          <input 
            type="file" 
            id="file-upload" 
            accept=".csv,.xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
            onChange={handleFileInputChange}
            disabled={isProcessing}
            hidden 
          />
        </div>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <div className="upload-info">
          <span className="supported-formats">Supported formats: CSV, XLSX, XLS</span>
          <span className="maximum-size">Maximum size: 5MB</span>
        </div>
      </main>
    </div>
  );
};

export default UploadSpreadsheet;