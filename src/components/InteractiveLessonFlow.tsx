// src/components/InteractiveLessonFlow.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, ChevronRight, Home, X, Edit2, Plus, Star, ChevronDown, ChevronUp } from 'lucide-react'
import ExternalProblemAssessment from './ExternalProblemAssessment'
import content from '@/content/staticContent'

// Type definitions
interface InternalProblem {
  id: string
  text: string
  category?: string
  subcategory?: string
}

interface ExternalProblem {
  id: string
  text: string
  assessment?: {
    control: number
    impact: number
    strategies: string[]
  }
}

interface Props {
  lesson: any
  onComplete: () => void
  userId: string
  existingReflection?: any
}

export default function InteractiveLessonFlow({ 
  lesson,
  onComplete,
  userId,
  existingReflection 
}: Props) {
  // Get content directly from static import
  const day1Content = content.day1
  
  // Initialize state
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
  const [isEditMode, setIsEditMode] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [editingProblemId, setEditingProblemId] = useState<string | null>(null)
  const [editingProblemText, setEditingProblemText] = useState("")
  const [currentCategorizingIndex, setCurrentCategorizingIndex] = useState(0)
  const [showIntro, setShowIntro] = useState(true)

  // Load existing data if editing
  useEffect(() => {
    if (existingReflection?.structured_data) {
      console.log('Loading existing reflection data:', existingReflection.structured_data)
      const data = existingReflection.structured_data
      
      if (data.internalProblems) {
        setInternalProblems(data.internalProblems)
      }
      if (data.externalProblems) {
        setExternalProblems(data.externalProblems)
      }
      if (data.feedbackRating) {
        setFeedbackRating(data.feedbackRating)
      }
      if (data.feedbackText) {
        setFeedbackText(data.feedbackText)
      }
      
      setIsEditMode(true)
      setShowIntro(false) // Skip intro when editing
      setCurrentStage(3) // Start at summary stage if editing
    }
  }, [existingReflection])

  // Function to add problem
  function addProblem() {
    if (currentProblem.trim()) {
      const newProblem = {
        id: Date.now().toString(),
        text: currentProblem.trim()
      }
      
      if (problemType === 'internal') {
        setInternalProblems([...internalProblems, newProblem])
      } else {
        setExternalProblems([...externalProblems, newProblem])
      }
      
      setCurrentProblem("")
      setHasChanges(true)
    }
  }

  // Function to delete problem
  function deleteProblem(id: string, type: 'internal' | 'external') {
    if (type === 'internal') {
      setInternalProblems(internalProblems.filter(p => p.id !== id))
    } else {
      setExternalProblems(externalProblems.filter(p => p.id !== id))
    }
    setHasChanges(true)
  }

  // Function to start editing a problem
  function startEditingProblem(id: string, text: string) {
    setEditingProblemId(id)
    setEditingProblemText(text)
  }

  // Function to save edited problem
  function saveEditedProblem(id: string, type: 'internal' | 'external') {
    if (type === 'internal') {
      setInternalProblems(internalProblems.map(p => 
        p.id === id ? { ...p, text: editingProblemText } : p
      ))
    } else {
      setExternalProblems(externalProblems.map(p => 
        p.id === id ? { ...p, text: editingProblemText } : p
      ))
    }
    setEditingProblemId(null)
    setEditingProblemText("")
    setHasChanges(true)
  }

  // Function to categorize internal problem
  function categorizeInternalProblem(category: string, subcategory?: string) {
    const updatedProblems = [...internalProblems]
    updatedProblems[currentCategorizingIndex] = {
      ...updatedProblems[currentCategorizingIndex],
      category,
      subcategory
    }
    setInternalProblems(updatedProblems)
    setHasChanges(true)

    // Move to next problem or complete
    if (currentCategorizingIndex < internalProblems.length - 1) {
      setCurrentCategorizingIndex(currentCategorizingIndex + 1)
    } else {
      // Move to external problems or summary
      if (externalProblems.length > 0) {
        setCurrentStage(2)
        setCurrentExternalIndex(0)
      } else {
        setCurrentStage(3)
      }
    }
  }

  // Function to handle external problem assessment
  function handleExternalAssessment(assessment: any) {
    const updatedProblems = [...externalProblems]
    updatedProblems[currentExternalIndex] = {
      ...updatedProblems[currentExternalIndex],
      assessment
    }
    setExternalProblems(updatedProblems)
    setHasChanges(true)

    // Move to next external problem or complete
    if (currentExternalIndex < externalProblems.length - 1) {
      setCurrentExternalIndex(currentExternalIndex + 1)
    } else {
      setCurrentStage(3)
    }
  }

  // Function to save reflection
  async function saveReflection(complete: boolean = false) {
    setSaving(true)
    
    const structuredData = {
      internalProblems,
      externalProblems,
      feedbackRating,
      feedbackText,
      completedAt: complete ? new Date().toISOString() : null
    }

    try {
      if (isEditMode && existingReflection) {
        // Update existing reflection
        const { error } = await supabase
          .from('reflections')
          .update({
            structured_data: structuredData,
            completed: complete,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingReflection.id)

        if (error) throw error
      } else {
        // Create new reflection
        const { error } = await supabase
          .from('reflections')
          .insert([{
            user_id: userId,
            lesson_id: lesson.id,
            structured_data: structuredData,
            completed: complete,
            created_at: new Date().toISOString()
          }])

        if (error) throw error
      }

      if (complete) {
        setShowCelebration(true)
        setTimeout(() => {
          onComplete()
        }, 3000)
      }
    } catch (error) {
      console.error('Error saving reflection:', error)
    } finally {
      setSaving(false)
    }
  }

  // Get step count
  const getTotalSteps = () => {
    if (externalProblems.length > 0) return 4
    return 3
  }

  // Render intro screen
  if (showIntro && !isEditMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8 relative">
        <button 
          onClick={onComplete}
          className="absolute top-8 right-8 flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Home className="w-5 h-5" />
          DASHBOARD
        </button>

        <div className="max-w-2xl mx-auto mt-20">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {day1Content.title}
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            {day1Content.intro.description}
          </p>

          <div className="bg-gray-800 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">What you'll do today:</h2>
            <ul className="space-y-3">
              {day1Content.intro.objectives.map((objective: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">✓</span>
                  <span className="text-gray-300">{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setShowIntro(false)}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02]"
          >
            {day1Content.buttons.start}
          </button>
        </div>
      </div>
    )
  }

  // Render based on current stage
  if (currentStage === 0) {
    // Stage 0: Problem Collection
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8 relative">
        <div className="absolute top-8 right-8 flex gap-4">
          <button 
            onClick={() => setShowIntro(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK
          </button>
          <button 
            onClick={onComplete}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            DASHBOARD
          </button>
        </div>

        <div className="max-w-3xl mx-auto mt-16">
          <div className="text-sm text-gray-400 mb-4">STEP 1 OF {getTotalSteps()}</div>
          
          <h1 className="text-4xl font-bold mb-6">
            {day1Content.problemCollection.title}
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            {day1Content.problemCollection.description}
          </p>

          {/* Problem Type Toggle */}
          <div className="flex gap-2 mb-6 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setProblemType('internal')}
              className={`flex-1 py-3 px-4 rounded-md transition-all ${
                problemType === 'internal' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              💭 Internal Problems ({internalProblems.length})
            </button>
            <button
              onClick={() => setProblemType('external')}
              className={`flex-1 py-3 px-4 rounded-md transition-all ${
                problemType === 'external' 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🌍 External Problems ({externalProblems.length})
            </button>
          </div>

          {/* Input Area */}
          <div className="bg-gray-800 rounded-xl p-6 mb-6">
            <label className="block text-sm text-gray-400 mb-2">
              Add a {problemType} problem:
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={currentProblem}
                onChange={(e) => setCurrentProblem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addProblem()}
                placeholder={problemType === 'internal' 
                  ? day1Content.problemCollection.internalPlaceholder
                  : day1Content.problemCollection.externalPlaceholder
                }
                className="flex-1 px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={addProblem}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            {/* Examples */}
            <div className="mt-4 text-sm text-gray-400">
              <span className="font-semibold">Examples:</span>
              <div className="mt-2 space-y-1">
                {(problemType === 'internal' 
                  ? day1Content.problemCollection.internalExamples 
                  : day1Content.problemCollection.externalExamples
                ).map((example: string, index: number) => (
                  <div key={index}>• {example}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Problem Lists */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Internal Problems */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-400">
                💭 Internal Problems ({internalProblems.length})
              </h3>
              <div className="space-y-2">
                {internalProblems.map((problem) => (
                  <div key={problem.id} className="bg-gray-800 rounded-lg p-3 flex items-center justify-between group">
                    {editingProblemId === problem.id ? (
                      <input
                        type="text"
                        value={editingProblemText}
                        onChange={(e) => setEditingProblemText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEditedProblem(problem.id, 'internal')}
                        onBlur={() => saveEditedProblem(problem.id, 'internal')}
                        className="flex-1 bg-gray-700 px-3 py-1 rounded"
                        autoFocus
                      />
                    ) : (
                      <>
                        <span className="text-gray-300">{problem.text}</span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEditingProblem(problem.id, problem.text)}
                            className="text-gray-400 hover:text-white"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProblem(problem.id, 'internal')}
                            className="text-gray-400 hover:text-red-400"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {internalProblems.length === 0 && (
                  <p className="text-gray-500 italic">No internal problems added yet</p>
                )}
              </div>
            </div>

            {/* External Problems */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-orange-400">
                🌍 External Problems ({externalProblems.length})
              </h3>
              <div className="space-y-2">
                {externalProblems.map((problem) => (
                  <div key={problem.id} className="bg-gray-800 rounded-lg p-3 flex items-center justify-between group">
                    {editingProblemId === problem.id ? (
                      <input
                        type="text"
                        value={editingProblemText}
                        onChange={(e) => setEditingProblemText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEditedProblem(problem.id, 'external')}
                        onBlur={() => saveEditedProblem(problem.id, 'external')}
                        className="flex-1 bg-gray-700 px-3 py-1 rounded"
                        autoFocus
                      />
                    ) : (
                      <>
                        <span className="text-gray-300">{problem.text}</span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEditingProblem(problem.id, problem.text)}
                            className="text-gray-400 hover:text-white"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProblem(problem.id, 'external')}
                            className="text-gray-400 hover:text-red-400"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {externalProblems.length === 0 && (
                  <p className="text-gray-500 italic">No external problems added yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={() => {
              if (internalProblems.length > 0) {
                setCurrentStage(1)
                setCurrentCategorizingIndex(0)
              } else if (externalProblems.length > 0) {
                setCurrentStage(2)
                setCurrentExternalIndex(0)
              } else {
                setCurrentStage(3)
              }
            }}
            disabled={internalProblems.length === 0 && externalProblems.length === 0}
            className={`w-full py-4 rounded-lg font-semibold transition-all ${
              internalProblems.length > 0 || externalProblems.length > 0
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                : 'bg-gray-700 cursor-not-allowed opacity-50'
            }`}
          >
            {internalProblems.length > 0 || externalProblems.length > 0
              ? `Continue with ${internalProblems.length + externalProblems.length} problems`
              : 'Add at least one problem to continue'
            }
          </button>
        </div>
      </div>
    )
  }

  if (currentStage === 1) {
    // Stage 1: Internal Problem Categorization
    const currentProblem = internalProblems[currentCategorizingIndex]
    const progress = ((currentCategorizingIndex + 1) / internalProblems.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8 relative">
        <div className="absolute top-8 right-8 flex gap-4">
          <button 
            onClick={() => setCurrentStage(0)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK
          </button>
          <button 
            onClick={onComplete}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            DASHBOARD
          </button>
        </div>

        <div className="max-w-3xl mx-auto mt-16">
          <div className="text-sm text-gray-400 mb-4">STEP 2 OF {getTotalSteps()}</div>
          
          <h1 className="text-4xl font-bold mb-6">
            {day1Content.categorization.title}
          </h1>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Problem {currentCategorizingIndex + 1} of {internalProblems.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Current Problem */}
          <div className="bg-gray-800 rounded-xl p-6 mb-8">
            <div className="text-sm text-blue-400 mb-2">💭 Internal Problem</div>
            <div className="text-2xl font-semibold">{currentProblem.text}</div>
          </div>

          <p className="text-lg text-gray-300 mb-6">
            {day1Content.categorization.question}
          </p>

          {/* Categories */}
          <div className="space-y-4">
            {Object.entries(day1Content.categorization.categories).map(([key, category]: [string, any]) => (
              <div key={key} className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3 text-blue-400">
                  {category.name}
                </h3>
                <p className="text-gray-400 mb-4">{category.description}</p>
                
                <div className="grid gap-2">
                  {category.subcategories.map((sub: any) => (
                    <button
                      key={sub.id}
                      onClick={() => categorizeInternalProblem(category.name, sub.name)}
                      className="text-left p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all group"
                    >
                      <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {sub.name}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {sub.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Skip Option */}
            <button
              onClick={() => categorizeInternalProblem('Unknown')}
              className="w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-400"
            >
              I'm not sure - skip this one
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStage === 2) {
    // Stage 2: External Problem Assessment
    const currentProblem = externalProblems[currentExternalIndex]
    const progress = ((currentExternalIndex + 1) / externalProblems.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8 relative">
        <div className="absolute top-8 right-8 flex gap-4">
          <button 
            onClick={() => {
              if (internalProblems.length > 0) {
                setCurrentStage(1)
                setCurrentCategorizingIndex(internalProblems.length - 1)
              } else {
                setCurrentStage(0)
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK
          </button>
          <button 
            onClick={onComplete}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            DASHBOARD
          </button>
        </div>

        <div className="max-w-3xl mx-auto mt-16">
          <div className="text-sm text-gray-400 mb-4">
            STEP {internalProblems.length > 0 ? 3 : 2} OF {getTotalSteps()}
          </div>
          
          <h1 className="text-4xl font-bold mb-6">Assess External Factors</h1>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Problem {currentExternalIndex + 1} of {externalProblems.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <ExternalProblemAssessment
            problem={currentProblem}
            onComplete={handleExternalAssessment}
            onSkip={() => {
              if (currentExternalIndex < externalProblems.length - 1) {
                setCurrentExternalIndex(currentExternalIndex + 1)
              } else {
                setCurrentStage(3)
              }
            }}
          />
        </div>
      </div>
    )
  }

  if (currentStage === 3) {
    // Stage 3: Summary and Completion
    const categorizedProblems = internalProblems.reduce((acc, problem) => {
      const category = problem.category || 'Uncategorized'
      if (!acc[category]) acc[category] = []
      acc[category].push(problem)
      return acc
    }, {} as Record<string, InternalProblem[]>)

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8 relative">
        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
            <div className="text-center animate-bounce">
              <div className="text-8xl mb-4">🎉</div>
              <h2 className="text-4xl font-bold mb-2">Awesome Work!</h2>
              <p className="text-xl text-gray-300">You've completed Day 1!</p>
            </div>
          </div>
        )}

        <div className="absolute top-8 right-8 flex gap-4">
          <button 
            onClick={() => {
              if (externalProblems.length > 0) {
                setCurrentStage(2)
                setCurrentExternalIndex(externalProblems.length - 1)
              } else if (internalProblems.length > 0) {
                setCurrentStage(1)
                setCurrentCategorizingIndex(internalProblems.length - 1)
              } else {
                setCurrentStage(0)
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK
          </button>
          <button 
            onClick={onComplete}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            DASHBOARD
          </button>
        </div>

        <div className="max-w-4xl mx-auto mt-16">
          <div className="text-sm text-gray-400 mb-4">
            STEP {getTotalSteps()} OF {getTotalSteps()}
          </div>
          
          <h1 className="text-4xl font-bold mb-2">
            {day1Content.summary.title}
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            {day1Content.summary.subtitle}
          </p>

          {/* Statistics */}
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
                {internalProblems.filter(p => p.category && p.category !== 'Unknown').length}
              </div>
              <div className="text-sm text-gray-400">Categorized</div>
            </div>
          </div>

          {/* Internal Problems by Category */}
          {internalProblems.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                💭 Internal Problems by Root Cause
              </h2>
              {Object.entries(categorizedProblems).map(([category, problems]) => (
                <div key={category} className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">
                    {category} ({problems.length})
                  </h3>
                  <div className="space-y-2">
                    {problems.map((problem) => (
                      <div key={problem.id} className="bg-gray-700 rounded-lg p-3">
                        <div className="text-white">{problem.text}</div>
                        {problem.subcategory && (
                          <div className="text-sm text-gray-400 mt-1">
                            → {problem.subcategory}
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
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">
                🌍 External Problems Assessment
              </h2>
              <div className="space-y-4">
                {externalProblems.map((problem) => (
                  <div key={problem.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="text-white font-semibold mb-2">{problem.text}</div>
                    {problem.assessment && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Control Level:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 bg-gray-600 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${problem.assessment.control * 10}%` }}
                              />
                            </div>
                            <span className="text-white">{problem.assessment.control}/10</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400">Impact Level:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 bg-gray-600 rounded-full h-2">
                              <div 
                                className="bg-orange-500 h-2 rounded-full"
                                style={{ width: `${problem.assessment.impact * 10}%` }}
                              />
                            </div>
                            <span className="text-white">{problem.assessment.impact}/10</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insights */}
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">✨ Insights</h2>
            <div className="space-y-3 text-gray-300">
              {day1Content.summary.insights.map((insight: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="bg-gray-800 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">How was this exercise?</h3>
            
            {/* Star Rating */}
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setFeedbackRating(star)}
                  className="text-3xl transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-8 h-8 ${
                      star <= feedbackRating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Feedback Text */}
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Any thoughts or feedback? (Optional)"
              className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {isEditMode && (
              <button
                onClick={() => saveReflection(false)}
                disabled={saving}
                className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all"
              >
                {saving ? 'SAVING...' : 'SAVE CHANGES'}
              </button>
            )}
            <button
              onClick={() => saveReflection(true)}
              disabled={saving}
              className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg font-semibold transition-all"
            >
              {saving ? 'SAVING...' : 'COMPLETE DAY 1'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Fallback for other days
  return <div>Day {lesson.day_number} content - to be implemented</div>
}