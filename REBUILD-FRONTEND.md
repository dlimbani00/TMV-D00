# Teammate Voices — Frontend Rebuild Prompt

## What This Is

The presentation tier for an enterprise employee survey platform called Teammate Voices. A single-page React application with a custom Apple-inspired design system. No CSS frameworks — all styling is hand-written in one global stylesheet.

Built with React 18, TypeScript, Vite, React Router v6, and Zustand for state management. The API client is a class-based fetch wrapper that talks to the Spring Boot backend.

---

## Design System

The visual language is Apple-inspired — clean, minimal, lots of whitespace, San Francisco system font stack.

The primary brand color is navy blue (hex 012169) used for primary buttons, active navigation states, and focus rings. Destructive actions use red (hex c00). Text is near-black (hex 1d1d1f) for primary, medium gray (hex 86868b) for secondary labels. Page backgrounds are light gray (hex f5f5f7). Cards are white with a 1-pixel border in light gray (hex d2d2d7) and 12-pixel border radius.

Typography uses the system font stack starting with Apple's SF Pro. Page titles are 28 pixels bold. Card section titles are 15 pixels semibold uppercase with letter spacing. Body text is 14 pixels. Labels are 11 pixels semibold uppercase. All headings use font weight 600 or 700.

Cards have 28 pixels of internal padding. Inputs have 10 by 14 pixel padding with 8-pixel radius. Status pills are inline-block with 3 by 10 pixel padding, 20-pixel radius, and colored backgrounds — green for active, yellow for draft, gray for closed. Buttons come in three sizes: small (8 by 16 padding), medium (10 by 24), and large (12 by 32).

Tables use white backgrounds with light gray header rows (hex fafafa), single-pixel row borders, and subtle hover highlighting.

---

## Navigation Layout

The app has a fixed layout structure for all admin pages. At the very top is a navy blue brand bar showing the Teammate Voices logo, "Employee Survey" label, and a user greeting with avatar. Below that is a white navigation bar with five items: Home, Programs, Surveys (with a dropdown for Survey Library and Create Survey), Reports, and Administration. The active nav item has a blue underline.

Below the nav bar, each page shows a breadcrumb trail, then the page title with action buttons aligned to the right, then the main content area inside white cards. A footer at the bottom shows the Teammate Voices copyright.

The Survey Responder page is the only exception — it has NO navigation bar, NO brand bar, NO footer. It renders standalone with just the survey content centered on the page.

---

## Routing

The app has 19 routes split into two groups.

Public routes have no navigation wrapper. The survey responder loads at /respond/ followed by a dispatch token, and also at /survey/ followed by a survey ID then /respond. Both render the same standalone survey completion page.

Admin routes are wrapped in the layout with navigation. The root path shows the Dashboard. Programs live at /programs for the list, /programs/new for creating, /programs/ followed by an ID for detail view, and /programs/ followed by an ID then /edit for editing. Surveys follow the same pattern at /surveys, /surveys/new, and /surveys/ followed by an ID then /edit. Other pages include /participants, /rules, /reports, /admin, /templates, /templates/new, and /templates/ followed by an ID then /edit.

Important implementation note: use React Router v6 layout routes with the Outlet component for the admin wrapper. Do NOT use nested Routes inside a wildcard path — it breaks dynamic segment matching.

---

## Pages

### Dashboard (root path)

The admin landing page. Shows three summary metric cards at the top: Total Surveys, Active Programs, and Pending Responses. Below that is a bar chart showing survey completions by month and a donut chart showing response status breakdown. At the bottom is a recent activity list.

### Survey Library (/surveys)

A grid/table view of all surveys. Columns show Program, Survey Name, Summary, Cycle, Status, Build Status, and an Actions column. Filter tabs across the top let users switch between All, Active, Draft, and Closed surveys. There's a search bar and a Create Survey button.

The Actions column has a three-dot menu with Edit and Clone options. Status values are shown as colored pills — green for Active, yellow for Draft, gray for Closed.

### Survey Editor (/surveys/ followed by ID then /edit)

The main survey authoring tool with five tabs.

The Details tab has form fields for Survey Name (required), Summary, a Survey Status toggle, Program selector (dropdown populated from the API), Participant Type, Survey Stage, Audience Source, Start Date, End Date, and an Anonymous toggle. Save and Next buttons at the bottom.

The Form Builder tab is a multi-page question editor. A page list on the left allows adding and removing pages. The main area shows questions for the selected page. Each question has a text input, type dropdown, label field, required toggle, and an options editor for choice-based questions. Supported question types are Single Select, Multiple Select, Rating Scale, Grid Rating Scale, Radio Buttons, Checkboxes, Single-line Input, Text Area, Sliding Scale, and Static Text. An Add Question section at the bottom has a type selector and add button.

The Form Viewer tab shows a read-only preview of the survey using the same renderer as the Survey Responder, but without a submit button. This is for authors to preview how the survey looks.

The Configuration tab has two sub-tabs: Flow View (the default) and Rules List. Flow View shows a question sidebar on the left and a flow canvas on the right. Clicking a question opens a rule editor where you define conditions and actions. The Rules List sub-tab shows all rules in a flat table with Edit and Delete buttons. Rules follow an IF/THEN pattern: IF a question matches a condition THEN perform an action. Rule types are visible_if, required_if, skip_to, and pipe_text. Actions are show, hide, require, skip_to, and pipe.

The Settings tab shows email configuration. It has a pre-flight dispatch checklist showing readiness checks from the backend, a table of active email assignments showing trigger event, template name, delay, status, and Send Test/Remove buttons, and a form to add new assignments with trigger type dropdown, template dropdown, and delay days input.

