import { useState } from 'react'
import { SurveyQuestion, RATING_SCALE_OPTIONS } from '../types/survey'
import '../styles/QuestionBuilder.css'

interface QuestionBuilderProps {
  onAddQuestion: (question: SurveyQuestion) => void
}

const QUESTION_TYPES = [
  {
    id: 'RATING_SCALE',
    label: 'Rating Scale',
    icon: '⭐',
    description: '1-5 scale',
  },
  {
    id: 'MULTIPLE_CHOICE',
    label: 'Multiple Choice',
    icon: '◯',
    description: 'Select one option',
  },
  {
    id: 'TEXT',
    label: 'Short Text',
    icon: '📝',
    description: 'Open-ended response',
  },
  {
    id: 'MATRIX',
    label: 'Matrix',
    icon: '▦',
    description: 'Multi-row grid',
  },
]

export default function QuestionBuilder({ onAddQuestion }: QuestionBuilderProps) {
  const [showForm, setShowForm] = useState(false)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [questionText, setQuestionText] = useState('')

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId)
  }

  const handleAddQuestion = () => {
    if (!questionText.trim()) {
      alert('Question text is required')
      return
    }

    const newQuestion: SurveyQuestion = {
      questionId: `q_${Date.now()}`,
      surveyId: 0,
      questionText,
      questionType: (selectedType || 'RATING_SCALE') as any,
      sortOrder: 0,
      isRequired: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      options:
        selectedType === 'RATING_SCALE'
          ? RATING_SCALE_OPTIONS.map((opt, idx) => ({
              optionId: `opt_${Date.now()}_${idx}`,
              questionId: `q_${Date.now()}`,
              optionText: opt.text,
              optionValue: opt.value,
              sortOrder: idx + 1,
              createdAt: new Date().toISOString(),
            }))
          : [],
    }

    onAddQuestion(newQuestion)
    setQuestionText('')
    setSelectedType(null)
    setShowForm(false)
  }

  if (!showForm) {
    return (
      <div className="question-builder">
        <button onClick={() => setShowForm(true)} className="btn-add-question">
          <span className="icon">+</span>
          <span>Add a question</span>
        </button>
      </div>
    )
  }

  return (
    <div className="question-builder question-builder-open">
      <div className="builder-header">
        <h3>Add Question</h3>
        <button className="btn-close" onClick={() => setShowForm(false)}>
          ✕
        </button>
      </div>

      <div className="builder-content">
        <div className="question-input-section">
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="What would you like to ask?"
            className="question-input"
            autoFocus
          />
        </div>

        <div className="question-types-section">
          <label className="section-label">Question Type</label>
          <div className="question-types-grid">
            {QUESTION_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className={`question-type-card ${selectedType === type.id ? 'active' : ''}`}
              >
                <div className="type-icon">{type.icon}</div>
                <div className="type-label">{type.label}</div>
                <div className="type-description">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="builder-footer">
          <button onClick={handleAddQuestion} className="btn btn-primary btn-block">
            Add Question
          </button>
          <button onClick={() => setShowForm(false)} className="btn btn-secondary btn-block">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
