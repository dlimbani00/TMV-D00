# Teammate Voices — Database Rebuild Prompt

## What This Is

The data tier for an enterprise employee survey platform called Teammate Voices. An Oracle 23 Free database running in Docker, managed by Flyway migrations from the Spring Boot backend. Stores surveys, programs, participants, responses, email templates, and audit logs across 12 tables with 16 foreign key relationships and 21 indexes.

The database is the safety net. Business rules are enforced in middleware, but the database provides referential integrity via foreign keys, data type constraints, and indexes for query performance.

---

## Infrastructure

The database runs as an Oracle 23 Free Slim Docker container on port 1521. The Oracle password is configurable via environment variable. An application user called teammate_voices owns all tables. The connection uses the FREEPDB1 pluggable database.

For local development without Oracle, an H2 file-based database is available via a dev profile. H2 auto-maps Oracle types and persists data to disk across restarts.

---

## Tables — Twelve Total

### 1. USERS

Stores authentication credentials. Fields include an auto-generated numeric ID, unique username (max 100 characters), unique email (max 255), password hash (max 255), role defaulting to USER, and a created timestamp. Both username and email have unique constraints.

### 2. PROGRAMS

Organizational containers for surveys. Fields include an auto-generated numeric ID, name (max 255, required), description (max 2000), template type (max 50, required), status defaulting to ACTIVE, survey progress defaulting to NOT_STARTED, and created/updated timestamps.

Valid status values are ACTIVE and INACTIVE. Valid survey progress values are NOT_STARTED, IN_PROGRESS, and COMPLETE. Template types include Teammate Voices, Intern Program, Engagement Survey, NPS Survey, and Custom.

### 3. SURVEYS

The core entity. Fields include an auto-generated numeric ID, title (max 255, required), description (large text), template type (max 50, required), status defaulting to DRAFT with a check constraint allowing only DRAFT, ACTIVE, or CLOSED, build status defaulting to DRAFT with a check constraint allowing only DRAFT or PUBLISHED, program ID (foreign key to Programs), created by user ID (foreign key to Users), participant type, survey stage, audience source, auto send flag, anonymous flag defaulting to true, start and end dates, cycle, and created/updated timestamps.

Two large text columns store JSON data. The pages column stores the complete multi-page survey structure as a JSON array. Each page object contains a page ID string, title, label, optional description, show description flag, sort order, and a questions array. Each question has question text, question type, optional question label and description, sort order, required flag, and an options array. Each option has text, numeric value, and sort order.

The logic_json column stores conditional logic rules as a JSON array. Each rule has an ID string, type (visible_if, required_if, skip_to, or pipe_text), a conditions group with an AND/OR operator and an items array of conditions, and an action with type and target references.

Question types stored in the pages JSON include Single Select, Multiple Select, Rating Scale, Grid Rating Scale, Radio Buttons, Checkboxes, Single-line Input, Text Area, Sliding Scale, and Static Text.

### 4. SURVEY_QUESTIONS

Individual questions linked to a survey via foreign key. Fields include auto-generated numeric ID, survey ID (required foreign key to Surveys), question text (max 500, required), question type (max 30, required), sort order defaulting to zero, required flag defaulting to true, and created/updated timestamps.

Note: Multi-page surveys store questions in the Surveys table's pages JSON column instead. This table is used for legacy simple surveys and by the Logic Rule Validator for referential checks.

### 5. SURVEY_OPTIONS

Answer choices for multiple-choice questions. Fields include auto-generated numeric ID, question ID (required foreign key to Survey Questions), option text (max 500, required), numeric option value, and sort order defaulting to zero.

### 6. PARTICIPANTS

People who receive and complete surveys. Uses a string primary key (max 100 characters) because participant IDs are external identifiers imported from HR systems and may be alphanumeric. Fields include full name (max 255, required), email (max 255, required, unique), participant type (max 30, required — either NEW_HIRE or EXISTING_RESOURCE), program ID (foreign key to Programs), training program name, cohort identifier, standard ID, manager name, hierarchy code, start date (required), mid point date, expected end date, active flag defaulting to true, and created/updated timestamps.

### 7. DISPATCHES

Tracks survey delivery to participants. Fields include auto-generated numeric ID, survey ID (required foreign key to Surveys), participant ID (required foreign key to Participants), survey stage (required — ONBOARDING, MID_TRAINING, or END_TRAINING), dispatch status defaulting to PENDING, unique dispatch token string, sent/opened/submitted timestamps, reminder count defaulting to zero, and created/updated timestamps.

