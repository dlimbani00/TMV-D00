import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Survey, TEAM_MATE_VOICES_QUESTIONS } from '../types/survey'
import { canAuthorSurveys, getUserRole } from '../utils/auth'
import '../styles/SurveyCreate.css'

export default function SurveyCreate() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    templateType: 'CUSTOM',
    participantType: 'ALL',
    surveyStage: 'ONBOARDING',
    audienceSource: 'CSV_UPLOAD',
    sourceRef: '',
    autoSend: true,
    isAnonymous: true,
  })
  // template selection is handled inline in formData

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const nextValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value

    if (name === 'templateType') {
      const isTMV = value === 'TEAM_MATE_VOICES'
      setFormData({
        ...formData,
        templateType: value,
        audienceSource: isTMV ? 'AUTO_API' : formData.audienceSource,
      })
      return
    }

    setFormData({
      ...formData,
      [name]: nextValue,
    })
  }

  const handleCreateSurvey = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      alert('Survey title is required')
      return
    }

    if (formData.templateType === 'TEAM_MATE_VOICES' && formData.audienceSource !== 'AUTO_API') {
      alert('Team Mate Voices survey must use AUTO_API participant source')
      return
    }

    if (formData.audienceSource !== 'AUTO_API' && !formData.sourceRef.trim()) {
      alert('Please provide source reference (CSV file name or Google Sheet ID)')
      return
    }

    // Create new survey object
    const newSurvey: Survey = {
      surveyId: Math.floor(Math.random() * 10000), // Temporary ID
      title: formData.title,
      description: formData.description,
      templateType: formData.templateType as any,
      status: 'DRAFT',
      createdBy: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startDate: null,
      endDate: null,
      isAnonymous: formData.isAnonymous,
      participantType: formData.participantType as any,
      surveyStage: formData.surveyStage as any,
      audienceSource: formData.audienceSource as any,
      sourceRef: formData.sourceRef,
      autoSend: formData.autoSend,
    }

    // Store in localStorage temporarily (will be replaced with API call)
    localStorage.setItem(`survey_${newSurvey.surveyId}`, JSON.stringify(newSurvey))

    // Navigate to editor
    navigate(`/surveys/${newSurvey.surveyId}/edit`)
  }

  if (!canAuthorSurveys(getUserRole())) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Access denied</h2>
        <p>Only Admin can create lifecycle surveys.</p>
      </div>
    )
  }

  return (
    <div className="survey-create-container">
      <div className="form-header">
        <h2>Create New Lifecycle Survey</h2>
        <p>Admin creates and automates surveys by participant type and training stage</p>
      </div>

      <form onSubmit={handleCreateSurvey} className="survey-form">
        <div className="form-section">
          <label htmlFor="title" className="form-label">
            Survey Title *
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Team Mate Voices 2026"
            className="form-input"
            required
          />
        </div>

        <div className="form-section">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe the purpose of this survey..."
            rows={4}
            className="form-input"
          />
        </div>

        <div className="form-section">
          <label htmlFor="templateType" className="form-label">
            Survey Type
          </label>
          <select
            id="templateType"
            name="templateType"
            value={formData.templateType}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="CUSTOM">Custom Survey</option>
            <option value="TEAM_MATE_VOICES">Team Mate Voices Template</option>
            <option value="ENGAGEMENT">Employee Engagement</option>
            <option value="NPS">Net Promoter Score</option>
          </select>
          {formData.templateType === 'TEAM_MATE_VOICES' && (
            <p className="template-info">
              Includes {TEAM_MATE_VOICES_QUESTIONS.length} pre-built questions focused on employee engagement
            </p>
          )}
        </div>

        <div className="form-section">
          <label htmlFor="participantType" className="form-label">
            Participant Type
          </label>
          <select
            id="participantType"
            name="participantType"
            value={formData.participantType}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="ALL">All participants</option>
            <option value="NEW_HIRE">New hires</option>
            <option value="EXISTING_RESOURCE">Existing resources</option>
          </select>
        </div>

        <div className="form-section">
          <label htmlFor="surveyStage" className="form-label">
            Training Milestone
          </label>
          <select
            id="surveyStage"
            name="surveyStage"
            value={formData.surveyStage}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="ONBOARDING">Onboarding</option>
            <option value="MID_TRAINING">Mid Training</option>
            <option value="END_TRAINING">End Training</option>
          </select>
        </div>

        <div className="form-section">
          <label htmlFor="audienceSource" className="form-label">
            Participant Source
          </label>
          <select
            id="audienceSource"
            name="audienceSource"
            value={formData.audienceSource}
            onChange={handleInputChange}
            className="form-select"
            disabled={formData.templateType === 'TEAM_MATE_VOICES'}
          >
            <option value="AUTO_API">Automated API Feed</option>
            <option value="CSV_UPLOAD">CSV Upload</option>
            <option value="GOOGLE_SHEET">Google Sheet</option>
          </select>
          {formData.templateType === 'TEAM_MATE_VOICES' && (
            <p className="helper-text">Team Mate Voices is locked to automated API feed.</p>
          )}
        </div>

        {formData.audienceSource !== 'AUTO_API' && (
          <div className="form-section">
            <label htmlFor="sourceRef" className="form-label">
              Source Reference
            </label>
            <input
              id="sourceRef"
              type="text"
              name="sourceRef"
              value={formData.sourceRef}
              onChange={handleInputChange}
              placeholder={formData.audienceSource === 'CSV_UPLOAD' ? 'participants.csv' : 'Google Sheet ID'}
              className="form-input"
            />
          </div>
        )}

        <div className="form-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="autoSend"
              checked={formData.autoSend}
              onChange={handleInputChange}
            />
            <span>Enable automated lifecycle sending</span>
          </label>
          <p className="helper-text">
            Automatically send this survey at the selected training milestone
          </p>
        </div>

        <div className="form-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleInputChange}
            />
            <span>Make responses anonymous</span>
          </label>
          <p className="helper-text">
            Anonymous responses encourage honest feedback
          </p>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Create Survey & Add Questions
          </button>
          <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
