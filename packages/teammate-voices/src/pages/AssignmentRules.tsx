import { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody, CardFooter, Button } from '../design-system'
import { api } from '@/services/api'
import type { AssignmentRule } from '@/types/participant'

export default function AssignmentRules() {
  const [rules, setRules] = useState<AssignmentRule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getAssignmentRules()
      .then(setRules)
      .catch(() => setRules([]))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this rule?')) return
    try {
      await api.deleteAssignmentRule(id)
      setRules(prev => prev.filter(r => r.ruleId !== id))
    } catch {
      alert('Failed to delete rule')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 34, fontWeight: 700, color: '#1D1D1F', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            Assignment Rules
          </h1>
          <p style={{ fontSize: 15, color: '#86868B', margin: 0 }}>
            Configure which surveys are sent at each lifecycle stage
          </p>
        </div>
        <Button variant="primary">Add Rule</Button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: 60, color: '#86868B' }}>Loading rules...</p>
      ) : rules.length === 0 ? (
        <Card variant="elevated" padding="lg">
          <CardBody style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontSize: 17, color: '#86868B', margin: '0 0 8px' }}>No assignment rules configured</p>
            <p style={{ fontSize: 14, color: '#AEAEB2', margin: 0 }}>
              Rules determine which surveys are automatically sent during onboarding, mid-training, and end-training stages.
            </p>
          </CardBody>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {rules.map(rule => (
            <Card key={rule.ruleId} variant="elevated" padding="none">
              <CardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px 6px' }}>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: '#1D1D1F', margin: 0 }}>{rule.ruleName}</h3>
                <span style={{
                  fontSize: 12, padding: '2px 8px', borderRadius: 6,
                  backgroundColor: rule.isActive ? '#D1FAE5' : '#F2F2F7',
                  color: rule.isActive ? '#065F46' : '#8E8E93',
                  fontWeight: 600,
                }}>
                  {rule.isActive ? 'Active' : 'Inactive'}
                </span>
              </CardHeader>
              <CardBody style={{ padding: '6px 20px 8px' }}>
                <div style={{ display: 'flex', gap: 16, fontSize: 14, color: '#636366' }}>
                  <span>Type: <strong>{rule.participantType.replace(/_/g, ' ')}</strong></span>
                  <span>Stage: <strong>{rule.surveyStage.replace(/_/g, ' ')}</strong></span>
                  {rule.sendDayOffset != null && <span>Day offset: <strong>{rule.sendDayOffset}</strong></span>}
                </div>
              </CardBody>
              <CardFooter style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '8px 20px 14px' }}>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(rule.ruleId)}>Delete</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
