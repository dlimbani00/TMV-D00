# Teammate Voices — Configuration Tab Build Prompt

## Purpose

Build the Configuration tab inside the Survey Editor. This tab lets survey authors define conditional logic rules that control how the survey behaves at runtime — showing or hiding questions based on answers, making questions conditionally required, skipping to different pages, and piping answer text into other questions.

The Configuration tab is the fourth tab in the Survey Editor (after Details, Form Builder, and Form Viewer). It only appears when editing an existing survey that has at least one page with questions defined in the Form Builder.

---

## Prerequisites

Before building the Configuration tab, the following must already exist:

The Survey Editor page must exist with a working tab bar. The survey must have a pages JSON field that contains an array of page objects, each containing a questions array. Each question has a questionId (or a composite ID like PG-WELCOME-q0), questionText, questionType, isRequired flag, and optionally an options array.

The backend must have a logic_json CLOB column on the SURVEYS table for storing logic rules as JSON. The backend must have GET and PUT endpoints for /surveys/{id}/logic that return and accept an array of logic rule objects. The backend must have a LogicRuleValidator service that validates rules before saving. The backend must have a LogicEvaluatorService that evaluates rules against answers at runtime.

---

## Data Structure

A logic rule has this shape in plain English:

Each rule has an id (a unique string like lr_abc123), a type (one of four values: visible_if, required_if, skip_to, or pipe_text), a conditions object, and an action object.

