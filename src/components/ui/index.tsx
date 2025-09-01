'use client'

import React from 'react'

// Simple Button component for now
export const Button = ({ children, className = '', ...props }: any) => {
  return (
    <button
      className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// Simple Badge component
export const Badge = ({ children, variant = 'default', size = 'md', className = '', ...props }: any) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700 ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

// Export other components as empty for now
export const Card = ({ children, className = '', ...props }: any) => (
  <div className={`bg-white rounded-lg shadow ${className}`} {...props}>{children}</div>
)

export const CardHeader = ({ children, ...props }: any) => (
  <div className="p-6 border-b" {...props}>{children}</div>
)

export const CardContent = ({ children, ...props }: any) => (
  <div className="p-6" {...props}>{children}</div>
)

export const Input = ({ ...props }: any) => (
  <input className="w-full px-4 py-2 border rounded-lg" {...props} />
)

export const Textarea = ({ ...props }: any) => (
  <textarea className="w-full px-4 py-2 border rounded-lg" {...props} />
)

export const Progress = ({ value = 0, max = 100 }: any) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(value/max)*100}%` }} />
  </div>
)

export const Skeleton = ({ className = '' }: any) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
)