Valid dispatch status values are PENDING, SENT, OPENED, SUBMITTED, FAILED, and EXPIRED.

### 8. SURVEY_RESPONSES

One row per survey completion attempt. Fields include auto-generated numeric ID, survey ID (required foreign key to Surveys), respondent user ID (optional foreign key to Users), dispatch ID (optional foreign key to Dispatches), participant ID string, is_complete flag defaulting to false, started and submitted timestamps, and created timestamp.

### 9. SURVEY_ANSWERS

Individual question answers within a response. Fields include auto-generated numeric ID, response ID (required foreign key to Survey Responses), question ID (required foreign key to Survey Questions), answer text (max 4000 for text answers and single select values), answer value (numeric for ratings and scores), answer JSON (large text for multi-select arrays and complex structured answers), page ID string (which page this answer belongs to), and created timestamp.

### 10. EMAIL_TEMPLATES

Reusable email templates with merge field support. Fields include auto-generated numeric ID, name (max 255, required), description (max 2000), category (max 50, required), subject line (max 500, required), from name (max 255), body HTML (large text, required — the rendered email content), body JSON (large text — editor state for re-editing), merge fields (large text — JSON array of field definitions), status defaulting to DRAFT, is_default flag, created by user ID, and created/updated timestamps.

Valid categories are INVITATION, REMINDER, THANK_YOU, WELCOME, COMPLETION, ANNOUNCEMENT, and CUSTOM. Valid statuses are DRAFT, ACTIVE, and ARCHIVED.

Merge fields in the body HTML use double curly brace syntax around field names: participant_name, email, survey_title, survey_link, program_name, cohort, company_name, sender_name, and others.

### 11. EMAIL_TEMPLATE_ASSIGNMENTS

Links email templates to surveys and programs with trigger events. Fields include auto-generated numeric ID, template ID (required foreign key to Email Templates), program ID (optional foreign key to Programs), survey ID (optional foreign key to Surveys), trigger type (max 50, required), send delay in days defaulting to zero, active flag defaulting to true, and created timestamp.

Valid trigger types are INITIAL_INVITE, REMINDER_1, REMINDER_2, REMINDER_3, THANK_YOU, SURVEY_CLOSED, PROGRAM_WELCOME, PROGRAM_COMPLETE, and AD_HOC.

### 12. ASSIGNMENT_RULES

Rules for automatically assigning surveys to participant segments. Fields include auto-generated numeric ID, survey ID (required foreign key to Surveys), rule name (max 255, required), rule type (max 50, required), field name (max 100), field value (max 255), and created timestamp.

### 13. WORKFLOW_AUDIT_LOG

