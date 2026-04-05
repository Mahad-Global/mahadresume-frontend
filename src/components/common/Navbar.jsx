import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import Logo from './Logo'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout, isAuthenticated, isEmployer } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const dashboardPath = isEmployer() ? '/employer' : '/dashboard'

  const scrollTo = (id) => {
    setMenuOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navLinkClass = 'text-gray-300 hover:text-white transition-colors text-sm bg-transparent border-0 cursor-pointer'
  const mobileNavLinkClass = 'block w-full text-left text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 text-sm bg-transparent border-0 cursor-pointer'

  return (
    <nav className="bg-[#0D1B2A] border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Logo size="md" to="/" white />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollTo('features')} className={navLinkClass}>Features</button>
            <button onClick={() => scrollTo('pricing')} className={navLinkClass}>Pricing</button>
            <a href="/career-advice" className="text-gray-300 hover:text-white transition-colors text-sm">Career Advice</a>
            <button onClick={() => scrollTo('testimonials')} className={navLinkClass}>Testimonials</button>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated() ? (
              <>
                <Link to={dashboardPath} className="text-gray-300 hover:text-white transition-colors text-sm">Dashboard</Link>
                <button onClick={handleLogout} className="text-gray-300 hover:text-white transition-colors text-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors text-sm">Login</Link>
                <Link to="/register" className="bg-[#1A73E8] hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">Get Started Free</Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white p-2 rounded-lg hover:bg-white/10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 py-4 space-y-1">
            <button onClick={() => scrollTo('features')} className={mobileNavLinkClass}>Features</button>
            <button onClick={() => scrollTo('pricing')} className={mobileNavLinkClass}>Pricing</button>
            <a href="/career-advice" className="block text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 text-sm">Career Advice</a>
            <button onClick={() => scrollTo('testimonials')} className={mobileNavLinkClass}>Testimonials</button>
            <div className="border-t border-white/10 pt-3 mt-2 space-y-1">
              {isAuthenticated() ? (
                <>
                  <Link to={dashboardPath} onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 text-sm">Dashboard</Link>
                  <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="w-full text-left text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 text-sm">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 text-sm">Login</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="block bg-[#1A73E8] text-white px-3 py-2.5 rounded-lg text-center font-semibold text-sm mt-2">Get Started Free</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
