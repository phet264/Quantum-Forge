import { ThemeProvider } from '@/components/theme-provider'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ProgressProvider } from '@/state/ProgressContext'
import { UserProvider } from '@/state/UserContext'
import { CircuitProvider } from '@/state/CircuitContext'


// Pages
import { Dashboard } from '@/pages/Dashboard'
import { Simulator } from '@/pages/Simulator'
import { CircuitBuilder } from '@/pages/CircuitBuilder'
import { Research } from '@/pages/Research'
import { LessonViewer } from '@/pages/LessonViewer'
import { AlgorithmViewer } from '@/pages/AlgorithmViewer'
import { Settings } from '@/pages/Settings'
import { NotFound } from '@/pages/NotFound'

import { Tutor } from '@/pages/Tutor'

function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <ProgressProvider>
          <CircuitProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<DashboardLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="simulator" element={<Simulator />} />
                    <Route path="circuit-builder" element={<CircuitBuilder />} />
                    <Route path="tutor" element={<Tutor />} />
                    <Route path="research">
                      <Route index element={<Research />} />
                      <Route path="lesson/:id" element={<LessonViewer />} />
                      <Route path="algorithm/:id" element={<AlgorithmViewer />} />
                    </Route>
                    <Route path="settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </ThemeProvider>
          </CircuitProvider>
        </ProgressProvider>
      </UserProvider>
    </ErrorBoundary>
  )
}

export default App
