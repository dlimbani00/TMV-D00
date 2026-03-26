import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { TimelinePoint } from '@/types/analytics'

interface Props {
  data: TimelinePoint[]
}

export default function ResponseTimelineChart({ data }: Props) {
  if (!data || data.length === 0) {
    return <p style={{ color: '#86868b', textAlign: 'center', padding: 40 }}>No response data yet</p>
  }

  return (
    <div className="analytics__chart-card">
      <h3 className="analytics__chart-title">Responses Over Time</h3>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#6e6e73' }}
              tickFormatter={(d: string) => {
                const date = new Date(d + 'T00:00:00')
                return `${date.getMonth() + 1}/${date.getDate()}`
              }}
            />
            <YAxis tick={{ fontSize: 11, fill: '#6e6e73' }} allowDecimals={false} />
            <Tooltip
              labelFormatter={(d) => new Date(String(d) + 'T00:00:00').toLocaleDateString()}
              formatter={(value, name) => [String(value), name === 'cumulative' ? 'Total' : 'New']}
            />
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="#012169"
              fill="#012169"
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#4A90D9"
              fill="#4A90D9"
              fillOpacity={0.08}
              strokeWidth={1.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
