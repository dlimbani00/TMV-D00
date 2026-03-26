import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Input } from '../design-system'
import Breadcrumb from '@/components/Breadcrumb'
import TabBar from '@/components/TabBar'
import StatusPill from '@/components/StatusPill'
import FormField from '@/components/FormField'
import FormBuilderPanel from '@/components/FormBuilderPanel'
import FormViewer from '@/components/FormViewer'
import ToggleSwitch from '@/components/ToggleSwitch'
import { LogicTab } from '@/components/logic'
import { api } from '@/services/api'
import type { Survey, SurveyPage, SurveyTab } from '@/types/survey'
import { SURVEY_TABS } from '@/types/survey'
import type { Program } from '@/types/program'
import type { LogicRule } from '@/types/logic'
import type { EmailTemplate, EmailTemplateAssignment } from '@/types/emailTemplate'
import { TRIGGER_TYPES } from '@/types/emailTemplate'

const FALLBACK_PROGRAMS: Program[] = [
  { programId: 1, name: 'Teammate Voices', description: 'Employee engagement', templateType: 'Teammate Voices', status: 'ACTIVE', surveyProgress: 'NOT_STARTED', createdAt: '', updatedAt: '' },
  { programId: 2, name: 'ESAT', description: 'Employee satisfaction', templateType: 'Engagement Survey', status: 'ACTIVE', surveyProgress: 'NOT_STARTED', createdAt: '', updatedAt: '' },
  { programId: 3, name: 'Intern Program', description: 'Intern feedback', templateType: 'Intern Program', status: 'ACTIVE', surveyProgress: 'NOT_STARTED', createdAt: '', updatedAt: '' },
  { programId: 4, name: 'NPS Survey', description: 'Net promoter score', templateType: 'NPS Survey', status: 'ACTIVE', surveyProgress: 'NOT_STARTED', createdAt: '', updatedAt: '' },
]

const EMPTY_SURVEY: Partial<Survey> = {
  title: '',
  description: '',
  templateType: 'CUSTOM',
  status: 'DRAFT',
  buildStatus: 'DRAFT',
  participantType: 'ALL',
  surveyStage: 'ONBOARDING',
  audienceSource: 'CSV_UPLOAD',
  autoSend: false,
  isAnonymous: true,
  questions: [],
  pages: [],
}

