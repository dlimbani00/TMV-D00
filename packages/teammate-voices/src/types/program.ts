export type ProgramStatus = 'Active' | 'Inactive'
export type SurveyProgress = 'Not started' | 'In progress' | 'Complete'

export interface Program {
  programId: number
  name: string
  description: string
  templateType?: string
  status: ProgramStatus
  surveyProgress: SurveyProgress
  createdAt: string
  updatedAt: string
}

export const MOCK_PROGRAMS: Program[] = [
  {
    programId: 1,
    name: 'Enterprise 360 2025 - A',
    description: 'Body text lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac dolor hendrerit, efficitur dolor sed, malesuada ex. Cras metus ligula, fermentum eget',
    status: 'Active',
    surveyProgress: 'Not started',
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
  },
  {
    programId: 2,
    name: 'Enterprise 360 2025 - B',
    description: 'Body text lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac dolor hendrerit, efficitur dolor sed, malesuada ex. Cras metus ligula, fermentum eget',
    status: 'Active',
    surveyProgress: 'In progress',
    createdAt: '2025-02-01T00:00:00Z',
    updatedAt: '2025-02-01T00:00:00Z',
  },
]

export const PROGRAM_TEMPLATES = [
  'Teammate Voices',
  'Intern Program',
  'Engagement Survey',
  'NPS Survey',
  'Custom',
] as const
