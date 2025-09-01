// src/components/CompletedLessonView.tsx
'use client'

import { ArrowLeft, Edit3, Calendar, CheckCircle, Tag, TrendingUp } from 'lucide-react'

interface CompletedLessonViewProps {
  lesson: any
  reflection: any
  onBack: () => void
  onEdit: () => void
}

export default function CompletedLessonView({ lesson, reflection, onBack, onEdit }: CompletedLessonViewProps) {
  const content = reflection?.content || {}
  
  // For Day 1 - Problem categorization
  const renderDay1Summary = () => {
    const internalProblems = content.internalProblems || []
    const externalProblems = content.externalProblems || []
    const categories = content.categories || {}
    
    // Count problems by category
    const categoryCounts: Record<string, number> = {}
    Object.values(categories).forEach((cat: any) => {
      if (cat) {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
      }
    })
    
    const topCategories = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
    
    return (
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Internal Problems</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{internalProblems.length}</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4">
            <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">External Problems</p>
            <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">{externalProblems.length}</p>
          </div>
        </div>
        
        {/* Top Patterns */}
        {topCategories.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Top Patterns Identified</h3>
            <div className="space-y-2">
              {topCategories.map(([category, count]) => (
                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium text-gray-900 dark:text-white">{category}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{count} problems</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Problem Lists */}
        <div className="space-y-4">
          {internalProblems.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Internal Problems (💭)</h3>
              <div className="space-y-1">
                {internalProblems.map((problem: string, idx: number) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="text-blue-500 dark:text-blue-400 mt-1">•</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{problem}</p>
                    {categories[`internal-${idx}`] && (
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">
                        {categories[`internal-${idx}`]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {externalProblems.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">External Problems (🌍)</h3>
              <div className="space-y-1">
                {externalProblems.map((problem: string, idx: number) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="text-orange-500 dark:text-orange-400 mt-1">•</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{problem}</p>
                    {categories[`external-${idx}`] && (
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">
                        {categories[`external-${idx}`]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
  
  // For Day 3 - Role identification
  const renderDay3Summary = () => {
    const roles = content.roles || []
    const traits = content.traits || []
    const values = content.values || []
    
    return (
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4">
            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Roles Identified</p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">{roles.length}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">Core Traits</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-300">{traits.length}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Values</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{values.length}</p>
          </div>
        </div>
        
        {/* Lists */}
        <div className="space-y-4">
          {roles.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Roles You've Been Playing</h3>
              <div className="flex flex-wrap gap-2">
                {roles.map((role: any, idx: number) => (
                  <span key={idx} className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm">
                    {role.name || role}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {traits.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your True Traits</h3>
              <div className="flex flex-wrap gap-2">
                {traits.map((trait: string, idx: number) => (
                  <span key={idx} className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {values.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Core Values</h3>
              <div className="flex flex-wrap gap-2">
                {values.map((value: string, idx: number) => (
                  <span key={idx} className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                    {value}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
  
  // For standard lessons
  const renderStandardSummary = () => {
    const responses = content.responses || content.reflections || {}
    
    return (
      <div className="space-y-4">
        {Object.entries(responses).map(([prompt, response]: [string, any], idx) => (
          <div key={idx} className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{prompt}</p>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{response}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
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
          
          <button
            onClick={onEdit}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Exercise</span>
          </button>
        </div>
        
        {/* Main Content */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          {/* Lesson Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Day {lesson.day_number}</span>
                  <span className="text-sm text-gray-300 dark:text-gray-600">•</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Week {lesson.week_number}</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{lesson.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                    <span>Completed</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(reflection?.completed_at || reflection?.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Summary Content */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Results</h2>
            
            {lesson.day_number === 1 && renderDay1Summary()}
            {lesson.day_number === 3 && renderDay3Summary()}
            {![1, 3].includes(lesson.day_number) && renderStandardSummary()}
            
            {/* AI Summary if available */}
            {content.aiSummary && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300">AI Insights</h3>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-400">{content.aiSummary}</p>
              </div>
            )}
            
            {/* Notes section */}
            {content.notes && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Notes</h3>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{content.notes}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Action Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-xl">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Want to add more insights or update your responses? 
              <button onClick={onEdit} className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                Edit this exercise
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}