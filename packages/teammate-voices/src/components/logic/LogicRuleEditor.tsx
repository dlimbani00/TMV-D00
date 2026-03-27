import { useState } from 'react'
import { Button, Select, Card, CardBody } from '../../design-system'
import type { SelectOption } from '../../design-system'
import LogicConditionRow from './LogicConditionRow'
import type { LogicRule, LogicCondition, LogicOperator } from '@/types/logic'
import { RULE_TYPE_LABELS } from '@/types/logic'

interface QuestionInfo {
  id: string
  label: string
  text: string
  type: string
  options?: string[]
  pageId?: string
  pageLabel?: string
}

interface PageInfo {
  id?: string
  label: string
}

interface LogicRuleEditorProps {
  rule: LogicRule
  questions: QuestionInfo[]
  pages: PageInfo[]
  onSave: (rule: LogicRule) => void
  onCancel: () => void
  onDelete: () => void
  onChange: (rule: LogicRule) => void
}

const RULE_TYPES: { value: LogicRule['type']; label: string }[] = [
  { value: 'visible_if', label: 'Show / Hide' },
  { value: 'required_if', label: 'Make Required' },
  { value: 'skip_to', label: 'Skip To' },
  { value: 'pipe_text', label: 'Pipe Text' },
]

function createEmptyCondition(): LogicCondition {
  return { questionId: '', operator: 'equals' as LogicOperator, value: '' }
}

