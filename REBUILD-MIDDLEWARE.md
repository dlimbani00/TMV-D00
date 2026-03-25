# Teammate Voices — Middleware (Backend) Rebuild Prompt

## What This Is

The middleware tier for an enterprise employee survey platform called Teammate Voices. A Spring Boot 3.2 REST API that serves as the brain of the application — it handles HTTP requests, enforces business rules, orchestrates workflows, and persists data to Oracle via JPA/Hibernate.

Built with Spring Boot 3.2, Java 17, JPA/Hibernate, Oracle JDBC driver, Flyway for migrations, JWT for authentication, and Spring Mail for email dispatch.

The middleware is the enforcer. The database stores data, the frontend displays it, but the middleware decides what is allowed. All business rules live here.

---

## Architecture — Six Layers

The middleware has six layers, each with a single responsibility. Requests flow top to bottom.

Layer 1 is REST Controllers. These handle HTTP binding — extracting path variables, validating request bodies with Bean Validation, and returning ResponseEntity wrappers. Controllers contain zero business logic. They delegate everything to services.

Layer 2 is Workflow Orchestration. These are services that coordinate multi-step operations. For example, publishing a survey requires validation, state change, email notification, and audit logging — all in sequence. The workflow service calls other services in the right order.

Layer 3 is Validation Services. These enforce business rules before data reaches the database. They collect all errors into a list and throw a single exception with a combined message. Examples include the Logic Rule Validator and the Email Dispatch Validator.

Layer 4 is Business Services. Standard CRUD services that own one domain entity each. They map between JPA entities and DTOs, manage transactions, and call repositories. Each service is annotated with Transactional.

Layer 5 is JPA Repositories. Spring Data interfaces that extend JpaRepository. They define query methods using Spring's naming conventions. The framework generates SQL at runtime. No manual queries needed for most cases.

Layer 6 is JPA Entities. Annotated Java classes that map to Oracle tables. Each entity has an auto-generated identity primary key, explicit column name mappings, and timestamp fields for created and updated dates.

Cross-cutting concerns include a global exception handler that maps exceptions to HTTP status codes, a security filter chain for JWT authentication and CORS, and Flyway for database migration management.

---

## Security

The security configuration disables CSRF (stateless REST API) and sets up a JWT filter chain. The following paths are permitted without authentication: health check, auth endpoints, surveys, programs, email templates, respond, participants, dispatches, and assignment rules.

CORS is configured to allow requests from localhost on ports 5200 and 5175. JWT tokens are generated on login with a configurable expiration (default 24 hours) and validated on each request via an Authorization Bearer header.

---

## Controllers — Nine Endpoints Groups

### Surveys Controller (path prefix /surveys)

Thirteen endpoints. List all surveys. Get a single survey by ID. Create a new survey. Update a survey (guarded — only works if status is Draft). Delete a survey (guarded — only works if status is Draft). Publish a survey (workflow: Draft to Active with validation, notification, and audit). Unpublish a survey (Active back to Draft). Close a survey (Active to Closed). Reopen a survey (Closed back to Active). Clone a survey (deep copy including questions, options, pages, and logic rules). Get logic rules for a survey. Save logic rules (validated by the Logic Rule Validator). Evaluate logic rules against a set of answers.

### Programs Controller (path prefix /programs)

Six endpoints. List all programs. Get a single program by ID. Get program detail which returns program info combined with all participants and their dispatch statuses. Create a program. Update a program (guarded — blocked if any linked survey has Active status). Delete a program (guarded — same linked survey check).

### Email Templates Controller (path prefix /email-templates)

Twelve endpoints. List all templates with optional category and status filters. Get a single template by ID. Create a template. Update a template. Delete a template. Duplicate a template. Get available merge fields grouped by category. Create an assignment linking a template to a survey or program with a trigger type. List assignments for a template. Delete an assignment. Get assignments for a specific survey. Send a test email. Validate dispatch readiness for a survey.

### Response Controller (path prefix /respond)

Two endpoints. Load a survey by dispatch token (returns the survey data for the respondent to fill out). Submit responses via dispatch token (saves all answers and updates dispatch status to Submitted).

### Other Controllers