The header buttons change based on survey lifecycle. For Draft surveys: Delete (red), Cancel, and Publish. For Active or Closed surveys: Cancel and Clone (blue). The Delete and Publish buttons are hidden when the survey is Active or Closed. No warning banner — the backend enforces the lock.

### Survey Responder (/respond/ followed by token)

A standalone public-facing page with no navigation. Loads the survey by dispatch token or direct survey ID. Renders one page at a time with Next and Back buttons. A progress bar shows completion at the top.

Rating Scale questions render as a horizontal row of equal-sized clickable tiles numbered 1 through 5. All tiles must be the same size whether selected or not. The selected tile gets a blue border and light blue background — no size change on click.

Required questions show validation errors if the user tries to advance without answering. After submitting, a thank you screen appears. If the survey is not Active, it shows a message saying the survey is currently not accepting responses.

### Programs (/programs)

A card grid layout. Each program card shows a status badge (Active green or Inactive gray), a survey progress badge (Not Started, In Progress, or Complete with matching colors), the program name, description, and a "View program details" link. There's a Hide Inactive toggle and an Add Program button. Each card has a three-dot menu with Edit and Delete options.

### Program Create (/programs/new and /programs/ followed by ID then /edit)

A form page for creating or editing programs. Fields include Template Type selector, Program Name (required), Description, and a Status toggle. Save and Cancel buttons at the bottom.

### Program Detail (/programs/ followed by ID)

Two-card layout. The top white card shows Program Information: a grid with Template Type, Program Name, Status (as a pill), and Survey Progress. Below that is a full-width Description field, then Created and Last Updated dates. At the bottom of the card is a metrics bar with four colored counters: Total (gray), Completed (green), Sent (blue), and Pending (gray).

The bottom gray-background card shows the Participants grid. The header has a title showing the participant count, a search input, and a status filter dropdown. The table columns are Name, Email, Cohort, Type, Status (as a colored pill), Stage, Reminders, and Submitted date. Status pills use green for Completed, blue for Sent and Opened, gray for Pending, red for Failed, orange for Expired, and light gray for Not Dispatched.

### Email Template List (/templates)

A grid view matching the Survey Library pattern. Category filter tabs across the top: All, Invitation, Reminder, Thank You, Welcome, etc. Search bar and action buttons for Edit, Clone, and Delete.

### Email Template Editor (/templates/ followed by ID then /edit)

A four-tab builder following the same pattern as the Survey Editor.

The Details tab has fields for template name, description, category (dropdown: Invitation, Reminder, Thank You, Welcome, Completion, Announcement, Custom), subject line, from name, and status toggle.

The Template Builder tab has a WYSIWYG editor using contentEditable. The toolbar has Bold, Italic, Underline, Link, Heading, List, and Align buttons. An Insert Merge Field dropdown groups available fields by category — Participant fields (name, email, cohort), Survey fields (title, link, due date), Program fields (name, description, company), and Sender fields. There's also a Card Block button that inserts a styled gray card section inside the email body. Merge fields render as inline pills showing the field name.

The Preview tab renders the HTML with merge fields replaced by sample data. Shows the subject line at the top.

The Settings tab allows assigning the template to programs and surveys with a trigger type and send delay in days.

### Other Pages

Participant List shows a table of all participants with type, cohort, and status columns. Assignment Rules allows creating rules that link participant types to survey stages. Reports is an analytics placeholder. Administration is the admin settings page with a link to email templates.

---

## Data Types

The frontend defines TypeScript interfaces for all data structures. Key entities include:

A Survey has an ID, title, description, template type, status (Draft, Active, or Closed), build status, program ID, pages array, logic JSON, dates, and various settings. Pages are arrays containing page objects, each with a page ID, title, label, description, sort order, and a questions array. Questions have text, type, label, sort order, required flag, and options array.

A Program has an ID, name, description, template type, status, survey progress, and timestamps. The Program Detail combines program info with a participants array where each row includes participant details plus their latest dispatch status.

A Participant has an ID, full name, email, type (New Hire or Existing Resource), cohort, dates, and active flag.

A Dispatch tracks survey delivery with ID, participant ID, survey ID, survey stage, status (Pending, Sent, Opened, Submitted, Failed, Expired), timestamps, and reminder count.

Logic Rules have an ID, type, condition group with AND/OR operator and condition items, and an action with type and target. Email Templates have an ID, name, description, category, subject, HTML body, merge fields, and status.

---

## API Client

A class-based fetch wrapper. All methods hit the backend at the configured API URL (default localhost port 8081 with /api prefix). Non-200 responses throw an Error with the message from the backend's JSON response.

The client has approximately 28 methods covering Surveys (list, get, create, update, delete, publish, clone), Programs (list, get, detail, create, update, delete), Logic Rules (get, save, evaluate), Email Templates (list, get, create, update, delete, duplicate, merge fields), Email Assignments (list, save, delete, by-survey, send test, validate dispatch), and Participants, Dispatches, and Assignment Rules.

The pages field on surveys requires serialization — the API stores it as a JSON string, so the client must parse it on load and stringify it on save.

---

## Build Order

Start with the design system tokens and base components like Button, Input, Modal, and Card. Then build the layout: brand bar, navigation, footer, breadcrumb, tab bar, and status pill. Set up routing with the layout wrapper. Create the API client and TypeScript types.

Build the Survey Library page first, then the Survey Editor starting with the Details tab, then Form Builder, then Form Viewer. Next build Programs with the card grid, create/edit form, and detail page with participant grid.

Add the Configuration tab for logic rules, then the Settings tab for email assignments. Build the Email Template List and Editor. Build the Survey Responder as a standalone page.

Finish with the Dashboard charts, Participant List, Assignment Rules, Reports, and Administration pages.
