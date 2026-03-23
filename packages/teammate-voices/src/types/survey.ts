export interface Survey {
  surveyId: number
  title: string
  description: string
  templateType: 'CUSTOM' | 'TEAM_MATE_VOICES' | 'ENGAGEMENT' | 'NPS'
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED'
  buildStatus?: 'DRAFT' | 'PUBLISHED'
  programId?: number
  cycle?: string
  participantType: 'NEW_HIRE' | 'EXISTING_RESOURCE' | 'ALL'
  surveyStage: 'ONBOARDING' | 'MID_TRAINING' | 'END_TRAINING'
  audienceSource: 'AUTO_API' | 'CSV_UPLOAD' | 'GOOGLE_SHEET'
  autoSend: boolean
  createdBy: number | null
  startDate: string | null
  endDate: string | null
  isAnonymous: boolean
  createdAt: string
  updatedAt: string
  questions?: SurveyQuestion[]
  pages?: SurveyPage[]
}

export interface SurveyPage {
  pageId: string
  title: string
  label: string
  description: string
  showDescription: boolean
  sortOrder: number
  questions: SurveyQuestion[]
}

export type SurveyTab = 'details' | 'formBuilder' | 'formViewer' | 'configuration' | 'settings'

export const SURVEY_TABS: Array<{ key: SurveyTab; label: string }> = [
  { key: 'details', label: 'Details' },
  { key: 'formBuilder', label: 'Form Builder' },
  { key: 'formViewer', label: 'Form Viewer' },
  { key: 'configuration', label: 'Configuration' },
  { key: 'settings', label: 'Settings' },
]

export interface SurveyQuestion {
  questionId?: number
  questionText: string
  questionType: string
  questionLabel?: string
  questionDescription?: string
  showDescription?: boolean
  secondaryType?: string
  sortOrder: number
  isRequired: boolean
  options?: SurveyOption[]
}

export const QUESTION_TYPES = [
  'Checkboxes',
  'Grid Rating Scale',
  'Multiselect',
  'Radio Buttons',
  'Rating Scale',
  'Single Select',
  'Single-line Input',
  'Sliding Scale',
  'Static Text',
  'Text Area',
] as const

export interface SurveyOption {
  optionId?: number
  optionText: string
  optionValue: number
  sortOrder: number
}

export const TEAM_MATE_VOICES_QUESTIONS: Array<{ question: string; type: SurveyQuestion['questionType'] }> = [
  { question: 'I feel valued and appreciated at work', type: 'RATING_SCALE' },
  { question: 'My manager provides clear direction and support', type: 'RATING_SCALE' },
  { question: 'I have the tools and resources I need to do my job effectively', type: 'RATING_SCALE' },
  { question: 'I feel a sense of belonging in my team', type: 'RATING_SCALE' },
  { question: 'My work-life balance is healthy', type: 'RATING_SCALE' },
  { question: 'I see opportunities for growth and development', type: 'RATING_SCALE' },
  { question: 'Communication within my team is open and honest', type: 'RATING_SCALE' },
  { question: 'I would recommend this company as a great place to work', type: 'RATING_SCALE' },
  { question: 'What is the biggest challenge you face in your role?', type: 'TEXT' },
  { question: 'What could we improve most in our workplace culture?', type: 'TEXT' },
]

export const RATING_SCALE_OPTIONS = [
  { value: 1, text: 'Strongly Disagree' },
  { value: 2, text: 'Disagree' },
  { value: 3, text: 'Neutral' },
  { value: 4, text: 'Agree' },
  { value: 5, text: 'Strongly Agree' },
]
