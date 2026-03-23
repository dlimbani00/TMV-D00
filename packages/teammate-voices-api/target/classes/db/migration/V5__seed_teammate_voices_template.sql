-- V5: Seed Team Mate Voices survey template with questions and rating options

-- Create template survey
INSERT INTO SURVEYS (title, description, template_type, status, is_anonymous)
VALUES (
    'Team Mate Voices 2026',
    'Annual employee engagement survey to gather feedback on team dynamics, leadership, and workplace culture',
    'TEAM_MATE_VOICES',
    'DRAFT',
    1
);

-- Rating scale questions
INSERT INTO SURVEY_QUESTIONS (survey_id, question_text, question_type, sort_order, is_required)
SELECT survey_id, 'I feel valued and appreciated at work', 'RATING_SCALE', 1, 1
FROM SURVEYS WHERE title = 'Team Mate Voices 2026';

INSERT INTO SURVEY_QUESTIONS (survey_id, question_text, question_type, sort_order, is_required)
SELECT survey_id, 'My manager provides clear direction and support', 'RATING_SCALE', 2, 1
FROM SURVEYS WHERE title = 'Team Mate Voices 2026';

INSERT INTO SURVEY_QUESTIONS (survey_id, question_text, question_type, sort_order, is_required)
SELECT survey_id, 'I have the tools and resources I need to do my job effectively', 'RATING_SCALE', 3, 1
FROM SURVEYS WHERE title = 'Team Mate Voices 2026';

INSERT INTO SURVEY_QUESTIONS (survey_id, question_text, question_type, sort_order, is_required)
SELECT survey_id, 'I feel a sense of belonging in my team', 'RATING_SCALE', 4, 1
FROM SURVEYS WHERE title = 'Team Mate Voices 2026';

INSERT INTO SURVEY_QUESTIONS (survey_id, question_text, question_type, sort_order, is_required)
SELECT survey_id, 'My work-life balance is healthy', 'RATING_SCALE', 5, 1
FROM SURVEYS WHERE title = 'Team Mate Voices 2026';

INSERT INTO SURVEY_QUESTIONS (survey_id, question_text, question_type, sort_order, is_required)
SELECT survey_id, 'I see opportunities for growth and development', 'RATING_SCALE', 6, 1
FROM SURVEYS WHERE title = 'Team Mate Voices 2026';

INSERT INTO SURVEY_QUESTIONS (survey_id, question_text, question_type, sort_order, is_required)
SELECT survey_id, 'Communication within my team is open and honest', 'RATING_SCALE', 7, 1
FROM SURVEYS WHERE title = 'Team Mate Voices 2026';

INSERT INTO SURVEY_QUESTIONS (survey_id, question_text, question_type, sort_order, is_required)
SELECT survey_id, 'I would recommend this company as a great place to work', 'RATING_SCALE', 8, 1
FROM SURVEYS WHERE title = 'Team Mate Voices 2026';

-- Text questions
INSERT INTO SURVEY_QUESTIONS (survey_id, question_text, question_type, sort_order, is_required)
SELECT survey_id, 'What is the biggest challenge you face in your role?', 'TEXT', 9, 0
FROM SURVEYS WHERE title = 'Team Mate Voices 2026';

INSERT INTO SURVEY_QUESTIONS (survey_id, question_text, question_type, sort_order, is_required)
SELECT survey_id, 'What could we improve most in our workplace culture?', 'TEXT', 10, 0
FROM SURVEYS WHERE title = 'Team Mate Voices 2026';

-- Rating scale options (1-5) for all rating questions
INSERT INTO SURVEY_OPTIONS (question_id, option_text, option_value, sort_order)
SELECT q.question_id, 'Strongly Disagree', 1, 1
FROM SURVEY_QUESTIONS q JOIN SURVEYS s ON q.survey_id = s.survey_id
WHERE s.title = 'Team Mate Voices 2026' AND q.question_type = 'RATING_SCALE';

INSERT INTO SURVEY_OPTIONS (question_id, option_text, option_value, sort_order)
SELECT q.question_id, 'Disagree', 2, 2
FROM SURVEY_QUESTIONS q JOIN SURVEYS s ON q.survey_id = s.survey_id
WHERE s.title = 'Team Mate Voices 2026' AND q.question_type = 'RATING_SCALE';

INSERT INTO SURVEY_OPTIONS (question_id, option_text, option_value, sort_order)
SELECT q.question_id, 'Neutral', 3, 3
FROM SURVEY_QUESTIONS q JOIN SURVEYS s ON q.survey_id = s.survey_id
WHERE s.title = 'Team Mate Voices 2026' AND q.question_type = 'RATING_SCALE';

INSERT INTO SURVEY_OPTIONS (question_id, option_text, option_value, sort_order)
SELECT q.question_id, 'Agree', 4, 4
FROM SURVEY_QUESTIONS q JOIN SURVEYS s ON q.survey_id = s.survey_id
WHERE s.title = 'Team Mate Voices 2026' AND q.question_type = 'RATING_SCALE';

INSERT INTO SURVEY_OPTIONS (question_id, option_text, option_value, sort_order)
SELECT q.question_id, 'Strongly Agree', 5, 5
FROM SURVEY_QUESTIONS q JOIN SURVEYS s ON q.survey_id = s.survey_id
WHERE s.title = 'Team Mate Voices 2026' AND q.question_type = 'RATING_SCALE';

COMMIT;
