import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { ScoreDistributionItem } from '@/types/analytics'

interface Props {
  data: ScoreDistributionItem[]
}

const LABELS: Record<number, string> = {
  1: 'Strongly Disagree',
  2: 'Disagree',
  3: 'Neutral',
  4: 'Agree',
  5: 'Strongly Agree',
}

const COLORS: Record<number, string> = {
  1: '#DC2626',
  2: '#F59E0B',
  3: '#9CA3AF',
  4: '#3B82F6',
  5: '#065F46',
}

export default function ScoreDistributionChart({ data }: Props) {
  if (!data || data.length === 0) {
    return <p style={{ color: '#86868b', textAlign: 'center', padding: 40 }}>No score data</p>
  }

  return (
    <div className="analytics__chart-card">
      <h3 className="analytics__chart-title">Score Distribution</h3>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
            <XAxis
              dataKey="score"
              tick={{ fontSize: 11, fill: '#6e6e73' }}
              tickFormatter={(s: number) => LABELS[s] || String(s)}
            />
            <YAxis tick={{ fontSize: 11, fill: '#6e6e73' }} allowDecimals={false} />
            <Tooltip
              formatter={(value) => [String(value), 'Responses']}
              labelFormatter={(s) => `Score ${s}: ${LABELS[Number(s)] || s}`}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={48}>
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[entry.score] || '#6e6e73'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
