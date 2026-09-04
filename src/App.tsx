import { ThemeProvider } from '@/components/theme-provider'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ProgressProvider } from '@/state/ProgressContext'
import { UserProvider, useUser } from '@/state/UserContext'
import { CircuitProvider } from '@/state/CircuitContext'
import { AssessmentProvider } from '@/state/AssessmentContext'
import { InstructorProvider } from '@/state/InstructorContext'
import { SharedCircuitsProvider } from '@/state/SharedCircuitsContext'
import { AnimationProvider } from '@/state/AnimationContext'


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
import { AssessmentView } from '@/pages/AssessmentView'
import { AssessmentsList } from '@/pages/AssessmentsList'
import { ChallengeView } from '@/pages/ChallengeView'
import { InstructorDashboard } from '@/pages/InstructorDashboard'
import { InstructorStudents } from '@/pages/InstructorStudents'
import { InstructorAssessments } from '@/pages/InstructorAssessments'
import { InstructorAnalytics } from '@/pages/InstructorAnalytics'
import { InstructorChallenges } from '@/pages/InstructorChallenges'
import { Progress } from '@/pages/Progress'

import { Navigate, Outlet } from 'react-router-dom'

function InstructorRoute() {
  const { user } = useUser()
  if (user?.role !== 'instructor') {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}

function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <ProgressProvider>
          <SharedCircuitsProvider>
            <CircuitProvider>
              <AnimationProvider>
                <AssessmentProvider>
                  <InstructorProvider>
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
                            <Route path="progress" element={<Progress />} />
                            <Route path="assessments" element={<AssessmentsList />} />
                            <Route path="assessment/:id" element={<AssessmentView />} />
                            <Route path="challenge/:assessmentId/:challengeId" element={<ChallengeView />} />
                            <Route path="instructor" element={<InstructorRoute />}>
                              <Route index element={<InstructorDashboard />} />
                              <Route path="students" element={<InstructorStudents />} />
                              <Route path="assessments" element={<InstructorAssessments />} />
                              <Route path="analytics" element={<InstructorAnalytics />} />
                              <Route path="challenges" element={<InstructorChallenges />} />
                            </Route>
                            <Route path="settings" element={<Settings />} />
                            <Route path="*" element={<NotFound />} />
                          </Route>
                        </Routes>
                      </BrowserRouter>
                    </ThemeProvider>
                  </InstructorProvider>
                </AssessmentProvider>
              </AnimationProvider>
            </CircuitProvider>
          </SharedCircuitsProvider>
        </ProgressProvider>
      </UserProvider>
    </ErrorBoundary>
  )
}

export default App
