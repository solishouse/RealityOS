// src/components/Profile.tsx
'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Save, Target, User as UserIcon, Mail, Calendar, Award, Edit2 } from 'lucide-react'

interface ProfileProps {
  user: User
  profile: any
  onBack: () => void
}

export default function Profile({ user, profile, onBack }: ProfileProps) {
  const [editing, setEditing] = useState(false)
  const [firstName, setFirstName] = useState(profile?.first_name || '')
  const [goal, setGoal] = useState(profile?.goal || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName.trim(),
          goal: goal.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      setMessage('Profile updated successfully!')
      setEditing(false)
      
      // Refresh the page to show updated data
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (err) {
      console.error('Error updating profile:', err)
      setMessage('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const joinDate = profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'
  const completionRate = Math.round(((profile?.current_day || 0) / 28) * 100)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-xl">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">
                  {firstName || 'User'}
                </h1>
                <p className="text-white/80">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 space-y-6">
            {/* Editable Fields */}
            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <UserIcon className="w-4 h-4" />
                    <span>First Name</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Target className="w-4 h-4" />
                    <span>Your Goal</span>
                  </label>
                  <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none"
                    placeholder="What do you hope to achieve with RealityOS?"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    This is your north star throughout the program
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false)
                      setFirstName(profile?.first_name || '')
                      setGoal(profile?.goal || '')
                      setMessage('')
                    }}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                {message && (
                  <div className={`p-3 rounded-lg ${
                    message.includes('success') 
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
                      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                  }`}>
                    {message}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Display Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <UserIcon className="w-4 h-4" />
                      <span>First Name</span>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {firstName || 'Not set'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                  </div>
                </div>

                {/* Goal Section */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <Target className="w-4 h-4" />
                    <span>Your Goal</span>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-blue-900 dark:text-blue-300">
                      {goal || 'No goal set yet. Click Edit Profile to add one.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Section (Always visible) */}
            {!editing && (
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Your Progress</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.current_day || 0}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Current Day</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.streak_count || 0}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Day Streak</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{completionRate}%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.ceil((profile?.current_day || 0) / 7)}/4
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Week</p>
                  </div>
                </div>
              </div>
            )}

            {/* Account Info (Always visible) */}
            {!editing && (
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Account Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Member Since</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{joinDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Award className="w-4 h-4" />
                      <span>Subscription</span>
                    </div>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      profile?.subscription_status === 'premium'
                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}>
                      {profile?.subscription_status === 'premium' ? 'Premium' : 'Free'} Plan
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}