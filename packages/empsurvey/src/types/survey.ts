// Survey Types
export interface Survey {
  surveyId: number
  title: string
  description: string
  templateType: 'CUSTOM' | 'TEAM_MATE_VOICES' | 'ENGAGEMENT' | 'NPS'
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED'
  createdBy: number
  createdAt: string
  updatedAt: string
  startDate: string | null
  endDate: string | null
  isAnonymous: boolean
  participantType?: 'NEW_HIRE' | 'EXISTING_RESOURCE' | 'ALL'
  surveyStage?: 'ONBOARDING' | 'MID_TRAINING' | 'END_TRAINING'
  audienceSource?: 'AUTO_API' | 'CSV_UPLOAD' | 'GOOGLE_SHEET'
  sourceRef?: string
  autoSend?: boolean
  questions?: SurveyQuestion[]
}

export interface SurveyQuestion {
  questionId: number | string
  surveyId: number
  questionText: string
  questionType: 'RATING_SCALE' | 'MULTIPLE_CHOICE' | 'TEXT' | 'MATRIX'
  sortOrder: number
  isRequired: boolean
  createdAt: string
  updatedAt: string
  options?: SurveyOption[]
}

export interface SurveyOption {
  optionId: number | string
  questionId: number | string
  optionText: string
  optionValue: number
  sortOrder: number
  createdAt: string
}

export interface SurveyResponse {
  responseId: number
  surveyId: number
  respondentUserId: number | null
  submittedAt: string | null
  startedAt: string
  createdAt: string
  answers?: SurveyAnswer[]
}

export interface SurveyAnswer {
  answerId: number
  responseId: number
  questionId: number
  answerText: string | null
  answerValue: number | null
  createdAt: string
}

// Team Mate Voices Template Questions
export const TEAM_MATE_VOICES_QUESTIONS = [
  {
    question: 'I feel valued and appreciated at work',
    type: 'RATING_SCALE' as const,
  },
  {
    question: 'My manager provides clear direction and support',
    type: 'RATING_SCALE' as const,
  },
  {
    question: 'I have the tools and resources I need to do my job effectively',
    type: 'RATING_SCALE' as const,
  },
  {
    question: 'I feel a sense of belonging in my team',
    type: 'RATING_SCALE' as const,
  },
  {
    question: 'My work-life balance is healthy',
    type: 'RATING_SCALE' as const,
  },
  {
    question: 'I see opportunities for growth and development',
    type: 'RATING_SCALE' as const,
  },
  {
    question: 'Communication within my team is open and honest',
    type: 'RATING_SCALE' as const,
  },
  {
    question: 'I would recommend this company as a great place to work',
    type: 'RATING_SCALE' as const,
  },
  {
    question: 'What is the biggest challenge you face in your role?',
    type: 'TEXT' as const,
  },
  {
    question: 'What could we improve most in our workplace culture?',
    type: 'TEXT' as const,
  },
]

export const RATING_SCALE_OPTIONS = [
  { value: 1, text: 'Strongly Disagree' },
  { value: 2, text: 'Disagree' },
  { value: 3, text: 'Neutral' },
  { value: 4, text: 'Agree' },
  { value: 5, text: 'Strongly Agree' },
]
