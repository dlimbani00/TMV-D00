import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import SurveyList from './pages/SurveyList'
import SurveyCreate from './pages/SurveyCreate'
import FormBuilder from './pages/FormBuilder'
import ParticipantImport from './pages/ParticipantImport'
import AssignmentRules from './pages/AssignmentRules'
import CreateSurveyModal from './components/CreateSurveyModal'
import { getUserRole, setUserRole, UserRole } from './utils/auth'
import './App.css'

function App() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [role, setRole] = useState<UserRole>(getUserRole())

  const handleRoleChange = (nextRole: UserRole) => {
    setRole(nextRole)
    setUserRole(nextRole)
  }

  return (
    <Router>
      <div className="app">
        {/* Apple-style Navigation Bar */}
        <nav className="apple-nav">
          <div className="nav-content">
            <Link to="/" className="nav-logo">
              <span className="nav-brand-text">EMPSurvey</span>
            </Link>
            <ul className="nav-list">
              <li><Link to="/surveys" className="nav-link">Surveys</Link></li>
              <li>
                <button onClick={() => setIsCreateModalOpen(true)} className="nav-link nav-link-button">
                  Create
                </button>
              </li>
              <li><Link to="/templates" className="nav-link">Templates</Link></li>
              <li><Link to="/analytics" className="nav-link">Analytics</Link></li>
              <li><Link to="/participants" className="nav-link">Participants</Link></li>
              <li><Link to="/rules" className="nav-link">Rules</Link></li>
            </ul>
            <div className="nav-actions">
              <select
                aria-label="Role"
                value={role}
                onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                style={{ marginRight: 8, borderRadius: 8, padding: '4px 8px' }}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="INSTRUCTOR">INSTRUCTOR</option>
                <option value="PARTICIPANT">PARTICIPANT</option>
              </select>
              <button className="nav-icon-btn" aria-label="Notifications">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12 5.33333C12 4.27247 11.5786 3.25505 10.8284 2.50491C10.0783 1.75476 9.06087 1.33333 8 1.33333C6.93913 1.33333 5.92172 1.75476 5.17157 2.50491C4.42143 3.25505 4 4.27247 4 5.33333C4 10 2 11.3333 2 11.3333H14C14 11.3333 12 10 12 5.33333Z" stroke="#f5f5f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.15335 14C9.03614 14.2021 8.86791 14.3698 8.6655 14.4864C8.46309 14.6029 8.2336 14.6643 8.00001 14.6643C7.76643 14.6643 7.53694 14.6029 7.33453 14.4864C7.13212 14.3698 6.96389 14.2021 6.84668 14" stroke="#f5f5f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="nav-icon-btn" aria-label="User menu">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.3333 14V12.6667C13.3333 11.9594 13.0524 11.2811 12.5523 10.781C12.0522 10.281 11.3739 10 10.6667 10H5.33333C4.62609 10 3.94781 10.281 3.44772 10.781C2.94762 11.2811 2.66667 11.9594 2.66667 12.6667V14" stroke="#f5f5f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.00001 7.33333C9.47277 7.33333 10.6667 6.13943 10.6667 4.66667C10.6667 3.19391 9.47277 2 8.00001 2C6.52725 2 5.33334 3.19391 5.33334 4.66667C5.33334 6.13943 6.52725 7.33333 8.00001 7.33333Z" stroke="#f5f5f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </nav>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<SurveyList />} />
            <Route path="/surveys" element={<SurveyList />} />
            <Route path="/create" element={<SurveyCreate />} />
            <Route path="/form-builder" element={<FormBuilder />} />
            <Route path="/surveys/:surveyId/edit" element={<FormBuilder />} />
            <Route path="/participants" element={<ParticipantImport />} />
            <Route path="/rules" element={<AssignmentRules />} />
          </Routes>
        </main>

        {/* Create Survey Modal */}
        <CreateSurveyModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
        />
      </div>
    </Router>
  )
}

export default App
