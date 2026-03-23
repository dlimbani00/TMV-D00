-- V10: Add person_number, standard_id, manager_name, hierarchy_code, mid_point_date to participants
-- Also clear old seed data and re-key using person_number as participant_id

-- Drop existing seed rows (V9 data)
DELETE FROM PARTICIPANTS WHERE participant_id LIKE 'P0%';

-- Add new columns
ALTER TABLE PARTICIPANTS ADD (
    STANDARD_ID VARCHAR2(20),
    MANAGER_NAME VARCHAR2(255),
    HIERARCHY_CODE VARCHAR2(20),
    MID_POINT_DATE DATE
);

-- Seed realistic participant data (participant_id = person number)
INSERT INTO PARTICIPANTS (participant_id, full_name, email, participant_type, training_program, cohort, start_date, expected_end_date, mid_point_date, standard_id, manager_name, hierarchy_code, is_active, created_at, updated_at) VALUES
('28888113', 'Sarah Johnson', 'sarah.johnson@example.com', 'NEW_HIRE', 'Software Engineering Bootcamp', '2026-Q1', DATE '2026-01-15', DATE '2026-04-15', DATE '2026-03-01', 'NBKRRA', 'Michael Torres', 'AABBC', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO PARTICIPANTS (participant_id, full_name, email, participant_type, training_program, cohort, start_date, expected_end_date, mid_point_date, standard_id, manager_name, hierarchy_code, is_active, created_at, updated_at) VALUES
('28912045', 'Michael Chen', 'michael.chen@example.com', 'NEW_HIRE', 'Software Engineering Bootcamp', '2026-Q1', DATE '2026-01-15', DATE '2026-04-15', DATE '2026-03-01', 'JCHNMK', 'Laura Bennett', 'AABBC', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO PARTICIPANTS (participant_id, full_name, email, participant_type, training_program, cohort, start_date, expected_end_date, mid_point_date, standard_id, manager_name, hierarchy_code, is_active, created_at, updated_at) VALUES
('29034782', 'Emily Rodriguez', 'emily.rodriguez@example.com', 'NEW_HIRE', 'Data Analytics Program', '2026-Q1', DATE '2026-02-01', DATE '2026-05-01', DATE '2026-03-16', 'ERDGEM', 'James Whitaker', 'AACDE', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO PARTICIPANTS (participant_id, full_name, email, participant_type, training_program, cohort, start_date, expected_end_date, mid_point_date, standard_id, manager_name, hierarchy_code, is_active, created_at, updated_at) VALUES
('27651498', 'James Wilson', 'james.wilson@example.com', 'EXISTING_RESOURCE', 'Leadership Development', '2026-Q1', DATE '2026-01-10', DATE '2026-06-30', DATE '2026-04-05', 'JWLSNR', 'Patricia Gomez', 'BBCDA', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO PARTICIPANTS (participant_id, full_name, email, participant_type, training_program, cohort, start_date, expected_end_date, mid_point_date, standard_id, manager_name, hierarchy_code, is_active, created_at, updated_at) VALUES
('29187634', 'Priya Patel', 'priya.patel@example.com', 'NEW_HIRE', 'Cloud Architecture Training', '2026-Q1', DATE '2026-01-20', DATE '2026-04-20', DATE '2026-03-06', 'PPATLK', 'David Nakamura', 'AABBC', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO PARTICIPANTS (participant_id, full_name, email, participant_type, training_program, cohort, start_date, expected_end_date, mid_point_date, standard_id, manager_name, hierarchy_code, is_active, created_at, updated_at) VALUES
('27489201', 'David Kim', 'david.kim@example.com', 'EXISTING_RESOURCE', 'Agile Coaching Certification', '2025-Q4', DATE '2025-10-01', DATE '2026-03-31', DATE '2026-01-01', 'DKIMAG', 'Sandra Reeves', 'CCDAB', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO PARTICIPANTS (participant_id, full_name, email, participant_type, training_program, cohort, start_date, expected_end_date, mid_point_date, standard_id, manager_name, hierarchy_code, is_active, created_at, updated_at) VALUES
('29256310', 'Amanda Foster', 'amanda.foster@example.com', 'NEW_HIRE', 'Software Engineering Bootcamp', '2026-Q1', DATE '2026-01-15', DATE '2026-04-15', DATE '2026-03-01', 'AFSTRN', 'Michael Torres', 'AABBC', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO PARTICIPANTS (participant_id, full_name, email, participant_type, training_program, cohort, start_date, expected_end_date, mid_point_date, standard_id, manager_name, hierarchy_code, is_active, created_at, updated_at) VALUES
('27802155', 'Robert Martinez', 'robert.martinez@example.com', 'EXISTING_RESOURCE', 'Leadership Development', '2026-Q1', DATE '2026-01-10', DATE '2026-06-30', DATE '2026-04-05', 'RMRZNL', 'Patricia Gomez', 'BBCDA', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO PARTICIPANTS (participant_id, full_name, email, participant_type, training_program, cohort, start_date, expected_end_date, mid_point_date, standard_id, manager_name, hierarchy_code, is_active, created_at, updated_at) VALUES
('29078443', 'Lisa Thompson', 'lisa.thompson@example.com', 'NEW_HIRE', 'Data Analytics Program', '2026-Q1', DATE '2026-02-01', DATE '2026-05-01', DATE '2026-03-16', 'LTHMPD', 'James Whitaker', 'AACDE', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO PARTICIPANTS (participant_id, full_name, email, participant_type, training_program, cohort, start_date, expected_end_date, mid_point_date, standard_id, manager_name, hierarchy_code, is_active, created_at, updated_at) VALUES
('29145887', 'Kevin Nguyen', 'kevin.nguyen@example.com', 'NEW_HIRE', 'Cloud Architecture Training', '2026-Q1', DATE '2026-01-20', DATE '2026-04-20', DATE '2026-03-06', 'KNGYNV', 'David Nakamura', 'AABBC', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO PARTICIPANTS (participant_id, full_name, email, participant_type, training_program, cohort, start_date, expected_end_date, mid_point_date, standard_id, manager_name, hierarchy_code, is_active, created_at, updated_at) VALUES
('27523678', 'Rachel Green', 'rachel.green@example.com', 'EXISTING_RESOURCE', 'Agile Coaching Certification', '2025-Q4', DATE '2025-10-01', DATE '2026-03-31', DATE '2026-01-01', 'RGRNAC', 'Sandra Reeves', 'CCDAB', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO PARTICIPANTS (participant_id, full_name, email, participant_type, training_program, cohort, start_date, expected_end_date, mid_point_date, standard_id, manager_name, hierarchy_code, is_active, created_at, updated_at) VALUES
('29312056', 'Daniel Brown', 'daniel.brown@example.com', 'NEW_HIRE', 'Software Engineering Bootcamp', '2026-Q2', DATE '2026-03-15', DATE '2026-06-15', DATE '2026-04-30', 'DBRWNQ', 'Laura Bennett', 'AABBC', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO PARTICIPANTS (participant_id, full_name, email, participant_type, training_program, cohort, start_date, expected_end_date, mid_point_date, standard_id, manager_name, hierarchy_code, is_active, created_at, updated_at) VALUES
('27698412', 'Jessica Lee', 'jessica.lee@example.com', 'EXISTING_RESOURCE', 'Leadership Development', '2025-Q4', DATE '2025-11-01', DATE '2026-04-30', DATE '2026-01-31', 'JLEELD', 'Patricia Gomez', 'BBCDA', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO PARTICIPANTS (participant_id, full_name, email, participant_type, training_program, cohort, start_date, expected_end_date, mid_point_date, standard_id, manager_name, hierarchy_code, is_active, created_at, updated_at) VALUES
('29401789', 'Chris Taylor', 'chris.taylor@example.com', 'NEW_HIRE', 'Data Analytics Program', '2026-Q2', DATE '2026-03-01', DATE '2026-06-01', DATE '2026-04-16', 'CTYLRP', 'James Whitaker', 'AACDE', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO PARTICIPANTS (participant_id, full_name, email, participant_type, training_program, cohort, start_date, expected_end_date, mid_point_date, standard_id, manager_name, hierarchy_code, is_active, created_at, updated_at) VALUES
('29478234', 'Natalie Wang', 'natalie.wang@example.com', 'NEW_HIRE', 'Cloud Architecture Training', '2026-Q2', DATE '2026-03-20', DATE '2026-06-20', DATE '2026-05-05', 'NWNGCL', 'David Nakamura', 'DDABC', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