Participants controller with list and create endpoints. Assignment Rules controller with list, create, and delete. Dispatches controller with list. Auth controller with login and register. Health controller returning service status and timestamp.

---

## Services — Fourteen Total

### Survey Service

Handles CRUD operations for surveys. Has a private guard method called requireEditable that checks if the survey status is Draft — if not, it throws a BusinessRuleException telling the user to clone the survey instead. This guard is called before update and delete operations.

The updateLogicRules method calls the Logic Rule Validator before serializing rules to JSON and persisting. The cloneSurvey method performs a deep copy of the survey including all questions, options, the pages JSON, and the logic JSON, setting the clone's status to Draft.

### Survey Workflow Service

Orchestrates multi-step lifecycle operations. The publish method performs five steps in sequence: validate that the survey has a title, pages, and questions; check email readiness using the Email Dispatch Validator; change status from Draft to Active; send an admin notification email; and write an audit log entry. Returns a result object containing the updated survey, email readiness status, and whether the notification was sent.

The unpublish method validates the survey is Active, changes to Draft, and writes an audit log. Close validates Active and changes to Closed. Reopen validates Closed and changes to Active. All four operations record who performed them and from what IP address.

### Logic Rule Validator

The most complex validator in the system. Called before saving logic rules. Collects all errors into a list and throws one BusinessRuleException with a combined message.

Performs structural validation: rule type must be one of visible_if, required_if, skip_to, or pipe_text. Condition operator must be one of equals, not_equals, greater_than, less_than, between, contains, not_contains, is_empty, is_not_empty, or any_of. Action type must be one of show, hide, require, skip_to, or pipe. Conditions must not be empty. Values are required for comparison operators but not for is_empty or is_not_empty.

Performs referential validation: all question IDs referenced in conditions must exist in the survey. This checks both numeric database IDs and composite page-based IDs like PG-MAIN-q0 that the frontend generates from the pages JSON. Target question IDs and page IDs in actions must also exist. The validator extracts valid IDs from two sources — the SURVEY_QUESTIONS database table and the survey's pages JSON column.

Performs business rule validation: no circular skip_to chains (detected using depth-first graph traversal cycle detection). Cannot hide a required question because respondents would be unable to complete the survey. No duplicate rule IDs. No self-skip where the skip target is the same question used in the condition. No duplicate conditions on the same question within one rule. Rule type must match action type — visible_if can only have show or hide actions, required_if can only have require, skip_to can only have skip_to, and pipe_text can only have pipe. Maximum 200 rules per survey and 20 conditions per rule. Survey must be in Draft status to edit rules.

### Logic Evaluator Service

A stateless runtime evaluation engine. Takes a list of logic rules and a map of answers, then evaluates each rule's conditions against the answers. Returns a result containing a visibility map (which questions are visible), a required map (which are required), a skip target (where to jump next), and piped values (text substitutions). Supports AND and OR condition grouping.

### Program Service

CRUD operations for programs plus a getProgramDetail method that joins participant data with dispatch data. For each participant in the program, it looks up their latest dispatch to determine completion status. Returns counts for total, completed, sent, and pending.

Has a guard method called requireEditableProgram that checks whether any survey linked to the program has Active status. If so, it throws a BusinessRuleException. This guard is called before update and delete operations.

### Email Template Service

Standard CRUD for email templates. The duplicate method creates a copy with "Copy" appended to the name and status set to Draft.

### Email Template Assignment Service

Manages the links between email templates and surveys or programs. Each assignment has a trigger type (Initial Invite, Reminder 1 through 3, Thank You, Survey Closed, Program Welcome, Program Complete, or Ad Hoc) and a send delay in days.

### Email Dispatch Validator

Performs pre-send readiness checks for a survey. Checks whether the survey is Active, the linked program is Active, email templates are assigned for the required trigger types, assigned templates are Active, each template has a from address set, and each template has a non-blank subject line. Returns a result with an overall passed/failed flag and a list of individual checks with their status and details.

### Email Sending Service

Sends emails via Spring Mail using a configured SMTP provider. Has a method to render a template by replacing merge field placeholders (double curly braces around field names) with actual participant, survey, and program data.

### Response Service

