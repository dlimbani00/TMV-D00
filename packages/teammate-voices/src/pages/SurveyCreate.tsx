import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody, Button, Input } from '../design-system'
import { api } from '@/services/api'
import { TEAM_MATE_VOICES_QUESTIONS, RATING_SCALE_OPTIONS } from '@/types/survey'

const TEMPLATES = [
  { key: 'TEAM_MATE_VOICES', label: 'Team Mate Voices', description: 'Employee engagement and team feedback', icon: '🗣' },
  { key: 'ENGAGEMENT', label: 'Engagement', description: 'General employee engagement survey', icon: '📊' },
  { key: 'NPS', label: 'NPS', description: 'Net Promoter Score survey', icon: '📈' },
  { key: 'CUSTOM', label: 'Custom', description: 'Build your own survey from scratch', icon: '✏️' },
] as const

export default function SurveyCreate() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('TEAM_MATE_VOICES')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleCreate = async () => {
    if (!title.trim()) return

    setLoading(true)
    try {
      const questions = selectedTemplate === 'TEAM_MATE_VOICES'
        ? TEAM_MATE_VOICES_QUESTIONS.map((q, i) => ({
            questionText: q.question,
            questionType: q.type,
            sortOrder: i + 1,
            isRequired: q.type === 'RATING_SCALE',
            options: q.type === 'RATING_SCALE'
              ? RATING_SCALE_OPTIONS.map((o, j) => ({
                  optionText: o.text,
                  optionValue: o.value,
                  sortOrder: j + 1,
                }))
              : [],
          }))
        : []

      const survey = await api.createSurvey({
        title: title.trim(),
        description: description.trim(),
        templateType: selectedTemplate as 'CUSTOM' | 'TEAM_MATE_VOICES' | 'ENGAGEMENT' | 'NPS',
        status: 'DRAFT',
        isAnonymous: true,
        participantType: 'ALL',
        surveyStage: 'ONBOARDING',
        audienceSource: 'CSV_UPLOAD',
        autoSend: false,
        questions,
      })
      navigate(`/surveys/${survey.surveyId}/edit`)
    } catch {
      alert('Failed to create survey')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <h1 style={{ fontSize: 34, fontWeight: 700, color: '#1D1D1F', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
        Create Survey
      </h1>
      <p style={{ fontSize: 17, color: '#86868B', margin: '0 0 32px' }}>
        Choose a template and configure your survey
      </p>

      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1D1D1F', marginBottom: 8 }}>
          Template
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {TEMPLATES.map(t => (
            <Card
              key={t.key}
              variant={selectedTemplate === t.key ? 'outlined' : 'elevated'}
              padding="md"
              pressable
              onClick={() => setSelectedTemplate(t.key)}
              style={{
                cursor: 'pointer',
                borderColor: selectedTemplate === t.key ? '#007AFF' : undefined,
                borderWidth: selectedTemplate === t.key ? 2 : undefined,
              }}
            >
              <CardBody>
                <span style={{ fontSize: 24 }}>{t.icon}</span>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#1D1D1F', margin: '8px 0 4px' }}>{t.label}</p>
                <p style={{ fontSize: 13, color: '#86868B', margin: 0 }}>{t.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input
          label="Survey Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Team Mate Voices 2026"
          fullWidth
          id="survey-title"
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label htmlFor="survey-desc" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1D1D1F', marginBottom: 8 }}>
          Description
        </label>
        <textarea
          id="survey-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the purpose of this survey..."
          rows={3}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 10,
            border: '1px solid #D2D2D7',
            fontSize: 15,
            fontFamily: 'inherit',
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <Button variant="secondary" onClick={() => navigate('/surveys')}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleCreate}
          loading={loading}
          disabled={!title.trim()}
        >
          Create Survey
        </Button>
      </div>
    </div>
  )
}
