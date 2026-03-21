import { Link } from 'react-router-dom'
import { Card, CardBody } from '@arya/design-system'
import type { Program } from '@/types/program'

interface ProgramCardProps {
  program: Program
}

const PROGRESS_STYLES: Record<string, { bg: string; color: string }> = {
  'Not started': { bg: '#FEE2E2', color: '#991B1B' },
  'In progress': { bg: '#DBEAFE', color: '#1E40AF' },
  'Complete': { bg: '#D1FAE5', color: '#065F46' },
}

export default function ProgramCard({ program }: ProgramCardProps) {
  const progressStyle = PROGRESS_STYLES[program.surveyProgress] || PROGRESS_STYLES['Not started']

  return (
    <Card variant="elevated" padding="md" className="program-card">
      <CardBody>
        <div className="program-card__badges">
          <span className="program-card__badge program-card__badge--status">
            {program.status}
          </span>
          <span
            className="program-card__badge"
            style={{ backgroundColor: progressStyle.bg, color: progressStyle.color }}
          >
            {program.surveyProgress}
          </span>
        </div>

        <h3 className="program-card__title">{program.name}</h3>

        <p className="program-card__description">{program.description}</p>

        <Link to={`/programs/${program.programId}`} className="program-card__link">
          View program details &rsaquo;
        </Link>
      </CardBody>
    </Card>
  )
}
