import type { Survey } from '@/types/survey'
import type { Program } from '@/types/program'
import type { Participant, AssignmentRule, Dispatch } from '@/types/participant'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api'

class TeammateVoicesAPI {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const config: RequestInit = {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      let errorData: Record<string, unknown> = {}
      try { errorData = await response.json() } catch { /* not JSON */ }
      const message = (errorData.message as string) || `HTTP ${response.status}: ${response.statusText}`
      throw new Error(message)
    }

    if (response.status === 204) return null as T
    return response.json()
  }

  // Surveys
  async getSurveys(): Promise<Survey[]> {
    const surveys = await this.request<Survey[]>('/surveys')
    return surveys.map(this.deserializeSurveyPages)
  }

  async getSurvey(id: number): Promise<Survey> {
    const survey = await this.request<Survey>(`/surveys/${id}`)
    return this.deserializeSurveyPages(survey)
  }

  async createSurvey(survey: Partial<Survey>): Promise<Survey> {
    const result = await this.request<Survey>('/surveys', {
      method: 'POST',
      body: JSON.stringify(this.serializeSurveyPages(survey)),
    })
    return this.deserializeSurveyPages(result)
  }

  async updateSurvey(id: number, survey: Partial<Survey>): Promise<Survey> {
    const result = await this.request<Survey>(`/surveys/${id}`, {
      method: 'PUT',
      body: JSON.stringify(this.serializeSurveyPages(survey)),
    })
    return this.deserializeSurveyPages(result)
  }

  async deleteSurvey(id: number): Promise<void> {
    return this.request<void>(`/surveys/${id}`, { method: 'DELETE' })
  }

  async publishSurvey(id: number): Promise<Survey> {
    return this.request<Survey>(`/surveys/${id}/publish`, { method: 'POST' })
  }

  async cloneSurvey(id: number): Promise<Survey> {
    const result = await this.request<Survey>(`/surveys/${id}/clone`, { method: 'POST' })
    return this.deserializeSurveyPages(result)
  }

  // Programs
  async getPrograms(): Promise<Program[]> {
    return this.request<Program[]>('/programs')
  }

  async getProgram(id: number): Promise<Program> {
    return this.request<Program>(`/programs/${id}`)
  }

  async createProgram(program: Partial<Program>): Promise<Program> {
    return this.request<Program>('/programs', {
      method: 'POST',
      body: JSON.stringify(program),
    })
  }

  async updateProgram(id: number, program: Partial<Program>): Promise<Program> {
    return this.request<Program>(`/programs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(program),
    })
  }

  async deleteProgram(id: number): Promise<void> {
    return this.request<void>(`/programs/${id}`, { method: 'DELETE' })
  }

  // Participants
  async getParticipants(): Promise<Participant[]> {
    return this.request<Participant[]>('/participants')
  }

  async createParticipant(participant: Partial<Participant>): Promise<Participant> {
    return this.request<Participant>('/participants', {
      method: 'POST',
      body: JSON.stringify(participant),
    })
  }

  // Assignment Rules
  async getAssignmentRules(): Promise<AssignmentRule[]> {
    return this.request<AssignmentRule[]>('/assignment-rules')
  }

  async createAssignmentRule(rule: Partial<AssignmentRule>): Promise<AssignmentRule> {
    return this.request<AssignmentRule>('/assignment-rules', {
      method: 'POST',
      body: JSON.stringify(rule),
    })
  }

  async deleteAssignmentRule(id: number): Promise<void> {
    return this.request<void>(`/assignment-rules/${id}`, { method: 'DELETE' })
  }

  // Dispatches
  async getDispatches(): Promise<Dispatch[]> {
    return this.request<Dispatch[]>('/dispatches')
  }

  // pages is stored as a JSON string in the backend but as SurveyPage[] on the frontend
  private serializeSurveyPages(survey: Partial<Survey>): Record<string, unknown> {
    const { pages, ...rest } = survey
    return {
      ...rest,
      pages: pages != null ? JSON.stringify(pages) : null,
    }
  }

  private deserializeSurveyPages(survey: Survey): Survey {
    if (typeof survey.pages === 'string') {
      try {
        return { ...survey, pages: JSON.parse(survey.pages) }
      } catch {
        return { ...survey, pages: [] }
      }
    }
    return survey
  }
}

export const api = new TeammateVoicesAPI()
