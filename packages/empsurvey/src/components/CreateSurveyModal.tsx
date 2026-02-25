// CreateSurveyModal.tsx - Typeform-style modal for creating surveys
import { useNavigate } from 'react-router-dom'
import '../styles/CreateSurveyModal.css'

interface CreateSurveyModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateSurveyModal({ isOpen, onClose }: CreateSurveyModalProps) {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleTemplateClick = (templateType: string) => {
    navigate('/form-builder', { state: { templateType } })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">Add form elements</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        {/* Modal Content */}
        <div className="modal-content">
          {/* Main Grid */}
          <div className="modal-grid">
            {/* Contact info */}
            <div className="grid-section">
              <h3 className="section-title">Contact info</h3>
              <div className="element-list">
                <button className="element-list-item" onClick={() => handleTemplateClick('CONTACT_INFO')}>
                  <div className="element-icon contact">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M16 17V15C16 13.3431 14.6569 12 13 12H7C5.34315 12 4 13.3431 4 15V17" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <span>Contact Info</span>
                </button>
                <button className="element-list-item" onClick={() => handleTemplateClick('EMAIL')}>
                  <div className="element-icon email">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M3 7L10 11L17 7" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <span>Email</span>
                </button>
                <button className="element-list-item" onClick={() => handleTemplateClick('PHONE')}>
                  <div className="element-icon phone">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M6 3C6 2.44772 6.44772 2 7 2H13C13.5523 2 14 2.44772 14 3V17C14 17.5523 13.5523 18 13 18H7C6.44772 18 6 17.5523 6 17V3Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M8 15H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span>Phone Number</span>
                </button>
                <button className="element-list-item" onClick={() => handleTemplateClick('ADDRESS')}>
                  <div className="element-icon address">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2C7.79086 2 6 3.79086 6 6C6 9 10 14 10 14C10 14 14 9 14 6C14 3.79086 12.2091 2 10 2Z" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="10" cy="6" r="1.5" fill="currentColor"/>
                    </svg>
                  </div>
                  <span>Address</span>
                </button>
                <button className="element-list-item" onClick={() => handleTemplateClick('WEBSITE')}>
                  <div className="element-icon website">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 9L9 4L14 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 16V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span>Website</span>
                </button>
              </div>
            </div>

            {/* Choice */}
            <div className="grid-section">
              <h3 className="section-title">Choice</h3>
              <div className="element-list">
                <button className="element-list-item" onClick={() => handleTemplateClick('MULTIPLE_CHOICE')}>
                  <div className="element-icon choice">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="6" cy="14" r="2" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M10 6H17M10 14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span>Multiple Choice</span>
                </button>
                <button className="element-list-item" onClick={() => handleTemplateClick('DROPDOWN')}>
                  <div className="element-icon dropdown">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect x="4" y="6" width="12" height="2" rx="1" fill="currentColor"/>
                      <path d="M7 12L10 15L13 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span>Dropdown</span>
                </button>
                <button className="element-list-item" onClick={() => handleTemplateClick('PICTURE_CHOICE')}>
                  <div className="element-icon picture">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect x="3" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="7" cy="8" r="1.5" fill="currentColor"/>
                      <path d="M3 13L7 9L11 13L14 10L17 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span>Picture Choice</span>
                </button>
                <button className="element-list-item" onClick={() => handleTemplateClick('YESNO')}>
                  <div className="element-icon yesno">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="7" cy="10" r="4" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="13" cy="10" r="4" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <span>Yes/No</span>
                </button>
                <button className="element-list-item" onClick={() => handleTemplateClick('LEGAL')}>
                  <div className="element-icon legal">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 10L8 13L15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span>Legal</span>
                </button>
                <button className="element-list-item" onClick={() => handleTemplateClick('CHECKBOX')}>
                  <div className="element-icon checkbox">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect x="4" y="4" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                      <rect x="4" y="12" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M10 6H16M10 14H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span>Checkbox</span>
                </button>
              </div>
            </div>

            {/* Rating & ranking */}
            <div className="grid-section">
              <h3 className="section-title">Rating & ranking</h3>
              <div className="element-list">
                <button className="element-list-item" onClick={() => handleTemplateClick('NPS')}>
                  <div className="element-icon nps">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 3L11.5 7.5L16 9L11.5 10.5L10 15L8.5 10.5L4 9L8.5 7.5L10 3Z" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <span>Net Promoter Score®</span>
                </button>
                <button className="element-list-item" onClick={() => handleTemplateClick('OPINION_SCALE')}>
                  <div className="element-icon opinion">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M3 10H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="5" cy="10" r="2" fill="currentColor"/>
                      <circle cx="15" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <span>Opinion Scale</span>
                </button>
                <button className="element-list-item" onClick={() => handleTemplateClick('RATING')}>
                  <div className="element-icon rating">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2L12 8L18 9L13 13L15 19L10 15L5 19L7 13L2 9L8 8L10 2Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <span>Rating</span>
                </button>
                <button className="element-list-item" onClick={() => handleTemplateClick('RANKING')}>
                  <div className="element-icon ranking">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 6H6M4 10H8M4 14H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span>Ranking</span>
                </button>
                <button className="element-list-item" onClick={() => handleTemplateClick('MATRIX')}>
                  <div className="element-icon matrix">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect x="3" y="3" width="5" height="5" stroke="currentColor" strokeWidth="1.5"/>
                      <rect x="12" y="3" width="5" height="5" stroke="currentColor" strokeWidth="1.5"/>
                      <rect x="3" y="12" width="5" height="5" stroke="currentColor" strokeWidth="1.5"/>
                      <rect x="12" y="12" width="5" height="5" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <span>Matrix</span>
                </button>
              </div>
            </div>

