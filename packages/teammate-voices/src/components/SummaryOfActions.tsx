import { useState } from 'react'
import { Button } from '../design-system'
import DataTable from '@/components/DataTable'
import { MOCK_ACTIONS } from '@/types/dashboard'
import type { ActionItem } from '@/types/dashboard'

const TABS = [
  'All actions',
  'Upcoming actions: Next 30 days',
  'Recent reports: Last 30 days',
] as const

const TABLE_COLUMNS: Array<{ key: keyof ActionItem; label: string }> = [
  { key: 'employeeName', label: 'Employee name' },
  { key: 'program', label: 'Program' },
  { key: 'task', label: 'Task' },
  { key: 'relationship', label: 'Relationship' },
  { key: 'dueDate', label: 'Due date' },
  { key: 'status', label: 'Status' },
]

export default function SummaryOfActions() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="dashboard__actions">
      <div className="dashboard__actions-header">
        <h2 className="dashboard__actions-title">Summary of actions</h2>
        <Button variant="ghost" size="sm">
          + Add action plan
        </Button>
      </div>

      <div className="dashboard__tabs">
        {TABS.map((tab, idx) => (
          <button
            key={tab}
            className={`dashboard__tab ${activeTab === idx ? 'dashboard__tab--active' : ''}`}
            onClick={() => setActiveTab(idx)}
          >
            {tab}
          </button>
        ))}
      </div>

      <DataTable
        columns={TABLE_COLUMNS}
        data={MOCK_ACTIONS}
      />
    </div>
  )
}
