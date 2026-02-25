import { useEffect, useState } from 'react'
import { surveyAPI, AssignmentRule, ParticipantType, SurveyStage } from '../services/api'

const defaultRule: AssignmentRule = {
  name: '',
  participantType: 'ALL',
  surveyStage: 'ONBOARDING',
  surveyId: 0,
  active: true,
  sendDayOffset: 0,
}

export default function AssignmentRules() {
  const [rules, setRules] = useState<AssignmentRule[]>([])
  const [form, setForm] = useState<AssignmentRule>(defaultRule)
  const [msg, setMsg] = useState<string | null>(null)

  const load = async () => {
    try {
      const data = await surveyAPI.getAssignmentRules()
      setRules(data)
    } catch {
      setRules([])
    }
  }

  useEffect(() => {
    load()
  }, [])

  const save = async () => {
    try {
      await surveyAPI.createAssignmentRule(form)
      setMsg('Rule saved')
      setForm(defaultRule)
      load()
    } catch (e) {
      setMsg(`Save failed: ${e instanceof Error ? e.message : 'Unknown error'}`)
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Lifecycle Assignment Rules (Phase 2)</h2>
      <div style={{ display: 'grid', gap: 8, maxWidth: 520 }}>
        <input placeholder="Rule name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <select value={form.participantType} onChange={(e) => setForm({ ...form, participantType: e.target.value as ParticipantType })}>
          <option value="ALL">ALL</option>
          <option value="NEW_HIRE">NEW_HIRE</option>
          <option value="EXISTING_RESOURCE">EXISTING_RESOURCE</option>
        </select>
        <select value={form.surveyStage} onChange={(e) => setForm({ ...form, surveyStage: e.target.value as SurveyStage })}>
          <option value="ONBOARDING">ONBOARDING</option>
          <option value="MID_TRAINING">MID_TRAINING</option>
          <option value="END_TRAINING">END_TRAINING</option>
        </select>
        <input type="number" placeholder="Survey ID" value={form.surveyId || ''} onChange={(e) => setForm({ ...form, surveyId: Number(e.target.value) })} />
        <input type="number" placeholder="Send day offset" value={form.sendDayOffset || 0} onChange={(e) => setForm({ ...form, sendDayOffset: Number(e.target.value) })} />
        <label><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
        <button onClick={save}>Save Rule</button>
      </div>
      {msg && <p>{msg}</p>}

      <h3 style={{ marginTop: 24 }}>Existing Rules</h3>
      <ul>
        {rules.map((r) => (
          <li key={r.ruleId ?? `${r.name}-${r.surveyId}`}>{r.name} · {r.participantType} · {r.surveyStage} · Survey {r.surveyId}</li>
        ))}
      </ul>
    </div>
  )
}
