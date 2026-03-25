import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Layout from '@/components/Layout'
import Dashboard from '@/pages/Dashboard'
import Programs from '@/pages/Programs'
import ProgramCreate from '@/pages/ProgramCreate'
import ProgramDetail from '@/pages/ProgramDetail'
import SurveyList from '@/pages/SurveyList'
import SurveyEditor from '@/pages/SurveyEditor'
import SurveyResponder from '@/pages/SurveyResponder'
import ParticipantList from '@/pages/ParticipantList'
import AssignmentRules from '@/pages/AssignmentRules'
import Reports from '@/pages/Reports'
import Administration from '@/pages/Administration'
import EmailTemplateList from '@/pages/EmailTemplateList'
import EmailTemplateEditor from '@/pages/EmailTemplateEditor'

function LayoutWrapper() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public respondent routes — standalone, no nav/header */}
        <Route path="/respond/:token" element={<SurveyResponder />} />
        <Route path="/survey/:surveyId/respond" element={<SurveyResponder />} />

        {/* Admin routes — inside Layout with nav/header */}
        <Route element={<LayoutWrapper />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/new" element={<ProgramCreate />} />
          <Route path="/programs/:programId" element={<ProgramDetail />} />
          <Route path="/programs/:programId/edit" element={<ProgramCreate />} />
          <Route path="/surveys" element={<SurveyList />} />
          <Route path="/surveys/new" element={<SurveyEditor />} />
          <Route path="/surveys/:surveyId/edit" element={<SurveyEditor />} />
          <Route path="/participants" element={<ParticipantList />} />
          <Route path="/rules" element={<AssignmentRules />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/admin" element={<Administration />} />
          <Route path="/templates" element={<EmailTemplateList />} />
          <Route path="/templates/new" element={<EmailTemplateEditor />} />
          <Route path="/templates/:templateId/edit" element={<EmailTemplateEditor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
