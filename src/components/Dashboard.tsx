// src/components/Dashboard.tsx
'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Lock, CheckCircle, PlayCircle, Calendar, Target, ChevronRight, Info, ArrowLeft, X } from 'lucide-react'
import InteractiveLessonFlow from './InteractiveLessonFlow'
import CompletedLessonView from './CompletedLessonView'

interface Profile {
  id: string
  email: string
  first_name?: string
  subscription_status: string
  current_day: number
  streak_count: number
  goal?: string
}

interface Lesson {
  id: number
  day_number: number
  week_number: number
  title: string
  content: string
  prompts: string[]
  program_type: string
}

interface Reflection {
  id: string
  lesson_id: number
  content: any
  completed: boolean
  created_at: string
  updated_at: string
}

const weekData: Record<number, any> = {
  1: {
    title: "Align with your true self",
    subtitle: "Get clear on who you are and what's been holding you back",
    description: "This week, you'll identify the patterns and beliefs that have been running your life on autopilot. Through structured exercises, you'll uncover the roots of your struggles and reconnect with your authentic self.",
    topics: [
      "Expose the problems you're facing",
      "Identify root causes and patterns",
      "Map your current reality",
      "Clarify what you truly want",
      "Reconnect with your authentic self"
    ]
  },
  2: {
    title: "Learn what shapes your reality",
    subtitle: "Understand the forces behind your results and patterns",
    description: "Dive deep into the mechanics of how thoughts, emotions, and actions create your experience. You'll learn the operating principles that determine what shows up in your life.",
    topics: [
      "The thought-emotion-action loop",
      "How beliefs become reality",
      "Understanding energy and frequency",
      "The role of the subconscious mind",
      "Breaking automatic patterns"
    ]
  },
  3: {
    title: "Build your new operating system",
    subtitle: "Rewire how you think, feel, and show up every day",
    description: "Time to install your upgrades. You'll develop new mental models, emotional responses, and behavioral patterns aligned with who you're becoming.",
    topics: [
      "Design your ideal identity",
      "Create empowering beliefs",
      "Build new emotional patterns",
      "Develop aligned habits",
      "Practice embodiment exercises"
    ]
  },
  4: {
    title: "Live what you've learned",
    subtitle: "Turn your inner work into everyday choices",
    description: "Integration week. You'll create sustainable practices and systems to maintain your new operating system in real-world conditions.",
    topics: [
      "Create your daily practice",
      "Build accountability systems",
      "Navigate challenges and setbacks",
      "Maintain momentum long-term",
      "Design your next chapter"
    ]
  }
}

