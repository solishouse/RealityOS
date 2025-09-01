// src/app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import NavigationBar from '@/components/NavigationBar'
import Dashboard from '@/components/Dashboard'
import Onboarding from '@/components/Onboarding'
import Profile from '@/components/Profile'
import LoginForm from '@/components/LoginForm'

interface UserProfile {
  id: string
  email: string
  first_name?: string
  subscription_status: string
  current_day: number
  streak_count: number
  goal?: string
  onboarding_completed: boolean
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<'dashboard' | 'progress' | 'profile'>('dashboard')

  useEffect(() => {
    checkUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        fetchProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        setUser(user)
        await fetchProfile(user.id)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchProfile(userId: string) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileData) {
      setProfile(profileData)
    }
  }

  const handleOnboardingComplete = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  // Show loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400" />
      </div>
    )
  }

  // Show login form if no user
  if (!user) {
    return <LoginForm />
  }

  // Show onboarding if not completed
  if (!profile?.onboarding_completed) {
    return (
      <Onboarding 
        user={user} 
        onComplete={handleOnboardingComplete}
      />
    )
  }

  // Main app
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <NavigationBar 
        user={user}
        profile={profile}
        currentView={currentView}
        onNavigate={(view: any) => setCurrentView(view)}
      />
      
      {currentView === 'dashboard' && (
        <Dashboard user={user} profile={profile} />
      )}
      
      {currentView === 'progress' && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Your Progress</h1>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{profile?.current_day || 0}/28</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Days Completed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{profile?.streak_count || 0}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Current Streak</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {Math.round(((profile?.current_day || 0) / 28) * 100)}%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Progress</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  Week {Math.ceil((profile?.current_day || 1) / 7)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Current Week</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-8">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Overall Progress</span>
                <span>{profile?.current_day || 0} of 28 days</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((profile?.current_day || 0) / 28) * 100}%` }}
                />
              </div>
            </div>

            {/* Weekly Progress Grid */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Weekly Breakdown</h3>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((week) => {
                  const startDay = (week - 1) * 7 + 1
                  const endDay = week * 7
                  const currentDay = profile?.current_day || 0
                  const weekProgress = Math.max(0, Math.min(7, currentDay - startDay + 1))
                  const isCurrentWeek = currentDay >= startDay && currentDay <= endDay
                  
                  return (
                    <div key={week} className="flex items-center space-x-4">
                      <div className="w-20">
                        <span className={`text-sm font-medium ${
                          isCurrentWeek ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          Week {week}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex space-x-1">
                          {[...Array(7)].map((_, day) => {
                            const dayNumber = startDay + day
                            const isCompleted = dayNumber <= currentDay
                            const isCurrent = dayNumber === currentDay
                            
                            return (
                              <div
                                key={day}
                                className={`flex-1 h-8 rounded ${
                                  isCompleted
                                    ? 'bg-green-500 dark:bg-green-600'
                                    : isCurrent
                                    ? 'bg-blue-500 dark:bg-blue-600'
                                    : 'bg-gray-200 dark:bg-gray-800'
                                }`}
                                title={`Day ${dayNumber}`}
                              />
                            )
                          })}
                        </div>
                      </div>
                      <div className="w-16 text-right">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {weekProgress}/7
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {currentView === 'profile' && (
        <Profile 
          user={user} 
          profile={profile}
          onBack={() => setCurrentView('dashboard')}
        />
      )}
    </div>
  )
}