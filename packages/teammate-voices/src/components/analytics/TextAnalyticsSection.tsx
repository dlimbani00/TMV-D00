import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface TextAnalytics {
  sentimentDistribution: { positive: number; neutral: number; negative: number; total: number }
  topKeywords: { word: string; count: number; sentiment: number }[]
  questionSentiments: {
    questionId: number; questionText: string; totalAnswers: number
    positive: number; neutral: number; negative: number; avgSentiment: number
    answers: { text: string; score: number; label: string }[]
  }[]
}

interface Props {
  surveyId: number
}

const SENTIMENT_COLORS = { positive: '#065F46', neutral: '#9CA3AF', negative: '#DC2626' }

function SentimentPill({ label }: { label: string }) {
  const color = SENTIMENT_COLORS[label as keyof typeof SENTIMENT_COLORS] || '#6e6e73'
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 11,
      fontWeight: 500, color: 'white', background: color
    }}>
      {label}
    </span>
  )
}

export default function TextAnalyticsSection({ surveyId }: Props) {
  const [data, setData] = useState<TextAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedQ, setExpandedQ] = useState<Set<number>>(new Set())

  useEffect(() => {
    setLoading(true)
    fetch(`http://localhost:8081/api/surveys/${surveyId}/text-analytics`)
      .then(r => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [surveyId])

  if (loading) return <div className="analytics__loading">Analyzing text responses...</div>
  if (!data) return null

  const pieData = [
    { name: 'Positive', value: data.sentimentDistribution.positive, color: SENTIMENT_COLORS.positive },
    { name: 'Neutral', value: data.sentimentDistribution.neutral, color: SENTIMENT_COLORS.neutral },
    { name: 'Negative', value: data.sentimentDistribution.negative, color: SENTIMENT_COLORS.negative },
  ].filter(d => d.value > 0)

  const toggleQuestion = (qId: number) => {
    setExpandedQ(prev => {
      const next = new Set(prev)
      if (next.has(qId)) next.delete(qId)
      else next.add(qId)
      return next
    })
  }

  return (
    <>
      {/* Sentiment Overview + Word Cloud */}
      <div className="analytics__charts-grid">
        {/* Sentiment Pie Chart */}
        <div className="analytics__chart-card">
          <h3 className="analytics__chart-title">Sentiment Distribution</h3>
          <p className="analytics__chart-subtitle">{data.sentimentDistribution.total} open-ended responses analyzed</p>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [String(value), 'Responses']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Word Cloud */}
        <div className="analytics__chart-card">
          <h3 className="analytics__chart-title">Top Keywords</h3>
          <p className="analytics__chart-subtitle">Most frequent words in open-ended responses</p>
          <div className="analytics__word-cloud">
            {data.topKeywords.map(kw => {
              const size = Math.max(12, Math.min(32, 12 + kw.count * 2))
              const color = kw.sentiment > 0.3 ? '#065F46'
                : kw.sentiment < -0.3 ? '#DC2626' : '#1d1d1f'
              return (
                <span
                  key={kw.word}
                  className="analytics__word-cloud-item"
                  style={{ fontSize: size, color, fontWeight: kw.count > 5 ? 600 : 400 }}
                  title={`${kw.word}: ${kw.count} mentions (sentiment: ${kw.sentiment.toFixed(1)})`}
                >
                  {kw.word}
                </span>
              )
            })}
          </div>
        </div>
      </div>

      {/* Per-Question Sentiment with Expandable Answers */}
      <div className="analytics__chart-card analytics__chart-full">
        <h3 className="analytics__chart-title">Sentiment by Question</h3>
        <p className="analytics__chart-subtitle">Click a question to see individual answer sentiments</p>
        <div className="analytics__open-ended">
          {data.questionSentiments.map(qs => {
            const isOpen = expandedQ.has(qs.questionId)
            return (
              <div key={qs.questionId} className="analytics__oe-group">
                <button
                  className={`analytics__oe-header${isOpen ? ' analytics__oe-header--open' : ''}`}
                  onClick={() => toggleQuestion(qs.questionId)}
                >
                  <span className="analytics__oe-chevron">{isOpen ? '▼' : '▶'}</span>
                  <span className="analytics__oe-question">{qs.questionText}</span>
                  <span style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#065F46', fontSize: 12, fontWeight: 600 }}>+{qs.positive}</span>
                    <span style={{ color: '#9CA3AF', fontSize: 12 }}>{qs.neutral}</span>
                    <span style={{ color: '#DC2626', fontSize: 12, fontWeight: 600 }}>-{qs.negative}</span>
                  </span>
                </button>
                {isOpen && (
                  <ul className="analytics__oe-answers">
                    {qs.answers.map((ans, i) => (
                      <li key={i} className="analytics__oe-answer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                        <span>{ans.text}</span>
                        <SentimentPill label={ans.label} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
