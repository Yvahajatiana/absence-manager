import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AbsenceListPage from './pages/AbsenceListPage'
import CreateAbsencePage from './pages/CreateAbsencePage'
import AbsenceDetailPage from './pages/AbsenceDetailPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/absences" element={<AbsenceListPage />} />
        <Route path="/absences/new" element={<CreateAbsencePage />} />
        <Route path="/absences/:id" element={<AbsenceDetailPage />} />
        <Route path="/absences/:id/edit" element={<CreateAbsencePage />} />
      </Routes>
    </Layout>
  )
}

export default App