            {/* Text & Video */}
            <div className="grid-section">
              <h3 className="section-title">Text & Video</h3>
              <div className="element-list">
                <button className="element-list-item" onClick={() => handleTemplateClick('LONG_TEXT')}>
                  <div className="element-icon longtext">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 4H16M4 8H16M4 12H16M4 16H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span>Long Text</span>
                </button>
                <button className="element-list-item" onClick={() => handleTemplateClick('SHORT_TEXT')}>
                  <div className="element-icon shorttext">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 6H16M4 10H16M4 14H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span>Short Text</span>
                </button>
                <button className="element-list-item" onClick={() => handleTemplateClick('VIDEO_AUDIO')}>
                  <div className="element-icon video">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="14" cy="7" r="1" fill="red"/>
                    </svg>
                  </div>
                  <span>Video and Audio</span>
                  <svg className="premium-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2L9.5 6.5L14 8L9.5 9.5L8 14L6.5 9.5L2 8L6.5 6.5L8 2Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Other */}
            <div className="grid-section">
              <h3 className="section-title">Other</h3>
              <div className="element-list">
                <button className="element-list-item" onClick={() => handleTemplateClick('NUMBER')}>
                  <div className="element-icon number">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <text x="5" y="15" fill="currentColor" fontSize="14" fontWeight="600">#</text>
                    </svg>
                  </div>
                  <span>Number</span>
                </button>
                <button className="element-list-item" onClick={() => handleTemplateClick('DATE')}>
                  <div className="element-icon date">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M3 8H17M7 2V6M13 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span>Date</span>
                </button>
                <button className="element-list-item" onClick={() => handleTemplateClick('PAYMENT')}>
                  <div className="element-icon payment">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect x="2" y="5" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M2 9H18" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <span>Payment</span>
                  <svg className="premium-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2L9.5 6.5L14 8L9.5 9.5L8 14L6.5 9.5L2 8L6.5 6.5L8 2Z" fill="currentColor"/>
                  </svg>
                </button>
                <button className="element-list-item" onClick={() => handleTemplateClick('FILE_UPLOAD')}>
                  <div className="element-icon file">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M12 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V16C4 16.5304 4.21071 17.0391 4.58579 17.4142C4.96086 17.7893 5.46957 18 6 18H14C14.5304 18 15.0391 17.7893 15.4142 17.4142C15.7893 17.0391 16 16.5304 16 16V6L12 2Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M12 2V6H16" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <span>File Upload</span>
                  <svg className="premium-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2L9.5 6.5L14 8L9.5 9.5L8 14L6.5 9.5L2 8L6.5 6.5L8 2Z" fill="currentColor"/>
                  </svg>
                </button>
                <button className="element-list-item" onClick={() => handleTemplateClick('GOOGLE_DRIVE')}>
                  <div className="element-icon gdrive">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2L16 10L13 15H7L4 10L10 2Z" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <span>Google Drive</span>
                  <svg className="premium-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2L9.5 6.5L14 8L9.5 9.5L8 14L6.5 9.5L2 8L6.5 6.5L8 2Z" fill="currentColor"/>
                  </svg>
                </button>
                <button className="element-list-item" onClick={() => handleTemplateClick('CALENDLY')}>
                  <div className="element-icon calendly">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="7" stroke="#0069FF" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <span>Calendly</span>
                </button>
              </div>
            </div>

            {/* Other Section - Additional Elements */}
            <div className="grid-section">
              <h3 className="section-title">Templates</h3>
              <div className="element-list">
                <button className="element-list-item" onClick={() => handleTemplateClick('WELCOME_SCREEN')}>
                  <div className="element-icon welcome">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M10 7L10 13M7 10L13 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span>Welcome Screen</span>
                </button>
                <button className="element-list-item" onClick={() => handleTemplateClick('STATEMENT')}>
                  <div className="element-icon statement">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 7H16M4 10H16M4 13H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span>Statement</span>
                </button>
                <button className="element-list-item" onClick={() => handleTemplateClick('QUESTION_GROUP')}>
                  <div className="element-icon question">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 6H16M4 10H16M4 14H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span>Question Group</span>
                </button>
                <button className="element-list-item" onClick={() => handleTemplateClick('MULTI_QUESTION')}>
                  <div className="element-icon multipage">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect x="4" y="3" width="12" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M7 7H13M7 10H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span>Multi-Question Page</span>
                </button>
                <button className="element-list-item" onClick={() => handleTemplateClick('END_SCREEN')}>
                  <div className="element-icon endscreen">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 10L8 13L15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>End Screen</span>
                </button>
                <button className="element-list-item" onClick={() => handleTemplateClick('REDIRECT')}>
                  <div className="element-icon redirect">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 4L16 10L10 16M16 10H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Redirect to URL</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