export default function Dashboard({ user }: { user: User }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [reflections, setReflections] = useState<Reflection[]>([])
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [viewingCompletedLesson, setViewingCompletedLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [showWeekModal, setShowWeekModal] = useState<number | null>(null)

  useEffect(() => {
    fetchData()
  }, [user])

  async function fetchData() {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError
      setProfile(profileData)

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .order('day_number', { ascending: true })

      if (lessonsError) throw lessonsError
      setLessons(lessonsData || [])

      // Fetch reflections
      const { data: reflectionsData, error: reflectionsError } = await supabase
        .from('reflections')
        .select('*')
        .eq('user_id', user.id)

      if (reflectionsError) throw reflectionsError
      setReflections(reflectionsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  function isLessonCompleted(lessonId: number) {
    return reflections.some(r => r.lesson_id === lessonId && r.completed)
  }

  function isLessonAccessible(dayNumber: number) {
    if (!profile) return false
    return dayNumber <= profile.current_day
  }

  async function completeLesson() {
    if (!profile) return

    const nextDay = profile.current_day + 1
    const { error } = await supabase
      .from('profiles')
      .update({ 
        current_day: nextDay,
        streak_count: profile.streak_count + 1
      })
      .eq('id', user.id)

    if (!error) {
      setProfile({ ...profile, current_day: nextDay, streak_count: profile.streak_count + 1 })
      setCurrentLesson(null)
      fetchData()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (currentLesson) {
    return (
      <InteractiveLessonFlow
        lesson={currentLesson}
        onComplete={completeLesson}
        userId={user.id}
      />
    )
  }

  if (viewingCompletedLesson) {
    return (
      <CompletedLessonView
        lesson={viewingCompletedLesson}
        userId={user.id}
        onBack={() => setViewingCompletedLesson(null)}
      />
    )
  }

  const currentWeek = profile ? Math.ceil(profile.current_day / 7) : 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      {/* Week Overview Modal */}
      {showWeekModal !== null && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-8">
          <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 p-6 border-b border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Week {showWeekModal}</h2>
                  <p className="text-xl text-blue-400">{weekData[showWeekModal].title}</p>
                </div>
                <button
                  onClick={() => setShowWeekModal(null)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Overview</h3>
                <p className="text-gray-400">{weekData[showWeekModal].description}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-3">What You'll Learn</h3>
                <ul className="space-y-2">
                  {weekData[showWeekModal].topics.map((topic: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-blue-400 mt-1">•</span>
                      <span className="text-gray-400">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-3">Daily Lessons</h3>
                <div className="space-y-2">
                  {lessons
                    .filter(l => l.week_number === showWeekModal)
                    .map(lesson => {
                      const isCompleted = isLessonCompleted(lesson.id)
                      const isAccessible = isLessonAccessible(lesson.day_number)
                      
                      return (
                        <div 
                          key={lesson.id}
                          className={`p-4 rounded-lg ${
                            isCompleted 
                              ? 'bg-green-900/30 border border-green-500/50'
                              : isAccessible
                              ? 'bg-gray-700'
                              : 'bg-gray-700/50 opacity-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-400">Day {lesson.day_number}</span>
                                {isCompleted && <CheckCircle className="w-4 h-4 text-green-400" />}
                              </div>
                              <div className="font-semibold mt-1">{lesson.title}</div>
                            </div>
                            {!isAccessible && <Lock className="w-5 h-5 text-gray-500" />}
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              
              <button
                onClick={() => setShowWeekModal(null)}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2">
            Welcome back{profile?.first_name ? `, ${profile.first_name}` : ''}!
          </h1>
          <p className="text-xl text-gray-400">Day {profile?.current_day} of your transformation journey</p>
        </div>

        {/* Progress Tracker at Top */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Your Journey</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-400">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-400">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                <span className="text-sm text-gray-400">Locked</span>
              </div>
            </div>
          </div>
          
          {/* Week Progress Nodes */}
          <div className="relative">
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-700"></div>
            <div className="relative flex justify-between">
              {[1, 2, 3, 4].map((week) => {
                const weekStart = (week - 1) * 7 + 1
                const weekEnd = week * 7
                const isCurrentWeek = profile && profile.current_day >= weekStart && profile.current_day <= weekEnd
                const isCompleted = profile && profile.current_day > weekEnd
                const isLocked = profile && profile.current_day < weekStart
                
                return (
                  <div key={week} className="flex flex-col items-center">
                    <button
                      onClick={() => setShowWeekModal(week)}
                      className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg transition-all transform hover:scale-110 ${
                        isCompleted 
                          ? 'bg-green-500 text-white'
                          : isCurrentWeek
                          ? 'bg-blue-500 text-white animate-pulse'
                          : isLocked
                          ? 'bg-gray-700 text-gray-400'
                          : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      {isCompleted ? '✓' : week}
                    </button>
                    <div className="mt-3 text-center">
                      <div className="text-sm font-semibold">Week {week}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {isCompleted ? 'Complete' : isCurrentWeek ? 'In Progress' : isLocked ? 'Locked' : 'Ready'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Stats and Goal */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-blue-400" />
              <span className="text-3xl font-bold">{profile?.streak_count || 0}</span>
            </div>
            <h3 className="text-lg font-semibold">Day Streak</h3>
            <p className="text-sm text-gray-400">Keep it going!</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-purple-400" />
              <span className="text-3xl font-bold">{Math.round(((profile?.current_day || 0) / 28) * 100)}%</span>
            </div>
            <h3 className="text-lg font-semibold">Progress</h3>
            <p className="text-sm text-gray-400">Day {profile?.current_day} of 28</p>
          </div>

          {profile?.goal && (
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-semibold text-gray-400">MY GOAL</h3>
              </div>
              <p className="text-gray-300 line-clamp-3">{profile.goal}</p>
            </div>
          )}
        </div>

        {/* Week Modules */}
        <div className="space-y-6">
          {[1, 2, 3, 4].map((weekNum) => {
            const weekLessons = lessons.filter(l => l.week_number === weekNum)
            const weekStart = (weekNum - 1) * 7 + 1
            const isWeekAccessible = profile && profile.current_day >= weekStart
            const isCurrentWeek = weekNum === currentWeek

            return (
              <div key={weekNum} className="bg-gray-800 rounded-2xl overflow-hidden">
                {/* Week Header */}
                <div className={`p-6 ${isCurrentWeek ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-semibold text-gray-400">WEEK {weekNum}</span>
                        {isCurrentWeek && (
                          <span className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl font-bold mb-1">{weekData[weekNum].title}</h2>
                      <p className="text-gray-400">{weekData[weekNum].subtitle}</p>
                    </div>
                    
                    <button
                      onClick={() => setShowWeekModal(weekNum)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <Info className="w-4 h-4" />
                      View Overview
                    </button>
                  </div>
                </div>

                {/* Lessons */}
                <div className="p-6 pt-0">
                  <div className="space-y-3">
                    {weekLessons.map((lesson) => {
                      const isCompleted = isLessonCompleted(lesson.id)
                      const isAccessible = isLessonAccessible(lesson.day_number)
                      const isCurrent = lesson.day_number === profile?.current_day

                      return (
                        <div
                          key={lesson.id}
                          className={`p-4 rounded-xl transition-all ${
                            isCompleted
                              ? 'bg-green-900/20 border border-green-500/30'
                              : isCurrent
                              ? 'bg-blue-900/20 border border-blue-500/30'
                              : isAccessible
                              ? 'bg-gray-700 hover:bg-gray-600'
                              : 'bg-gray-700/50 opacity-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                isCompleted
                                  ? 'bg-green-500'
                                  : isCurrent
                                  ? 'bg-blue-500'
                                  : 'bg-gray-600'
                              }`}>
                                {isCompleted ? (
                                  <CheckCircle className="w-6 h-6" />
                                ) : isAccessible ? (
                                  <span className="font-bold">{lesson.day_number}</span>
                                ) : (
                                  <Lock className="w-5 h-5" />
                                )}
                              </div>
                              
                              <div>
                                <h3 className="font-semibold text-lg">{lesson.title}</h3>
                                <p className="text-sm text-gray-400">Day {lesson.day_number}</p>
                              </div>
                            </div>

                            {isAccessible && (
                              <button
                                onClick={() => {
                                  if (isCompleted) {
                                    setViewingCompletedLesson(lesson)
                                  } else {
                                    setCurrentLesson(lesson)
                                  }
                                }}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                                  isCompleted
                                    ? 'bg-gray-700 hover:bg-gray-600'
                                    : isCurrent
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                                    : 'bg-gray-600 hover:bg-gray-500'
                                }`}
                              >
                                {isCompleted ? 'View' : isCurrent ? 'Start' : 'Resume'}
                                <ChevronRight className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}