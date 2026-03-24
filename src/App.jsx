import { useDDRStore } from './store/useDDRStore'
import UploadPage from './pages/UploadPage'
import OverviewPage from './pages/OverviewPage'

export default function App() {
  const data = useDDRStore(state => state.data)

  return (
    <div className='min-h-screen bg-gray-950 text-gray-100 font-mono'>
      {data ? <OverviewPage /> : <UploadPage />}
    </div>
  )
}