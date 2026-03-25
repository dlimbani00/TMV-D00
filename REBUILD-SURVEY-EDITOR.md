# Teammate Voices — Survey Editor Rebuild Prompt

## What This Is

The Survey Editor is the most complex page in the application. It lives at /surveys/ followed by an ID then /edit for existing surveys and /surveys/new for creating. It is a five-tab authoring workspace where admins build, preview, configure logic, and manage email settings for a survey. Each tab is described in full detail below.

The editor uses a tab bar component across the top with five tabs: Details, Form Builder, Form Viewer, Configuration, and Settings. Only one tab is visible at a time. The active tab has an underline indicator in the brand navy color.

The page header shows a breadcrumb (Survey > survey name), the survey title as a large heading, a build status pill (Draft in yellow or Published in green), and action buttons on the right side. The action buttons change based on the survey lifecycle status — this is described at the end of this document.

---

## Tab 1: Details

The Details tab is a form for entering survey metadata. It is the first tab shown when creating a new survey.

The form is organized in rows inside a white card.

Row 1 has three fields side by side. Survey Name is a required text input with a helper text "Create a name for the survey." below it. Summary is an optional text input with helper text "Add a short description of the survey." Survey Status is a toggle switch labeled Active with On/Off text next to it. When toggled on, the survey status is set to ACTIVE. When toggled off, it stays DRAFT.

Row 2 has a single field. Program is a required select dropdown populated from the programs API endpoint. It shows all available programs by name. The helper text reads "Map the survey to a program." Below the program field is a horizontal divider line.

Row 3 has additional optional fields in a two-column grid. Participant Type is a select with options like ALL, NEW_HIRE, EXISTING_RESOURCE. Survey Stage is a select with options like ONBOARDING, MID_TRAINING, END_TRAINING. Audience Source is a text input. Cycle is a text input. Start Date and End Date are date inputs. Is Anonymous is a toggle switch defaulting to on.

At the bottom of the tab are two buttons: Save (secondary style) and Next (which advances to the Form Builder tab).

When Save is clicked, the survey is created via POST or updated via PUT to the backend. After saving, a brief success message appears. The Next button simply switches to the next tab without saving — the user must explicitly click Save.

---

## Tab 2: Form Builder

The Form Builder is where survey authors create and organize questions across multiple pages.

The layout has a page navigation panel on the left and a question editing area on the right.

The page navigation panel shows a vertical list of page tabs. Each tab shows the page label (like "Welcome", "Engagement", "Leadership"). There is an Add Page button at the bottom. Clicking a page tab selects that page and shows its questions in the main area. Pages can be reordered, renamed, and deleted. Each page has a page ID that follows the pattern PG- followed by a short label in uppercase (like PG-WELCOME, PG-ENGAGE).

When a page is selected, the main area shows the page title as an editable input at the top, an optional description field, a show description toggle, and then all questions for that page.

Each question is displayed as a card with the following elements. A question number badge on the left (like Q1, Q2). The question text as an editable text input. A question type dropdown selector. A question label input (short identifier). A Required toggle button styled as a small pill that highlights when active. A Configure button (gear icon) that opens the logic rule editor for this question. A Delete button to remove the question.

Below the question text, if the question type supports options (Single Select, Multiple Select, Radio Buttons, Checkboxes, Rating Scale), an options editor appears. This shows each option as an editable row with option text and option value. Options can be added, removed, and reordered. For Rating Scale, the options are typically numbered 1 through 5 with labels like Strongly Disagree through Strongly Agree.

At the bottom of the questions list is an Add Question section. This has a question type dropdown (showing all ten question types), an optional secondary type dropdown, and an Add Question button. When Add Question is clicked, a new question card is immediately created with the selected type and added to the current page.

The ten question types and how they render:

Single Select renders as a dropdown or radio button group in the viewer. The builder shows an options list editor where each option has text and a numeric value.

Multiple Select renders as a checkbox group. Same options editor as Single Select but respondents can pick multiple answers.

Rating Scale renders as a horizontal row of equal-sized clickable tiles. Typically 5 options from Strongly Disagree to Strongly Agree, each with a number (1-5) and label. The builder shows an options editor. In the viewer, all tiles must be the same size whether selected or not.

Grid Rating Scale renders as a matrix/table where rows are sub-questions and columns are rating options. The builder needs both a row editor and a column editor.

Radio Buttons renders as vertical radio buttons. Same as Single Select but always rendered as radio buttons, never a dropdown.

Checkboxes renders as vertical checkboxes. Same as Multiple Select but always rendered as checkboxes.