export default function LogicRuleEditor({
  rule,
  questions,
  pages,
  onSave,
  onCancel,
  onDelete,
  onChange,
}: LogicRuleEditorProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const ruleTypeOptions: SelectOption[] = RULE_TYPES.map(rt => ({
    value: rt.value,
    label: rt.label,
  }))

  const questionOptions: SelectOption[] = questions.map(q => ({
    value: q.id,
    label: q.label,
  }))

  const pageOptions: SelectOption[] = pages.map(p => ({
    value: String(p.id || ''),
    label: p.label,
  }))

  // Action type depends on rule type
  const actionTypeOptions: SelectOption[] = (() => {
    switch (rule.type) {
      case 'visible_if':
        return [
          { value: 'show', label: 'Show question' },
          { value: 'hide', label: 'Hide question' },
        ]
      case 'required_if':
        return [{ value: 'require', label: 'Make required' }]
      case 'skip_to':
        return [{ value: 'skip_to', label: 'Skip to' }]
      case 'pipe_text':
        return [{ value: 'pipe', label: 'Pipe answer' }]
      default:
        return []
    }
  })()

  const handleTypeChange = (newType: LogicRule['type']) => {
    const actionMap: Record<LogicRule['type'], LogicRule['action']['type']> = {
      visible_if: 'show',
      required_if: 'require',
      skip_to: 'skip_to',
      pipe_text: 'pipe',
    }
    onChange({
      ...rule,
      type: newType,
      action: { type: actionMap[newType] },
    })
  }

  const handleAddCondition = () => {
    onChange({
      ...rule,
      conditions: {
        ...rule.conditions,
        items: [...rule.conditions.items, createEmptyCondition()],
      },
    })
  }

  const handleUpdateCondition = (index: number, updated: LogicCondition) => {
    const items = [...rule.conditions.items]
    items[index] = updated
    onChange({ ...rule, conditions: { ...rule.conditions, items } })
  }

  const handleRemoveCondition = (index: number) => {
    const items = rule.conditions.items.filter((_, i) => i !== index)
    onChange({ ...rule, conditions: { ...rule.conditions, items } })
  }

  const toggleConjunction = () => {
    onChange({
      ...rule,
      conditions: {
        ...rule.conditions,
        operator: rule.conditions.operator === 'AND' ? 'OR' : 'AND',
      },
    })
  }

  const isValid =
    rule.conditions.items.length > 0 &&
    rule.conditions.items.every(c =>
      c.conditionType === 'participant' ? !!c.participantField : !!c.questionId
    ) &&
    (rule.type !== 'visible_if' || rule.action.targetQuestionId) &&
    (rule.type !== 'required_if' || rule.action.targetQuestionId) &&
    (rule.type !== 'skip_to' || rule.action.targetQuestionId || rule.action.targetPageId)

  return (
    <div className="logic-editor">
      <Card variant="outlined" padding="md">
        <CardBody>
          <div className="logic-editor__header">
            <h3 className="logic-editor__title">
              {RULE_TYPE_LABELS[rule.type]} Rule
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </Button>
          </div>

          {/* Rule Type */}
          <div className="logic-editor__section">
            <label className="logic-editor__label">Rule Type</label>
            <Select
              options={ruleTypeOptions}
              value={rule.type}
              onChange={(e) => handleTypeChange(e.target.value as LogicRule['type'])}
              fullWidth
            />
          </div>

          {/* Conditions */}
          <div className="logic-editor__section">
            <div className="logic-editor__section-header">
              <label className="logic-editor__label">IF conditions are met</label>
              {rule.conditions.items.length > 1 && (
                <button
                  className="logic-editor__conjunction-toggle"
                  onClick={toggleConjunction}
                >
                  Match <strong>{rule.conditions.operator === 'AND' ? 'ALL' : 'ANY'}</strong>
                </button>
              )}
            </div>

            <div className="logic-editor__conditions">
              {rule.conditions.items.map((cond, idx) => (
                <LogicConditionRow
                  key={idx}
                  condition={cond}
                  questions={questions}
                  onChange={(updated) => handleUpdateCondition(idx, updated)}
                  onRemove={() => handleRemoveCondition(idx)}
                  showConjunction={idx > 0 ? rule.conditions.operator : null}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddCondition}
            >
              + Add Condition
            </Button>
          </div>

          {/* Action Config */}
          <div className="logic-editor__section">
            <label className="logic-editor__label">THEN</label>

            {actionTypeOptions.length > 1 && (
              <div className="logic-editor__action-row">
                <Select
                  options={actionTypeOptions}
                  value={rule.action.type}
                  onChange={(e) =>
                    onChange({
                      ...rule,
                      action: { ...rule.action, type: e.target.value as LogicRule['action']['type'] },
                    })
                  }
                  fullWidth
                />
              </div>
            )}

            {(rule.type === 'visible_if' || rule.type === 'required_if') && (
              <div className="logic-editor__action-row">
                <Select
                  options={questionOptions}
                  value={rule.action.targetQuestionId || ''}
                  placeholder="Select target question"
                  onChange={(e) =>
                    onChange({
                      ...rule,
                      action: { ...rule.action, targetQuestionId: e.target.value },
                    })
                  }
                  fullWidth
                />
              </div>
            )}

            {rule.type === 'skip_to' && (
              <div className="logic-editor__action-row">
                <Select
                  options={[...questionOptions, ...pageOptions.map(p => ({ ...p, label: `📄 ${p.label}` }))]}
                  value={rule.action.targetQuestionId || rule.action.targetPageId?.toString() || ''}
                  placeholder="Skip to question or page"
                  onChange={(e) => {
                    const val = e.target.value
                    const isPage = pages.some(p => String(p.id) === val)
                    onChange({
                      ...rule,
                      action: {
                        ...rule.action,
                        targetQuestionId: isPage ? undefined : val,
                        targetPageId: isPage ? val : undefined,
                      },
                    })
                  }}
                  fullWidth
                />
              </div>
            )}

            {rule.type === 'pipe_text' && (
              <div className="logic-editor__action-row">
                <Select
                  options={questionOptions}
                  value={rule.action.targetQuestionId || ''}
                  placeholder="Pipe answer from question"
                  onChange={(e) =>
                    onChange({
                      ...rule,
                      action: { ...rule.action, targetQuestionId: e.target.value, pipeField: e.target.value },
                    })
                  }
                  fullWidth
                />
              </div>
            )}
          </div>

          {/* Delete confirmation */}
          {showDeleteConfirm && (
            <div className="logic-editor__delete-confirm">
              <p>Delete this rule?</p>
              <div className="logic-editor__delete-actions">
                <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" size="sm" onClick={onDelete}>
                  Delete
                </Button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="logic-editor__footer">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onSave(rule)}
              disabled={!isValid}
            >
              Save Rule
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
