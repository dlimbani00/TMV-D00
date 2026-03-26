import { useState, useEffect, useMemo } from 'react'
import { EmptyState } from '../../design-system'
import LogicRuleCard from './LogicRuleCard'
import LogicRuleEditor from './LogicRuleEditor'
import { QuestionSidebar, FocusedFlowPanel, LogicRulesPopup } from '@/components/config'
import { buildQuestionList, getRulesSourcedFrom, getRulesTargeting } from '@/components/config/types'
import type { LogicRule } from '@/types/logic'
import type { SurveyPage } from '@/types/survey'
import { api } from '@/services/api'

interface LogicTabProps {
  surveyId?: number
  pages: SurveyPage[]
  logicRules: LogicRule[]
  onRulesChange: (rules: LogicRule[]) => void
  readOnly?: boolean
}

type SubTab = 'flow' | 'rules'

function generateId(): string {
  return 'lr_' + Math.random().toString(36).substring(2, 11)
}

function createEmptyRule(): LogicRule {
  return {
    id: generateId(),
    type: 'visible_if',
    conditions: { operator: 'AND', items: [] },
    action: { type: 'show' },
  }
}

export default function LogicTab({ surveyId, pages, logicRules, onRulesChange, readOnly = false }: LogicTabProps) {
  const [subTab, setSubTab] = useState<SubTab>('flow')
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null)
  const [editingRule, setEditingRule] = useState<LogicRule | null>(null)
  const [loading, setLoading] = useState(false)

  // Flow view state
  const [focusedQuestionId, setFocusedQuestionId] = useState<string | null>(null)
  const [popupQuestionId, setPopupQuestionId] = useState<string | null>(null)

  useEffect(() => {
    if (!surveyId) return
    setLoading(true)
    api.getLogicRules(surveyId)
      .then(rules => {
        if (rules && rules.length > 0) onRulesChange(rules)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [surveyId])

  const allQuestions = pages.flatMap((page, pageIdx) =>
    page.questions.map((q, qIdx) => ({
      id: q.questionId?.toString() || `${page.pageId}-q${qIdx}`,
      label: `P${pageIdx + 1} Q${qIdx + 1}: ${q.questionText || 'Untitled'}`,
      text: q.questionText || 'Untitled',
      type: q.questionType,
      options: (q.options || []).map(o => o.optionText),
      pageId: page.pageId,
      pageLabel: page.title || `Page ${pageIdx + 1}`,
    }))
  )

  const allPages = pages.map((page, idx) => ({
    id: page.pageId,
    label: page.title || `Page ${idx + 1}`,
  }))

  // Flow view data
  const flowQuestions = useMemo(() => buildQuestionList(pages), [pages])
  const focusedQuestion = flowQuestions.find(q => q.id === focusedQuestionId) || null
  const popupQuestion = flowQuestions.find(q => q.id === popupQuestionId) || null
  const pagesMeta = useMemo(() =>
    pages.map((p, i) => ({ id: p.pageId, label: p.title || `Page ${i + 1}` })),
    [pages]
  )

  // Auto-select first question in flow view
  useEffect(() => {
    if (subTab === 'flow' && !focusedQuestionId && flowQuestions.length > 0) {
      setFocusedQuestionId(flowQuestions[0].id)
    }
  }, [subTab, focusedQuestionId, flowQuestions])

  // --- Rules List handlers ---
  const handleAddRule = () => {
    const newRule = createEmptyRule()
    setEditingRule(newRule)
    setSelectedRuleId(newRule.id)
    setSubTab('rules')
  }

  const handleSelectRule = (ruleId: string) => {
    const rule = logicRules.find(r => r.id === ruleId)
    if (rule) {
      setEditingRule({ ...rule })
      setSelectedRuleId(ruleId)
    }
  }

  const handleSaveRule = (rule: LogicRule) => {
    const exists = logicRules.some(r => r.id === rule.id)
    const updated = exists
      ? logicRules.map(r => (r.id === rule.id ? rule : r))
      : [...logicRules, rule]
    onRulesChange(updated)
    setEditingRule(null)
    setSelectedRuleId(null)
  }

  const handleDeleteRule = (ruleId: string) => {
    onRulesChange(logicRules.filter(r => r.id !== ruleId))
    if (selectedRuleId === ruleId) {
      setEditingRule(null)
      setSelectedRuleId(null)
    }
  }

  const handleCancel = () => {
    setEditingRule(null)
    setSelectedRuleId(null)
  }

  // --- Flow view handlers ---
  const handleFlowSaveRule = (rule: LogicRule) => {
    const exists = logicRules.some(r => r.id === rule.id)
    const updated = exists
      ? logicRules.map(r => r.id === rule.id ? rule : r)
      : [...logicRules, rule]
    onRulesChange(updated)
  }

  const handleFlowDeleteRule = (ruleId: string) => {
    onRulesChange(logicRules.filter(r => r.id !== ruleId))
  }

  if (loading) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: '#86868b' }}>
        <p style={{ fontSize: 15 }}>Loading logic rules...</p>
      </div>
    )
  }

  return (
    <div className="logic-tab">
      {/* Sub-tab header */}
      <div className="logic-tab__subtab-header">
        <div className="logic-tab__subtabs">
          <button
            className={`logic-tab__subtab${subTab === 'flow' ? ' logic-tab__subtab--active' : ''}`}
            onClick={() => setSubTab('flow')}
          >
            Flow View
          </button>
          <button
            className={`logic-tab__subtab${subTab === 'rules' ? ' logic-tab__subtab--active' : ''}`}
            onClick={() => setSubTab('rules')}
          >
            Rules List
          </button>
        </div>
      </div>

      {/* Rules List sub-tab — editor on LEFT, rules list on RIGHT */}
      {subTab === 'rules' && (
        <div className="logic-tab__layout">
          <div className="logic-tab__editor">
            {readOnly ? (
              <div className="logic-tab__editor-empty">
                <p style={{ color: '#86868b', fontSize: 14 }}>
                  Rules are read-only because this survey is published. Clone the survey to make changes.
                </p>
              </div>
            ) : editingRule ? (
              <LogicRuleEditor
                rule={editingRule}
                questions={allQuestions}
                pages={allPages}
                onSave={handleSaveRule}
                onCancel={handleCancel}
                onDelete={() => handleDeleteRule(editingRule.id)}
                onChange={setEditingRule}
              />
            ) : (
              <div className="logic-tab__editor-empty">
                <p style={{ color: '#86868b', fontSize: 14 }}>
                  Select a rule to edit, or click "+ Add Rule" to create one.
                </p>
              </div>
            )}
          </div>

          <div className="logic-tab__list">
            {logicRules.length === 0 && !editingRule ? (
              <EmptyState
                title="No logic rules yet"
                message={readOnly
                  ? "No conditional logic rules configured for this survey."
                  : "Add conditional logic to control question visibility, requirements, and skip patterns."}
                action={readOnly ? undefined : { label: '+ Add Rule', onClick: handleAddRule }}
                icon={
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6e6e73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                }
              />
            ) : (
              <div className="logic-tab__rule-list">
                {logicRules.map(rule => (
                  <LogicRuleCard
                    key={rule.id}
                    rule={rule}
                    questions={allQuestions}
                    isSelected={selectedRuleId === rule.id}
                    onSelect={readOnly ? undefined : () => handleSelectRule(rule.id)}
                    onDelete={readOnly ? undefined : () => handleDeleteRule(rule.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Flow View sub-tab */}
      {subTab === 'flow' && (
        <div className="cfg-tab__flow-layout">
          <QuestionSidebar
            questions={flowQuestions}
            logicRules={logicRules}
            focusedQuestionId={focusedQuestionId}
            onSelectQuestion={setFocusedQuestionId}
          />
          <FocusedFlowPanel
            focusedQuestion={focusedQuestion}
            questions={flowQuestions}
            logicRules={logicRules}
            onFocusQuestion={setFocusedQuestionId}
            onOpenRules={setPopupQuestionId}
          />
        </div>
      )}

      {/* Logic Rules Popup (used by Flow View) — disabled in readOnly */}
      {popupQuestion && !readOnly && (
        <LogicRulesPopup
          open={!!popupQuestion}
          onClose={() => setPopupQuestionId(null)}
          question={popupQuestion}
          rules={getRulesSourcedFrom(popupQuestion.id, logicRules)}
          targetRules={getRulesTargeting(popupQuestion.id, logicRules)}
          allQuestions={flowQuestions}
          pages={pagesMeta}
          onSaveRule={handleFlowSaveRule}
          onDeleteRule={handleFlowDeleteRule}
        />
      )}
    </div>
  )
}
