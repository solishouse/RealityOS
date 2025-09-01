// src/components/ExternalProblemAssessment.tsx
// This is the enhanced Stage 3 for Day 1 - External Problem Assessment

import { useState } from 'react'
import { ChevronRight, ChevronLeft, AlertCircle, Brain } from 'lucide-react'

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

interface Props {
  externalProblems: ExternalProblem[]
  internalProblems: InternalProblem[]
  currentIndex: number
  onComplete: (updatedExternal: ExternalProblem, updatedInternals: InternalProblem[]) => void
  onBack: () => void
}

export default function ExternalProblemAssessment({ 
  externalProblems, 
  internalProblems, 
  currentIndex, 
  onComplete, 
  onBack 
}: Props) {
  const currentExternal = externalProblems[currentIndex]
  const [questionStep, setQuestionStep] = useState(0)
  const [selectedInternalIds, setSelectedInternalIds] = useState<string[]>([])
  
  // Assessment answers
  const [whatBothers, setWhatBothers] = useState('')
  const [howItFeels, setHowItFeels] = useState('')
  const [storyTelling, setStoryTelling] = useState('')
  const [contributing, setContributing] = useState('')
  
  // Suggested internal problems based on assessment
  const getSuggestedInternals = () => {
    const suggestions = new Set<string>()
    
    // Analyze feelings for suggestions
    const feelings = howItFeels.toLowerCase()
    if (feelings.includes('anxious') || feelings.includes('worried')) {
      internalProblems.forEach(p => {
        if (p.text.toLowerCase().includes('anxiety') || p.text.toLowerCase().includes('worry')) {
          suggestions.add(p.id)
        }
      })
    }
    if (feelings.includes('angry') || feelings.includes('frustrated')) {
      internalProblems.forEach(p => {
        if (p.text.toLowerCase().includes('anger') || p.text.toLowerCase().includes('frustrat')) {
          suggestions.add(p.id)
        }
      })
    }
    if (feelings.includes('powerless') || feelings.includes('helpless')) {
      internalProblems.forEach(p => {
        if (p.text.toLowerCase().includes('control') || p.text.toLowerCase().includes('power')) {
          suggestions.add(p.id)
        }
      })
    }
    
    // Analyze story for suggestions
    const story = storyTelling.toLowerCase()
    if (story.includes('not good enough') || story.includes('fail')) {
      internalProblems.forEach(p => {
        if (p.category === 'mind' && p.subcategory === 'insecurity') {
          suggestions.add(p.id)
        }
      })
    }
    
    return Array.from(suggestions)
  }

  const questions = [
    {
      title: "What bothers you most?",
      subtitle: "What part of this situation really gets to you?",
      placeholder: "e.g., 'The lack of respect' or 'That I can't change it' or 'The unfairness of it'",
      value: whatBothers,
      setValue: setWhatBothers
    },
    {
      title: "How does it make you feel?",
      subtitle: "What emotions come up inside when this happens?",
      placeholder: "e.g., 'Angry and then guilty about being angry' or 'Anxious and powerless' or 'Frustrated and stuck'",
      value: howItFeels,
      setValue: setHowItFeels
    },
    {
      title: "What story are you telling yourself?",
      subtitle: "What does this situation mean about you, others, or your life?",
      placeholder: "e.g., 'I'll never be respected' or 'I'm not strong enough to handle this' or 'Things will always be this way'",
      value: storyTelling,
      setValue: setStoryTelling
    },
    {
      title: "What might you be contributing?",
      subtitle: "What are you doing (or not doing) that may be keeping this pattern alive?",
      placeholder: "e.g., 'Not setting boundaries' or 'Avoiding the conversation' or 'Taking on too much' (Optional)",
      value: contributing,
      setValue: setContributing,
      optional: true
    }
  ]

  const currentQuestion = questions[questionStep]

  // Assessment questions view
  if (questionStep < questions.length) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white p-4">
        <div className="max-w-3xl mx-auto">
          {/* Navigation */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => {
                if (questionStep > 0) {
                  setQuestionStep(questionStep - 1)
                } else {
                  onBack()
                }
              }}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="font-mono text-sm">BACK</span>
            </button>
            <div className="text-gray-500 dark:text-gray-500 font-mono text-sm">
              EXTERNAL {currentIndex + 1} OF {externalProblems.length} • Q{questionStep + 1} OF {questions.length}
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="bg-gray-200 dark:bg-gray-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-500 to-cyan-500 h-2 rounded-full transition-all"
                style={{ width: `${((questionStep + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* External Problem Context */}
          <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-orange-500 dark:text-orange-400">🌍</span>
              <span className="text-sm text-orange-600 dark:text-orange-400 font-mono">EXTERNAL SITUATION</span>
            </div>
            <p className="text-lg text-gray-900 dark:text-white">{currentExternal.text}</p>
          </div>

          {/* Current Question */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{currentQuestion.title}</h2>
              <p className="text-gray-600 dark:text-gray-400">{currentQuestion.subtitle}</p>
            </div>

            <textarea
              value={currentQuestion.value}
              onChange={(e) => currentQuestion.setValue(e.target.value)}
              placeholder={currentQuestion.placeholder}
              className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-colors resize-none"
              rows={4}
              autoFocus
            />

            {currentQuestion.optional && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">This question is optional - skip if not applicable</p>
            )}

            <button
              onClick={() => {
                if (questionStep < questions.length - 1) {
                  setQuestionStep(questionStep + 1)
                } else {
                  // Move to linking step
                  setQuestionStep(questions.length)
                }
              }}
              disabled={!currentQuestion.value && !currentQuestion.optional}
              className="w-full mt-6 bg-cyan-500 text-black font-mono font-bold py-4 rounded hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {questionStep < questions.length - 1 ? 'NEXT QUESTION' : 'CONTINUE TO LINKING'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Linking to internal problems view
  const suggestedIds = getSuggestedInternals()
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setQuestionStep(questions.length - 1)}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-mono text-sm">BACK</span>
          </button>
          <div className="text-gray-500 dark:text-gray-500 font-mono text-sm">
            EXTERNAL {currentIndex + 1} OF {externalProblems.length} • LINKING
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Connect to internal patterns</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Based on your assessment, which internal experiences does this external situation trigger?
          </p>
        </div>

        {/* Assessment Summary */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-mono text-gray-500 dark:text-gray-500 mb-4">YOUR ASSESSMENT</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">What bothers you:</p>
              <p className="text-sm text-gray-900 dark:text-white">{whatBothers}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">How it makes you feel:</p>
              <p className="text-sm text-gray-900 dark:text-white">{howItFeels}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">The story you tell yourself:</p>
              <p className="text-sm text-gray-900 dark:text-white">{storyTelling}</p>
            </div>
            {contributing && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">What you might be contributing:</p>
                <p className="text-sm text-gray-900 dark:text-white">{contributing}</p>
              </div>
            )}
          </div>
        </div>

        {/* Suggested connections */}
        {suggestedIds.length > 0 && (
          <div className="bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">Suggested connections based on your assessment:</span>
            </div>
            <div className="space-y-2">
              {suggestedIds.map(id => {
                const problem = internalProblems.find(p => p.id === id)
                if (!problem) return null
                return (
                  <button
                    key={id}
                    onClick={() => {
                      if (!selectedInternalIds.includes(id)) {
                        setSelectedInternalIds([...selectedInternalIds, id])
                      }
                    }}
                    className="w-full text-left p-2 bg-cyan-100 dark:bg-cyan-950/20 rounded text-sm hover:bg-cyan-200 dark:hover:bg-cyan-950/30 transition-colors"
                  >
                    <span className="text-cyan-700 dark:text-cyan-300">+ {problem.text}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Internal problems selection */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-semibold mb-4 text-gray-900 dark:text-white">
            Select all internal experiences this triggers:
          </h3>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {internalProblems.map(problem => {
              const isSelected = selectedInternalIds.includes(problem.id)
              const isSuggested = suggestedIds.includes(problem.id)
              
              return (
                <button
                  key={problem.id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedInternalIds(selectedInternalIds.filter(id => id !== problem.id))
                    } else {
                      setSelectedInternalIds([...selectedInternalIds, problem.id])
                    }
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-500 dark:border-blue-600'
                      : isSuggested
                        ? 'border-cyan-300 dark:border-cyan-700 hover:border-blue-500 dark:hover:border-blue-600'
                        : 'border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? 'bg-blue-500 dark:bg-blue-600 border-blue-500 dark:border-blue-600'
                        : 'border-gray-400 dark:border-gray-600'
                    }`}>
                      {isSelected && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className={`${isSuggested && !isSelected ? 'text-cyan-700 dark:text-cyan-300' : 'text-gray-900 dark:text-white'}`}>
                        {problem.text}
                      </span>
                      {isSuggested && !isSelected && (
                        <span className="ml-2 text-xs text-cyan-600 dark:text-cyan-400">(suggested)</span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {selectedInternalIds.length === 0 && (
            <p className="mt-4 text-sm text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Select at least one internal experience this external situation triggers
            </p>
          )}
        </div>

        <button
          onClick={() => {
            const updatedExternal = {
              ...currentExternal,
              linkedInternalIds: selectedInternalIds,
              assessment: {
                whatBothers,
                howItFeels,
                storyTelling,
                contributing
              }
            }

            const updatedInternals = internalProblems.map(internal => {
              if (selectedInternalIds.includes(internal.id)) {
                return {
                  ...internal,
                  linkedExternalIds: [...(internal.linkedExternalIds || []), currentExternal.id]
                }
              }
              return internal
            })

            onComplete(updatedExternal, updatedInternals)
          }}
          disabled={selectedInternalIds.length === 0}
          className="w-full bg-cyan-500 text-black font-mono font-bold py-4 rounded hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {currentIndex < externalProblems.length - 1 
            ? `CONTINUE TO NEXT EXTERNAL (${currentIndex + 2}/${externalProblems.length})`
            : 'COMPLETE EXTERNAL ASSESSMENT'}
        </button>
      </div>
    </div>
  )
}