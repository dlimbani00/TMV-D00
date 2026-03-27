import { Select, Input, Button } from '../../design-system'
import type { SelectOption } from '../../design-system'
import type { LogicCondition, LogicOperator, ConditionType } from '@/types/logic'
import {
  OPERATOR_LABELS,
  CHOICE_OPERATORS,
  RATING_OPERATORS,
  TEXT_OPERATORS,
  MULTI_CHOICE_OPERATORS,
  PARTICIPANT_FIELDS,
} from '@/types/logic'
import type { QuestionInfo } from './types'

interface ConditionRowProps {
  condition: LogicCondition
  questions: QuestionInfo[]
  onChange: (updated: LogicCondition) => void
  onRemove: () => void
  showConjunction?: 'AND' | 'OR' | null
}

function getOperatorsForType(questionType: string): LogicOperator[] {
  const t = questionType?.toLowerCase() || 'text'
  if (t.includes('multi') || t.includes('checkbox')) return MULTI_CHOICE_OPERATORS
  if (t.includes('rating') || t.includes('scale') || t.includes('nps')) return RATING_OPERATORS
  if (t.includes('choice') || t.includes('radio') || t.includes('dropdown') || t.includes('select')) return CHOICE_OPERATORS
  return TEXT_OPERATORS
}

function needsValueInput(operator: LogicOperator): boolean {
  return operator !== 'is_empty' && operator !== 'is_not_empty'
}

const SOURCE_OPTIONS: SelectOption[] = [
  { value: 'question', label: 'Survey Answer' },
  { value: 'participant', label: 'Participant Attribute' },
]

const PARTICIPANT_FIELD_OPTIONS: SelectOption[] = PARTICIPANT_FIELDS.map(f => ({
  value: f.value,
  label: f.label,
}))

const PARTICIPANT_FIELD_PRESETS: Record<string, string[]> = {
  participantType: ['NEW_HIRE', 'EXISTING_RESOURCE'],
  region: ['North America', 'APAC', 'EMEA', 'LATAM'],
  lineOfBusiness: ['Retail Banking', 'Corporate Banking', 'Wealth Management', 'Insurance', 'Capital Markets'],
}

export default function ConditionRow({
  condition, questions, onChange, onRemove, showConjunction,
}: ConditionRowProps) {
  const conditionType: ConditionType = condition.conditionType || 'question'
  const isParticipant = conditionType === 'participant'

  const selectedQ = questions.find(q => q.id === condition.questionId)
  const operators = isParticipant
    ? TEXT_OPERATORS
    : (selectedQ ? getOperatorsForType(selectedQ.type) : TEXT_OPERATORS)

  const questionOpts: SelectOption[] = questions.map(q => ({ value: q.id, label: q.label }))
  const operatorOpts: SelectOption[] = operators.map(op => ({ value: op, label: OPERATOR_LABELS[op] }))
  const hasChoices = !isParticipant && selectedQ?.options && selectedQ.options.length > 0
  const valueOpts: SelectOption[] = hasChoices ? selectedQ!.options.map(o => ({ value: o, label: o })) : []

  const participantPresets = isParticipant && condition.participantField
    ? (PARTICIPANT_FIELD_PRESETS[condition.participantField] || null)
    : null

  const handleSourceChange = (newType: ConditionType) => {
    onChange({
      conditionType: newType,
      questionId: newType === 'question' ? (condition.questionId || '') : undefined,
      participantField: newType === 'participant' ? (condition.participantField || PARTICIPANT_FIELDS[0].value) : undefined,
      operator: 'equals',
      value: '',
    })
  }

  return (
    <div className="cfg-condition-row">
      {showConjunction && (
        <span className="cfg-condition-row__conj">{showConjunction}</span>
      )}
      <div className="cfg-condition-row__fields">

        {/* Source type: Survey Answer vs Participant Attribute */}
        <div className="cfg-condition-row__field cfg-condition-row__field--source">
          <Select
            options={SOURCE_OPTIONS}
            value={conditionType}
            onChange={e => handleSourceChange(e.target.value as ConditionType)}
            fullWidth
          />
        </div>

        {/* Question selector OR participant field selector */}
        {isParticipant ? (
          <div className="cfg-condition-row__field cfg-condition-row__field--q">
            <Select
              options={PARTICIPANT_FIELD_OPTIONS}
              value={condition.participantField || ''}
              placeholder="Select attribute"
              onChange={e => onChange({ ...condition, conditionType: 'participant', participantField: e.target.value, operator: 'equals', value: '' })}
              fullWidth
            />
          </div>
        ) : (
          <div className="cfg-condition-row__field cfg-condition-row__field--q">
            <Select
              options={questionOpts}
              value={condition.questionId || ''}
              placeholder="Select question"
              onChange={e => onChange({ ...condition, conditionType: 'question', questionId: e.target.value, operator: 'equals', value: '' })}
              fullWidth
            />
          </div>
        )}

        <div className="cfg-condition-row__field cfg-condition-row__field--op">
          <Select
            options={operatorOpts}
            value={condition.operator}
            onChange={e => onChange({ ...condition, operator: e.target.value as LogicOperator })}
            fullWidth
          />
        </div>

        {needsValueInput(condition.operator) && (
          <div className="cfg-condition-row__field cfg-condition-row__field--val">
            {hasChoices ? (
              <Select
                options={valueOpts}
                value={String(condition.value || '')}
                placeholder="Select value"
                onChange={e => onChange({ ...condition, value: e.target.value })}
                fullWidth
              />
            ) : participantPresets ? (
              <Select
                options={participantPresets.map(v => ({ value: v, label: v }))}
                value={String(condition.value || '')}
                placeholder="Select value"
                onChange={e => onChange({ ...condition, value: e.target.value })}
                fullWidth
              />
            ) : (
              <Input
                value={String(condition.value || '')}
                placeholder="Enter value"
                onChange={e => onChange({ ...condition, value: e.target.value })}
                fullWidth
              />
            )}
          </div>
        )}

        <Button variant="ghost" size="sm" onClick={onRemove} aria-label="Remove condition">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
