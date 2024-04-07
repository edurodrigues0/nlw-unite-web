import { Route, Routes } from 'react-router-dom'
import Attendees from '../pages/attendees'
import Events from '../pages/events'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Events />} />
      <Route path="/participantes" element={<Attendees />} />
    </Routes>
  )
}