Single-line Input renders as a short text input field. No options needed in the builder.

Text Area renders as a multi-line text area for long-form responses. No options needed.

Sliding Scale renders as a horizontal slider with a numeric range. The builder needs a minimum value, maximum value, and step size.

Static Text renders as non-interactive instructional text. No response collected. The builder just needs the text content.

Questions are stored in the pages JSON on the survey. The pages JSON is an array of page objects, each containing a questions array. When the user modifies questions in the builder, the entire pages array is updated in the frontend state and saved to the backend when the user clicks Save.

---

## Tab 3: Form Viewer

The Form Viewer is a read-only preview that shows exactly how the survey will appear to respondents. It uses the same rendering component as the standalone Survey Responder page but without the submit button and without page-by-page navigation — it shows all pages and questions in a single scrollable view.

The viewer renders each page as a section with the page title as a heading, the page description in lighter text if show description is enabled, and then all questions.

Each question renders based on its type:

Rating Scale shows a horizontal row of equal-sized tiles. Each tile displays the option value number in bold and the option text below it in smaller text. All tiles are the same size. When a tile is selected (for demonstration only in preview), it gets a blue border and light blue background. The tiles should not change size when selected.

Single Select and Radio Buttons show vertical radio button options.

Multiple Select and Checkboxes show vertical checkbox options.

Single-line Input shows a text input field.

Text Area shows a multi-line textarea.

Sliding Scale shows a horizontal slider with the current value displayed.

Static Text shows formatted text content.

Required questions show an asterisk after the question text. In the Form Viewer, no validation occurs — it is purely visual preview. There is no Submit button because this is for authors to preview the survey, not to take it.

The viewer should indicate the question number (like 1, 2, 3) with a colored circle badge to the left of each question.

---

## Tab 4: Configuration

The Configuration tab is where authors define conditional logic rules that control survey behavior at runtime — showing/hiding questions, making questions required based on answers, skipping to different pages, and piping text values.

The tab has two sub-tabs: Flow View (the default, shown first) and Rules List. A sub-tab bar appears below the main tab bar.

### Flow View Sub-Tab

The layout is split into two panels. The left panel is a question sidebar listing all questions from all pages in the survey. The right panel is a flow canvas that shows the selected question's context and allows rule configuration.

The question sidebar shows questions grouped by page. Each page shows as a collapsible section header (like "Page 1: Welcome"). Under each page header, questions are listed with their question number, a short preview of the question text, and a small indicator if the question already has rules configured (like a colored dot or rule count badge). Clicking a question selects it and updates the flow canvas on the right.

When a question is selected, the flow canvas shows the question details at the top (page label, question number, full question text) and below that shows any existing rules for that question. If no rules exist, it shows a message like "No rules configured for this question" with an Add Rule button.

When Add Rule is clicked or when editing an existing rule, a rule editor form appears. The rule editor has three sections:

The Condition section is the IF part. It starts with a condition group operator selector (AND or OR — meaning all conditions must match or any condition can match). Below that are condition rows. Each row has a question selector dropdown (showing all questions in the survey by page and question text), an operator dropdown (equals, not equals, greater than, less than, between, contains, not contains, is empty, is not empty, any of), and a value input that adapts based on the operator and question type. An Add Condition button allows adding more condition rows. Each condition row has a remove button.

The Action section is the THEN part. It has an action type dropdown. The available action types depend on the rule type being created. For visible_if rules the actions are show or hide. For required_if rules the action is require. For skip_to rules the action is skip_to which requires selecting a target question or page. For pipe_text rules the action is pipe which requires specifying a pipe field name.

A target selector appears below the action type when applicable. For show, hide, and require actions, it is a target question dropdown. For skip_to, it can be either a target question or a target page. For pipe, it is a text field for the pipe field name.

Save Rule and Cancel buttons appear at the bottom of the rule editor. When saved, the rule is added to the survey's logic rules array and persisted to the backend via the save logic rules endpoint. The backend validates all rules before accepting them — if validation fails, an alert shows the error messages.

Existing rules for the selected question appear as cards showing the rule type as a colored badge (like "Skip To" in blue or "Visible If" in green), the condition summary (like "IF Q1 equals Engineering"), the action summary (like "THEN show Q5"), and Edit and Delete buttons.

### Rules List Sub-Tab

This sub-tab shows a flat table of ALL rules across all questions in the survey. Columns include the rule type (as a colored badge), the source question, the condition summary, the action summary, and Edit and Delete buttons. An Add Rule button appears at the top right. Clicking Add Rule opens the same rule editor form. Clicking Edit on any rule opens the editor pre-populated with that rule's data.

