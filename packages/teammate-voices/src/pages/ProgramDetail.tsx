import { useState, useEffect, useMemo, useCallback, useRef, ChangeEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../design-system'
import Breadcrumb from '@/components/Breadcrumb'
import StatusPill from '@/components/StatusPill'
import { AgGridReact } from 'ag-grid-react'
import type { ColDef, SizeColumnsToFitGridStrategy } from 'ag-grid-community'
import { api } from '@/services/api'
import type { ProgramDetail as ProgramDetailType, ParticipantStatusRow } from '@/types/program'

function getStatusVariant(status: string): 'active' | 'draft' | 'closed' | 'default' {
  const s = status.toUpperCase()
  if (s === 'ACTIVE') return 'active'
  if (s === 'INACTIVE') return 'draft'
  if (s === 'CLOSED') return 'closed'
  return 'default'
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  SUBMITTED:  { label: 'Completed',       color: '#166534', bg: '#dcfce7' },
  SENT:       { label: 'Sent',            color: '#1e40af', bg: '#dbeafe' },
  OPENED:     { label: 'Opened',          color: '#1e40af', bg: '#dbeafe' },
  PENDING:    { label: 'Pending',         color: '#6b7280', bg: '#f3f4f6' },
  FAILED:     { label: 'Failed',          color: '#dc2626', bg: '#fef2f2' },
  EXPIRED:    { label: 'Expired',         color: '#d97706', bg: '#fefce8' },
}

const DEFAULT_STATUS = { label: 'Not Dispatched', color: '#9ca3af', bg: '#f9fafb' }

function DispatchStatusCellRenderer({ value }: { value: string | null }) {
  const cfg = value ? STATUS_CONFIG[value] || DEFAULT_STATUS : DEFAULT_STATUS
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 500,
      color: cfg.color,
      background: cfg.bg,
      whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  )
}

function TypeCellRenderer({ value }: { value: string }) {
  if (!value) return '—'
  if (value === 'NEW_HIRE') return 'New Hire'
  if (value === 'EXISTING_RESOURCE') return 'Existing'
  return value
}

const statusFilters: Record<string, string> = {
  ALL: 'All',
  SUBMITTED: 'Completed',
  SENT: 'Sent',
  OPENED: 'Opened',
  PENDING: 'Pending',
  NOT_DISPATCHED: 'Not Dispatched',
}

