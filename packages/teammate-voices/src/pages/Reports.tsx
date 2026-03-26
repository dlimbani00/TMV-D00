import { useState, useEffect } from 'react'
import { Input } from '../design-system'
import Breadcrumb from '@/components/Breadcrumb'
import DataTable from '@/components/DataTable'
import type { Column } from '@/components/DataTable'
import SurveyAnalyticsDashboard from '@/components/analytics/SurveyAnalyticsDashboard'
import TrendView from '@/components/analytics/TrendView'
import TextAnalyticsSection from '@/components/analytics/TextAnalyticsSection'
import { api } from '@/services/api'
import type { Participant } from '@/types/participant'
import type { Survey } from '@/types/survey'

type ReportTab = 'analytics' | 'trends' | 'sentiment' | 'participants'

const StatusBadge = ({ active }: { active: boolean }) => (
  <span className={`reports__badge ${active ? 'reports__badge--active' : 'reports__badge--inactive'}`}>
    {active ? 'Active' : 'Inactive'}
  </span>
)

const TypeBadge = ({ type }: { type: string }) => (
  <span className="reports__badge reports__badge--type">
    {type.replace(/_/g, ' ')}
  </span>
)

const COLUMNS: Column<Participant>[] = [
  { key: 'fullName', label: 'Name', render: (row) => <span className="reports__name">{row.fullName}</span> },
  { key: 'email', label: 'Email' },
  { key: 'participantType', label: 'Type', render: (row) => <TypeBadge type={row.participantType} /> },
  { key: 'trainingProgram', label: 'Program', render: (row) => row.trainingProgram || '\u2014' },
  { key: 'cohort', label: 'Cohort', render: (row) => row.cohort || '\u2014' },
  { key: 'startDate', label: 'Start Date', render: (row) => new Date(row.startDate).toLocaleDateString() },
  { key: 'isActive', label: 'Status', render: (row) => <StatusBadge active={row.isActive} /> },
]

export default function Reports() {
  const [activeTab, setActiveTab] = useState<ReportTab>('analytics')
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null)

  // Participant tab state
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loadingParticipants, setLoadingParticipants] = useState(false)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Load surveys for the analytics selector
  useEffect(() => {
    api.getSurveys()
      .then(data => {
        // Sort: ACTIVE first, then by lowest ID (oldest/seeded surveys have data)
        const sorted = [...data].sort((a, b) => {
          if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') return -1
          if (a.status !== 'ACTIVE' && b.status === 'ACTIVE') return 1
          return (a.surveyId || 0) - (b.surveyId || 0)
        })
        setSurveys(sorted)
        if (sorted.length > 0 && sorted[0].surveyId) {
          setSelectedSurveyId(sorted[0].surveyId)
        }
      })
      .catch(() => setSurveys([]))
  }, [])

  // Load participants when tab switches
  useEffect(() => {
    if (activeTab !== 'participants') return
    if (participants.length > 0) return
    setLoadingParticipants(true)
    api.getParticipants()
      .then(setParticipants)
      .catch(() => setParticipants([]))
      .finally(() => setLoadingParticipants(false))
  }, [activeTab])

  const filtered = participants.filter(p => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
    const matchesType = filterType === 'all' || p.participantType === filterType
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && p.isActive) ||
      (filterStatus === 'inactive' && !p.isActive)
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Reports' }]} />

      <div className="reports">
        <div className="reports__header">
          <h1 className="reports__title">Reports</h1>
        </div>

        {/* Tab bar */}
        <div className="reports__tab-bar">
          <div className="reports__tabs">
            <button
              className={`reports__tab${activeTab === 'analytics' ? ' reports__tab--active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              Survey Analytics
            </button>
            <button
              className={`reports__tab${activeTab === 'trends' ? ' reports__tab--active' : ''}`}
              onClick={() => setActiveTab('trends')}
            >
              Trends
            </button>
            <button
              className={`reports__tab${activeTab === 'sentiment' ? ' reports__tab--active' : ''}`}
              onClick={() => setActiveTab('sentiment')}
            >
              Sentiment
            </button>
            <button
              className={`reports__tab${activeTab === 'participants' ? ' reports__tab--active' : ''}`}
              onClick={() => setActiveTab('participants')}
            >
              Participants
            </button>
          </div>

          {/* Survey selector (for analytics and sentiment tabs) */}
          {(activeTab === 'analytics' || activeTab === 'sentiment') && (
            <select
              className="reports__survey-selector"
              value={selectedSurveyId || ''}
              onChange={e => setSelectedSurveyId(Number(e.target.value))}
            >
              <option value="" disabled>Select a survey</option>
              {surveys.map(s => (
                <option key={s.surveyId} value={s.surveyId}>
                  {s.title} ({s.status})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Analytics tab */}
        {activeTab === 'analytics' && (
          selectedSurveyId ? (
            <SurveyAnalyticsDashboard surveyId={selectedSurveyId} />
          ) : (
            <div style={{ textAlign: 'center', padding: 60, color: '#86868b' }}>
              <p>Select a survey above to view analytics</p>
            </div>
          )
        )}

        {/* Trends tab */}
        {activeTab === 'trends' && (
          <TrendView surveys={surveys} />
        )}

        {/* Sentiment tab */}
        {activeTab === 'sentiment' && (
          selectedSurveyId ? (
            <TextAnalyticsSection surveyId={selectedSurveyId} />
          ) : (
            <div style={{ textAlign: 'center', padding: 60, color: '#86868b' }}>
              <p>Select a survey above to view sentiment analysis</p>
            </div>
          )
        )}

        {/* Participants tab */}
        {activeTab === 'participants' && (
          <>
            <div className="reports__grid-section">
              <div className="reports__grid-header">
                <h2 className="reports__grid-title">Participants</h2>
              </div>

              <div className="reports__filters">
                <div className="reports__search">
                  <Input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="sm"
                    fullWidth
                  />
                </div>
                <select
                  className="reports__filter-select"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="NEW_HIRE">New Hire</option>
                  <option value="EXISTING_RESOURCE">Existing Resource</option>
                </select>
                <select
                  className="reports__filter-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {loadingParticipants ? (
                <div className="reports__loading"><p>Loading participant data...</p></div>
              ) : (
                <DataTable
                  columns={COLUMNS}
                  data={filtered}
                  emptyMessage={search || filterType !== 'all' || filterStatus !== 'all'
                    ? 'No participants match your filters'
                    : 'No participants found'}
                  rowKey={(row) => row.participantId}
                />
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
