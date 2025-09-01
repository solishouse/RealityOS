// src/components/Dashboard.tsx
'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Lock, CheckCircle, PlayCircle, Calendar, Target, ChevronRight, Info, ArrowLeft } from 'lucide-react'
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
    description: "This week, you'll identify the patterns and beliefs that have been running your life on autopilot. Through structured exercises, you'll uncover the roots of your struggles and reconnect with your authentic self."
  },
  2: {
    title: "Learn what shapes your reality",
    subtitle: "Understand the forces behind your results and patterns",
    description: "Dive deep into the mechanics of how thoughts, emotions, and actions create your experience. You'll learn the operating principles that determine what shows up in your life."
  },
  3: {
    title: "Build your new operating system",
    subtitle: "Rewire how you think, feel, and show up every day",
    description: "Time to install your upgrades. You'll develop new mental models, emotional responses, and behavioral patterns aligned with who you're becoming."
  },
  4: {
    title: "Live what you've learned",
    subtitle: "Turn your inner work into everyday choices",
    description: "Integration week. You'll create sustainable practices and systems to maintain your new operating system in real-world conditions."
  }
}

interface DashboardProps {
  user: User
  profile: Profile | null
}

export default function Dashboard({ user, profile }: DashboardProps) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [reflections, setReflections] = useState<Record<number, Reflection>>({})
  const [loading, setLoading] = useState(true)
  const [showWeekIntro, setShowWeekIntro] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(1)
  const [viewingCompleted, setViewingCompleted] = useState<Lesson | null>(null)

  useEffect(() => {
    fetchLessons()
    fetchReflections()
  }, [])

  async function fetchLessons() {
    const { data } = await supabase
      .from('lessons')
      .select('*')
      .order('day_number')
    
    if (data) {
      setLessons(data)
      const currentDay = profile?.current_day || 1
      const week = Math.ceil(currentDay / 7)
      setCurrentWeek(week)
    }
    setLoading(false)
  }

  async function fetchReflections() {
    const { data } = await supabase
      .from('reflections')
      .select('*')
      .eq('user_id', user.id)
    
    if (data) {
      const reflectionMap: Record<number, Reflection> = {}
      data.forEach(r => {
        reflectionMap[r.lesson_id] = r
      })
      setReflections(reflectionMap)
    }
  }

  const getLessonStatus = (lesson: Lesson) => {
    const reflection = reflections[lesson.id]
    if (reflection?.completed) return 'completed'
    if (lesson.day_number === (profile?.current_day || 1)) return 'current'
    if (lesson.day_number < (profile?.current_day || 1)) return 'available'
    return 'locked'
  }

  const handleLessonClick = (lesson: Lesson) => {
    const status = getLessonStatus(lesson)
    
    if (status === 'completed') {
      setViewingCompleted(lesson)
    } else if (status === 'current' || status === 'available') {
      // Check if it's the first lesson of a new week
      if (lesson.day_number % 7 === 1 && !reflections[lesson.id]) {
        setShowWeekIntro(true)
        setCurrentWeek(lesson.week_number)
      } else {
        setCurrentLesson(lesson)
      }
    }
  }

  // Handle viewing completed lessons
  if (viewingCompleted) {
    return (
      <CompletedLessonView
        lesson={viewingCompleted}
        reflection={reflections[viewingCompleted.id]}
        onBack={() => setViewingCompleted(null)}
        onEdit={() => {
          setCurrentLesson(viewingCompleted)
          setViewingCompleted(null)
        }}
      />
    )
  }

  // Show week introduction
  if (showWeekIntro) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Week {currentWeek}: {weekData[currentWeek].title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{weekData[currentWeek].subtitle}</p>
          <p className="text-gray-700 dark:text-gray-300 mb-8">{weekData[currentWeek].description}</p>
          <button
            onClick={() => {
              setShowWeekIntro(false)
              const firstLesson = lessons.find(l => l.week_number === currentWeek && l.day_number % 7 === 1)
              if (firstLesson) setCurrentLesson(firstLesson)
            }}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Start Week {currentWeek}
          </button>
        </div>
      </div>
    )
  }

  // Show current lesson
  if (currentLesson) {
    if ([1, 3].includes(currentLesson.day_number)) {
      return (
        <InteractiveLessonFlow
          lesson={currentLesson}
          userId={user.id}
          onComplete={() => {
            setCurrentLesson(null)
            fetchReflections()
          }}
          onBack={() => setCurrentLesson(null)}
        />
      )
    }
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <button
            onClick={() => setCurrentLesson(null)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Day {currentLesson.day_number}: {currentLesson.title}</h1>
            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
            
            {currentLesson.prompts && currentLesson.prompts.length > 0 && (
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reflection Prompts</h3>
                {currentLesson.prompts.map((prompt: string, idx: number) => (
                  <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300">{prompt}</p>
                  </div>
                ))}
              </div>
            )}
            
            <button
              onClick={() => {
                setCurrentLesson(null)
                fetchReflections()
              }}
              className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Complete Lesson
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  // Main Dashboard View
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {profile?.first_name || 'there'}!
          </h1>
          
          {profile?.goal && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Your Goal</p>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">{profile.goal}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Progress Timeline */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Your 28-Day Journey</h2>
            
            {/* Timeline */}
            <div className="relative">
              {[1, 2, 3, 4].map((weekNum: number) => {
                const weekLessons = lessons.filter(l => l.week_number === weekNum)
                const weekCompleted = weekLessons.every(l => reflections[l.id]?.completed)
                const weekInProgress = weekNum === currentWeek
                const weekLocked = weekNum > currentWeek
                
                return (
                  <div key={weekNum} className="relative">
                    {/* Connector Line */}
                    {weekNum < 4 && (
                      <div className={`absolute left-6 top-24 w-0.5 h-24 ${
                        weekNum < currentWeek ? 'bg-green-400 dark:bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`} />
                    )}
                    
                    {/* Week Section */}
                    <div className={`mb-8 ${weekLocked ? 'opacity-50' : ''}`}>
                      {/* Week Header */}
                      <div className="flex items-start space-x-4 mb-4">
                        {/* Week Status Icon */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                          weekCompleted 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : weekInProgress
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-4 ring-blue-50 dark:ring-blue-950/50'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                        }`}>
                          {weekCompleted ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : weekInProgress ? (
                            <PlayCircle className="w-6 h-6" />
                          ) : (
                            <span className="text-sm">{weekNum}</span>
                          )}
                        </div>
                        
                        {/* Week Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Week {weekNum} {weekInProgress && (
                                <span className="ml-2 text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                                  IN PROGRESS
                                </span>
                              )}
                            </h3>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 font-medium">{weekData[weekNum].title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{weekData[weekNum].subtitle}</p>
                          
                          {weekInProgress && (
                            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <p className="text-sm text-gray-600 dark:text-gray-400">{weekData[weekNum].description}</p>
                              <button className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-1">
                                <span>View week overview</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Week Modules */}
                      <div className="ml-16 space-y-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                          Week {weekNum} Modules
                        </p>
                        
                        <div className="grid gap-2">
                          {weekLessons.map((lesson) => {
                            const status = getLessonStatus(lesson)
                            const isInteractive = [1, 3].includes(lesson.day_number)
                            
                            return (
                              <button
                                key={lesson.id}
                                onClick={() => handleLessonClick(lesson)}
                                disabled={status === 'locked'}
                                className={`relative flex items-center justify-between p-3 rounded-lg border transition-all ${
                                  status === 'completed'
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 cursor-pointer'
                                    : status === 'current'
                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-pointer shadow-sm'
                                    : status === 'available'
                                    ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer'
                                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 cursor-not-allowed'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  {/* Day indicator */}
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                                    status === 'completed'
                                      ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                                      : status === 'current'
                                      ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                  }`}>
                                    {status === 'completed' ? '✓' : lesson.day_number}
                                  </div>
                                  
                                  {/* Lesson info */}
                                  <div className="text-left">
                                    <p className={`font-medium text-sm ${
                                      status === 'locked' ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'
                                    }`}>
                                      Day {lesson.day_number}: {lesson.title}
                                    </p>
                                    {isInteractive && (
                                      <span className="text-xs text-blue-600 dark:text-blue-400">Interactive Exercise</span>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Status/Action */}
                                <div className="flex items-center space-x-2">
                                  {status === 'locked' && (
                                    <div className="group relative">
                                      <Lock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                      <div className="absolute right-0 top-full mt-1 invisible group-hover:visible bg-gray-900 dark:bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                                        Must complete Day {lesson.day_number - 1} to unlock
                                      </div>
                                    </div>
                                  )}
                                  {status === 'completed' && (
                                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                  )}
                                  {status === 'current' && (
                                    <PlayCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                  )}
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current Day</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.current_day || 0}/28</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                🔥
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.streak_count || 0} days</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                📊
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(((profile?.current_day || 0) / 28) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}