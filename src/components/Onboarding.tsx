// src/components/Onboarding.tsx
'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Sparkles, Target, ArrowRight, Check } from 'lucide-react'
import content from '@/content/staticContent'

interface Props {
  user: User
  onComplete: () => void
}

export default function Onboarding({ user, onComplete }: Props) {
  const [step, setStep] = useState(1)
  const [firstName, setFirstName] = useState('')
  const [goal, setGoal] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  // Get onboarding content from static import
  const onboardingContent = content.onboarding

  const handleComplete = async () => {
    if (step === 1) {
      if (!firstName.trim()) {
        setError(onboardingContent.errors.nameRequired)
        return
      }
      setError('')
      setStep(2)
      return
    }

    if (step === 2) {
      if (!goal.trim()) {
        setError(onboardingContent.errors.goalRequired)
        return
      }
      setError('')
      setSaving(true)

      try {
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
        setError(onboardingContent.errors.saveFailed)
        setSaving(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-700 text-gray-400'
            }`}>
              {step > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <div className={`w-20 h-1 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-700'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-700 text-gray-400'
            }`}>
              2
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8">
          {step === 1 ? (
            <>
              {/* Step 1: Name */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {onboardingContent.headers.title}
                </h1>
                <p className="text-gray-400">
                  {onboardingContent.headers.subtitle}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {onboardingContent.steps.name.label}
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value)
                      setError('')
                    }}
                    placeholder={onboardingContent.steps.name.placeholder}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {onboardingContent.steps.name.helper}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Step 2: Goal */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {onboardingContent.headers.titleStep2}
                </h1>
                <p className="text-gray-400">
                  {onboardingContent.headers.subtitleStep2}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {onboardingContent.steps.goal.label}
                  </label>
                  <textarea
                    value={goal}
                    onChange={(e) => {
                      setGoal(e.target.value)
                      setError('')
                    }}
                    placeholder={onboardingContent.steps.goal.placeholder}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {onboardingContent.steps.goal.helper}
                  </p>
                </div>

                {/* Example Goals */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {onboardingContent.examples.title}
                  </p>
                  <div className="grid gap-2">
                    {onboardingContent.examples.goals.map((example: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setGoal(example)}
                        className="text-left px-3 py-2 text-sm text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <Sparkles className="w-3 h-3 inline mr-2 text-gray-500" />
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex gap-3">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
              >
                Back
              </button>
            )}
            
            <button
              onClick={handleComplete}
              disabled={saving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>
                {saving 
                  ? 'Setting up...' 
                  : step === 1 
                  ? onboardingContent.buttons.continue 
                  : onboardingContent.buttons.startJourney
                }
              </span>
              {!saving && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-6">
            {onboardingContent.footer}
          </p>
        </div>
      </div>
    </div>
  )
}