The left side of the Rules List should show a message like "Select a rule to edit, or click Add Rule to create one" when no rule is selected.

---

## Tab 5: Settings

The Settings tab manages email template assignments for the survey lifecycle and displays a pre-flight readiness checklist.

At the top of the tab is a Dispatch Readiness Checklist card. This card has a colored background — green if all checks pass, yellow if there are warnings. It shows the result of the backend's dispatch validation endpoint. Each check is displayed as a row with a pass/fail icon (green checkmark or red X), the check name in bold, and a detail message. Checks include whether the survey is Active, whether the linked program is Active, whether email templates are assigned for required trigger types, whether assigned templates are Active, and whether templates have valid from addresses and subject lines. A "Checking..." indicator shows while the validation is loading. The checklist refreshes whenever the Settings tab becomes active or when assignments change.

Below the checklist, if a test email was recently sent, a success or failure message appears as a colored banner — green for success, red for failure — that auto-dismisses after 5 seconds.

Below that is an Active Email Assignments table showing all email template assignments for this survey. Columns are Trigger Event (shown as a styled pill, like "Initial Invitation"), Email Template name, Delay (shown as days or "Immediate" if zero), Status (Active in green or Inactive in gray), and two action buttons: Send Test and Remove. Send Test triggers the backend to send a test email using that template. Remove deletes the assignment.

Below the assignments table is an Add Email Assignment card with a border. It contains three fields in a grid: Trigger Event dropdown (showing all nine trigger types — Initial Invitation, Reminder 1, 2, 3, Thank You, Survey Closed, Program Welcome, Program Complete, Ad Hoc), Email Template dropdown (showing only Active templates from the backend, displaying name and category), and Delay in Days number input. An Add Assignment button submits the form. After adding, the new assignment appears in the table above and the form resets.

If no assignments exist yet, a message below the add form says "No email assignments yet. Add one above to configure survey notifications."

---

## Header Buttons and Lifecycle Behavior

The Survey Editor header shows different buttons depending on the survey's current status.

When the survey status is Draft, three buttons appear: Delete (red destructive style, only shown in edit mode — not shown when creating a new survey), Cancel (secondary style, navigates back to the survey library), and Publish (secondary style, calls the publish workflow endpoint which validates, changes status to Active, sends notification, and writes audit log).

When the survey status is Active or Closed, only two buttons appear: Cancel (secondary, navigates back) and Clone (primary blue style, calls the clone endpoint which creates a deep copy with Draft status and navigates to the new survey's edit page). The Delete button is hidden. The Publish button is replaced by Clone. There is no warning banner or message — the backend enforces the edit lock by rejecting any PUT requests with a 422 error.

When the user clicks Clone, a copy of the survey is created with "Copy" appended to the title, Draft status, and all pages, questions, options, and logic rules duplicated. The user is navigated to the new survey's editor.

---

## State Management

The Survey Editor maintains its state in local component state (useState hooks), not in a global store. Key state values include the survey object (with all fields including pages array), the active tab key, loading and saving flags, a save message string, the logic rules array, and Settings tab state for email assignments, templates, dispatch checks, and test message.

The pages array is the most important state. It is an array of page objects, each containing a questions array. When the Form Builder modifies questions, it updates the pages array in state. When Save is clicked, the entire survey object including the pages array is sent to the backend.

Logic rules are loaded separately from the survey via the get logic rules endpoint and stored in their own state array. When rules change in the Configuration tab, they are saved to the backend via the save logic rules endpoint. The backend validates all rules before accepting them.

Email assignments are loaded when the Settings tab becomes active and stored in their own state array. The dispatch readiness checklist is also fetched when the Settings tab activates and re-fetched whenever assignments change.

---

## Data Flow

When the editor loads in edit mode, it fetches the survey by ID from the backend, parses the pages JSON string into an array, loads the list of programs for the Details tab dropdown, loads logic rules for the Configuration tab, and loads email assignments and templates for the Settings tab.

When the user clicks Save on any tab, the entire survey object is sent to the backend as a PUT request. The pages array is serialized back to a JSON string. If the survey is Active, the backend rejects the save with a 422 error.

When the user modifies logic rules and they auto-save (or explicitly save), the rules are sent to the backend's save logic rules endpoint. The backend's Logic Rule Validator checks all structural, referential, and business rules. If validation fails, an alert shows all error messages. If it passes, the rules are persisted as JSON in the survey's logic_json column.

When the user adds or removes email assignments, individual API calls are made for each add or delete operation. The assignments table refreshes after each operation.
