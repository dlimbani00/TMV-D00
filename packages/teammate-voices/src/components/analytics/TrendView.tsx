import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { Survey } from '@/types/survey'

interface TrendData {
  current: { surveyId: number; title: string; cycle: string; totalResponses: number; averageScore: number; enps: number; responseRate: number } | null
  previous: { surveyId: number; title: string; cycle: string; totalResponses: number; averageScore: number; enps: number; responseRate: number } | null
  trendLine: { label: string; avgScore: number; enps: number; responses: number }[]
}

interface Props {
  surveys: Survey[]
}

function getDeltaColor(delta: number): string {
  if (delta > 0) return '#065F46'
  if (delta < 0) return '#DC2626'
  return '#6e6e73'
}

function DeltaArrow({ value }: { value: number }) {
  if (value === 0) return <span style={{ color: '#6e6e73' }}>—</span>
  return (
    <span style={{ color: getDeltaColor(value), fontWeight: 600 }}>
      {value > 0 ? '▲' : '▼'} {Math.abs(value).toFixed(1)}
    </span>
  )
}

export default function TrendView({ surveys }: Props) {
  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null)
  const [compareWithId, setCompareWithId] = useState<number | null>(null)
  const [trend, setTrend] = useState<TrendData | null>(null)
  const [loading, setLoading] = useState(false)

  // Auto-select first survey
  useEffect(() => {
    if (!selectedSurveyId && surveys.length > 0 && surveys[0].surveyId) {
      setSelectedSurveyId(surveys[0].surveyId)
    }
  }, [surveys])

  useEffect(() => {
    if (!selectedSurveyId) return
    setLoading(true)
    const url = compareWithId
      ? `/surveys/${selectedSurveyId}/trends?compareWith=${compareWithId}`
      : `/surveys/${selectedSurveyId}/trends`

    fetch(`http://localhost:8081/api${url}`)
      .then(r => r.json())
      .then(setTrend)
      .catch(() => setTrend(null))
      .finally(() => setLoading(false))
  }, [selectedSurveyId, compareWithId])

  return (
    <div className="analytics" style={{ gap: 20 }}>
      {/* Survey selectors */}
      <div className="analytics__filters">
        <span className="analytics__filters-label">Compare:</span>
        <select
          className="analytics__filter-select"
          style={{ minWidth: 200 }}
          value={selectedSurveyId || ''}
          onChange={e => setSelectedSurveyId(Number(e.target.value))}
        >
          <option value="">Select survey</option>
          {surveys.map(s => (
            <option key={s.surveyId} value={s.surveyId}>{s.title} ({s.cycle || s.status})</option>
          ))}
        </select>
        <span className="analytics__filters-label">vs</span>
        <select
          className="analytics__filter-select"
          style={{ minWidth: 200 }}
          value={compareWithId || ''}
          onChange={e => setCompareWithId(Number(e.target.value) || null)}
        >
          <option value="">Program trend (all)</option>
          {surveys.filter(s => s.surveyId !== selectedSurveyId).map(s => (
            <option key={s.surveyId} value={s.surveyId}>{s.title} ({s.cycle || s.status})</option>
          ))}
        </select>
      </div>

      {loading && <div className="analytics__loading">Loading trend data...</div>}

      {!loading && !trend && selectedSurveyId && (
        <div className="analytics__empty">No trend data available</div>
      )}

      {!loading && !selectedSurveyId && (
        <div className="analytics__empty">Select a survey above to view trends</div>
      )}

      {/* Side-by-side comparison */}
      {trend && trend.current && trend.previous && trend.current.surveyId !== trend.previous.surveyId && (
        <div className="analytics__charts-grid">
          <div className="analytics__chart-card">
            <h3 className="analytics__chart-title">{trend.current.title}</h3>
            <p className="analytics__chart-subtitle">{trend.current.cycle || 'Current'}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
              <div><span style={{ fontSize: 24, fontWeight: 700 }}>{trend.current.averageScore.toFixed(1)}</span><br/><span style={{ fontSize: 12, color: '#86868b' }}>Avg Score</span></div>
              <div><span style={{ fontSize: 24, fontWeight: 700 }}>{trend.current.enps > 0 ? '+' : ''}{trend.current.enps}</span><br/><span style={{ fontSize: 12, color: '#86868b' }}>eNPS</span></div>
              <div><span style={{ fontSize: 24, fontWeight: 700 }}>{trend.current.totalResponses}</span><br/><span style={{ fontSize: 12, color: '#86868b' }}>Responses</span></div>
              <div><span style={{ fontSize: 24, fontWeight: 700 }}>{trend.current.responseRate}%</span><br/><span style={{ fontSize: 12, color: '#86868b' }}>Response Rate</span></div>
            </div>
          </div>
          <div className="analytics__chart-card">
            <h3 className="analytics__chart-title">Change</h3>
            <p className="analytics__chart-subtitle">vs {trend.previous.title}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
              <div><DeltaArrow value={trend.current.averageScore - trend.previous.averageScore} /><br/><span style={{ fontSize: 12, color: '#86868b' }}>Avg Score</span></div>
              <div><DeltaArrow value={trend.current.enps - trend.previous.enps} /><br/><span style={{ fontSize: 12, color: '#86868b' }}>eNPS</span></div>
              <div><DeltaArrow value={trend.current.totalResponses - trend.previous.totalResponses} /><br/><span style={{ fontSize: 12, color: '#86868b' }}>Responses</span></div>
              <div><DeltaArrow value={trend.current.responseRate - trend.previous.responseRate} /><br/><span style={{ fontSize: 12, color: '#86868b' }}>Response Rate</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Trend line chart */}
      {trend && trend.trendLine && trend.trendLine.length > 0 && (
        <div className="analytics__chart-card analytics__chart-full">
          <h3 className="analytics__chart-title">Score Trend</h3>
          <p className="analytics__chart-subtitle">Average score across survey cycles</p>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={trend.trendLine} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6e6e73' }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: '#6e6e73' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avgScore" stroke="#012169" strokeWidth={2} name="Avg Score" dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
