import React from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-[#0D1B2A] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <Logo size="md" to="/" white />
            </div>
            <p className="text-sm leading-relaxed">
              AI-powered resume builder designed for UAE & Gulf job seekers. Land your dream job faster.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Get Started</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">For Employers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register" className="hover:text-white transition-colors">Post a Campaign</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Search Candidates</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Employer Plans</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:support@mahadresume.com" className="hover:text-white transition-colors">support@mahadresume.com</a></li>
              <li><a href="https://wa.me/14155238886" className="hover:text-white transition-colors">WhatsApp Bot</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">© 2026 MahadResume. All rights reserved.</p>
          <p className="text-sm">Built for UAE 🇦🇪 & Gulf 🌍 Job Seekers</p>
        </div>
      </div>
    </footer>
  )
}
