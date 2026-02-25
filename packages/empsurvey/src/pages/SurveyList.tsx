import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { surveyAPI, Survey } from '../services/api'
import { canAuthorSurveys, getUserRole } from '../utils/auth'
import '../styles/SurveyList.css'

export default function SurveyList() {
  const [activeTab, setActiveTab] = useState<'all' | 'drafts' | 'active' | 'closed'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [loading, setLoading] = useState(true)

  // Load surveys from API on component mount
  useEffect(() => {
    loadSurveys()
  }, [])

  const loadSurveys = async () => {
    try {
      setLoading(true)
      console.log('📋 Loading surveys from API...')
      const data = await surveyAPI.getAllSurveys()
      console.log('✅ Surveys loaded:', data)
      setSurveys(data)
    } catch (error) {
      console.error('❌ Error loading surveys:', error)
      // Show empty state on error
      setSurveys([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'status-draft'
      case 'ACTIVE':
        return 'status-active'
      case 'CLOSED':
        return 'status-closed'
      default:
        return 'status-default'
    }
  }

  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'drafts' && survey.status === 'DRAFT') ||
                       (activeTab === 'active' && survey.status === 'ACTIVE') ||
                       (activeTab === 'closed' && survey.status === 'CLOSED')
    return matchesSearch && matchesTab
  })

  const getTabCount = (tab: string) => {
    if (tab === 'all') return surveys.length
    return surveys.filter(s => s.status === tab.toUpperCase()).length
  }

  const handleDelete = async (surveyId: number) => {
    if (confirm('Are you sure you want to delete this survey?')) {
      try {
        await surveyAPI.deleteSurvey(surveyId)
        setSurveys(surveys.filter(s => s.surveyId !== surveyId))
        console.log('✅ Survey deleted:', surveyId)
      } catch (error) {
        console.error('❌ Error deleting survey:', error)
        alert('Failed to delete survey. Please try again.')
      }
    }
  }

  return (
    <div className="survey-list-container">
      {/* Header with Title and Create Button */}
      <div className="workspace-header">
        <div className="header-content">
          <h1>My Workspace</h1>
          {canAuthorSurveys(getUserRole()) && (
            <Link to="/create" className="btn btn-primary">
              <span className="btn-icon">+</span>
              Create
            </Link>
          )}
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="workspace-nav">
        <div className="nav-tabs">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All <span className="tab-count">{getTabCount('all')}</span>
          </button>
          <button 
            className={`tab ${activeTab === 'drafts' ? 'active' : ''}`}
            onClick={() => setActiveTab('drafts')}
          >
            Drafts <span className="tab-count">{getTabCount('drafts')}</span>
          </button>
          <button 
            className={`tab ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active <span className="tab-count">{getTabCount('active')}</span>
          </button>
          <button 
            className={`tab ${activeTab === 'closed' ? 'active' : ''}`}
            onClick={() => setActiveTab('closed')}
          >
            Closed <span className="tab-count">{getTabCount('closed')}</span>
          </button>
        </div>
        
        <div className="search-bar">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 14L11.1 11.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input 
            type="text"
            placeholder="Search surveys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="empty-state">
          <div className="empty-illustration">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="50" fill="#F2F2F7"/>
            </svg>
          </div>
          <h3>Loading surveys...</h3>
        </div>
      ) : filteredSurveys.length === 0 ? (
        <div className="empty-state">
          <div className="empty-illustration">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="50" fill="#F2F2F7"/>
              <path d="M60 35V85M35 60H85" stroke="#007AFF" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>
          <h3>No surveys yet</h3>
          <p>Create your first survey to start collecting valuable feedback from your team.</p>
          {canAuthorSurveys(getUserRole()) && (
            <Link to="/create" className="btn btn-primary btn-lg">
              <span className="btn-icon">+</span>
              Create your first survey
            </Link>
          )}
        </div>
      ) : (
        <div className="surveys-grid">
          {filteredSurveys.map((survey) => (
            <Link 
              key={survey.surveyId} 
              to={`/surveys/${survey.surveyId}/edit`}
              className="survey-card-link"
            >
              <div className="survey-card">
                <div className="card-badge">
                  <span className={`status-badge ${getStatusColor(survey.status)}`}>
                    {survey.status}
                  </span>
                </div>
                
                <div className="card-content">
                  <div className="card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M8 12H16M8 8H16M8 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h3 className="card-title">{survey.title}</h3>
                  {survey.description && (
                    <p className="card-description">{survey.description}</p>
                  )}
                </div>

                <div className="card-footer">
                  <div className="card-meta">
                    <span className="template-tag">
                      {survey.templateType.replace('_', ' ')}
                    </span>
                    {survey.participantType && (
                      <span className="template-tag" style={{ marginLeft: '8px' }}>
                        {survey.participantType.replace('_', ' ')}
                      </span>
                    )}
                    {survey.surveyStage && (
                      <span className="template-tag" style={{ marginLeft: '8px' }}>
                        {survey.surveyStage.replace('_', ' ')}
                      </span>
                    )}
                    {survey.audienceSource && (
                      <span className="template-tag" style={{ marginLeft: '8px' }}>
                        {survey.audienceSource.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <div className="card-date">
                    {survey.updatedAt
                      ? new Date(survey.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })
                      : '—'}
                  </div>
                </div>

                <button 
                  className="card-menu-btn"
                  onClick={(e) => {
                    e.preventDefault()
                    if (survey.surveyId != null) handleDelete(survey.surveyId)
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="3" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="13" r="1.5" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
