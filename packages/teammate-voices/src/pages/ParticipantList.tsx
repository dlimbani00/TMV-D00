import { useState, useEffect, useRef } from 'react'
import { Card, CardBody, Button, Input } from '../design-system'
import { api } from '@/services/api'
import type { Participant } from '@/types/participant'

interface ImportResult {
  totalRows: number
  created: number
  updated: number
  skipped: number
  errors: string[]
}

export default function ParticipantList() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadParticipants = () => {
    setLoading(true)
    api.getParticipants()
      .then(setParticipants)
      .catch(() => setParticipants([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadParticipants() }, [])

  const filtered = participants.filter(p =>
    p.fullName.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleImportClick = () => {
    setImportResult(null)
    setImportError(null)
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.endsWith('.xlsx')) {
      setImportError('Only .xlsx files are supported. Please upload an Excel spreadsheet.')
      e.target.value = ''
      return
    }
    setImporting(true)
    setImportResult(null)
    setImportError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const token = localStorage.getItem('tv_token')
      const res = await fetch('/api/participants/import', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      })
      if (!res.ok) {
        const msg = await res.text()
        setImportError(msg || 'Import failed')
      } else {
        const result: ImportResult = await res.json()
        setImportResult(result)
        loadParticipants()
      }
    } catch {
      setImportError('Network error — could not reach the server')
    } finally {
      setImporting(false)
      e.target.value = ''
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 34, fontWeight: 700, color: '#1D1D1F', margin: 0, letterSpacing: '-0.02em' }}>
          Participants
        </h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Button variant="primary" onClick={handleImportClick} disabled={importing}>
            {importing ? 'Importing...' : 'Import Excel (.xlsx)'}
          </Button>
        </div>
      </div>

      {/* Import result banner */}
      {importResult && (
        <div style={{
          marginBottom: 20, padding: '16px 20px', borderRadius: 12,
          backgroundColor: importResult.skipped > 0 ? '#FFFBEB' : '#F0FDF4',
          border: `1px solid ${importResult.skipped > 0 ? '#FCD34D' : '#86EFAC'}`,
        }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, color: '#1D1D1F' }}>
            Import complete — {importResult.totalRows} rows processed
          </div>
          <div style={{ fontSize: 14, color: '#636366', display: 'flex', gap: 20 }}>
            <span style={{ color: '#065F46' }}>✓ {importResult.created} created</span>
            <span style={{ color: '#1D4ED8' }}>↑ {importResult.updated} updated</span>
            {importResult.skipped > 0 && <span style={{ color: '#92400E' }}>⚠ {importResult.skipped} skipped</span>}
          </div>
          {importResult.errors.length > 0 && (
            <ul style={{ marginTop: 10, paddingLeft: 20, fontSize: 13, color: '#92400E' }}>
              {importResult.errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          )}
          <button onClick={() => setImportResult(null)} style={{ marginTop: 8, fontSize: 12, color: '#86868B', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            Dismiss
          </button>
        </div>
      )}

      {/* Import error banner */}
      {importError && (
        <div style={{
          marginBottom: 20, padding: '14px 20px', borderRadius: 12,
          backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
          fontSize: 14, color: '#991B1B', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>{importError}</span>
          <button onClick={() => setImportError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991B1B', fontSize: 16, padding: '0 4px' }}>✕</button>
        </div>
      )}

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
            {!search && (
              <p style={{ fontSize: 14, color: '#AEAEB2', marginTop: 8 }}>
                Use the "Import Excel (.xlsx)" button to bulk-load participants from a spreadsheet.
              </p>
            )}
          </CardBody>
        </Card>
      ) : (
        <Card variant="elevated" padding="none">
          <CardBody style={{ padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E5EA' }}>
                  {['Name', 'Email', 'Type', 'Program', 'Cohort', 'Region', 'Line of Business', 'Status'].map(h => (
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
                    <td style={{ padding: '12px 16px', color: '#636366' }}>{p.region || '\u2014'}</td>
                    <td style={{ padding: '12px 16px', color: '#636366' }}>{p.lineOfBusiness || '\u2014'}</td>
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
