import React from 'react'
import { Link } from 'react-router-dom'

/**
 * MahadResume logo — uses actual brand assets
 * size: 'sm' | 'md' | 'lg'
 * to: link destination (default '/')
 * white: if true, subtitle renders lighter (for dark backgrounds)
 */
export default function Logo({ size = 'md', to = '/', white = false }) {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg', sub: 'text-[9px]', gap: 'gap-2' },
    md: { icon: 'w-10 h-10', text: 'text-xl', sub: 'text-[10px]', gap: 'gap-2.5' },
    lg: { icon: 'w-14 h-14', text: 'text-3xl', sub: 'text-xs', gap: 'gap-3' },
  }
  const s = sizes[size] || sizes.md

  return (
    <Link to={to} className={`inline-flex items-center ${s.gap} select-none`}>
      {/* Logo icon */}
      <img
        src="/logo-icon.png"
        alt="MahadResume"
        className={`${s.icon} object-contain`}
      />

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span className={`${s.text} font-extrabold tracking-tight`}>
          <span className="bg-gradient-to-r from-[#00D4FF] via-[#1A73E8] to-[#7B2FF7] bg-clip-text text-transparent">
            Mahad
          </span>
          <span className={white ? 'text-white' : 'text-[#384959]'}>
            Resume
          </span>
        </span>
        <span className={`${s.sub} font-medium tracking-wider uppercase ${white ? 'text-gray-400' : 'text-gray-400'} mt-0.5`}>
          AI Resume Builder
        </span>
      </div>
    </Link>
  )
}
