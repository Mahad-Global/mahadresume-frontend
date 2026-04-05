import React from 'react'
import { Link } from 'react-router-dom'

/**
 * MahadResume logo component
 * size: 'sm' | 'md' | 'lg'
 * to: link destination (default '/')
 * white: if true, renders wordmark in white (for dark backgrounds)
 */
export default function Logo({ size = 'md', to = '/', white = false }) {
  const sizes = {
    sm: { icon: 'w-7 h-7', text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-xl',  sub: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', sub: 'text-xs' },
  }
  const s = sizes[size] || sizes.md

  return (
    <Link to={to} className="inline-flex items-center gap-2 select-none">
      {/* Icon mark */}
      <div className={`${s.icon} relative shrink-0`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Navy circle background */}
          <circle cx="20" cy="20" r="20" fill="#0D1B2A"/>
          {/* Document body */}
          <rect x="10" y="8" width="16" height="22" rx="2" fill="#1A73E8"/>
          {/* Fold corner */}
          <path d="M22 8 L26 12 L22 12 Z" fill="#0D1B2A" opacity="0.5"/>
          <path d="M22 8 L26 12 L22 12 Z" fill="#4A90D9"/>
          {/* Text lines */}
          <rect x="13" y="15" width="10" height="1.5" rx="0.75" fill="white" opacity="0.9"/>
          <rect x="13" y="19" width="8" height="1.5" rx="0.75" fill="white" opacity="0.7"/>
          <rect x="13" y="23" width="6" height="1.5" rx="0.75" fill="white" opacity="0.5"/>
          {/* AI star badge */}
          <circle cx="28" cy="28" r="7" fill="#0097A7"/>
          <text x="28" y="32" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">AI</text>
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span className={`${s.text} font-bold tracking-tight ${white ? 'text-white' : 'text-[#0D1B2A]'}`}>
          Mahad<span className="text-[#0097A7]">Resume</span>
        </span>
        <span className={`${s.sub} font-medium tracking-wide uppercase ${white ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
          AI Resume Builder · UAE
        </span>
      </div>
    </Link>
  )
}
