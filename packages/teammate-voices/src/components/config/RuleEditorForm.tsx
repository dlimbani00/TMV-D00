import { useState } from 'react'
import { Button, Select } from '../../design-system'
import type { SelectOption } from '../../design-system'
import ConditionRow from './ConditionRow'
import type { QuestionInfo } from './types'
import type { LogicRule, LogicCondition, LogicOperator } from '@/types/logic'
import { RULE_TYPE_LABELS } from '@/types/logic'

interface RuleEditorFormProps {
  rule: LogicRule
  questions: QuestionInfo[]
  pages: { id: string; label: string }[]
  onSave: (rule: LogicRule) => void
  onCancel: () => void
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

export default function RuleEditorForm({
  rule: initialRule, questions, pages, onSave, onCancel,
}: RuleEditorFormProps) {
  const [rule, setRule] = useState<LogicRule>({ ...initialRule })

  const ruleTypeOpts: SelectOption[] = RULE_TYPES.map(r => ({ value: r.value, label: r.label }))
  const questionOpts: SelectOption[] = questions.map(q => ({ value: q.id, label: q.label }))
  const pageOpts: SelectOption[] = pages.map(p => ({ value: p.id, label: p.label }))

  const actionTypeOpts: SelectOption[] = (() => {
    switch (rule.type) {
      case 'visible_if': return [{ value: 'show', label: 'Show question' }, { value: 'hide', label: 'Hide question' }]
      case 'required_if': return [{ value: 'require', label: 'Make required' }]
      case 'skip_to': return [{ value: 'skip_to', label: 'Skip to' }]
      case 'pipe_text': return [{ value: 'pipe', label: 'Pipe answer' }]
      default: return []
    }
  })()

  const handleTypeChange = (newType: LogicRule['type']) => {
    const actionMap: Record<LogicRule['type'], LogicRule['action']['type']> = {
      visible_if: 'show', required_if: 'require', skip_to: 'skip_to', pipe_text: 'pipe',
    }
    setRule({ ...rule, type: newType, action: { type: actionMap[newType] } })
  }

  const handleAddCondition = () => {
    setRule({
      ...rule,
      conditions: { ...rule.conditions, items: [...rule.conditions.items, createEmptyCondition()] },
    })
  }

  const handleUpdateCondition = (idx: number, updated: LogicCondition) => {
    const items = [...rule.conditions.items]
    items[idx] = updated
    setRule({ ...rule, conditions: { ...rule.conditions, items } })
  }

  const handleRemoveCondition = (idx: number) => {
    setRule({
      ...rule,
      conditions: { ...rule.conditions, items: rule.conditions.items.filter((_, i) => i !== idx) },
    })
  }

  const toggleConjunction = () => {
    setRule({
      ...rule,
      conditions: { ...rule.conditions, operator: rule.conditions.operator === 'AND' ? 'OR' : 'AND' },
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
    <div className="cfg-rule-editor">
      <h4 className="cfg-rule-editor__title">
        {initialRule.conditions.items.length === 0 ? 'New Rule' : `Edit ${RULE_TYPE_LABELS[rule.type]} Rule`}
      </h4>

      {/* Rule type */}
      <div className="cfg-rule-editor__section">
        <label className="cfg-rule-editor__label">Rule Type</label>
        <Select options={ruleTypeOpts} value={rule.type}
          onChange={e => handleTypeChange(e.target.value as LogicRule['type'])} fullWidth />
      </div>

      {/* Conditions */}
      <div className="cfg-rule-editor__section">
        <div className="cfg-rule-editor__section-header">
          <label className="cfg-rule-editor__label">IF conditions are met</label>
          {rule.conditions.items.length > 1 && (
            <button className="cfg-rule-editor__conj-toggle" onClick={toggleConjunction}>
              Match <strong>{rule.conditions.operator === 'AND' ? 'ALL' : 'ANY'}</strong>
            </button>
          )}
        </div>
        <div className="cfg-rule-editor__conditions">
          {rule.conditions.items.map((cond, idx) => (
            <ConditionRow
              key={idx}
              condition={cond}
              questions={questions}
              onChange={updated => handleUpdateCondition(idx, updated)}
              onRemove={() => handleRemoveCondition(idx)}
              showConjunction={idx > 0 ? rule.conditions.operator : null}
            />
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={handleAddCondition}>+ Add Condition</Button>
      </div>

      {/* Action */}
      <div className="cfg-rule-editor__section">
        <label className="cfg-rule-editor__label">THEN</label>
        {actionTypeOpts.length > 1 && (
          <div className="cfg-rule-editor__action-row">
            <Select options={actionTypeOpts} value={rule.action.type}
              onChange={e => setRule({ ...rule, action: { ...rule.action, type: e.target.value as LogicRule['action']['type'] } })}
              fullWidth />
          </div>
        )}
        {(rule.type === 'visible_if' || rule.type === 'required_if') && (
          <div className="cfg-rule-editor__action-row">
            <Select options={questionOpts} value={rule.action.targetQuestionId || ''} placeholder="Select target question"
              onChange={e => setRule({ ...rule, action: { ...rule.action, targetQuestionId: e.target.value } })} fullWidth />
          </div>
        )}
        {rule.type === 'skip_to' && (
          <div className="cfg-rule-editor__action-row">
            <Select
              options={[...questionOpts, ...pageOpts.map(p => ({ ...p, label: `📄 ${p.label}` }))]}
              value={rule.action.targetQuestionId || rule.action.targetPageId || ''}
              placeholder="Skip to question or page"
              onChange={e => {
                const val = e.target.value
                const isPage = pages.some(p => p.id === val)
                setRule({
                  ...rule,
                  action: { ...rule.action, targetQuestionId: isPage ? undefined : val, targetPageId: isPage ? val : undefined },
                })
              }}
              fullWidth
            />
          </div>
        )}
        {rule.type === 'pipe_text' && (
          <div className="cfg-rule-editor__action-row">
            <Select options={questionOpts} value={rule.action.targetQuestionId || ''} placeholder="Pipe answer from question"
              onChange={e => setRule({ ...rule, action: { ...rule.action, targetQuestionId: e.target.value, pipeField: e.target.value } })} fullWidth />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="cfg-rule-editor__footer">
        <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" size="sm" onClick={() => onSave(rule)} disabled={!isValid}>Save Rule</Button>
      </div>
    </div>
  )
}
