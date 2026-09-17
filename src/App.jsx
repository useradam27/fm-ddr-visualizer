import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useDDRStore } from './store/useDDRStore'
import AppLayout from './components/layout/AppLayout'
import UploadPage from './pages/UploadPage'
import OverviewPage from './pages/OverviewPage'
import TablesPage from './pages/TablesPage'
import ScriptsPage from './pages/ScriptsPage'


function ComingSoon({ name }) {
  return <div className="p-8 text-gray-600 text-sm">{name} coming soon...</div>
}

export default function App() {
  const data = useDDRStore(state => state.data)
 
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
        <UploadPage />
      </div>
    )
  }
 
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppLayout>
        <Routes>
          <Route path="/"                  element={<OverviewPage />} />
          <Route path="/tables"            element={<TablesPage />} />
          <Route path="/tables/:tableId"   element={<TablesPage />} />
          <Route path="/scripts"           element={<ScriptsPage />} />
          <Route path="/scripts/:scriptId" element={<ScriptsPage />} />
          <Route path="/layouts"           element={<ComingSoon name="Layouts" />} />
          <Route path="/relationships"     element={<ComingSoon name="Relationships" />} />
          <Route path="/valuelists"        element={<ComingSoon name="Value Lists" />} />
          <Route path="/customfunctions"   element={<ComingSoon name="Custom Functions" />} />
          <Route path="/security"          element={<ComingSoon name="Security" />} />
          <Route path="/issues"            element={<ComingSoon name="Issues" />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}