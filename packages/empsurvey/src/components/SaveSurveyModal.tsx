import { useState } from 'react'
import { createPortal } from 'react-dom'

interface SaveSurveyModalProps {
  isOpen: boolean
  currentTitle: string
  isSaving: boolean
  onSave: (title: string) => Promise<void>
  onCancel: () => void
}

export default function SaveSurveyModal({
  isOpen,
  currentTitle,
  isSaving,
  onSave,
  onCancel
}: SaveSurveyModalProps) {
  const [title, setTitle] = useState(currentTitle)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Survey name is required')
      return
    }

    if (title.trim().length < 3) {
      setError('Survey name must be at least 3 characters')
      return
    }

    try {
      await onSave(title.trim())
      setTitle(currentTitle)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save survey')
    }
  }

  const handleCancel = () => {
    setTitle(currentTitle)
    setError(null)
    onCancel()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSaving) {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={handleCancel}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '32px',
          maxWidth: '500px',
          width: 'calc(100% - 40px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          zIndex: 10001,
          animation: 'modalFadeIn 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ marginBottom: '24px' }}>
          <h2
            style={{
              margin: '0 0 8px 0',
              fontSize: '24px',
              fontWeight: '600',
              color: '#1a1a1a'
            }}
          >
            Save Survey
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: '14px',
              color: '#666666'
            }}
          >
            Enter a name for your survey
          </p>
        </div>

        {/* Input Field */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#333333'
            }}
          >
            Survey Name
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              setError(null)
            }}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Employee Satisfaction Survey"
            autoFocus
            disabled={isSaving}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '16px',
              border: error ? '2px solid #dc2626' : '1px solid #d1d5db',
              borderRadius: '6px',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              color: '#1a1a1a',
              backgroundColor: isSaving ? '#f3f4f6' : '#ffffff',
              cursor: isSaving ? 'not-allowed' : 'text',
              transition: 'border-color 0.2s',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = error ? '#dc2626' : '#d1d5db'
            }}
          />
          {error && (
            <p
              style={{
                margin: '8px 0 0 0',
                fontSize: '13px',
                color: '#dc2626'
              }}
            >
              {error}
            </p>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}
        >
          <button
            onClick={handleCancel}
            disabled={isSaving}
            style={{
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: '500',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: '#ffffff',
              color: '#374151',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.6 : 1,
              transition: 'all 0.2s',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => {
              if (!isSaving) {
                e.currentTarget.style.backgroundColor = '#f3f4f6'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.7 : 1,
              transition: 'all 0.2s',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => {
              if (!isSaving) {
                e.currentTarget.style.backgroundColor = '#2563eb'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6'
            }}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes modalFadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    </div>,
    document.body
  )
}
