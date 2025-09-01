// src/components/LoginForm.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setSuccess('Check your email for confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        window.location.reload()
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address')
      return
    }
    
    setError('')
    setSuccess('')
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/`,
      })
      if (error) throw error
      setSuccess('Password reset link sent! Check your email.')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Welcome to RealityOS
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
          {resetMode 
            ? 'Reset your password' 
            : isSignUp 
            ? 'Create your account' 
            : 'Sign in to continue your journey'}
        </p>
        
        {resetMode ? (
          // Password Reset Form
          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              required
            />
            
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            
            {success && (
              <p className="text-sm text-green-500">{success}</p>
            )}
            
            <button
              onClick={handlePasswordReset}
              disabled={loading || !!success}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              {loading ? 'Sending...' : 'Send Reset Email'}
            </button>
            
            <button
              onClick={() => {
                setResetMode(false)
                setError('')
                setSuccess('')
              }}
              className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Back to login
            </button>
          </div>
        ) : (
          // Sign In/Up Form
          <>
            <form onSubmit={handleAuth} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                required
              />
              
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 characters)"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                required
                minLength={6}
              />
              
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              
              {success && (
                <p className="text-sm text-green-500">{success}</p>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
              >
                {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>
            
            <div className="mt-4 space-y-2">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError('')
                  setSuccess('')
                }}
                className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
              
              {!isSignUp && (
                <button
                  onClick={() => {
                    setResetMode(true)
                    setError('')
                    setSuccess('')
                  }}
                  className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Forgot your password?
                </button>
              )}
            </div>
          </>
        )}
        
        <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-6">
          Your 28-day transformation awaits
        </p>
      </div>
    </div>
  )
}