import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBuilding, FaStar } from 'react-icons/fa';
import { BsList, BsArrowLeft } from 'react-icons/bs';
import './ManualImport.css';

const ManualImport = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    designation: '',
    avatar: null,
    email: '',
    companyLogo: null,
    company: '',
    companyWebsite: '',
    companySize: '',
    team: '',
    region: '',
    proofType: '',
    rating: 0,
    testimonialTitle: '',
    testimonial: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  return (
    <div className="manual-import-container">
      <header className="manual-import-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <BsArrowLeft />
        </button>
        <h1 className="manual-import-title">Manual import</h1>
        <p className="manual-import-subtitle">Manually add video, text or screengrabs proof to your account.</p>
      </header>

      <main className="manual-import-main">
        <div className="manual-import-form-card">
          <div className="proof-type-selector">
            <button type="button" className="proof-type-button active">
              <BsList /> Text testimonial
            </button>
          </div>

          <form onSubmit={handleSubmit} className="manual-import-form">
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="customerName" className="form-label">
                  Customer name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="designation" className="form-label">
                  Designation
                </label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  placeholder="Your Designation"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label className="form-label">Avatar</label>
                <div className="file-upload-group">
                  <div className="file-upload-icon">
                    <FaUser />
                  </div>
                  <button
                    type="button"
                    className="file-upload-button"
                    onClick={() => document.getElementById('avatar-upload').click()}
                  >
                    Pick an Image
                  </button>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'avatar')}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label className="form-label">Company Logo</label>
                <div className="file-upload-group">
                  <div className="file-upload-icon">
                    <FaBuilding />
                  </div>
                  <button
                    type="button"
                    className="file-upload-button"
                    onClick={() => document.getElementById('company-logo-upload').click()}
                  >
                    Pick an Image
                  </button>
                  <input
                    type="file"
                    id="company-logo-upload"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'companyLogo')}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
            </div>

            <div className="form-section two-column">
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="company" className="form-label">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Your Company"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="companyWebsite" className="form-label">
                    Company Website
                  </label>
                  <input
                    type="url"
                    id="companyWebsite"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleInputChange}
                    placeholder="www.example.com"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="companySize" className="form-label">
                    Company Size
                  </label>
                  <select
                    id="companySize"
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Select Company Size</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="501-1000">501-1000</option>
                    <option value="1000+">1000+</option>
                  </select>
                </div>
              </div>

              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="team" className="form-label">
                    Team
                  </label>
                  <input
                    type="text"
                    id="team"
                    name="team"
                    value={formData.team}
                    onChange={handleInputChange}
                    placeholder="Your Team"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="region" className="form-label">
                    Region
                  </label>
                  <input
                    type="text"
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    placeholder="Your Region"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="proofType" className="form-label">
                    Proof Type
                  </label>
                  <select
                    id="proofType"
                    name="proofType"
                    value={formData.proofType}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Select Proof Type</option>
                    <option value="text">Text</option>
                    <option value="video">Video</option>
                    <option value="screengrab">Screengrab</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label className="form-label">Ratings</label>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`star-icon ${formData.rating >= star ? 'filled' : ''}`}
                      onClick={() => handleRatingClick(star)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label htmlFor="testimonialTitle" className="form-label">
                  Testimonial Title
                </label>
                <input
                  type="text"
                  id="testimonialTitle"
                  name="testimonialTitle"
                  value={formData.testimonialTitle}
                  onChange={handleInputChange}
                  placeholder="Write your testimonial title"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label htmlFor="testimonial" className="form-label">
                  Testimonial
                </label>
                <textarea
                  id="testimonial"
                  name="testimonial"
                  value={formData.testimonial}
                  onChange={handleInputChange}
                  placeholder="Write your testimonial"
                  className="form-textarea"
                  rows="6"
                />
              </div>
            </div>

            <div className="form-submit-section">
              <button type="submit" className="submit-button">
                Submit
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ManualImport;

