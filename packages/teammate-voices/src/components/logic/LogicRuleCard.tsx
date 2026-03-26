import { Card, CardBody } from '../../design-system'
import type { LogicRule } from '@/types/logic'
import { RULE_TYPE_LABELS, ACTION_TYPE_LABELS, OPERATOR_LABELS } from '@/types/logic'

interface QuestionInfo {
  id: string
  label: string
  text: string
  type: string
}

interface LogicRuleCardProps {
  rule: LogicRule
  questions: QuestionInfo[]
  isSelected: boolean
  onSelect?: () => void
  onDelete?: () => void
}

function getQuestionLabel(questionId: string, questions: QuestionInfo[]): string {
  const q = questions.find(q => q.id === questionId)
  return q ? q.label : `Q(${questionId})`
}

function buildRuleSentence(rule: LogicRule, questions: QuestionInfo[]): string {
  const conditions = rule.conditions.items.map((cond, i) => {
    const qLabel = getQuestionLabel(cond.questionId, questions)
    const opLabel = OPERATOR_LABELS[cond.operator] || cond.operator
    const valueStr = cond.operator === 'is_empty' || cond.operator === 'is_not_empty'
      ? ''
      : ` "${Array.isArray(cond.value) ? cond.value.join(', ') : cond.value}"`
    const prefix = i > 0 ? ` ${rule.conditions.operator} ` : ''
    return `${prefix}${qLabel} ${opLabel}${valueStr}`
  })

  const condStr = conditions.length > 0 ? conditions.join('') : 'no conditions'

  const actionLabel = ACTION_TYPE_LABELS[rule.action.type] || rule.action.type
  let targetStr = ''
  if (rule.action.targetQuestionId) {
    targetStr = getQuestionLabel(rule.action.targetQuestionId, questions)
  } else if (rule.action.targetPageId) {
    targetStr = `Page ${rule.action.targetPageId}`
  } else if (rule.action.pipeField) {
    targetStr = rule.action.pipeField
  }

  return `IF ${condStr} THEN ${actionLabel} ${targetStr}`.trim()
}

export default function LogicRuleCard({ rule, questions, isSelected, onSelect, onDelete }: LogicRuleCardProps) {
  return (
    <div
      className={`logic-rule-card${isSelected ? ' logic-rule-card--selected' : ''}`}
      onClick={onSelect || undefined}
      style={{ cursor: onSelect ? 'pointer' : 'default' }}
    >
      <Card variant="outlined" padding="sm">
        <CardBody>
          <div className="logic-rule-card__content">
            <div className="logic-rule-card__type">
              <span className="logic-rule-card__type-badge">
                {RULE_TYPE_LABELS[rule.type]}
              </span>
            </div>
            <p className="logic-rule-card__sentence">
              {buildRuleSentence(rule, questions)}
            </p>
            {onDelete && <button
              className="logic-rule-card__delete"
              onClick={(e) => { e.stopPropagation(); onDelete() }}
              aria-label="Delete rule"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
