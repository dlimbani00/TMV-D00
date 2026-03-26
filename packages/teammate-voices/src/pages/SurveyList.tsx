import { useState, useEffect, useRef, useCallback, useMemo, type ChangeEvent } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Button } from '../design-system'
import Breadcrumb from '@/components/Breadcrumb'
import { api } from '@/services/api'
import type { Survey } from '@/types/survey'
import type { Program } from '@/types/program'
import { AgGridReact } from 'ag-grid-react'
import type { ColDef, SizeColumnsToFitGridStrategy } from 'ag-grid-community'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'

ModuleRegistry.registerModules([AllCommunityModule])

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return dateStr.substring(0, 10)
}

const statuses: Record<string, string> = {
  all: 'All',
  ACTIVE: 'Active',
  DRAFT: 'Draft',
  CLOSED: 'Closed',
}

const paginationPageSizeSelector = [5, 10, 20]

function ActionsCellRenderer({ data, onEdit, onClone }: { data: Survey; onEdit: (id: number) => void; onClone: (id: number) => void }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleToggle = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 4, left: rect.right - 120 })
    }
    setOpen(!open)
  }

  if (!data) return null
  return (
    <div className="ag-actions-wrap">
      <button ref={triggerRef} className="ag-actions-trigger" onClick={handleToggle} title="Actions">⋮</button>
      {open && createPortal(
        <div
          ref={menuRef}
          className="ag-actions-dropdown"
          style={{ top: pos.top, left: pos.left }}
        >
          <button className="ag-actions-dropdown__item" onClick={() => { setOpen(false); onEdit(data.surveyId) }}>Edit</button>
          <button className="ag-actions-dropdown__item" onClick={() => { setOpen(false); onClone(data.surveyId) }}>Clone</button>
          <button className="ag-actions-dropdown__item" onClick={() => {
            setOpen(false)
            navigator.clipboard.writeText(`${window.location.origin}/respond/${data.surveyId}`)
            alert('Anonymous link copied!')
          }}>Share Link</button>
        </div>,
        document.body,
      )}
    </div>
  )
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  ACTIVE: { bg: '#dcfce7', color: '#166534', label: 'Active' },
  DRAFT: { bg: '#fef9c3', color: '#854d0e', label: 'Draft' },
  CLOSED: { bg: '#f3f4f6', color: '#6b7280', label: 'Closed' },
}

function StatusCellRenderer({ value }: { value: string }) {
  const style = STATUS_STYLES[value] || STATUS_STYLES.DRAFT
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        backgroundColor: style.bg,
        color: style.color,
        lineHeight: '18px',
      }}
    >
      {style.label}
    </span>
  )
}

export default function SurveyList() {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [quickFilterText, setQuickFilterText] = useState<string>()
  const [activeTab, setActiveTab] = useState('all')
  const gridRef = useRef<AgGridReact>(null)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([api.getSurveys(), api.getPrograms()])
      .then(([s, p]) => { setSurveys(s); setPrograms(p) })
      .catch(() => { setSurveys([]); setPrograms([]) })
      .finally(() => setLoading(false))
  }, [])

  const programMap = useMemo(() => {
    const map: Record<number, string> = {}
    programs.forEach(p => { map[p.programId] = p.name })
    return map
  }, [programs])

  const handleClone = useCallback(async (surveyId: number) => {
    try {
      const cloned = await api.cloneSurvey(surveyId)
      setSurveys(prev => [...prev, cloned])
    } catch {
      alert('Failed to clone survey')
    }
  }, [])

  const columnDefs = useMemo<ColDef[]>(() => [
    {
      field: 'programId',
      headerName: 'Program',
      valueGetter: (params) => params.data?.programId ? (programMap[params.data.programId] || '') : '',
      flex: 1,
      minWidth: 130,
    },
    {
      field: 'title',
      headerName: 'Survey Name',
      flex: 1.5,
      minWidth: 180,
      cellRenderer: (params: { data: Survey }) => params.data?.title || '',
      onCellClicked: (params) => {
        if (params.data) navigate(`/surveys/${params.data.surveyId}/edit`)
      },
      cellStyle: { color: '#007aff', cursor: 'pointer', fontWeight: 500 },
    },
    {
      field: 'description',
      headerName: 'Summary',
      flex: 1.5,
      minWidth: 140,
    },
    {
      field: 'cycle',
      headerName: 'Cycle',
      width: 110,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      cellRenderer: StatusCellRenderer,
    },
    {
      field: 'updatedAt',
      headerName: 'Last Updated',
      width: 140,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: 'createdAt',
      headerName: 'Date Created',
      width: 140,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      headerName: 'Actions',
      colId: 'actions',
      width: 100,
      sortable: false,
      filter: false,
      resizable: false,
      cellRendererParams: {
        onEdit: (id: number) => navigate(`/surveys/${id}/edit`),
        onClone: handleClone,
      },
      cellRenderer: ActionsCellRenderer,
    },
  ], [programMap, navigate, handleClone])

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
    if (!gridRef.current?.api) return
    if (status === 'all') {
      gridRef.current.api.setColumnFilterModel('status', null)
        .then(() => gridRef.current!.api.onFilterChanged())
    } else {
      gridRef.current.api.setColumnFilterModel('status', { values: [status] })
        .then(() => gridRef.current!.api.onFilterChanged())
    }
  }, [])

  return (
    <div className="survey-library">
      <Breadcrumb items={[
        { label: 'Surveys', path: '/surveys' },
        { label: 'Survey Library' },
      ]} />

      <h1 className="survey-library__title">Survey library</h1>

      <div className="survey-library__table-card">
        <div className="survey-library__toolbar">
          <div className="survey-library__tabs">
            {Object.entries(statuses).map(([key, label]) => (
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
              <svg className="survey-library__search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M11.5 7a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm-.82 4.74a6 6 0 1 1 1.06-1.06l2.79 2.79a.75.75 0 1 1-1.06 1.06l-2.79-2.79Z" fill="currentColor"/>
              </svg>
              <input
                type="text"
                placeholder="Search surveys..."
                onInput={onFilterTextBoxChanged}
                className="survey-library__search-input"
              />
            </div>

            <Button variant="primary" size="sm" onClick={() => navigate('/surveys/new')}>
              + Create Survey
            </Button>
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: 60, color: '#86868b' }}>Loading surveys...</p>
        ) : (
          <div className="ag-theme-quartz survey-library__grid">
            <AgGridReact
              ref={gridRef}
              rowData={surveys}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              autoSizeStrategy={autoSizeStrategy}

              pagination
              paginationPageSize={10}
              paginationPageSizeSelector={paginationPageSizeSelector}
              quickFilterText={quickFilterText}
              domLayout="autoHeight"
              rowHeight={40}
              getRowId={(params) => String(params.data.surveyId)}
              overlayNoRowsTemplate="<span style='padding:40px;color:#86868b;font-size:14px'>No surveys found</span>"
            />
          </div>
        )}
      </div>
    </div>
  )
}