export default function ProgramDetail() {
  const { programId } = useParams()
  const navigate = useNavigate()
  const gridRef = useRef<AgGridReact>(null)
  const [detail, setDetail] = useState<ProgramDetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const [quickFilterText, setQuickFilterText] = useState('')
  const [activeTab, setActiveTab] = useState('ALL')

  useEffect(() => {
    if (!programId) return
    api.getProgramDetail(Number(programId))
      .then(setDetail)
      .catch(() => navigate('/programs'))
      .finally(() => setLoading(false))
  }, [programId, navigate])

  const columnDefs = useMemo<ColDef[]>(() => [
    {
      field: 'fullName',
      headerName: 'Name',
      flex: 1.2,
      minWidth: 150,
      cellStyle: { fontWeight: 500 },
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: 'cohort',
      headerName: 'Cohort',
      width: 110,
      valueFormatter: (params) => params.value || '—',
    },
    {
      field: 'participantType',
      headerName: 'Type',
      width: 120,
      cellRenderer: TypeCellRenderer,
    },
    {
      field: 'dispatchStatus',
      headerName: 'Status',
      width: 130,
      cellRenderer: DispatchStatusCellRenderer,
    },
    {
      field: 'surveyStage',
      headerName: 'Stage',
      width: 120,
      valueFormatter: (params) => params.value ? params.value.replace(/_/g, ' ') : '—',
    },
    {
      field: 'reminderCount',
      headerName: 'Reminders',
      width: 100,
      valueFormatter: (params) => params.value > 0 ? String(params.value) : '—',
    },
    {
      field: 'submittedAt',
      headerName: 'Submitted',
      width: 120,
      valueFormatter: (params) => params.value ? params.value.substring(0, 10) : '—',
    },
  ], [])

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    filter: false,
    resizable: true,
  }), [])

  const autoSizeStrategy = useMemo<SizeColumnsToFitGridStrategy>(() => ({
    type: 'fitGridWidth',
  }), [])

  const onFilterTextBoxChanged = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => setQuickFilterText(value),
    [],
  )

  const handleTabClick = useCallback((status: string) => {
    setActiveTab(status)
  }, [])

  const filteredParticipants = useMemo(() => {
    if (!detail) return []
    if (activeTab === 'ALL') return detail.participants
    if (activeTab === 'NOT_DISPATCHED') return detail.participants.filter((p: ParticipantStatusRow) => !p.dispatchStatus)
    return detail.participants.filter((p: ParticipantStatusRow) => p.dispatchStatus === activeTab)
  }, [detail, activeTab])

  if (loading) {
    return <p style={{ textAlign: 'center', padding: 60, color: '#86868b' }}>Loading program...</p>
  }

  if (!detail) {
    return <p style={{ textAlign: 'center', padding: 60, color: '#86868b' }}>Program not found.</p>
  }

  const { program, totalParticipants, completedCount, sentCount, pendingCount } = detail
  const progressLabel = (program.surveyProgress || 'NOT_STARTED').replace(/_/g, ' ')

  return (
    <div className="page-container">
      <Breadcrumb items={[
        { label: 'Programs', path: '/programs' },
        { label: program.name },
      ]} />

      <div className="program-detail__header">
        <div>
          <h1 className="program-detail__title">{program.name}</h1>
          <div className="program-detail__meta">
            <StatusPill label={program.status} variant={getStatusVariant(program.status)} />
            <span className="program-detail__progress-badge" data-progress={program.surveyProgress}>
              {progressLabel}
            </span>
          </div>
        </div>
        <div className="program-detail__actions">
          <Button variant="secondary" size="sm" onClick={() => navigate(`/programs/${programId}/edit`)}>
            Edit
          </Button>
          <Button variant="secondary" size="sm" onClick={() => navigate('/programs')}>
            Back
          </Button>
        </div>
      </div>

      {/* Top Card: Program Information */}
      <div className="program-detail__info-card">
        <h3 className="program-detail__card-title">Program Information</h3>
        <div className="program-detail__info-grid">
          <div className="program-detail__info-item">
            <span className="program-detail__info-label">Template Type</span>
            <span className="program-detail__info-value">{program.templateType || '—'}</span>
          </div>
          <div className="program-detail__info-item">
            <span className="program-detail__info-label">Program Name</span>
            <span className="program-detail__info-value">{program.name}</span>
          </div>
          <div className="program-detail__info-item">
            <span className="program-detail__info-label">Status</span>
            <span className="program-detail__info-value"><StatusPill label={program.status} variant={getStatusVariant(program.status)} /></span>
          </div>
          <div className="program-detail__info-item">
            <span className="program-detail__info-label">Survey Progress</span>
            <span className="program-detail__info-value">{progressLabel}</span>
          </div>
          <div className="program-detail__info-item program-detail__info-item--full">
            <span className="program-detail__info-label">Description</span>
            <span className="program-detail__info-value">{program.description || '—'}</span>
          </div>
          <div className="program-detail__info-item">
            <span className="program-detail__info-label">Created</span>
            <span className="program-detail__info-value">
              {program.createdAt ? new Date(program.createdAt).toLocaleDateString() : '—'}
            </span>
          </div>
          <div className="program-detail__info-item">
            <span className="program-detail__info-label">Last Updated</span>
            <span className="program-detail__info-value">
              {program.updatedAt ? new Date(program.updatedAt).toLocaleDateString() : '—'}
            </span>
          </div>
        </div>

        {/* Summary metrics */}
        <div className="program-detail__metrics">
          <div className="program-detail__metric">
            <span className="program-detail__metric-value">{totalParticipants}</span>
            <span className="program-detail__metric-label">Total</span>
          </div>
          <div className="program-detail__metric program-detail__metric--green">
            <span className="program-detail__metric-value">{completedCount}</span>
            <span className="program-detail__metric-label">Completed</span>
          </div>
          <div className="program-detail__metric program-detail__metric--blue">
            <span className="program-detail__metric-value">{sentCount}</span>
            <span className="program-detail__metric-label">Sent</span>
          </div>
          <div className="program-detail__metric program-detail__metric--gray">
            <span className="program-detail__metric-value">{pendingCount}</span>
            <span className="program-detail__metric-label">Pending</span>
          </div>
        </div>
      </div>

      {/* Bottom Card: Participants AG Grid */}
      <div className="survey-library__table-card">
        <div className="survey-library__toolbar">
          <div className="survey-library__tabs">
            {Object.entries(statusFilters).map(([key, label]) => (
              <button
                key={key}
                className={`survey-library__tab-btn${activeTab === key ? ' survey-library__tab-btn--active' : ''}`}
                onClick={() => handleTabClick(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="survey-library__toolbar-right">
            <div className="survey-library__search-wrap">
              <span className="survey-library__search-icon">
                <svg width="16" height="16" fill="none" stroke="#86868b" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
              </span>
              <input
                className="survey-library__search"
                type="text"
                placeholder="Search participants..."
                value={quickFilterText}
                onChange={onFilterTextBoxChanged}
              />
            </div>
          </div>
        </div>

        <div className="ag-theme-alpine survey-library__grid">
          <AgGridReact
            ref={gridRef}
            rowData={filteredParticipants}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoSizeStrategy={autoSizeStrategy}
            quickFilterText={quickFilterText}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[5, 10, 20]}
            domLayout="autoHeight"
            rowHeight={44}
            headerHeight={40}
            suppressCellFocus
            animateRows
          />
        </div>
      </div>
    </div>
  )
}
