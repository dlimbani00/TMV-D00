# Phase 1 API Contract (Lifecycle Survey MVP)

## Base
- Base URL: `/api`
- Auth: SSO session/JWT (to be wired)
- Roles:
  - `ADMIN`: create/edit/publish surveys, manage rules/imports
  - `INSTRUCTOR`: read scoped analytics only
  - `PARTICIPANT`: submit survey only

## Survey Model Additions
`Survey` payload now supports:
- `participantType`: `NEW_HIRE | EXISTING_RESOURCE | ALL`
- `surveyStage`: `ONBOARDING | MID_TRAINING | END_TRAINING`
- `audienceSource`: `AUTO_API | CSV_UPLOAD | GOOGLE_SHEET`
- `sourceRef`: API feed key, csv file name, or Google Sheet ID
- `autoSend`: `boolean`

---

## Endpoints

### 1) Surveys

#### `GET /surveys`
Returns all surveys visible to caller.

#### `POST /surveys` (ADMIN)
Create survey.

```json
{
  "title": "Onboarding Pulse",
  "description": "Week-1 onboarding pulse",
  "templateType": "CUSTOM",
  "status": "DRAFT",
  "isAnonymous": true,
  "participantType": "NEW_HIRE",
  "surveyStage": "ONBOARDING",
  "autoSend": true,
  "questions": []
}
```

#### `PUT /surveys/{surveyId}` (ADMIN)
Update survey.

#### `POST /surveys/{surveyId}/publish` (ADMIN)
Publish draft survey.

---

### 2) Participants

#### `GET /participants` (ADMIN)
List participant records.

#### `POST /participants/import/csv` (ADMIN)
Import participants from CSV.

Query params:
- `fileName`: uploaded CSV file identifier

Response:
```json
{ "imported": 150, "failed": 3 }
```

---

### 3) Assignment Rules

#### `GET /assignment-rules` (ADMIN)
List assignment rules.

#### `POST /assignment-rules` (ADMIN)
Create rule that maps participant type + stage to survey.

```json
{
  "name": "New Hire Onboarding Rule",
  "participantType": "NEW_HIRE",
  "surveyStage": "ONBOARDING",
  "surveyId": 101,
  "active": true,
  "sendDayOffset": 5
}
```

---

### 4) Dispatch (Phase 1 schema-ready)

#### `GET /dispatches?status=PENDING` (ADMIN)
Fetch pending/failed/sent dispatch records.

#### `POST /dispatches/run` (ADMIN)
Manual trigger to evaluate rules + create/send dispatches.

---

## Validation Rules
- One dispatch per `(participant_id, survey_id, survey_stage)`.
- `participantType` and `surveyStage` enums are strict.
- `INSTRUCTOR` cannot create/update/publish.

---

## Notes
- This contract is Phase 1 scaffolding for backend implementation.
- Frontend payloads are already aligned to these fields.
