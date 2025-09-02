// src/components/Profile.tsx
'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { User as UserIcon, Target, Calendar, Zap, Edit, Save, X, LogOut, Award } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Profile {
  id: string
  email: string
  first_name?: string
  subscription_status: string
  current_day: number
  streak_count: number
  goal?: string
}

export default function Profile({ user }: { user: User }) {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingGoal, setIsEditingGoal] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [goal, setGoal] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [user])

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      
      setProfile(data)
      setFirstName(data.first_name || '')
      setGoal(data.goal || '')
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile(field: 'first_name' | 'goal', value: string) {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [field]: value })
        .eq('id', user.id)

      if (error) throw error

      // Update local state
      setProfile(prev => prev ? { ...prev, [field]: value } : null)
      
      // Close edit mode
      if (field === 'first_name') setIsEditingName(false)
      if (field === 'goal') setIsEditingGoal(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white">Profile not found</div>
      </div>
    )
  }

  const completionPercentage = Math.round((profile.current_day / 28) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Profile</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Main Profile Card */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <UserIcon className="w-10 h-10" />
              </div>
              <div>
                {/* Name Section */}
                {isEditingName ? (
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="px-3 py-1 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter your name"
                      autoFocus
                    />
                    <button
                      onClick={() => updateProfile('first_name', firstName)}
                      disabled={saving}
                      className="p-1 text-green-400 hover:text-green-300"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setFirstName(profile.first_name || '')
                        setIsEditingName(false)
                      }}
                      className="p-1 text-gray-400 hover:text-gray-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-3xl font-bold">
                      {profile.first_name || 'Set Your Name'}
                    </h2>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  </div>
                )}
                <p className="text-gray-400">{profile.email}</p>
              </div>
            </div>
            
            {/* Subscription Badge */}
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
              profile.subscription_status === 'premium' 
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                : 'bg-gray-700 text-gray-300'
            }`}>
              {profile.subscription_status === 'premium' ? 'PREMIUM' : 'FREE TRIAL'}
            </div>
          </div>

          {/* Goal Section */}
          <div className="bg-gray-700 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold">My Goal</h3>
              </div>
              {!isEditingGoal && (
                <button
                  onClick={() => setIsEditingGoal(true)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {isEditingGoal ? (
              <div className="space-y-3">
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  rows={3}
                  placeholder="What do you want to achieve in the next 4 weeks?"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => updateProfile('goal', goal)}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save Goal'}
                  </button>
                  <button
                    onClick={() => {
                      setGoal(profile.goal || '')
                      setIsEditingGoal(false)
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-300">
                {profile.goal || 'Click edit to set your 4-week goal'}
              </p>
            )}
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-xl p-4 text-center">
              <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{profile.current_day}</div>
              <div className="text-sm text-gray-400">Current Day</div>
            </div>
            
            <div className="bg-gray-700 rounded-xl p-4 text-center">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{profile.streak_count}</div>
              <div className="text-sm text-gray-400">Day Streak</div>
            </div>
            
            <div className="bg-gray-700 rounded-xl p-4 text-center">
              <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{completionPercentage}%</div>
              <div className="text-sm text-gray-400">Complete</div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-semibold mb-6">Journey Progress</h3>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Day {profile.current_day} of 28</span>
              <span>{completionPercentage}% Complete</span>
            </div>
            <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-8">
            {[1, 2, 3, 4].map((week) => {
              const weekStart = (week - 1) * 7 + 1
              const weekEnd = week * 7
              const isCurrentWeek = profile.current_day >= weekStart && profile.current_day <= weekEnd
              const isCompleted = profile.current_day > weekEnd
              
              return (
                <div 
                  key={week}
                  className={`p-4 rounded-lg text-center transition-all ${
                    isCompleted 
                      ? 'bg-green-900/30 border-2 border-green-500'
                      : isCurrentWeek
                      ? 'bg-blue-900/30 border-2 border-blue-500'
                      : 'bg-gray-700 border-2 border-gray-600'
                  }`}
                >
                  <div className="text-sm text-gray-400 mb-1">Week {week}</div>
                  <div className="font-semibold">
                    {isCompleted ? '✓ Complete' : isCurrentWeek ? 'In Progress' : 'Upcoming'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-gray-800 rounded-2xl p-8">
          <h3 className="text-2xl font-semibold mb-6">Account Settings</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
              <div>
                <div className="font-semibold">Email</div>
                <div className="text-sm text-gray-400">{profile.email}</div>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
              <div>
                <div className="font-semibold">Subscription</div>
                <div className="text-sm text-gray-400">
                  {profile.subscription_status === 'premium' 
                    ? 'Premium Member' 
                    : 'Free Trial (7 days remaining)'
                  }
                </div>
              </div>
              {profile.subscription_status !== 'premium' && (
                <button className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg font-semibold transition-all">
                  Upgrade
                </button>
              )}
            </div>

            <button
              onClick={handleSignOut}
              className="w-full mt-6 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}