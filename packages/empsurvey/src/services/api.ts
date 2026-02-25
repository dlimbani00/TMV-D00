// API Client for Survey Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface SurveyOption {
  optionId?: number;
  optionText: string;
  optionValue: string;
  sortOrder: number;
}

export interface SurveyQuestion {
  questionId?: number;
  questionText: string;
  questionType: string;
  sortOrder: number;
  isRequired: boolean;
  options: SurveyOption[];
}

export type ParticipantType = 'NEW_HIRE' | 'EXISTING_RESOURCE' | 'ALL'
export type SurveyStage = 'ONBOARDING' | 'MID_TRAINING' | 'END_TRAINING'
export type AudienceSource = 'AUTO_API' | 'CSV_UPLOAD' | 'GOOGLE_SHEET'

export interface Survey {
  surveyId?: number;
  title: string;
  description: string;
  templateType: string;
  status: string;
  createdBy?: number | null;
  startDate?: string;
  endDate?: string;
  isAnonymous: boolean;
  participantType?: ParticipantType;
  surveyStage?: SurveyStage;
  audienceSource?: AudienceSource;
  sourceRef?: string;
  autoSend?: boolean;
  questions: SurveyQuestion[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Participant {
  participantId: string;
  fullName: string;
  email: string;
  participantType: Exclude<ParticipantType, 'ALL'>;
  trainingProgram?: string;
  cohort?: string;
  instructorId?: number;
  startDate: string;
  expectedEndDate?: string;
  sourceType?: AudienceSource;
  sourceRef?: string;
}

export interface AssignmentRule {
  ruleId?: number;
  name: string;
  participantType: ParticipantType;
  surveyStage: SurveyStage;
  surveyId: number;
  active: boolean;
  sendDayOffset?: number;
}

class SurveyAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    };

    console.log(`📡 API Request: ${config.method || 'GET'} ${url}`);
    console.log(`   Base URL: ${this.baseUrl}`);

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          // Response is not JSON
        }
        const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        console.error(`❌ API Error: ${errorMessage}`);
        console.error(`   Response Status: ${response.status}`);
        console.error(`   Response Headers:`, response.headers);
        throw new Error(errorMessage);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        console.log(`✅ API Success: ${response.status} (No Content)`);
        return null as T;
      }

      const data = await response.json();
      console.log(`✅ API Success: ${response.status}`, data);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`🔴 API Request FAILED: ${errorMessage}`);
      console.error(`   URL: ${url}`);
      console.error(`   Method: ${config.method || 'GET'}`);
      console.error(`   Error details:`, error);
      
      // Provide helpful diagnostics
      if (errorMessage.includes('Failed to fetch')) {
        console.error(`\n⚠️  CONNECTION ERROR - The API server might not be running!`);
        console.error(`   ✅ Make sure to run: cd packages/empsurvey-api && mvn spring-boot:run`);
        console.error(`   ✅ Check if port 8080 is listening: lsof -i :8080`);
        console.error(`   ✅ API Base URL: ${this.baseUrl}`);
      }
      
      throw error;
    }
  }

  // Get all surveys
  async getAllSurveys(): Promise<Survey[]> {
    return this.request<Survey[]>('/surveys');
  }

  // Get survey by ID
  async getSurveyById(id: number): Promise<Survey> {
    return this.request<Survey>(`/surveys/${id}`);
  }

  // Create new survey
  async createSurvey(survey: Survey): Promise<Survey> {
    return this.request<Survey>('/surveys', {
      method: 'POST',
      body: JSON.stringify(survey),
    });
  }

  // Update existing survey
  async updateSurvey(id: number, survey: Survey): Promise<Survey> {
    return this.request<Survey>(`/surveys/${id}`, {
      method: 'PUT',
      body: JSON.stringify(survey),
    });
  }

  // Delete survey
  async deleteSurvey(id: number): Promise<void> {
    return this.request<void>(`/surveys/${id}`, {
      method: 'DELETE',
    });
  }

  // Publish survey
  async publishSurvey(id: number): Promise<Survey> {
    return this.request<Survey>(`/surveys/${id}/publish`, {
      method: 'POST',
    });
  }

  // Participants (Phase 1 contracts)
  async importParticipantsCsv(fileName: string): Promise<{ imported: number; failed: number }> {
    return this.request<{ imported: number; failed: number }>(`/participants/import/csv?fileName=${encodeURIComponent(fileName)}`, {
      method: 'POST',
    });
  }

  async getParticipants(): Promise<Participant[]> {
    return this.request<Participant[]>('/participants');
  }

  // Assignment rules (Phase 1 contracts)
  async getAssignmentRules(): Promise<AssignmentRule[]> {
    return this.request<AssignmentRule[]>('/assignment-rules');
  }

  async createAssignmentRule(rule: AssignmentRule): Promise<AssignmentRule> {
    return this.request<AssignmentRule>('/assignment-rules', {
      method: 'POST',
      body: JSON.stringify(rule),
    });
  }
}

// Export singleton instance
export const surveyAPI = new SurveyAPI();
