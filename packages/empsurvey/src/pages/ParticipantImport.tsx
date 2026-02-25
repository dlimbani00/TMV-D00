import { useState } from 'react'
import { surveyAPI } from '../services/api'

export default function ParticipantImport() {
  const [fileName, setFileName] = useState('participants.csv')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleImport = async () => {
    try {
      setLoading(true)
      setMessage(null)
      const res = await surveyAPI.importParticipantsCsv(fileName)
      setMessage(`Imported ${res.imported}, failed ${res.failed}`)
    } catch (e) {
      setMessage(`Import failed: ${e instanceof Error ? e.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Participant Import (Phase 2)</h2>
      <p>Import roster for lifecycle automation.</p>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <input value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="participants.csv" />
        <button onClick={handleImport} disabled={loading}>{loading ? 'Importing...' : 'Import CSV'}</button>
      </div>
      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </div>
  )
}
