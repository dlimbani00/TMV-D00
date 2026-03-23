import { useState, useEffect } from 'react'
import { Card, CardBody, Button, Input } from '../design-system'
import { api } from '@/services/api'
import type { Participant } from '@/types/participant'

export default function ParticipantList() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.getParticipants()
      .then(setParticipants)
      .catch(() => setParticipants([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = participants.filter(p =>
    p.fullName.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 34, fontWeight: 700, color: '#1D1D1F', margin: 0, letterSpacing: '-0.02em' }}>
          Participants
        </h1>
        <Button variant="primary">Import CSV</Button>
      </div>

      <div style={{ marginBottom: 20, maxWidth: 320 }}>
        <Input
          placeholder="Search participants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="sm"
          fullWidth
        />
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: 60, color: '#86868B' }}>Loading participants...</p>
      ) : filtered.length === 0 ? (
        <Card variant="elevated" padding="lg">
          <CardBody style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontSize: 17, color: '#86868B', margin: 0 }}>
              {search ? 'No participants match your search' : 'No participants imported yet'}
            </p>
          </CardBody>
        </Card>
      ) : (
        <Card variant="elevated" padding="none">
          <CardBody style={{ padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E5EA' }}>
                  {['Name', 'Email', 'Type', 'Program', 'Cohort', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#86868B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.participantId} style={{ borderBottom: '1px solid #F2F2F7' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: '#1D1D1F' }}>{p.fullName}</td>
                    <td style={{ padding: '12px 16px', color: '#636366' }}>{p.email}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 6, backgroundColor: '#EFF6FF', color: '#1D4ED8' }}>
                        {p.participantType.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#636366' }}>{p.trainingProgram || '\u2014'}</td>
                    <td style={{ padding: '12px 16px', color: '#636366' }}>{p.cohort || '\u2014'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontSize: 12, padding: '2px 8px', borderRadius: 6,
                        backgroundColor: p.isActive ? '#D1FAE5' : '#FEE2E2',
                        color: p.isActive ? '#065F46' : '#991B1B',
                      }}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