The conditions object has an operator (AND or OR) that determines whether all conditions must match or any single condition can match. It also has an items array of individual conditions. Each condition has a questionId (which question's answer to check), an operator (how to compare), and a value (what to compare against). The value can be a string, a number, or an array of strings depending on the operator.

The action object has a type (show, hide, require, skip_to, or pipe), and optionally a targetQuestionId (which question the action affects), a targetPageId (which page to skip to), or a pipeField (the field name for piped text).

The ten valid condition operators are: equals, not_equals, greater_than, less_than, between, contains, not_contains, is_empty, is_not_empty, and any_of. The operators is_empty and is_not_empty do not need a value. The operator between expects an array of two numbers. The operator any_of expects an array of strings.

The four rule types map to specific allowed action types. A visible_if rule can only have show or hide actions. A required_if rule can only have a require action. A skip_to rule can only have a skip_to action. A pipe_text rule can only have a pipe action.

---

## Tab Layout

The Configuration tab has two sub-tabs displayed as a secondary tab bar below the main Survey Editor tabs. The two sub-tabs are Flow View (the default, shown first) and Rules List. Only one sub-tab is visible at a time. The active sub-tab has an underline indicator.

On the right side of the sub-tab bar, aligned to the far right, is an Add Rule button styled as a primary navy pill button with a plus icon.

---

## Sub-Tab 1: Flow View

The Flow View is the primary interface for creating and editing logic rules in context. It is a two-panel layout.

### Left Panel: Question Sidebar

The left panel takes up approximately 30 percent of the width. It shows all questions from the survey organized by page.

Each page appears as a section header showing the page label (like "Page 1: Welcome" or just the page title). The section headers are styled in uppercase, smaller font, with a light gray color and a subtle bottom border.

Under each page section, questions are listed vertically. Each question row shows a circular badge with the question number (like Q1, Q2) in the brand purple color, followed by a truncated version of the question text (showing the first 40 or so characters with an ellipsis if longer).

If a question already has one or more logic rules configured for it, a small indicator appears on that question row — this can be a small colored dot, a rule count badge, or a subtle highlight to distinguish it from questions with no rules.

Clicking a question in the sidebar selects it. The selected question gets a highlighted background (light blue or light purple tint) and the right panel updates to show that question's context.

When the Configuration tab first loads, the first question in the first page is automatically selected.

### Right Panel: Flow Canvas

The right panel takes up the remaining 70 percent of the width. It shows the selected question's details and any rules associated with it.

At the top of the canvas, the selected question's context is displayed: the page label and question number (like "P1 Q1"), the full question text, and the question type as a subtle label.

Below the question context, if the selected question has existing rules, each rule is displayed as a rule card. If no rules exist, a centered message reads "No rules configured for this question" with a subtle Add Rule link or button below it.

When the user clicks the gear icon, configure button, or the Add Rule button, the rule editor form opens directly in the canvas — not in a separate modal or popup. The rule editor replaces the "no rules" message or appears below the existing rule cards.

### Rule Cards

Each existing rule card shows the rule type as a colored badge pill at the top left. The badge colors are: visible_if in green, required_if in orange, skip_to in blue, and pipe_text in purple.

Below the badge, the card shows a human-readable summary of the rule. The summary follows the pattern: IF [source question short text] [operator] [value] THEN [action] [target question short text]. For example: "IF P1 Q1: How was your experience equals Excellent THEN show P2 Q3: Tell us more."

At the bottom of each rule card are two small buttons: Edit (which opens the rule editor form pre-populated with this rule's data) and Delete (which removes the rule after a confirmation).

---

## Sub-Tab 2: Rules List

The Rules List sub-tab shows a flat table of ALL rules across ALL questions in the entire survey. This gives authors a bird's eye view of every rule.

The left side of the rules list shows an instructional message: "Select a rule to edit, or click Add Rule to create one." This message appears on the left when no rule is selected for editing.

The table has the following columns: Rule Type (displayed as a colored badge pill matching the colors described above), Source Question (the question whose answer triggers the rule, shown as page and question number like "P1 Q1" with truncated question text), Condition Summary (a brief text like "equals Engineering" or "greater than 3"), Action (the action type as text like "Show" or "Skip To"), Target (the target question or page, shown as "P2 Q3" or "Page 3"), and Actions (Edit and Delete icon buttons).

Each row in the table is clickable. Clicking a row selects it and opens the rule editor form on the left side or in a panel, pre-populated with that rule's data.

The Add Rule button in the sub-tab header also works from this view and opens a blank rule editor form.

---

## Rule Editor Form

The rule editor form is the core interface for creating and editing a single logic rule. It appears inline within the Flow View canvas or within the Rules List panel. It should not be a separate popup or modal — it should feel integrated into the tab.

The form has three sections arranged vertically.

### Section 1: Rule Type

A dropdown or segmented control that lets the author choose the rule type: visible_if, required_if, skip_to, or pipe_text. Each option shows a human-friendly label: "Show/Hide If", "Require If", "Skip To", "Pipe Text". Changing the rule type updates the available actions in Section 3.

### Section 2: Conditions (the IF)

This section is labeled "IF" or "When" in a subtle header.

First, there is a condition group operator selector. This is a small toggle or dropdown with two options: AND (meaning all conditions must be true) and OR (meaning any condition can be true). It defaults to AND.

Below the operator selector, condition rows are listed vertically. Each condition row has three fields arranged horizontally:

The first field is a Question dropdown. This dropdown lists all questions in the survey, organized by page. Each option shows the page label and question number followed by a truncated question text. For example: "P1 Q1: How was your Cohort experience" or "P2 Q3: Rate your onboarding." The dropdown should be searchable if the survey has many questions.

The second field is an Operator dropdown. This shows the ten valid operators with human-friendly labels: Equals, Not Equals, Greater Than, Less Than, Between, Contains, Not Contains, Is Empty, Is Not Empty, Any Of.

The third field is a Value input. The type of this input adapts based on the selected operator and the selected question's type. For equals and not_equals on a question with options (Single Select, Rating Scale, Radio Buttons), the value field should be a dropdown showing the question's available options. For equals and not_equals on a text question, it should be a free text input. For greater_than and less_than, it should be a number input. For between, it should show two number inputs (min and max). For contains and not_contains, it should be a text input. For is_empty and is_not_empty, the value field is hidden (these operators don't need a value). For any_of, it should show a multi-select dropdown of the question's options.

Each condition row also has a small remove button (an X icon) on the right side to delete that condition from the group. If there is only one condition, the remove button is hidden or disabled.

Below the condition rows, an Add Condition button (styled as a subtle text link with a plus icon) adds a new empty condition row.

### Section 3: Action (the THEN)

This section is labeled "THEN" or "Action" in a subtle header.

First, there is an Action Type dropdown. The available options change based on the rule type selected in Section 1. For visible_if rules, the options are Show and Hide. For required_if rules, the only option is Require. For skip_to rules, the only option is Skip To. For pipe_text rules, the only option is Pipe.

Below the action type, a target selector appears. The type of target depends on the action:

For Show, Hide, and Require actions, a Target Question dropdown appears. This dropdown lists all questions in the survey (same format as the condition question dropdown). The target question is the one that will be shown, hidden, or made required.

For Skip To actions, a Target dropdown appears that lets the author choose either a target question or a target page. The dropdown should show both questions and pages, with pages displayed as section headers like "Skip to Page: Welcome" and questions displayed as "Skip to Question: P2 Q3."

For Pipe actions, a Pipe Field Name text input appears. The author enters the field name that will be used to reference the piped value in other question texts (like "cohort_answer").

### Form Buttons

At the bottom of the rule editor form, two buttons appear: Save Rule (primary navy button) and Cancel (secondary gray button). Save Rule validates the form locally (all required fields filled) and then sends the full rules array to the backend PUT endpoint. Cancel discards unsaved changes and closes the editor form, returning to the previous view.

---

## Saving Rules

When the author saves a rule (either new or edited), the frontend builds the complete rules array including the new or modified rule and sends it to the backend via PUT /surveys/{id}/logic with the body containing a rules array.

The backend's LogicRuleValidator runs all validation checks. If validation passes, the rules are serialized to JSON and stored in the survey's logic_json column. The backend returns the saved rules array with a 200 status.

If validation fails, the backend returns a 422 status with an error response containing a message field that lists all validation errors separated by newlines. The frontend should display these errors to the author in an alert or error banner within the Configuration tab. The errors should not be silently swallowed.

---

## Deleting Rules

When the author clicks Delete on a rule card, a brief confirmation appears (either a confirm dialog or an inline "Are you sure?" with Yes/No buttons). If confirmed, the frontend removes the rule from the local array and sends the updated array to the backend. The rule card disappears from the view.

---

## Rule ID Generation

When creating a new rule, the frontend generates a unique rule ID. The format should be "lr_" followed by a random alphanumeric string of 8 to 10 characters. This ID is used internally to identify rules and is not displayed to the author.

---

## Runtime Evaluation

This section describes how rules are evaluated when a respondent takes the survey. This is separate from the authoring UI but is important context for understanding why the rules exist.

When a respondent answers questions, the frontend periodically sends the current answers to the backend via POST /surveys/{id}/evaluate with an answers map (question ID to answer value). The backend's LogicEvaluatorService processes all rules against the answers and returns a result object with four maps:

A visibilityMap that maps question IDs to boolean values indicating whether each question should be visible. A requiredMap that maps question IDs to boolean values indicating whether each question should be required. A skipTarget that is either null (no skip) or a string containing the question or page ID to skip to. A pipedValues map that maps pipe field names to their resolved text values.

The frontend Survey Responder page uses this evaluation result to dynamically show or hide questions, add or remove required indicators, navigate to skip targets, and replace piped text placeholders.

---

## Backend Validation Rules

The LogicRuleValidator in the middleware enforces the following checks when rules are saved. All errors are collected and returned together so the author can fix everything at once.

Structural checks: Every rule must have a valid type (visible_if, required_if, skip_to, or pipe_text). Every rule must have a non-null conditions object with at least one condition item. Every condition must have a questionId and a valid operator. Operators that compare values (everything except is_empty and is_not_empty) must have a non-null value. Every rule must have a non-null action with a valid action type (show, hide, require, skip_to, or pipe). The condition group operator must be AND or OR.

Referential checks: Every questionId referenced in conditions must exist in this survey (checked against both the database SURVEY_QUESTIONS table and the survey's pages JSON for composite IDs like PG-WELCOME-q0). Every targetQuestionId in actions must exist in this survey. Every targetPageId in actions must be a valid page ID in this survey's pages JSON. A skip_to action must have either a target question or a target page. A pipe action must have a non-empty pipeField.

Business rule checks: The rule type must be compatible with the action type (visible_if can only have show or hide, etc). A hide action cannot target a question that is marked as required in the survey, because respondents would be unable to complete the survey. Skip_to rules must not form circular references where Rule A skips to Q5 and Rule B on Q5 skips back to Q1, creating an infinite loop. This is detected using a graph traversal cycle detection algorithm. A skip_to rule cannot skip to a question that is referenced in its own conditions (self-skip), as this also creates an infinite loop. No two rules can have the same rule ID. A single rule cannot have duplicate conditions on the same question. The maximum number of rules per survey is 200. The maximum number of conditions per rule is 20. The survey must be in DRAFT status to edit rules — ACTIVE or CLOSED surveys cannot have their rules modified.

---

## Question ID Format

Questions can have two types of IDs depending on how they were created. Questions created through the API and stored in the SURVEY_QUESTIONS database table have numeric IDs like 1, 2, 3. Questions defined inline in the Form Builder's pages JSON have composite IDs that follow the pattern: the page ID, then a hyphen, then the letter q, then the question's zero-based index within that page. For example, PG-WELCOME-q0 is the first question on the Welcome page, PG-ENGAGE-q2 is the third question on the Engage page.

The validator accepts both formats. The frontend should use whatever format the questions already have — it should not convert between formats.

---

## Styling Guidelines

The Configuration tab follows the same design system as the rest of the Survey Editor. White background card containing all content. Sub-tab bar styled consistently with the main tab bar but slightly smaller. The question sidebar has a light gray background to distinguish it from the canvas. Rule cards have a subtle border, rounded corners, and a light shadow on hover. The rule editor form uses the same input components (dropdowns, text inputs, toggles) as the Details and Settings tabs. Badge pills for rule types use distinct colors: green for visible_if, orange for required_if, blue for skip_to, and purple for pipe_text. The Add Rule button is a navy pill button consistent with other primary actions in the app.

---

## State Management

The Configuration tab maintains its own local state within the Survey Editor component. Key state values include: the loaded logic rules array, the selected question ID in the Flow View sidebar, the active sub-tab (flow or rules), whether the rule editor is open, the rule currently being edited (null for new rules), and any save error messages.

When the Configuration tab becomes active (user clicks the tab), it loads the logic rules from the backend via GET /surveys/{id}/logic. When rules are modified and saved, the full array is sent to the backend via PUT /surveys/{id}/logic. The rules state is independent from the survey state — rules are loaded and saved through their own endpoints, not through the main survey PUT endpoint.

---

## API Endpoints Used

GET /surveys/{id}/logic — Returns the array of logic rules for a survey. Returns an empty array if no rules exist.

PUT /surveys/{id}/logic — Accepts a request body with a rules field containing the full array of logic rules. The backend validates all rules and either saves them (returning 200 with the rules array) or rejects them (returning 422 with error messages).

POST /surveys/{id}/evaluate — Accepts a request body with an answers map and returns the evaluation result. This endpoint is used by the Survey Responder, not by the Configuration tab itself, but is mentioned for completeness.

---

## Edge Cases

If the survey has no questions (empty pages array), the Configuration tab should show a message like "Add questions in the Form Builder before configuring logic rules."

If the survey is ACTIVE or CLOSED, the Configuration tab should still display existing rules (read-only) but the Add Rule button, Edit buttons, and Delete buttons should be disabled or hidden. The rule editor form should not be accessible. This matches the general pattern that ACTIVE and CLOSED surveys cannot be edited.

If the backend returns a validation error on save, the error messages should be displayed prominently in the tab (not just in a browser alert). The rule editor form should stay open so the author can fix the issues without losing their work.

If a question referenced by an existing rule is deleted from the Form Builder, the rule becomes orphaned. The next time rules are saved, the validator will catch the missing question reference and return an error. The Configuration tab should handle this gracefully by showing the orphaned rule with a warning indicator.
