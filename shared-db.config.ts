/**
 * Shared Database Configuration
 * Used by both ARYA Design System and EMPSurvey applications
 */

export const dbConfig = {
  // Oracle Database Connection
  host: process.env.VITE_DB_HOST || 'localhost',
  port: parseInt(process.env.VITE_DB_PORT || '1521'),
  serviceName: process.env.VITE_DB_SERVICE || 'FREEPDB1',
  username: process.env.VITE_DB_USER || 'arya',
  // Note: Never commit passwords. Use environment variables
  
  // API Endpoint (when backend is set up)
  apiBaseUrl: process.env.VITE_API_URL || 'http://localhost:3000/api',
  
  // Tables
  tables: {
    appleAccountUsers: 'APPLE_ACCOUNT_USERS',
    surveys: 'SURVEYS',
    surveyResponses: 'SURVEY_RESPONSES',
  },
}

export default dbConfig
