import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { testimonials } from '../../data/testimonials';
import defaultAvatar from '../../assets/avatar.png';
import './ReviewDetails.css';
import { BsGrid, BsChatLeftQuote, BsEnvelopeOpen, BsChatDots, BsFileEarmarkText, BsPencil, BsTrash, BsShare, BsEnvelope, BsBuildings, BsGlobe, BsUpload, BsArrowLeft } from 'react-icons/bs';
import g2Logo from '../../assets/image-49.png';
import { FaXTwitter, FaLinkedinIn, FaFacebookF } from 'react-icons/fa6';

const ReviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const stateReview = location.state?.review;
  const review = stateReview || testimonials.find((t) => t.id === parseInt(id));

  if (!review) {
    return <div>Review not found</div>;
  }

  const displayName = review.author || review.user || 'Customer';
  const displayContent = review.content || review.text || '';
  const displayDate = review.date || '';
  const displayRating = review.rating || null;
  const avatarSrc = review.avatar || defaultAvatar;

  return (
    <div className="review-details-page">
      <div className="review-details-sidebar">
        <div className="profile-banner">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            <BsArrowLeft />
            <span>Customers</span>
          </button>
          <div className="customer-profile">
            <img src={avatarSrc} alt={displayName} className="customer-avatar" />
            <h2>{displayName}</h2>
            <p>Sr. Engineer</p>
          </div>
        </div>
        <div className="customer-details">
          <div className="detail-item">
            <div className="detail-left"><BsEnvelope /> <span>Email</span></div>
            <div className="detail-right">pinal.p@example.com</div>
          </div>
          <div className="detail-item">
            <div className="detail-left"><BsBuildings /> <span>Company</span></div>
            <div className="detail-right">Acme Corp</div>
          </div>
          <div className="detail-item">
            <div className="detail-left"><BsGlobe /> <span>Website</span></div>
            <div className="detail-right">acme.com</div>
          </div>
          <div className="detail-item">
            <div className="detail-left"><BsUpload /> <span>Logo</span></div>
            <div className="detail-right"><button className="upload-logo-btn">Upload a company logo</button></div>
          </div>
          <div className="detail-item">
            <div className="detail-left"><span className="dot-icon" /> <span>Socials</span></div>
            <div className="detail-right">
              <div className="social-icons social-box">
                <button className="social-btn"><FaXTwitter /></button>
                <button className="social-btn"><FaLinkedinIn /></button>
                <button className="social-btn"><FaFacebookF /></button>
              </div>
            </div>
          </div>
        </div>
        <div className="customer-actions">
          <button>Invite to a form</button>
        </div>
      </div>
      <div className="review-details-main">
        <div className="review-tabs">
          <button className="tab active"><BsGrid /> All</button>
          <button className="tab"><BsChatLeftQuote /> Testimonials</button>
          <button className="tab"><BsEnvelopeOpen /> Invites</button>
          <button className="tab"><BsChatDots /> Feedback</button>
          <button className="tab"><BsFileEarmarkText /> Case studies</button>
        </div>
        <div className="review-card">
          <div className="review-card-header">
            <p className="import-meta"><img src={g2Logo} alt="G2"/> Testimonial imported 3 day ago</p>
            <div className="language-selector">
              <p>EN</p>
            </div>
          </div>
          <div className="review-card-body">
           {displayRating && (
             <div className="review-rating">
               {"★".repeat(displayRating)}
             </div>
           )}
            <h3>Developer Friendly IDE</h3>
            <p>{displayContent}</p>
            <div className="tag-row">
              <button className="tag-button">
                <span className="tag-icon" />
                Add a tag
              </button>
            </div>
          </div>
          <div className="review-card-footer">
            <div className="footer-left">
              <button className="approve">Approve</button>
              <button className="thank">Thank Customer ▾</button>
            </div>
            <div className="footer-right">
              <button className="edit"><BsPencil /> Edit</button>
              <button className="delete"><BsTrash /> Delete</button>
              <button className="share"><BsShare /> Share</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetails;