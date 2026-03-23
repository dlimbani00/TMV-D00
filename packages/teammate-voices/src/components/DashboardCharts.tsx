import { Card, CardBody } from '../design-system'
import BarChart from '@/components/BarChart'
import DonutChart from '@/components/DonutChart'
import {
  MOCK_REPORTS_PENDING,
  MOCK_REPORTS_COMPLETE,
  MOCK_STATUS,
} from '@/types/dashboard'

const TIMESTAMP = 'As of 01/01/2021 12:00 PM ET'

export default function DashboardCharts() {
  const statusTotal = MOCK_STATUS.reduce((sum, s) => sum + s.value, 0)

  return (
    <div className="dashboard__charts">
      <Card variant="outlined" padding="md">
        <CardBody>
          <BarChart
            title="Reports pending"
            subtitle={TIMESTAMP}
            data={MOCK_REPORTS_PENDING}
          />
        </CardBody>
      </Card>

      <Card variant="outlined" padding="md">
        <CardBody>
          <BarChart
            title="Reports complete"
            subtitle={TIMESTAMP}
            data={MOCK_REPORTS_COMPLETE}
          />
        </CardBody>
      </Card>

      <Card variant="outlined" padding="md">
        <CardBody>
          <DonutChart
            title="Status"
            subtitle={TIMESTAMP}
            segments={MOCK_STATUS}
            total={statusTotal}
          />
        </CardBody>
      </Card>
    </div>
  )
}
