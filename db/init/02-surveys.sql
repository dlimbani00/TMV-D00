-- Survey Management Tables for EMPSurvey

ALTER SESSION SET CONTAINER = FREEPDB1;
ALTER SESSION SET CURRENT_SCHEMA = TEAMMATE_VOICES;

-- Surveys Table
CREATE TABLE SURVEYS (
  survey_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR2(255) NOT NULL,
  description CLOB,
  template_type VARCHAR2(50) DEFAULT 'CUSTOM',
  status VARCHAR2(20) DEFAULT 'DRAFT',
  created_by NUMBER,
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
  updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
  start_date DATE,
  end_date DATE,
  is_anonymous NUMBER(1) DEFAULT 1,
  CONSTRAINT survey_status_chk CHECK (status IN ('DRAFT', 'ACTIVE', 'CLOSED', 'ARCHIVED')),
  CONSTRAINT survey_template_chk CHECK (template_type IN ('CUSTOM', 'TEAM_MATE_VOICES', 'ENGAGEMENT', 'NPS'))
);

-- Survey Questions Table
CREATE TABLE SURVEY_QUESTIONS (
  question_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  survey_id NUMBER NOT NULL,
  question_text VARCHAR2(500) NOT NULL,
  question_type VARCHAR2(30) NOT NULL,
  sort_order NUMBER,
  is_required NUMBER(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
  updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
  FOREIGN KEY (survey_id) REFERENCES SURVEYS(survey_id) ON DELETE CASCADE,
  CONSTRAINT question_type_chk CHECK (question_type IN ('RATING_SCALE', 'MULTIPLE_CHOICE', 'TEXT', 'MATRIX'))
);

-- Survey Question Options (for multiple choice / rating scales)
CREATE TABLE SURVEY_OPTIONS (
  option_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  question_id NUMBER NOT NULL,
  option_text VARCHAR2(255),
  option_value NUMBER,
  sort_order NUMBER,
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES SURVEY_QUESTIONS(question_id) ON DELETE CASCADE
);

-- Survey Responses (from employees)
CREATE TABLE SURVEY_RESPONSES (
  response_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  survey_id NUMBER NOT NULL,
  respondent_user_id NUMBER,
  submitted_at TIMESTAMP,
  started_at TIMESTAMP DEFAULT SYSTIMESTAMP,
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
  FOREIGN KEY (survey_id) REFERENCES SURVEYS(survey_id),
  FOREIGN KEY (respondent_user_id) REFERENCES APPLE_ACCOUNT_USERS(user_id)
);

-- Survey Response Answers
CREATE TABLE SURVEY_ANSWERS (
  answer_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  response_id NUMBER NOT NULL,
  question_id NUMBER NOT NULL,
  answer_text CLOB,
  answer_value NUMBER,
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
  FOREIGN KEY (response_id) REFERENCES SURVEY_RESPONSES(response_id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES SURVEY_QUESTIONS(question_id)
);

-- Create Indexes
CREATE INDEX idx_surveys_status ON SURVEYS(status);
CREATE INDEX idx_surveys_template ON SURVEYS(template_type);
CREATE INDEX idx_survey_questions_survey ON SURVEY_QUESTIONS(survey_id);
CREATE INDEX idx_survey_responses_survey ON SURVEY_RESPONSES(survey_id);
CREATE INDEX idx_survey_responses_user ON SURVEY_RESPONSES(respondent_user_id);
CREATE INDEX idx_survey_answers_response ON SURVEY_ANSWERS(response_id);
CREATE INDEX idx_survey_answers_question ON SURVEY_ANSWERS(question_id);

-- Team Mate Voices Template - Insert sample survey structure
INSERT INTO SURVEYS (title, description, template_type, status)
VALUES (
  'Team Mate Voices 2026',
  'Annual employee engagement survey to gather feedback on team dynamics, leadership, and workplace culture',
  'TEAM_MATE_VOICES',
  'DRAFT'
);

-- Grant SURVEY_USER access to all survey tables
GRANT SELECT, INSERT, UPDATE, DELETE ON TEAMMATE_VOICES.SURVEYS TO SURVEY_USER;
GRANT SELECT, INSERT, UPDATE, DELETE ON TEAMMATE_VOICES.SURVEY_QUESTIONS TO SURVEY_USER;
GRANT SELECT, INSERT, UPDATE, DELETE ON TEAMMATE_VOICES.SURVEY_OPTIONS TO SURVEY_USER;
GRANT SELECT, INSERT, UPDATE, DELETE ON TEAMMATE_VOICES.SURVEY_RESPONSES TO SURVEY_USER;
GRANT SELECT, INSERT, UPDATE, DELETE ON TEAMMATE_VOICES.SURVEY_ANSWERS TO SURVEY_USER;

-- Grant sequence access for identity columns
GRANT SELECT ON ALL SEQUENCES TO SURVEY_USER;

COMMIT;
