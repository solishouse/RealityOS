// src/components/InteractiveLessonFlow.tsx - DARK MODE UPDATED VERSION
'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, ChevronLeft, X, AlertCircle, Sparkles, Home } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import ExternalProblemAssessment from './ExternalProblemAssessment'

// Types
interface InternalProblem {
  id: string
  text: string
  category?: string
  subcategory?: string
  linkedExternalIds?: string[]
}

interface ExternalProblem {
  id: string
  text: string
  linkedInternalIds: string[]
  assessment?: {
    whatBothers: string
    howItFeels: string
    storyTelling: string
    contributing?: string
  }
}

// Root categories with subcategories
const rootCategories = {
  conditioning: {
    name: "Conditioning & External Pressure",
    color: "bg-red-500 dark:bg-red-600",
    description: "Default habits or norms you absorbed, not chose",
    subcategories: [
      { id: "cultural_norms", name: "Cultural norms", description: "What your culture teaches is 'normal' or 'right'" },
      { id: "external_pressure", name: "External pressure", description: "Expectations from others or society" },
      { id: "authority_influence", name: "Authority or family influence", description: "Expectations from parents, teachers, or power figures" },
      { id: "systems", name: "Systems you were raised in", description: "Environments that shaped how safe or free you felt" }
    ]
  },
  mind: {
    name: "The Mind",
    color: "bg-blue-500 dark:bg-blue-600",
    description: "Mental patterns and thought loops",
    subcategories: [
      { id: "fear", name: "Fear", description: "Avoidance or control driven by threat" },
      { id: "insecurity", name: "Insecurity", description: "Low self-trust or self-worth" },
      { id: "ego", name: "Ego", description: "Attachment to identity or being right" },
      { id: "limiting_beliefs", name: "Limiting beliefs", description: "Stories that limit what you think is possible" }
    ]
  },
  emotional: {
    name: "Emotional Residue & Survival",
    color: "bg-purple-500 dark:bg-purple-600",
    description: "Unprocessed emotions and protective patterns",
    subcategories: [
      { id: "unmet_needs", name: "Unmet needs", description: "Emotional or physical needs that were ignored" },
      { id: "trauma_patterns", name: "Trauma patterns", description: "Responses rooted in past stress or harm" },
      { id: "disconnection", name: "Disconnection", description: "Feeling numb or cut off from yourself/others" },
      { id: "avoidance", name: "Avoidance", description: "Escaping discomfort through distraction" },
      { id: "burnout", name: "Burnout", description: "Depletion from chronic strain" }
    ]
  },
  unknown: {
    name: "Unknown",
    color: "bg-yellow-500 dark:bg-yellow-600",
    description: "Unclear or out of your control",
    subcategories: [
      { id: "unclear", name: "Unclear source", description: "Not sure where this comes from yet" }
    ]
  }
}

