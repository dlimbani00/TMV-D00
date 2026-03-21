import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import Dashboard from '@/pages/Dashboard'
import Programs from '@/pages/Programs'
import ProgramCreate from '@/pages/ProgramCreate'
import SurveyList from '@/pages/SurveyList'
import SurveyCreate from '@/pages/SurveyCreate'
import SurveyEditor from '@/pages/SurveyEditor'
import ParticipantList from '@/pages/ParticipantList'
import AssignmentRules from '@/pages/AssignmentRules'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/new" element={<ProgramCreate />} />
          <Route path="/surveys" element={<SurveyList />} />
          <Route path="/surveys/new" element={<SurveyCreate />} />
          <Route path="/surveys/:surveyId/edit" element={<SurveyEditor />} />
          <Route path="/participants" element={<ParticipantList />} />
          <Route path="/rules" element={<AssignmentRules />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
