import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../design-system'
import Breadcrumb from '@/components/Breadcrumb'
import ToggleSwitch from '@/components/ToggleSwitch'
import { PROGRAM_TEMPLATES } from '@/types/program'
import { api } from '@/services/api'

export default function ProgramCreate() {
  const navigate = useNavigate()
  const [template, setTemplate] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSave = async () => {
    if (!name.trim()) return
    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')
    try {
      await api.createProgram({
        name: name.trim(),
        description: description.trim(),
        templateType: template || 'CUSTOM',
        status: isActive ? 'ACTIVE' : 'INACTIVE',
        surveyProgress: 'NOT_STARTED',
      })
      setSuccessMessage('Program saved successfully!')
      setLoading(false)
      setTimeout(() => navigate('/programs'), 1500)
    } catch (err) {
      console.error('Failed to create program:', err)
      setErrorMessage('Failed to save program. Please try again.')
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/programs')
  }

  return (
    <div className="program-create">
      <Breadcrumb items={[
        { label: 'Programs', path: '/programs' },
        { label: 'Add program' },
      ]} />

      <h1 className="program-create__title">Add program</h1>

      <div className="program-create__form">
        <h2 className="program-create__section-title">Program information</h2>

        <div className="program-create__row">
          <div className="program-create__field">
            <label className="program-create__label" htmlFor="template">
              Program starter template
            </label>
            <select
              id="template"
              className="program-create__select"
              value={template}
              onChange={e => setTemplate(e.target.value)}
            >
              <option value="">Choose template</option>
              {PROGRAM_TEMPLATES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <span className="program-create__helper">Choose a pre-defined template</span>
          </div>

          <div className="program-create__field">
            <label className="program-create__label" htmlFor="program-name">
              Program name*
            </label>
            <input
              id="program-name"
              className="program-create__input"
              placeholder="Add name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <span className="program-create__helper">Create a name for the program</span>
          </div>
        </div>

        <div className="program-create__row program-create__row--description">
          <div className="program-create__field program-create__field--wide">
            <label className="program-create__label" htmlFor="description">
              Program description
            </label>
            <input
              id="description"
              className="program-create__input"
              placeholder="Add description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <span className="program-create__helper">Add a description for the program</span>
          </div>

          <div className="program-create__field program-create__field--status">
            <span className="program-create__label">Program status</span>
            <ToggleSwitch
              label="Inactive"
              checked={isActive}
              onChange={setIsActive}
            />
          </div>
        </div>

        {successMessage && (
          <div className="program-create__message program-create__message--success">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="program-create__message program-create__message--error">
            {errorMessage}
          </div>
        )}

        <div className="program-create__actions">
          <Button variant="secondary" size="md" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSave} loading={loading} disabled={!name.trim()}>
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
