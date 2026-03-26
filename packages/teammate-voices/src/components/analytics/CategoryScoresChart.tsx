import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { CategoryScoreItem } from '@/types/analytics'

interface Props {
  data: CategoryScoreItem[]
}

function getScoreColor(score: number): string {
  if (score >= 4.0) return '#065F46'
  if (score >= 3.5) return '#047857'
  if (score >= 3.0) return '#D97706'
  return '#DC2626'
}

export default function CategoryScoresChart({ data }: Props) {
  if (!data || data.length === 0) {
    return <p style={{ color: '#86868b', textAlign: 'center', padding: 40 }}>No category data</p>
  }

  return (
    <div className="analytics__chart-card analytics__chart-full">
      <h3 className="analytics__chart-title">Category Scores</h3>
      <p className="analytics__chart-subtitle">Average score by survey section (1-5 scale)</p>
      <div style={{ width: '100%', height: Math.max(200, data.length * 48) }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 40, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" horizontal={false} />
            <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 11, fill: '#6e6e73' }} />
            <YAxis
              type="category"
              dataKey="category"
              tick={{ fontSize: 12, fill: '#1d1d1f' }}
              width={180}
            />
            <Tooltip
              formatter={(value) => [Number(value).toFixed(1), 'Avg Score']}
              labelFormatter={(label) => String(label)}
            />
            <Bar dataKey="avgScore" radius={[0, 4, 4, 0]} barSize={28}>
              {data.map((entry, index) => (
                <Cell key={index} fill={getScoreColor(entry.avgScore)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
