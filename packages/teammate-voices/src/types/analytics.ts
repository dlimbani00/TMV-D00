export interface SurveyAnalytics {
  totalResponses: number
  completedResponses: number
  totalDispatched: number
  averageScore: number
  enps: number
  responseTimeline: TimelinePoint[]
  scoreDistribution: ScoreDistributionItem[]
  categoryScores: CategoryScoreItem[]
  questionRankings: QuestionRankingItem[]
  demographicBreakdown: DemographicItem[]
  openEndedResponses: OpenEndedItem[]
}

export interface TimelinePoint {
  date: string
  count: number
  cumulative: number
}

export interface ScoreDistributionItem {
  score: number
  count: number
}

export interface CategoryScoreItem {
  category: string
  avgScore: number
  questionCount: number
}

export interface QuestionRankingItem {
  questionId: number
  questionText: string
  avgScore: number
  responseCount: number
  pageLabel: string
}

export interface DemographicItem {
  questionId: number
  field: string
  value: string
  count: number
}

export interface OpenEndedItem {
  questionId: number
  questionText: string
  answers: string[]
}