export default function InteractiveLessonFlow({ 
  lesson,
  onComplete,
  userId 
}: {
  lesson: any
  onComplete: () => void
  userId: string
}) {
  const [currentStage, setCurrentStage] = useState(0)
  const [internalProblems, setInternalProblems] = useState<InternalProblem[]>([])
  const [externalProblems, setExternalProblems] = useState<ExternalProblem[]>([])
  const [currentProblem, setCurrentProblem] = useState("")
  const [problemType, setProblemType] = useState<'internal' | 'external'>('internal')
  const [saving, setSaving] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [feedbackText, setFeedbackText] = useState("")
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [currentExternalIndex, setCurrentExternalIndex] = useState(0)

  async function saveReflection(data: any) {
    setSaving(true)
    try {
      await supabase.from('reflections').upsert({
        user_id: userId,
        lesson_id: lesson.id,
        structured_data: data,
        completed_at: new Date().toISOString(),
      })

      if (feedbackRating > 0 || feedbackText) {
        await supabase.from('feedback').insert({
          user_id: userId,
          lesson_id: lesson.id,
          rating: feedbackRating,
          feedback_text: feedbackText,
          feedback_type: 'lesson'
        })
      }

      await supabase
        .from('profiles')
        .update({ 
          current_day: lesson.day_number + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      setShowCelebration(true)
      setTimeout(() => {
        onComplete()
      }, 3000)
    } catch (error) {
      console.error('Error saving:', error)
    } finally {
      setSaving(false)
    }
  }

  // Day 1 Flow
  if (lesson.day_number === 1) {
    // Stage 0: Problem Collection
    if (currentStage === 0) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white p-4">
          <div className="max-w-3xl mx-auto">
            {/* Navigation */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={onComplete}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span className="font-mono text-sm">DASHBOARD</span>
              </button>
              <div className="text-gray-500 dark:text-gray-500 font-mono text-sm">
                DAY 1 • STEP 1 OF {externalProblems.length > 0 ? '4' : '3'}
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-4">Lay everything out</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Let's get real about what's weighing on you. Include both your internal experiences 
                (thoughts, feelings, patterns) and external situations (circumstances, people, events).
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
              {/* Segmented Control */}
              <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex mb-6">
                <button
                  onClick={() => setProblemType('internal')}
                  className={`flex-1 py-2 px-4 rounded transition-all font-mono text-sm ${
                    problemType === 'internal'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  💭 INTERNAL
                </button>
                <button
                  onClick={() => setProblemType('external')}
                  className={`flex-1 py-2 px-4 rounded transition-all font-mono text-sm ${
                    problemType === 'external'
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  🌍 EXTERNAL
                </button>
              </div>

              {/* Helper text */}
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                problemType === 'internal' 
                  ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  : 'bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800'
              }`}>
                {problemType === 'internal' 
                  ? "Your thoughts, feelings, behaviors, or patterns that feel off"
                  : "External circumstances, situations, or people affecting you"}
              </div>

              {/* Input */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={currentProblem}
                  onChange={(e) => setCurrentProblem(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && currentProblem.trim()) {
                      if (problemType === 'internal') {
                        setInternalProblems([...internalProblems, { 
                          id: Date.now().toString(), 
                          text: currentProblem.trim()
                        }])
                      } else {
                        setExternalProblems([...externalProblems, { 
                          id: Date.now().toString(), 
                          text: currentProblem.trim(),
                          linkedInternalIds: []
                        }])
                      }
                      setCurrentProblem("")
                    }
                  }}
                  placeholder={problemType === 'internal' 
                    ? "e.g., 'I feel anxious about work' or 'I procrastinate on important tasks'"
                    : "e.g., 'My boss constantly criticizes me' or 'Too many responsibilities at home'"
                  }
                  className="flex-1 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-colors"
                />
                <button
                  onClick={() => {
                    if (currentProblem.trim()) {
                      if (problemType === 'internal') {
                        setInternalProblems([...internalProblems, { 
                          id: Date.now().toString(), 
                          text: currentProblem.trim()
                        }])
                      } else {
                        setExternalProblems([...externalProblems, { 
                          id: Date.now().toString(), 
                          text: currentProblem.trim(),
                          linkedInternalIds: []
                        }])
                      }
                      setCurrentProblem("")
                    }
                  }}
                  disabled={!currentProblem.trim()}
                  className="bg-cyan-500 text-black px-6 py-3 rounded font-mono font-bold hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ADD
                </button>
              </div>

              {/* Problems Lists */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Internal Problems */}
                <div>
                  <h3 className="text-sm font-mono text-blue-600 dark:text-blue-400 mb-2">
                    INTERNAL ({internalProblems.length})
                  </h3>
                  <div className="space-y-2">
                    {internalProblems.map((problem) => (
                      <div key={problem.id} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded px-3 py-2">
                        <span className="text-blue-500 dark:text-blue-400 text-xs">💭</span>
                        <span className="flex-1 text-sm">{problem.text}</span>
                        <button
                          onClick={() => setInternalProblems(internalProblems.filter(p => p.id !== problem.id))}
                          className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {internalProblems.length === 0 && (
                      <p className="text-gray-500 dark:text-gray-600 text-sm">No internal problems added yet</p>
                    )}
                  </div>
                </div>

                {/* External Problems */}
                <div>
                  <h3 className="text-sm font-mono text-orange-600 dark:text-orange-400 mb-2">
                    EXTERNAL ({externalProblems.length})
                  </h3>
                  <div className="space-y-2">
                    {externalProblems.map((problem) => (
                      <div key={problem.id} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded px-3 py-2">
                        <span className="text-orange-500 dark:text-orange-400 text-xs">🌍</span>
                        <span className="flex-1 text-sm">{problem.text}</span>
                        <button
                          onClick={() => setExternalProblems(externalProblems.filter(p => p.id !== problem.id))}
                          className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {externalProblems.length === 0 && (
                      <p className="text-gray-500 dark:text-gray-600 text-sm">No external problems added yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentStage(1)}
              disabled={internalProblems.length < 2}
              className="w-full bg-cyan-500 text-black font-mono font-bold py-4 rounded hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {internalProblems.length < 2 
                ? `ADD AT LEAST ${2 - internalProblems.length} MORE INTERNAL PROBLEMS` 
                : 'CONTINUE TO CATEGORIZE'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )
    }
    
    // Stage 1: Categorize Internal Problems
    else if (currentStage === 1) {
      const uncategorizedProblems = internalProblems.filter(p => !p.category)
      const currentProblemToTag = uncategorizedProblems[0]

      if (!currentProblemToTag) {
        // All internal problems categorized
        if (externalProblems.length > 0) {
          setCurrentStage(2)
          setCurrentExternalIndex(0)
          return null
        } else {
          setCurrentStage(3)
          return null
        }
      }

      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white p-4">
          <div className="max-w-3xl mx-auto">
            {/* Navigation and progress */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setCurrentStage(0)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="font-mono text-sm">BACK</span>
              </button>
              <div className="text-gray-500 dark:text-gray-500 font-mono text-sm">
                CATEGORIZING {internalProblems.length - uncategorizedProblems.length + 1} OF {internalProblems.length}
              </div>
            </div>

            <div className="mb-4">
              <div className="bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-cyan-500 h-2 rounded-full transition-all"
                  style={{ width: `${((internalProblems.length - uncategorizedProblems.length) / internalProblems.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-2">Where does this come from?</h2>
              <div className="bg-gray-50 dark:bg-gray-950 border border-blue-200 dark:border-blue-800 rounded p-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-blue-500 dark:text-blue-400">💭</span>
                  <p className="text-lg">{currentProblemToTag.text}</p>
                </div>
              </div>

              {/* Category options */}
              <div className="space-y-6">
                {Object.entries(rootCategories).map(([key, category]) => (
                  <div key={key}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`${category.color} w-4 h-4 rounded`} />
                      <h3 className="font-semibold text-sm text-gray-600 dark:text-gray-400">{category.name}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-6">
                      {category.subcategories.map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => {
                            const updatedProblems = internalProblems.map(p => 
                              p.id === currentProblemToTag.id 
                                ? { ...p, category: key, subcategory: sub.id }
                                : p
                            )
                            setInternalProblems(updatedProblems)
                          }}
                          className="text-left p-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:border-cyan-500 dark:hover:border-cyan-400 transition-colors"
                        >
                          <div className="font-semibold text-sm mb-1">{sub.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-500">{sub.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }
    
    // Stage 2: External Problem Assessment
    else if (currentStage === 2) {
      if (currentExternalIndex >= externalProblems.length) {
        setCurrentStage(3)
        return null
      }

      return (
        <ExternalProblemAssessment
          externalProblems={externalProblems}
          internalProblems={internalProblems}
          currentIndex={currentExternalIndex}
          onComplete={(updatedExternal, updatedInternals) => {
            const updatedExternals = externalProblems.map(p => 
              p.id === updatedExternal.id ? updatedExternal : p
            )
            setExternalProblems(updatedExternals)
            setInternalProblems(updatedInternals)
            
            if (currentExternalIndex < externalProblems.length - 1) {
              setCurrentExternalIndex(currentExternalIndex + 1)
            } else {
              setCurrentStage(3)
            }
          }}
          onBack={() => {
            if (currentExternalIndex > 0) {
              setCurrentExternalIndex(currentExternalIndex - 1)
            } else {
              setCurrentStage(1)
            }
          }}
        />
      )
    }
    
    // Stage 3: Summary
    else if (currentStage === 3) {
      if (showCelebration) {
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white flex items-center justify-center p-4">
            <div className="text-center animate-fadeIn">
              <Sparkles className="w-20 h-20 text-yellow-500 mx-auto mb-6 animate-pulse" />
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                Day 1 Complete!
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">You've mapped your inner and outer landscape...</p>
            </div>
          </div>
        )
      }

      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white p-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-yellow-500" />
                <h1 className="text-3xl font-bold">Your complete problem landscape</h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                You've mapped how external situations trigger internal experiences. This awareness is powerful.
              </p>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-purple-700 dark:text-purple-300">Key Insights:</h2>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>✓ You identified <span className="text-blue-600 dark:text-blue-400 font-bold">{internalProblems.length} internal patterns</span> affecting you</p>
                <p>✓ You recognized <span className="text-orange-600 dark:text-orange-400 font-bold">{externalProblems.length} external triggers</span> in your environment</p>
                {externalProblems.filter(e => e.linkedInternalIds.length > 2).length > 0 && (
                  <p>✓ Some external situations trigger <span className="text-yellow-600 dark:text-yellow-400 font-bold">multiple internal responses</span></p>
                )}
              </div>
            </div>

            {/* Problems Display */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {Object.entries(rootCategories).map(([key, category]) => {
                const categoryProblems = internalProblems.filter(p => p.category === key)
                if (categoryProblems.length === 0) return null
                
                return (
                  <div key={key} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                    <div className={`${category.color} text-white dark:text-black px-3 py-1 rounded text-sm font-bold mb-3 inline-block`}>
                      {category.name} ({categoryProblems.length})
                    </div>
                    <div className="space-y-3">
                      {categoryProblems.map(problem => {
                        const linkedExternals = externalProblems.filter(e => 
                          e.linkedInternalIds.includes(problem.id)
                        )
                        return (
                          <div key={problem.id} className="border-l-2 border-gray-300 dark:border-gray-700 pl-3">
                            <div className="flex items-start gap-2">
                              <span className="text-blue-500 dark:text-blue-400 text-xs mt-1">💭</span>
                              <div className="flex-1">
                                <p className="text-sm">{problem.text}</p>
                                {linkedExternals.length > 0 && (
                                  <div className="mt-2 space-y-2">
                                    <p className="text-xs text-gray-600 dark:text-gray-500">Triggered by:</p>
                                    {linkedExternals.map(external => (
                                      <div key={external.id} className="ml-2 p-2 bg-orange-50 dark:bg-orange-950/20 rounded">
                                        <div className="flex items-start gap-2">
                                          <span className="text-orange-500 dark:text-orange-400 text-xs">🌍</span>
                                          <div className="flex-1">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">{external.text}</p>
                                            {external.assessment && (
                                              <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                                                <p>• Feels: {external.assessment.howItFeels}</p>
                                                <p>• Story: {external.assessment.storyTelling}</p>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Feedback */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">How was this exercise?</h3>
              
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setFeedbackRating(rating)}
                    className={`w-12 h-12 rounded-lg border-2 transition-all ${
                      feedbackRating >= rating 
                        ? 'bg-yellow-500 border-yellow-500 text-black' 
                        : 'border-gray-300 dark:border-gray-700 hover:border-yellow-500 dark:hover:border-yellow-400 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Any thoughts on this exercise? (optional)"
                className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-colors resize-none"
                rows={3}
              />
            </div>

            <button
              onClick={() => {
                saveReflection({
                  internalProblems,
                  externalProblems,
                  stage: 'day1_complete'
                })
              }}
              disabled={saving}
              className="w-full bg-green-500 text-black font-mono font-bold py-4 rounded hover:bg-green-400 disabled:opacity-50 transition-colors"
            >
              {saving ? 'SAVING...' : 'COMPLETE DAY 1'}
            </button>
          </div>
        </div>
      )
    }
  }

  // Fallback for other days
  return <div>Day {lesson.day_number} content - to be implemented</div>
}