export default function SurveyEditor() {
  const { surveyId } = useParams<{ surveyId: string }>()
  const navigate = useNavigate()
  const isEditMode = !!surveyId

  const [survey, setSurvey] = useState<Partial<Survey>>(EMPTY_SURVEY)
  const [programs, setPrograms] = useState<Program[]>([])
  const [activeTab, setActiveTab] = useState<SurveyTab>('details')
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [logicRules, setLogicRules] = useState<LogicRule[]>([])

  // Settings tab state
  const [emailAssignments, setEmailAssignments] = useState<EmailTemplateAssignment[]>([])
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([])
  const [newTrigger, setNewTrigger] = useState('')
  const [newTemplateId, setNewTemplateId] = useState<number | ''>('')
  const [newDelayDays, setNewDelayDays] = useState(0)
  const [sendingTest, setSendingTest] = useState<number | null>(null)
  const [testMessage, setTestMessage] = useState('')
  const [dispatchChecks, setDispatchChecks] = useState<Array<{ key: string; label: string; passed: boolean; detail: string }>>([])
  const [dispatchPassed, setDispatchPassed] = useState(false)
  const [checkingDispatch, setCheckingDispatch] = useState(false)

  useEffect(() => {
    api.getPrograms()
      .then((p) => setPrograms(p.length > 0 ? p : FALLBACK_PROGRAMS))
      .catch(() => setPrograms(FALLBACK_PROGRAMS))
  }, [])

  useEffect(() => {
    if (!surveyId) return
    api.getSurvey(Number(surveyId))
      .then((s) => setSurvey({ ...s, pages: s.pages || [] }))
      .catch(() => navigate('/surveys'))
      .finally(() => setLoading(false))
  }, [surveyId, navigate])

  // Load email assignments and templates for Settings tab
  useEffect(() => {
    if (!surveyId) return
    api.getAssignmentsBySurvey(Number(surveyId))
      .then(setEmailAssignments)
      .catch(() => {})
    api.getEmailTemplates()
      .then(setEmailTemplates)
      .catch(() => {})
  }, [surveyId])

  const handleAddEmailAssignment = async () => {
    if (!surveyId || !newTrigger || !newTemplateId) {
      alert('Please select both a template and a trigger type.')
      return
    }
    try {
      const saved = await api.saveTemplateAssignment(Number(newTemplateId), {
        triggerType: newTrigger,
        surveyId: Number(surveyId),
        sendDelayDays: newDelayDays,
        isActive: true,
      })
      setEmailAssignments(prev => [...prev.filter(a => a.assignmentId !== saved.assignmentId), saved])
      setNewTrigger('')
      setNewTemplateId('')
      setNewDelayDays(0)
    } catch {
      alert('Failed to save assignment.')
    }
  }

  const handleDeleteEmailAssignment = async (assignmentId: number) => {
    try {
      await api.deleteTemplateAssignment(assignmentId)
      setEmailAssignments(prev => prev.filter(a => a.assignmentId !== assignmentId))
    } catch {
      alert('Failed to delete assignment.')
    }
  }

  const handleSendTestEmail = async (templateId: number) => {
    setSendingTest(templateId)
    setTestMessage('')
    try {
      const result = await api.sendTestEmail(templateId)
      setTestMessage(result.message)
    } catch {
      setTestMessage('Failed to send test email.')
    } finally {
      setSendingTest(null)
      setTimeout(() => setTestMessage(''), 5000)
    }
  }

  // Run dispatch validation when Settings tab is active
  useEffect(() => {
    if (activeTab !== 'settings' || !surveyId) return
    setCheckingDispatch(true)
    api.validateDispatch(Number(surveyId))
      .then(result => {
        setDispatchChecks(result.checks)
        setDispatchPassed(result.passed)
      })
      .catch(() => {})
      .finally(() => setCheckingDispatch(false))
  }, [activeTab, surveyId, emailAssignments])

  const isActive = survey.status === 'ACTIVE'
  const isLocked = survey.status === 'ACTIVE' || survey.status === 'CLOSED'

  const handleSave = async () => {
    if (!survey.title?.trim()) return
    setSaving(true)
    setSaveMessage('')
    try {
      if (isEditMode && survey.surveyId) {
        const updated = await api.updateSurvey(survey.surveyId, survey)
        setSurvey({ ...updated, pages: updated.pages || [] })
      } else {
        const created = await api.createSurvey(survey)
        setSurvey({ ...created, pages: created.pages || [] })
        navigate(`/surveys/${created.surveyId}/edit`, { replace: true })
      }
      setSaveMessage('Survey saved successfully')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch {
      alert('Failed to save survey')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!survey.surveyId || !confirm('Delete this survey?')) return
    try {
      await api.deleteSurvey(survey.surveyId)
      navigate('/surveys')
    } catch {
      alert('Failed to delete survey')
    }
  }

  const handlePublish = async () => {
    if (!survey.surveyId) {
      await handleSave()
      return
    }
    try {
      const updated = await api.publishSurvey(survey.surveyId)
      setSurvey(updated)
    } catch {
      alert('Failed to publish survey')
    }
  }

  const handleClone = async () => {
    if (!survey.surveyId) return
    try {
      const cloned = await api.cloneSurvey(survey.surveyId)
      navigate(`/surveys/${cloned.surveyId}/edit`)
    } catch {
      alert('Failed to clone survey')
    }
  }

  const handleNext = () => {
    const currentIdx = SURVEY_TABS.findIndex(t => t.key === activeTab)
    if (currentIdx < SURVEY_TABS.length - 1) {
      setActiveTab(SURVEY_TABS[currentIdx + 1].key)
    }
  }

  const handlePagesChange = (pages: SurveyPage[]) => {
    setSurvey({ ...survey, pages })
  }

  const handleLogicRulesChange = (rules: LogicRule[]) => {
    if (survey.surveyId) {
      api.saveLogicRules(survey.surveyId, rules).then(() => {
        setLogicRules(rules)
      }).catch((err: Error) => {
        alert('Logic rule validation failed:\n\n' + err.message)
        // Reload last valid rules from backend
        api.getLogicRules(survey.surveyId!).then(setLogicRules).catch(() => {})
      })
    } else {
      setLogicRules(rules)
    }
  }

  if (loading) {
    return <p style={{ textAlign: 'center', padding: 60, color: '#86868b' }}>Loading survey...</p>
  }

  const pageTitle = isEditMode ? (survey.title || 'Edit survey') : 'Create survey'
  const breadcrumbLabel = isEditMode ? (survey.title || 'Edit survey') : 'Create survey'

  return (
    <div className="survey-editor">
      <Breadcrumb items={[
        { label: 'Survey', path: '/surveys' },
        { label: breadcrumbLabel },
      ]} />

      <div className="survey-editor__header">
        <div className="survey-editor__header-left">
          <h1 className="survey-editor__title">{pageTitle}</h1>
          <div className="survey-editor__status-row">
            <span className="survey-editor__status-label">Build status:</span>
            <StatusPill
              label={survey.buildStatus === 'PUBLISHED' ? 'Published' : 'Draft'}
              variant={survey.buildStatus === 'PUBLISHED' ? 'active' : 'draft'}
            />
          </div>
        </div>
        <div className="survey-editor__header-actions">
          {isEditMode && !isLocked && (
            <Button variant="destructive" size="sm" onClick={handleDelete}>Delete</Button>
          )}
          <Button variant="secondary" size="sm" onClick={() => navigate('/surveys')}>Cancel</Button>
          {isLocked ? (
            <Button variant="primary" size="sm" onClick={handleClone}>Clone</Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={handlePublish}>Publish</Button>
          )}
        </div>
      </div>

      <div className="survey-editor__card">
        <TabBar
          tabs={SURVEY_TABS}
          activeTab={activeTab}
          onChange={(key) => setActiveTab(key as SurveyTab)}
        />

        <div className={`survey-editor__content${activeTab === 'formBuilder' ? ' survey-editor__content--form-builder' : ''}`}>
        {activeTab === 'details' && (
          <>
            <h2 className="survey-editor__section-title">Survey information</h2>

            <div className="survey-editor__form-row">
              <FormField label="Survey Name" required helper="Create a name for the survey." htmlFor="survey-name">
                <Input
                  id="survey-name"
                  placeholder="Add name"
                  value={survey.title || ''}
                  onChange={(e) => setSurvey({ ...survey, title: e.target.value })}
                  fullWidth
                />
              </FormField>

              <FormField label="Summary" helper="Add a short description of the survey." htmlFor="survey-summary">
                <Input
                  id="survey-summary"
                  placeholder="Add description"
                  value={survey.description || ''}
                  onChange={(e) => setSurvey({ ...survey, description: e.target.value })}
                  fullWidth
                />
              </FormField>

              <FormField label="Survey status">
                <ToggleSwitch
                  label={isActive ? 'Active' : 'Inactive'}
                  checked={isActive}
                  onChange={(checked) => setSurvey({ ...survey, status: checked ? 'ACTIVE' : 'DRAFT' })}
                />
              </FormField>
            </div>

            <div className="survey-editor__form-row survey-editor__form-row--program">
              <FormField label="Program" required helper="Map the survey to a program." htmlFor="survey-program">
                <select
                  id="survey-program"
                  className="program-create__select"
                  value={survey.programId ? String(survey.programId) : ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSurvey({ ...survey, programId: Number(e.target.value) || undefined })}
                >
                  <option value="">Select</option>
                  {programs.map(p => (
                    <option key={p.programId} value={String(p.programId)}>{p.name}</option>
                  ))}
                </select>
              </FormField>
            </div>

            <hr className="survey-editor__divider" />

            <div className="survey-editor__bottom-actions">
              {saveMessage && <span className="survey-editor__save-message">{saveMessage}</span>}
              <Button variant="secondary" size="sm" onClick={handleSave} loading={saving}>Save</Button>
              <Button variant="primary" size="sm" onClick={handleNext}>Next</Button>
            </div>
          </>
        )}

        {activeTab === 'formBuilder' && (
          <FormBuilderPanel
            pages={survey.pages || []}
            onPagesChange={handlePagesChange}
            onSave={handleSave}
            onCancel={() => navigate('/surveys')}
            saving={saving}
            saveMessage={saveMessage}
            detailsComplete={!!survey.title?.trim()}
          />
        )}

        {activeTab === 'formViewer' && (
          <FormViewer survey={survey} logicRules={logicRules} />
        )}

        {activeTab === 'logic' && (
          <LogicTab
            surveyId={survey.surveyId}
            pages={survey.pages || []}
            logicRules={logicRules}
            onRulesChange={handleLogicRulesChange}
            readOnly={survey.status === 'ACTIVE' || survey.status === 'CLOSED'}
          />
        )}

        {activeTab === 'settings' && (
          <div className="email-editor__form" style={{ padding: '24px 28px' }}>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: '#1d1d1f', marginBottom: 8 }}>Email Configuration</h3>
            <p style={{ color: '#86868b', fontSize: 14, marginBottom: 24 }}>
              Assign email templates to survey lifecycle events. Notifications are sent to <strong>keyur@me.com</strong>.
            </p>

            {/* Pre-flight Dispatch Checklist */}
            <div style={{ border: '1px solid #d2d2d7', borderRadius: 12, padding: 20, marginBottom: 24, background: dispatchPassed ? '#f0fdf4' : '#fefce8' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: '#1d1d1f', margin: 0 }}>
                  {dispatchPassed ? 'Ready to send emails' : 'Pre-flight checklist'} {dispatchPassed ? '  ' : '  '}
                </h4>
                {checkingDispatch && <span style={{ fontSize: 12, color: '#86868b' }}>Checking...</span>}
              </div>
              {dispatchChecks.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {dispatchChecks.map(check => (
                    <div key={check.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13 }}>
                      <span style={{ flexShrink: 0, width: 20, textAlign: 'center', fontSize: 14 }}>
                        {check.passed ? '\u2705' : '\u274C'}
                      </span>
                      <div>
                        <span style={{ fontWeight: 500, color: check.passed ? '#166534' : '#92400e' }}>{check.label}</span>
                        <span style={{ color: '#86868b', marginLeft: 8 }}>{check.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {dispatchChecks.length === 0 && !checkingDispatch && (
                <p style={{ fontSize: 13, color: '#86868b', margin: 0 }}>Save the survey to run validation checks.</p>
              )}
            </div>

            {testMessage && (
              <div style={{ padding: '10px 16px', background: testMessage.includes('Failed') ? '#fef2f2' : '#dcfce7', borderRadius: 8, marginBottom: 16, fontSize: 13, color: testMessage.includes('Failed') ? '#dc2626' : '#166534' }}>
                {testMessage}
              </div>
            )}

            {/* Current Assignments */}
            {emailAssignments.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: '#1d1d1f', marginBottom: 12 }}>Active Email Assignments</h4>
                <table className="assignment-table">
                  <thead>
                    <tr>
                      <th>Trigger Event</th>
                      <th>Email Template</th>
                      <th>Delay</th>
                      <th>Status</th>
                      <th style={{ width: 160 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {emailAssignments.map(a => {
                      const trigger = TRIGGER_TYPES.find(t => t.value === a.triggerType)
                      const template = emailTemplates.find(t => t.templateId === a.templateId)
                      return (
                        <tr key={a.assignmentId}>
                          <td>
                            <span className="assignment-trigger-pill">{trigger?.label || a.triggerType}</span>
                          </td>
                          <td>{template?.name || a.templateName || `Template #${a.templateId}`}</td>
                          <td>{a.sendDelayDays ? `${a.sendDelayDays} day${a.sendDelayDays > 1 ? 's' : ''}` : 'Immediate'}</td>
                          <td>
                            <span className={`assignment-status ${a.isActive ? 'assignment-status--active' : 'assignment-status--inactive'}`}>
                              {a.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td style={{ display: 'flex', gap: 8 }}>
                            <button
                              className="assignment-delete-btn"
                              style={{ color: '#012169' }}
                              onClick={() => handleSendTestEmail(a.templateId)}
                              disabled={sendingTest === a.templateId}
                            >
                              {sendingTest === a.templateId ? 'Sending...' : 'Send Test'}
                            </button>
                            <button
                              className="assignment-delete-btn"
                              onClick={() => handleDeleteEmailAssignment(a.assignmentId)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Add New Assignment */}
            <div style={{ border: '1px solid #d2d2d7', borderRadius: 12, padding: 24 }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: '#1d1d1f', marginBottom: 16 }}>Add Email Assignment</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: 16, alignItems: 'end' }}>
                <FormField label="Trigger Event">
                  <select className="email-editor__select" value={newTrigger} onChange={e => setNewTrigger(e.target.value)}>
                    <option value="">Select trigger...</option>
                    {TRIGGER_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Email Template">
                  <select className="email-editor__select" value={newTemplateId} onChange={e => setNewTemplateId(e.target.value ? Number(e.target.value) : '')}>
                    <option value="">Select template...</option>
                    {emailTemplates.filter(t => t.status === 'ACTIVE').map(t => (
                      <option key={t.templateId} value={t.templateId}>{t.name} ({t.category})</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Delay (days)">
                  <input className="email-editor__input" type="number" min={0} max={365} value={newDelayDays} onChange={e => setNewDelayDays(Number(e.target.value))} />
                </FormField>
              </div>
              <div style={{ marginTop: 16 }}>
                <Button variant="primary" size="sm" onClick={handleAddEmailAssignment}>+ Add Assignment</Button>
              </div>
            </div>

            {emailAssignments.length === 0 && (
              <p style={{ color: '#86868b', fontSize: 13, marginTop: 16, textAlign: 'center' }}>
                No email assignments yet. Add one above to configure survey notifications.
              </p>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
