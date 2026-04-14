import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import Logo from './Logo'

const jobseekerNav = [
  { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
  { label: 'My Resumes', path: '/dashboard/resumes', icon: '📄' },
  { label: 'Templates', path: '/dashboard/templates', icon: '🎨' },
  { label: 'ATS Checker', path: '/dashboard/ats', icon: '🎯' },
  { label: 'Cover Letter', path: '/dashboard/cover-letter', icon: '✉️' },
  { label: 'Job Match', path: '/dashboard/jobs', icon: '💼' },
  { label: 'Documents', path: '/dashboard/documents', icon: '📁' },
  { label: 'My Profile', path: '/dashboard/profile', icon: '👤' },
  { label: 'Subscription', path: '/dashboard/subscription', icon: '⭐' },
]

const employerNav = [
  { label: 'Dashboard', path: '/employer', icon: '🏠' },
  { label: 'Campaigns', path: '/employer/campaigns', icon: '📢' },
  { label: 'Candidates', path: '/employer/candidates', icon: '👥' },
]

export default function DashboardLayout({ children }) {
  const { user, isEmployer, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = isEmployer() ? employerNav : jobseekerNav

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0D1B2A] transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:flex lg:flex-col
      `}>
        {/* Logo */}
        <div className="flex items-center px-6 py-5 border-b border-gray-800">
          <Logo size="sm" to="/" white />
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-gray-800">
          <p className="text-white text-sm font-medium truncate">{user?.email}</p>
          <span className="text-xs text-[#0097A7] capitalize">{user?.role || 'jobseeker'}</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-[#1A73E8] text-white font-medium'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center gap-4">
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1" />
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">← Back to site</Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
