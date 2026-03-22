-- Phase 1: Lifecycle survey model (Admin-authored, automated milestones)

ALTER SESSION SET CONTAINER = FREEPDB1;
ALTER SESSION SET CURRENT_SCHEMA = TEAMMATE_VOICES;

-- 1) Extend SURVEYS with lifecycle targeting
ALTER TABLE SURVEYS ADD (
  participant_type VARCHAR2(30) DEFAULT 'ALL',
  survey_stage VARCHAR2(30) DEFAULT 'ONBOARDING',
  audience_source VARCHAR2(30) DEFAULT 'CSV_UPLOAD',
  source_ref VARCHAR2(500),
  auto_send NUMBER(1) DEFAULT 1
);

ALTER TABLE SURVEYS ADD CONSTRAINT survey_participant_type_chk
  CHECK (participant_type IN ('NEW_HIRE', 'EXISTING_RESOURCE', 'ALL'));

ALTER TABLE SURVEYS ADD CONSTRAINT survey_stage_chk
  CHECK (survey_stage IN ('ONBOARDING', 'MID_TRAINING', 'END_TRAINING'));

ALTER TABLE SURVEYS ADD CONSTRAINT survey_audience_source_chk
  CHECK (audience_source IN ('AUTO_API', 'CSV_UPLOAD', 'GOOGLE_SHEET'));

-- 2) Canonical participant profile (supports automation)
CREATE TABLE SURVEY_PARTICIPANTS (
  participant_id VARCHAR2(100) PRIMARY KEY,
  full_name VARCHAR2(255) NOT NULL,
  email VARCHAR2(255) NOT NULL,
  participant_type VARCHAR2(30) NOT NULL,
  training_program VARCHAR2(255),
  cohort VARCHAR2(100),
  instructor_user_id NUMBER,
  start_date DATE NOT NULL,
  expected_end_date DATE,
  is_active NUMBER(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
  updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
  CONSTRAINT participant_type_chk CHECK (participant_type IN ('NEW_HIRE', 'EXISTING_RESOURCE')),
  CONSTRAINT participant_email_uk UNIQUE (email)
);

-- 3) Assignment matrix: which survey for which lifecycle segment
CREATE TABLE SURVEY_ASSIGNMENT_RULES (
  rule_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  rule_name VARCHAR2(255) NOT NULL,
  participant_type VARCHAR2(30) NOT NULL,
  survey_stage VARCHAR2(30) NOT NULL,
  survey_id NUMBER NOT NULL,
  send_day_offset NUMBER,
  is_active NUMBER(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
  updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
  CONSTRAINT assignment_participant_type_chk CHECK (participant_type IN ('NEW_HIRE', 'EXISTING_RESOURCE', 'ALL')),
  CONSTRAINT assignment_stage_chk CHECK (survey_stage IN ('ONBOARDING', 'MID_TRAINING', 'END_TRAINING')),
  CONSTRAINT fk_assignment_survey FOREIGN KEY (survey_id) REFERENCES SURVEYS(survey_id) ON DELETE CASCADE
);

-- 4) Dispatch ledger: dedupe + delivery tracking per milestone
CREATE TABLE SURVEY_DISPATCHES (
  dispatch_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  participant_id VARCHAR2(100) NOT NULL,
  survey_id NUMBER NOT NULL,
  survey_stage VARCHAR2(30) NOT NULL,
  dispatch_status VARCHAR2(30) DEFAULT 'PENDING',
  sent_at TIMESTAMP,
  opened_at TIMESTAMP,
  submitted_at TIMESTAMP,
  reminder_count NUMBER DEFAULT 0,
  dispatch_token VARCHAR2(255),
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
  updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
  CONSTRAINT dispatch_stage_chk CHECK (survey_stage IN ('ONBOARDING', 'MID_TRAINING', 'END_TRAINING')),
  CONSTRAINT dispatch_status_chk CHECK (dispatch_status IN ('PENDING', 'SENT', 'OPENED', 'SUBMITTED', 'FAILED', 'EXPIRED')),
  CONSTRAINT fk_dispatch_participant FOREIGN KEY (participant_id) REFERENCES SURVEY_PARTICIPANTS(participant_id) ON DELETE CASCADE,
  CONSTRAINT fk_dispatch_survey FOREIGN KEY (survey_id) REFERENCES SURVEYS(survey_id) ON DELETE CASCADE,
  CONSTRAINT dispatch_unique_once_per_stage UNIQUE (participant_id, survey_id, survey_stage)
);

CREATE INDEX idx_surveys_participant_type ON SURVEYS(participant_type);
CREATE INDEX idx_surveys_stage ON SURVEYS(survey_stage);
CREATE INDEX idx_assignment_active ON SURVEY_ASSIGNMENT_RULES(is_active);
CREATE INDEX idx_dispatch_status ON SURVEY_DISPATCHES(dispatch_status);
CREATE INDEX idx_dispatch_participant ON SURVEY_DISPATCHES(participant_id);

-- Grant SURVEY_USER access to lifecycle tables
GRANT SELECT, INSERT, UPDATE, DELETE ON TEAMMATE_VOICES.SURVEY_PARTICIPANTS TO SURVEY_USER;
GRANT SELECT, INSERT, UPDATE, DELETE ON TEAMMATE_VOICES.SURVEY_ASSIGNMENT_RULES TO SURVEY_USER;
GRANT SELECT, INSERT, UPDATE, DELETE ON TEAMMATE_VOICES.SURVEY_DISPATCHES TO SURVEY_USER;

COMMIT;
