import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../design-system'
import Breadcrumb from '@/components/Breadcrumb'
import ToggleSwitch from '@/components/ToggleSwitch'
import ProgramCard from '@/components/ProgramCard'
import { api } from '@/services/api'
import type { Program } from '@/types/program'

export default function Programs() {
  const [hideInactive, setHideInactive] = useState(false)
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getPrograms()
      .then(setPrograms)
      .catch(err => console.error('Failed to load programs:', err))
      .finally(() => setLoading(false))
  }, [])

  const filteredPrograms = hideInactive
    ? programs.filter(p => p.status === 'Active' || p.status === 'ACTIVE')
    : programs

  return (
    <>
      <Breadcrumb items={[
        { label: 'Survey', path: '/' },
        { label: 'Programs' },
      ]} />

      <h1 className="programs-page__title">Programs</h1>

      <div className="programs-page">
      <div className="programs-page__controls">
        <ToggleSwitch
          label="Hide inactive"
          checked={hideInactive}
          onChange={setHideInactive}
        />
        <Link to="/programs/new" style={{ textDecoration: 'none' }}>
          <Button variant="ghost" size="sm">+ Add program</Button>
        </Link>
      </div>

      <div className="programs-page__grid">
        {loading ? (
          <p>Loading programs...</p>
        ) : filteredPrograms.length === 0 ? (
          <p>No programs found.</p>
        ) : (
          filteredPrograms.map(program => (
            <ProgramCard key={program.programId} program={program} />
          ))
        )}
      </div>
      </div>
    </>
  )
}
