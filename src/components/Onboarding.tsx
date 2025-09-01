// src/components/Onboarding.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { ChevronRight, Target, User as UserIcon, Sparkles } from 'lucide-react'

interface OnboardingProps {
  user: User
  onComplete: () => void
}

export default function Onboarding({ user, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1)
  const [firstName, setFirstName] = useState('')
  const [goal, setGoal] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const exampleGoals = [
    "Break free from self-limiting patterns",
    "Build unshakeable confidence",
    "Create the life I've been dreaming about",
    "Stop self-sabotage and follow through",
    "Align my actions with my true values",
    "Develop mental clarity and focus"
  ]

  const handleComplete = async () => {
    if (step === 1) {
      if (!firstName.trim()) {
        setError('Please enter your first name')
        return
      }
      setError('')
      setStep(2)
      return
    }

    if (step === 2) {
      if (!goal.trim()) {
        setError('Please share what you hope to achieve')
        return
      }
      setError('')
      setSaving(true)

      try {
        // Create or update profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email,
            first_name: firstName.trim(),
            goal: goal.trim(),
            onboarding_completed: true,
            current_day: 1,
            streak_count: 0,
            subscription_status: 'free',
            program_start_date: new Date().toISOString().split('T')[0]
          })

        if (profileError) throw profileError

        onComplete()
      } catch (err) {
        console.error('Error saving profile:', err)
        setError('Failed to save your information. Please try again.')
        setSaving(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}>
              2
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-center mb-3">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                {step === 1 ? (
                  <UserIcon className="w-8 h-8 text-white" />
                ) : (
                  <Target className="w-8 h-8 text-white" />
                )}
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center">
              {step === 1 ? 'Welcome to RealityOS!' : 'Set Your Intention'}
            </h1>
            <p className="text-center text-white/80 mt-2">
              {step === 1 
                ? "Let's personalize your journey" 
                : "What transformation are you seeking?"}
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 1 ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    What should we call you?
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value)
                      setError('')
                    }}
                    placeholder="Enter your first name"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    This is how we'll address you throughout the program
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    What do you hope to achieve with RealityOS?
                  </label>
                  <textarea
                    value={goal}
                    onChange={(e) => {
                      setGoal(e.target.value)
                      setError('')
                    }}
                    placeholder="Describe your goal or the change you're seeking..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    This will be your north star throughout the 28-day journey
                  </p>
                </div>

                {/* Example goals for inspiration */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Need inspiration? Here are some examples:
                  </p>
                  <div className="space-y-2">
                    {exampleGoals.map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => setGoal(example)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Sparkles className="w-3 h-3 inline mr-2 text-gray-400 dark:text-gray-500" />
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Action button */}
            <button
              onClick={handleComplete}
              disabled={saving}
              className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <span>{saving ? 'Setting up...' : step === 1 ? 'Continue' : 'Start Your Journey'}</span>
              {!saving && <ChevronRight className="w-4 h-4" />}
            </button>

            {/* Skip option for step 2 */}
            {step === 2 && !saving && (
              <button
                onClick={() => {
                  setGoal("Transform my life")
                  handleComplete()
                }}
                className="mt-2 w-full py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Skip for now (you can add this later)
              </button>
            )}
          </div>
        </div>

        {/* Bottom text */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Your 28-day transformation begins now
        </p>
      </div>
    </div>
  )
}