Handles survey response submission. The submitViaToken method validates that the survey is Active, checks for duplicate responses from the same participant, creates a SurveyResponse record with all SurveyAnswer records, and updates the dispatch status to Submitted. The submitPublic method handles anonymous submissions without a dispatch token.

Also provides methods to list all responses for a survey and get a single response with its answers.

### Other Services

Participant Service for participant CRUD with entity-to-DTO mapping. Assignment Rule Service for managing survey assignment rules. Dispatch Service for listing dispatches. Auth Service for user registration and login with JWT token generation.

---

## Exception Handling

A single global exception handler catches all exceptions and maps them to appropriate HTTP responses with a consistent JSON format containing a code string, a message string, and an optional field errors map.

ResourceNotFoundException maps to HTTP 404 with code NOT_FOUND. IllegalArgumentException maps to 400 BAD_REQUEST. BusinessRuleException maps to 422 BUSINESS_RULE_VIOLATION. DuplicateResponseException maps to 409 DUPLICATE_RESPONSE. SurveyClosedException maps to 422 SURVEY_CLOSED. Bean Validation failures map to 400 VALIDATION_FAILED with a field errors map showing which fields failed and why. BadCredentialsException maps to 401 UNAUTHORIZED. AccessDeniedException maps to 403 FORBIDDEN. Any other exception maps to 500 INTERNAL_ERROR.

---

## Business Rules Summary

Survey Lifecycle: Draft surveys can be edited, deleted, published, and cloned. Active surveys cannot be edited or deleted — they can only be cloned, unpublished (back to Draft), or closed. Closed surveys cannot be edited or deleted — they can only be cloned or reopened (back to Active).

Program Lock: A program cannot be edited or deleted if any survey linked to it (via program_id foreign key) has Active status. The middleware checks this using a repository query that tests for existence of Active surveys for that program ID.

Logic Rule Validation: Ten structural checks, five referential checks, and eight business rule checks as described in the Logic Rule Validator section above.

Response Submission: The survey must be Active. No duplicate responses from the same participant for the same survey. Dispatch status is updated to Submitted upon completion.

---

## Data Transfer Objects

The middleware uses separate DTO classes for all API request and response bodies. Services map between JPA entities and DTOs — entities never leak to the API surface.

Key DTOs include SurveyDTO with all survey fields including the pages JSON string, ProgramDTO for program data, ProgramDetailDTO which nests the program info and a list of participant status rows each containing participant details plus their latest dispatch status and counts for total/completed/sent/pending.

LogicRuleDTO has Bean Validation annotations: the ID and type fields are required and non-blank, conditions and action are required and non-null with cascading validation into nested objects. The conditions group requires a non-blank operator and a non-empty items list. Each condition requires a non-blank question ID and operator. Each action requires a non-blank type.

Request DTOs include SaveLogicRequest wrapping a list of LogicRuleDTOs, EvaluateLogicRequest wrapping an answers map, SubmitSurveyRequest wrapping an answers map, and LoginRequest with username and password.

---

## Configuration

The main application configuration sets the server port to 8081 with a /api context path. It configures the Oracle datasource connection, sets JPA to use the Oracle dialect with DDL auto set to none (Flyway handles schema), enables Flyway migrations from the classpath, and sets the JWT secret key and expiration.

A separate dev profile configuration switches to H2 file-based database for local development without Oracle. This uses the H2 driver, H2 dialect, and enables the H2 web console.

Key Maven dependencies include Spring Boot starters for web, data JPA, security, validation, and mail. Also Oracle JDBC driver, H2 for dev/test, Flyway core, and the JJWT library for JWT token handling.

---

## Build Order

Start with the project scaffold — Maven POM, application entry class, and configuration files. Add Flyway migrations. Create all 13 JPA entities and 12 repositories. Create all DTOs and request objects. Add exception classes and the global exception handler. Set up security with JWT and the security config.

Then build CRUD services and controllers for surveys, programs, participants, assignment rules, and dispatches. Add the Logic Rule Validator and Logic Evaluator Service. Build the Survey Workflow Service for publish, unpublish, close, and reopen orchestration. Add the Email Template Service, Assignment Service, and Dispatch Validator. Build the Response Service and Response Controller. Finally add the business rule guards — requireEditable on surveys and requireEditableProgram on programs.
