// src/components/CompletedLessonView.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Edit, Calendar, Star, Target, Brain, Heart, AlertCircle } from 'lucide-react'
import InteractiveLessonFlow from './InteractiveLessonFlow'

interface Reflection {
  id: string
  lesson_id: number
  structured_data: any
  completed: boolean
  created_at: string
  updated_at: string
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

interface Props {
  lesson: Lesson
  userId: string
  onBack: () => void
}

export default function CompletedLessonView({ lesson, userId, onBack }: Props) {
  const [reflection, setReflection] = useState<Reflection | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchReflection()
  }, [lesson.id, userId])

  async function fetchReflection() {
    try {
      const { data, error } = await supabase
        .from('reflections')
        .select('*')
        .eq('user_id', userId)
        .eq('lesson_id', lesson.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setReflection(data)
    } catch (error) {
      console.error('Error fetching reflection:', error)
    } finally {
      setLoading(false)
    }
  }

  function getCategoryIcon(category: string) {
    switch(category) {
      case 'Conditioning': return '🧬'
      case 'Mind': return '🧠'
      case 'Emotional': return '❤️'
      case 'Unknown': return '❓'
      default: return '•'
    }
  }

  function getCategoryColor(category: string) {
    switch(category) {
      case 'Conditioning': return 'text-purple-400'
      case 'Mind': return 'text-blue-400'
      case 'Emotional': return 'text-red-400'
      case 'Unknown': return 'text-gray-400'
      default: return 'text-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (isEditing) {
    return (
      <InteractiveLessonFlow
        lesson={lesson}
        onComplete={() => {
          setIsEditing(false)
          fetchReflection()
        }}
        userId={userId}
        existingReflection={reflection}
      />
    )
  }

  if (!reflection || !reflection.structured_data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <div className="text-center py-20">
            <h2 className="text-3xl font-bold mb-4">No reflection found</h2>
            <p className="text-gray-400 mb-8">You haven't completed this lesson yet.</p>
            <button
              onClick={() => setIsEditing(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold transition-all"
            >
              Start This Lesson
            </button>
          </div>
        </div>
      </div>
    )
  }

  const data = reflection.structured_data
  const internalProblems = data.internalProblems || []
  const externalProblems = data.externalProblems || []

  // Group internal problems by category
  const categorizedProblems = internalProblems.reduce((acc: any, problem: any) => {
    const category = problem.category || 'Uncategorized'
    if (!acc[category]) acc[category] = []
    acc[category].push(problem)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            <Edit className="w-5 h-5" />
            Edit Reflection
          </button>
        </div>

        {/* Lesson Info */}
        <div className="mb-8">
          <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
            <Calendar className="w-4 h-4" />
            <span>Day {lesson.day_number} • Week {lesson.week_number}</span>
            <span>•</span>
            <span>Completed {new Date(reflection.created_at).toLocaleDateString()}</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">{lesson.title}</h1>
          
          {/* Rating Display */}
          {data.feedbackRating && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Your rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= data.feedbackRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-400">
              {internalProblems.length}
            </div>
            <div className="text-sm text-gray-400">Internal Problems</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-400">
              {externalProblems.length}
            </div>
            <div className="text-sm text-gray-400">External Problems</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">
              {Object.keys(categorizedProblems).length}
            </div>
            <div className="text-sm text-gray-400">Root Categories</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-400">
              {internalProblems.filter((p: any) => p.category && p.category !== 'Unknown').length}
            </div>
            <div className="text-sm text-gray-400">Categorized</div>
          </div>
        </div>

        {/* Internal Problems by Category */}
        {internalProblems.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-blue-400">💭</span>
              Internal Problems by Root Cause
            </h2>
            
            {Object.entries(categorizedProblems).map(([category, problems]: [string, any]) => (
              <div key={category} className="mb-6 last:mb-0">
                <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${getCategoryColor(category)}`}>
                  <span>{getCategoryIcon(category)}</span>
                  {category}
                  <span className="text-sm text-gray-400">({problems.length})</span>
                </h3>
                
                <div className="space-y-2">
                  {problems.map((problem: any, index: number) => (
                    <div key={problem.id || index} className="bg-gray-700 rounded-lg p-4">
                      <div className="text-white">{problem.text}</div>
                      {problem.subcategory && (
                        <div className="text-sm text-gray-400 mt-2 flex items-center gap-2">
                          <span>→</span>
                          <span>{problem.subcategory}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* External Problems with Assessments */}
        {externalProblems.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-orange-400">🌍</span>
              External Problems Assessment
            </h2>
            
            <div className="space-y-4">
              {externalProblems.map((problem: any, index: number) => (
                <div key={problem.id || index} className="bg-gray-700 rounded-lg p-4">
                  <div className="text-white font-semibold mb-3">{problem.text}</div>
                  
                  {problem.assessment && (
                    <>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <span className="text-sm text-gray-400">Control Level:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 bg-gray-600 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${problem.assessment.control * 10}%` }}
                              />
                            </div>
                            <span className="text-white text-sm">{problem.assessment.control}/10</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-400">Impact Level:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 bg-gray-600 rounded-full h-2">
                              <div 
                                className="bg-orange-500 h-2 rounded-full"
                                style={{ width: `${problem.assessment.impact * 10}%` }}
                              />
                            </div>
                            <span className="text-white text-sm">{problem.assessment.impact}/10</span>
                          </div>
                        </div>
                      </div>
                      
                      {problem.assessment.strategies && problem.assessment.strategies.length > 0 && (
                        <div>
                          <span className="text-sm text-gray-400">Strategies:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {problem.assessment.strategies.map((strategy: string) => (
                              <span key={strategy} className="px-3 py-1 bg-gray-600 rounded-full text-sm">
                                {strategy}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feedback Section */}
        {data.feedbackText && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-3">Your Feedback</h3>
            <p className="text-gray-300">{data.feedbackText}</p>
          </div>
        )}
      </div>
    </div>
  )
}