Tracks all state changes across the system using a polymorphic pattern. Fields include auto-generated numeric ID, entity type (max 50, required — SURVEY, PROGRAM, or EMAIL_TEMPLATE), entity ID (numeric, required — references the ID of the entity but has no foreign key constraint since it's polymorphic), action (max 50, required — PUBLISH, UNPUBLISH, CLOSE, REOPEN, etc.), previous state, new state, performed by user identifier, details (large text for JSON context), IP address (max 45), and created timestamp.

---

## Entity Relationship Diagram

Programs have a one-to-many relationship with Surveys through the program_id foreign key. Programs also have a one-to-many relationship with Participants through the program_id foreign key.

Surveys have a one-to-many relationship with Survey Questions. Survey Questions have a one-to-many relationship with Survey Options. Surveys also have a one-to-many relationship with Survey Responses and Dispatches.

Survey Responses have a one-to-many relationship with Survey Answers. Survey Answers reference both the Response (required) and the Question (required).

Dispatches link Surveys to Participants with status tracking.

Email Templates have a one-to-many relationship with Email Template Assignments. Assignments reference both Programs and Surveys as optional foreign keys.

Assignment Rules reference Surveys.

Users are referenced by Surveys (created_by) and Survey Responses (respondent_user_id).

The Workflow Audit Log is standalone with no foreign keys — it uses a polymorphic entity_type plus entity_id pattern to reference any entity.

---

## Foreign Key Relationships — Sixteen Total

Surveys reference Programs and Users. Survey Questions reference Surveys. Survey Options reference Survey Questions. Survey Responses reference Surveys, Users, and Dispatches. Survey Answers reference Survey Responses and Survey Questions. Dispatches reference Surveys and Participants. Participants reference Programs. Assignment Rules reference Surveys. Email Template Assignments reference Email Templates, Programs, and Surveys.

---

## Indexes — Twenty-One Total

Survey indexes on status and program_id. Question index on survey_id. Option index on question_id. Participant indexes on program_id and email. Dispatch indexes on participant_id, survey_id, and dispatch_token. Response indexes on survey_id, participant_id, and dispatch_id. Answer indexes on response_id, question_id, and page_id. Email Template indexes on category and status. Assignment indexes on template_id, program_id, and survey_id. Audit Log indexes on entity_type combined with entity_id, on action, and on created_at.

---

## Migration Order — Twenty Scripts

The migrations run in numbered order on application startup via Flyway.

Migration 1 creates the Users table. Migration 2 creates Survey, Survey Questions, and Survey Options tables. Migration 3 creates Survey Responses and Survey Answers. Migration 4 creates Dispatches, Assignment Rules, and Participants. Migration 5 seeds the first survey with template questions. Migration 6 creates the Programs table. Migration 7 adds the program_id foreign key to Surveys. Migration 8 adds the pages large text column to Surveys. Migration 9 seeds 15 sample participants. Migration 10 adds manager, hierarchy, and cohort fields to Participants. Migration 11 updates cohort tracking. Migration 12 adds the logic_json large text column to Surveys. Migration 13 enhances response tables with dispatch_id, is_complete, and participant_id columns. Migration 14 creates Email Templates and Email Template Assignments tables. Migration 15 seeds 11 default email templates. Migration 16 seeds additional programs and surveys. Migration 17 fixes the pages JSON for survey 1. Migration 18 creates the Workflow Audit Log table. Migration 19 adds all missing foreign key constraints. Migration 20 adds the program_id foreign key to Participants.

---

## Seed Data

Five programs should be seeded: Enterprise 360 2025 - A, Enterprise 360 2025 - B, Teammate Voices, TMV 2, and Test Program. All should be Active with survey progress set to Not Started except Teammate Voices which should be In Progress.

Fifteen participants should be seeded with a mix of ten New Hires and five Existing Resources across three cohorts (2025-Q4, 2026-Q1, 2026-Q2). All should be linked to the Teammate Voices program. Fourteen should be active and one should be inactive.

Eleven email templates should be seeded across all categories: two Invitation templates, three Reminder templates (friendly, urgent, final), two Thank You templates, one Welcome template, one Completion template, one Announcement template, and one Custom template. Each should have realistic HTML body content with merge field placeholders.

Four surveys should be seeded. Team Mate Voices 2026 with 15 or more Rating Scale questions across four pages covering Engagement, Leadership, Growth, and Culture — this one should have Active status. Teammate Voices as an intern feedback survey with three pages. Employee Voice Survey 2026 as an annual engagement survey with two pages. Academy Program Feedback as a post-training survey with two pages.

---

## Design Decisions

The pages and logic_json columns use large text (CLOB) instead of normalized tables because survey question structures vary significantly by type, loading a full survey is a single row fetch instead of N+1 queries, and saving all questions happens atomically in one transaction. The trade-off is that individual questions cannot be queried via SQL — for reporting, the Survey Answers table stores flattened answer data.

Both the Survey Questions table and the pages column exist because Survey Questions was the original design from migration 2 and pages was added later in migration 8 for multi-page support. The pages column is the canonical source for new surveys. Survey Questions is kept for backward compatibility and for the Logic Rule Validator to check question references.

Participant ID uses a string type instead of a number because participant IDs are external identifiers from HR systems that may be alphanumeric.

The Workflow Audit Log uses a polymorphic pattern (entity_type plus entity_id with no foreign key) instead of per-entity audit tables because it allows querying all state changes across the entire system from one table.

---

## Common Query Patterns

Survey completion rates are calculated by counting total responses and completed responses grouped by survey title.

Participant status for a program is retrieved by joining Participants with Dispatches on participant_id, filtering by program_id, and reading the dispatch status and submitted timestamp.

Answer distribution for a question is found by grouping Survey Answers by answer_text for a given question_id and counting occurrences.

The audit trail for a survey is retrieved by selecting from the Workflow Audit Log where entity_type is SURVEY and entity_id matches, ordered by created timestamp.
