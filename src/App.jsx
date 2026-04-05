import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'

// Lazy load pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPassword from './pages/auth/ForgotPassword'
import Dashboard from './pages/dashboard/Dashboard'
import ResumeBuilder from './pages/dashboard/ResumeBuilder'
import ATSChecker from './pages/dashboard/ATSChecker'
import Templates from './pages/dashboard/Templates'
import JobMatch from './pages/dashboard/JobMatch'
import CoverLetter from './pages/dashboard/CoverLetter'
import Subscription from './pages/dashboard/Subscription'
import EmployerDashboard from './pages/employer/EmployerDashboard'
import Campaigns from './pages/employer/Campaigns'
import Applications from './pages/employer/Applications'
import CandidateSearch from './pages/employer/CandidateSearch'
import ApplyPage from './pages/apply/ApplyPage'

const PrivateRoute = ({ children, employerOnly = false }) => {
  const { isAuthenticated, isEmployer } = useAuthStore()
  if (!isAuthenticated()) return <Navigate to="/login" replace />
  if (employerOnly && !isEmployer()) return <Navigate to="/dashboard" replace />
  return children
}

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, isEmployer } = useAuthStore()
  if (isAuthenticated()) {
    return <Navigate to={isEmployer() ? '/employer' : '/dashboard'} replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/apply/:inviteCode" element={<ApplyPage />} />

        {/* Auth */}
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Job Seeker Dashboard */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/dashboard/resume/:id?" element={<PrivateRoute><ResumeBuilder /></PrivateRoute>} />
        <Route path="/dashboard/ats" element={<PrivateRoute><ATSChecker /></PrivateRoute>} />
        <Route path="/dashboard/templates" element={<PrivateRoute><Templates /></PrivateRoute>} />
        <Route path="/dashboard/jobs" element={<PrivateRoute><JobMatch /></PrivateRoute>} />
        <Route path="/dashboard/cover-letter" element={<PrivateRoute><CoverLetter /></PrivateRoute>} />
        <Route path="/dashboard/subscription" element={<PrivateRoute><Subscription /></PrivateRoute>} />

        {/* Employer */}
        <Route path="/employer" element={<PrivateRoute employerOnly><EmployerDashboard /></PrivateRoute>} />
        <Route path="/employer/campaigns" element={<PrivateRoute employerOnly><Campaigns /></PrivateRoute>} />
        <Route path="/employer/campaigns/:id/applications" element={<PrivateRoute employerOnly><Applications /></PrivateRoute>} />
        <Route path="/employer/candidates" element={<PrivateRoute employerOnly><CandidateSearch /></PrivateRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
