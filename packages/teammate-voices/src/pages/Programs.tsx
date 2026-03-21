import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@arya/design-system'
import Breadcrumb from '@/components/Breadcrumb'
import ToggleSwitch from '@/components/ToggleSwitch'
import ProgramCard from '@/components/ProgramCard'
import { MOCK_PROGRAMS } from '@/types/program'

export default function Programs() {
  const [hideInactive, setHideInactive] = useState(false)

  const filteredPrograms = hideInactive
    ? MOCK_PROGRAMS.filter(p => p.status === 'Active')
    : MOCK_PROGRAMS

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
        {filteredPrograms.map(program => (
          <ProgramCard key={program.programId} program={program} />
        ))}
      </div>
      </div>
    </>
  )
}
