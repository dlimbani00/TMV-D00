import type { QuestionRankingItem } from '@/types/analytics'

interface Props {
  data: QuestionRankingItem[]
}

function getScoreColor(score: number): string {
  if (score >= 4.0) return '#065F46'
  if (score >= 3.5) return '#047857'
  if (score >= 3.0) return '#D97706'
  return '#DC2626'
}

export default function QuestionRankingsTable({ data }: Props) {
  if (!data || data.length === 0) {
    return <p style={{ color: '#86868b', textAlign: 'center', padding: 40 }}>No question data</p>
  }

  return (
    <div className="analytics__chart-card analytics__chart-full">
      <h3 className="analytics__chart-title">Question Rankings</h3>
      <p className="analytics__chart-subtitle">All rating questions sorted by average score</p>
      <div className="analytics__rankings-table">
        <table>
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th>Question</th>
              <th style={{ width: 120 }}>Category</th>
              <th style={{ width: 180 }}>Score</th>
              <th style={{ width: 80 }}>Responses</th>
            </tr>
          </thead>
          <tbody>
            {data.map((q, i) => (
              <tr key={q.questionId}>
                <td className="analytics__rank">{i + 1}</td>
                <td className="analytics__question-text">{q.questionText}</td>
                <td>
                  <span className="analytics__category-pill">{q.pageLabel}</span>
                </td>
                <td>
                  <div className="analytics__score-bar-wrapper">
                    <div
                      className="analytics__score-bar-fill"
                      style={{
                        width: `${(q.avgScore / 5) * 100}%`,
                        backgroundColor: getScoreColor(q.avgScore),
                      }}
                    />
                    <span className="analytics__score-value" style={{ color: getScoreColor(q.avgScore) }}>
                      {q.avgScore.toFixed(2)}
                    </span>
                  </div>
                </td>
                <td className="analytics__response-count">{q.responseCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
