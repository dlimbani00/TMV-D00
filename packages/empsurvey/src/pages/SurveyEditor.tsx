import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { surveyAPI, Survey, SurveyQuestion } from '../services/api'
import { SurveyQuestion as QuestionBuilderType } from '../types/survey'
import QuestionBuilder from '../components/QuestionBuilder'
import '../styles/SurveyEditor.css'

export default function SurveyEditor() {
  const { surveyId } = useParams<{ surveyId: string }>()
  const navigate = useNavigate()
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [questions, setQuestions] = useState<SurveyQuestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSurvey()
  }, [surveyId])

  const loadSurvey = async () => {
    if (!surveyId) return

    try {
      setLoading(true)
      console.log(`📋 Loading survey ${surveyId}...`)
      const data = await surveyAPI.getSurveyById(parseInt(surveyId))
      console.log('✅ Survey loaded:', data)
      setSurvey(data)
      setQuestions(data.questions || [])
    } catch (error) {
      console.error('❌ Error loading survey:', error)
      alert('Failed to load survey. Redirecting to survey list...')
      navigate('/surveys')
    } finally {
      setLoading(false)
    }
  }

  const handleAddQuestion = (question: QuestionBuilderType) => {
    const newQuestion: SurveyQuestion = {
      questionId: Date.now(), // Temporary ID until saved
      questionText: question.questionText,
      questionType: question.questionType,
      sortOrder: questions.length + 1,
      isRequired: question.isRequired,
      options: (question.options || []).map(opt => ({
        optionId: typeof opt.optionId === 'number' ? opt.optionId : undefined,
        optionText: opt.optionText,
        optionValue: String(opt.optionValue),
        sortOrder: opt.sortOrder,
      })),
    }
    setQuestions([...questions, newQuestion])
  }

  const handleDeleteQuestion = (questionId: string | number | undefined) => {
    if (questionId !== undefined) {
      setQuestions(questions.filter(q => q.questionId !== questionId))
    }
  }

  const handleSaveSurvey = async () => {
    if (!survey || !survey.surveyId) return

    try {
      console.log('💾 Saving survey...')
      const updatedSurvey = { ...survey, questions }
      await surveyAPI.updateSurvey(survey.surveyId, updatedSurvey)
      console.log('✅ Survey saved successfully!')
      alert('Survey saved successfully!')
      await loadSurvey() // Reload to get updated data
    } catch (error) {
      console.error('❌ Error saving survey:', error)
      alert('Failed to save survey. Please try again.')
    }
  }

  if (loading) {
    return <div className="loading">Loading survey...</div>
  }

  if (!survey) {
    return <div className="loading">Survey not found</div>
  }

  return (
    <div className="survey-editor-container">
      <div className="editor-header">
        <button onClick={() => navigate('/')} className="btn-back">
          ← Back
        </button>
        <h2>{survey.title}</h2>
        <button onClick={handleSaveSurvey} className="btn btn-primary">
          Save
        </button>
      </div>

      <div className="editor-layout">
        {/* Left Sidebar - Question Builder */}
        <div className="editor-sidebar">
          <QuestionBuilder onAddQuestion={handleAddQuestion} />
        </div>

        {/* Main Content - Form Preview */}
        <div className="editor-main">
          <div className="survey-details">
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{survey.title}</h1>
            {survey.description && <p className="survey-desc">{survey.description}</p>}
            <span className={`template-badge template-${survey.templateType.toLowerCase()}`}>
              {survey.templateType}
            </span>
          </div>

          <div className="questions-section">
            {questions.length === 0 ? (
              <div className="empty-questions">
                <p>👋 No questions yet. Add your first question to get started!</p>
              </div>
            ) : (
              <>
                <h3>{questions.length} Question{questions.length !== 1 ? 's' : ''}</h3>
                <div className="questions-list">
                  {questions.map((q) => (
                    <div key={q.questionId} className="question-item">
                      <div className="question-header">
                        <div className="question-number">{q.sortOrder}</div>
                        <span className="question-type-badge">{q.questionType}</span>
                        <button
                          onClick={() => handleDeleteQuestion(q.questionId)}
                          className="btn-delete"
                          title="Delete question"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="question-text">{q.questionText}</p>
                      {q.options && q.options.length > 0 && (
                        <div className="question-options">
                          {q.options.map((opt) => (
                            <div key={opt.optionId} className="option">
                              {opt.optionText}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Sidebar - Settings */}
        <div className="editor-settings">
          <div className="settings-section">
            <h4>📊 Survey Info</h4>
            <div className="settings-item">
              <strong>Type:</strong> {survey.templateType}
            </div>
            <div className="settings-item">
              <strong>Status:</strong> {survey.status}
            </div>
            <div className="settings-item">
              <strong>Anonymous:</strong> {survey.isAnonymous ? 'Yes' : 'No'}
            </div>
          </div>

          <div className="settings-section">
            <h4>📝 Questions</h4>
            <div className="settings-item">
              <strong>Total:</strong> {questions.length}
            </div>
            <div className="settings-item">
              <strong>Required:</strong> {questions.filter(q => q.isRequired).length}
            </div>
          </div>

          <div className="settings-section">
            <h4>⚙️ Actions</h4>
            <button
              onClick={handleSaveSurvey}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#007AFF',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Save Survey
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
