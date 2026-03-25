import type { Survey } from '@/types/survey'
import type { Program, ProgramDetail } from '@/types/program'
import type { Participant, AssignmentRule, Dispatch } from '@/types/participant'
import type { LogicRule, LogicEvaluationResult } from '@/types/logic'
import type { EmailTemplate, EmailTemplateAssignment } from '@/types/emailTemplate'

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

  async getProgramDetail(id: number): Promise<ProgramDetail> {
    return this.request<ProgramDetail>(`/programs/${id}/detail`)
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

  async getDispatchesBySurvey(surveyId: number): Promise<Dispatch[]> {
    return this.request<Dispatch[]>(`/dispatches/survey/${surveyId}`)
  }

  async dispatchSurvey(surveyId: number, baseUrl?: string): Promise<{ created: number; emailsSent: number; skipped: number; errors: string[] }> {
    const url = baseUrl || window.location.origin
    return this.request(`/dispatches/survey/${surveyId}/send?baseUrl=${encodeURIComponent(url)}`, {
      method: 'POST',
    })
  }

  // Logic Rules
  async getLogicRules(surveyId: number): Promise<LogicRule[]> {
    return this.request<LogicRule[]>(`/surveys/${surveyId}/logic`)
  }

  async saveLogicRules(surveyId: number, rules: LogicRule[]): Promise<LogicRule[]> {
    return this.request<LogicRule[]>(`/surveys/${surveyId}/logic`, {
      method: 'PUT',
      body: JSON.stringify({ rules }),
    })
  }

  async evaluateLogic(surveyId: number, answers: Record<string, unknown>): Promise<LogicEvaluationResult> {
    return this.request<LogicEvaluationResult>(`/surveys/${surveyId}/evaluate`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    })
  }

  // Email Templates
  async getEmailTemplates(category?: string): Promise<EmailTemplate[]> {
    const query = category ? `?category=${category}` : ''
    return this.request<EmailTemplate[]>(`/email-templates${query}`)
  }

  async getEmailTemplate(id: number): Promise<EmailTemplate> {
    return this.request<EmailTemplate>(`/email-templates/${id}`)
  }

  async createEmailTemplate(template: Partial<EmailTemplate>): Promise<EmailTemplate> {
    return this.request<EmailTemplate>('/email-templates', {
      method: 'POST',
      body: JSON.stringify(template),
    })
  }

  async updateEmailTemplate(id: number, template: Partial<EmailTemplate>): Promise<EmailTemplate> {
    return this.request<EmailTemplate>(`/email-templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(template),
    })
  }

  async deleteEmailTemplate(id: number): Promise<void> {
    return this.request<void>(`/email-templates/${id}`, { method: 'DELETE' })
  }

  async duplicateEmailTemplate(id: number): Promise<EmailTemplate> {
    return this.request<EmailTemplate>(`/email-templates/${id}/duplicate`, { method: 'POST' })
  }

  async getMergeFields(): Promise<Record<string, Array<{ field: string; label: string }>>> {
    return this.request(`/email-templates/merge-fields`)
  }

  // Email Template Assignments
  async getTemplateAssignments(templateId: number): Promise<EmailTemplateAssignment[]> {
    return this.request<EmailTemplateAssignment[]>(`/email-templates/${templateId}/assignments`)
  }

  async saveTemplateAssignment(templateId: number, assignment: Partial<EmailTemplateAssignment>): Promise<EmailTemplateAssignment> {
    return this.request<EmailTemplateAssignment>(`/email-templates/${templateId}/assignments`, {
      method: 'POST',
      body: JSON.stringify(assignment),
    })
  }

  async deleteTemplateAssignment(assignmentId: number): Promise<void> {
    return this.request<void>(`/email-templates/assignments/${assignmentId}`, { method: 'DELETE' })
  }

  async getAssignmentsBySurvey(surveyId: number): Promise<EmailTemplateAssignment[]> {
    return this.request<EmailTemplateAssignment[]>(`/email-templates/by-survey/${surveyId}`)
  }

  async sendTestEmail(templateId: number, email?: string): Promise<{ sent: boolean; to: string; message: string }> {
    return this.request(`/email-templates/${templateId}/send-test`, {
      method: 'POST',
      body: JSON.stringify(email ? { email } : {}),
    })
  }

  async getNotificationConfig(): Promise<{ notificationEmail: string }> {
    return this.request(`/email-templates/config/notification`)
  }

  async validateDispatch(surveyId: number): Promise<{ passed: boolean; checks: Array<{ key: string; label: string; passed: boolean; detail: string }> }> {
    return this.request(`/email-templates/validate-dispatch/${surveyId}`)
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
