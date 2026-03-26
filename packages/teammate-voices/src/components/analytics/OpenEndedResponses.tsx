import { useState } from 'react'
import type { OpenEndedItem } from '@/types/analytics'

interface Props {
  data: OpenEndedItem[]
}

export default function OpenEndedResponses({ data }: Props) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  if (!data || data.length === 0) {
    return <p style={{ color: '#86868b', textAlign: 'center', padding: 40 }}>No open-ended responses</p>
  }

  const toggle = (qId: number) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(qId)) next.delete(qId)
      else next.add(qId)
      return next
    })
  }

  return (
    <div className="analytics__chart-card analytics__chart-full">
      <h3 className="analytics__chart-title">Open-Ended Responses</h3>
      <p className="analytics__chart-subtitle">Click a question to expand all text answers</p>
      <div className="analytics__open-ended">
        {data.map(item => {
          const isOpen = expanded.has(item.questionId)
          return (
            <div key={item.questionId} className="analytics__oe-group">
              <button
                className={`analytics__oe-header${isOpen ? ' analytics__oe-header--open' : ''}`}
                onClick={() => toggle(item.questionId)}
              >
                <span className="analytics__oe-chevron">{isOpen ? '▼' : '▶'}</span>
                <span className="analytics__oe-question">{item.questionText}</span>
                <span className="analytics__oe-count">{item.answers.length} responses</span>
              </button>
              {isOpen && (
                <ul className="analytics__oe-answers">
                  {item.answers.map((answer, i) => (
                    <li key={i} className="analytics__oe-answer">{answer}</li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
