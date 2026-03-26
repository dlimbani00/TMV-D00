import { useState, useEffect } from 'react'
import { api } from '@/services/api'
import type { SurveyAnalytics } from '@/types/analytics'
import ResponseTimelineChart from './ResponseTimelineChart'
import ScoreDistributionChart from './ScoreDistributionChart'
import CategoryScoresChart from './CategoryScoresChart'
import QuestionRankingsTable from './QuestionRankingsTable'
import OpenEndedResponses from './OpenEndedResponses'

interface Props {
  surveyId: number
}

function getENPSColor(enps: number): string {
  if (enps >= 30) return '#065F46'
  if (enps >= 0) return '#D97706'
  return '#DC2626'
}

function getScoreColor(score: number): string {
  if (score >= 4.0) return '#065F46'
  if (score >= 3.0) return '#D97706'
  return '#DC2626'
}

export default function SurveyAnalyticsDashboard({ surveyId }: Props) {
  const [analytics, setAnalytics] = useState<SurveyAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!surveyId) return
    setLoading(true)
    setError(null)
    api.getSurveyAnalytics(surveyId)
      .then(setAnalytics)
      .catch(err => setError(err.message || 'Failed to load analytics'))
      .finally(() => setLoading(false))
  }, [surveyId])

  if (loading) {
    return <div className="analytics__loading">Loading analytics...</div>
  }

  if (error) {
    return <div className="analytics__error">Error: {error}</div>
  }

  if (!analytics) {
    return <div className="analytics__empty">No analytics data available</div>
  }

  const responseRate = analytics.totalDispatched > 0
    ? Math.round((analytics.totalResponses / analytics.totalDispatched) * 100)
    : 0
  const completionRate = analytics.totalResponses > 0
    ? Math.round((analytics.completedResponses / analytics.totalResponses) * 100)
    : 0

  return (
    <div className="analytics">
      {/* Stat Cards */}
      <div className="analytics__metrics">
        <div className="analytics__metric-card">
          <div className="analytics__metric-icon" style={{ background: '#EFF6FF' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="analytics__metric-info">
            <div className="analytics__metric-value">{responseRate}%</div>
            <div className="analytics__metric-label">Response Rate</div>
            <div className="analytics__metric-detail">{analytics.totalResponses} of {analytics.totalDispatched}</div>
          </div>
        </div>

        <div className="analytics__metric-card">
          <div className="analytics__metric-icon" style={{ background: '#ECFDF5' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="analytics__metric-info">
            <div className="analytics__metric-value">{completionRate}%</div>
            <div className="analytics__metric-label">Completion Rate</div>
            <div className="analytics__metric-detail">{analytics.completedResponses} complete</div>
          </div>
        </div>

        <div className="analytics__metric-card">
          <div className="analytics__metric-icon" style={{ background: '#FEF3C7' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="analytics__metric-info">
            <div className="analytics__metric-value" style={{ color: getScoreColor(analytics.averageScore) }}>
              {analytics.averageScore.toFixed(1)}
            </div>
            <div className="analytics__metric-label">Average Score</div>
            <div className="analytics__metric-detail">out of 5.0</div>
          </div>
        </div>

        <div className="analytics__metric-card">
          <div className="analytics__metric-icon" style={{ background: analytics.enps >= 0 ? '#ECFDF5' : '#FEF2F2' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={getENPSColor(analytics.enps)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div className="analytics__metric-info">
            <div className="analytics__metric-value" style={{ color: getENPSColor(analytics.enps) }}>
              {analytics.enps > 0 ? '+' : ''}{analytics.enps}
            </div>
            <div className="analytics__metric-label">eNPS</div>
            <div className="analytics__metric-detail">Employee Net Promoter</div>
          </div>
        </div>
      </div>

      {/* Charts Row 1: Timeline + Distribution */}
      <div className="analytics__charts-grid">
        <ResponseTimelineChart data={analytics.responseTimeline} />
        <ScoreDistributionChart data={analytics.scoreDistribution} />
      </div>

      {/* Category Scores */}
      <CategoryScoresChart data={analytics.categoryScores} />

      {/* Question Rankings */}
      <QuestionRankingsTable data={analytics.questionRankings} />

      {/* Open-Ended Responses */}
      <OpenEndedResponses data={analytics.openEndedResponses} />
    </div>
  )
}
