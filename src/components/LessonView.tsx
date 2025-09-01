// src/components/LessonView.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Lesson {
  id: number
  day_number: number
  week_number: number
  title: string
  content: string
  prompts: string[]
}

interface LessonViewProps {
  lesson: Lesson
  onBack: () => void
  userId: string
  onComplete: () => void
}

export default function LessonView({ lesson, onBack, userId, onComplete }: LessonViewProps) {
  const [responses, setResponses] = useState<Record<number, string>>({})
  const [saving, setSaving] = useState(false)

  async function saveReflection() {
    setSaving(true)
    
    try {
      // Save reflection
      await supabase.from('reflections').upsert({
        user_id: userId,
        lesson_id: lesson.id,
        responses,
        completed_at: new Date().toISOString(),
      })

      // Update user progress
      await supabase
        .from('profiles')
        .update({ 
          current_day: lesson.day_number + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      // Track analytics
      await supabase.from('lesson_analytics').insert({
        user_id: userId,
        lesson_id: lesson.id,
        prompts_answered: Object.keys(responses).length,
        prompts_skipped: lesson.prompts.length - Object.keys(responses).length,
        total_word_count: Object.values(responses).join(' ').split(' ').length,
        completed_at: new Date().toISOString(),
      })

      onComplete()
    } catch (error) {
      console.error('Error saving reflection:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white font-mono text-sm mb-6 transition-colors"
        >
          ← BACK TO DASHBOARD
        </button>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
          <div className="mb-6">
            <div className="text-cyan-500 font-mono text-sm mb-2">
              DAY {lesson.day_number} • WEEK {lesson.week_number}
            </div>
            <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {lesson.content}
            </p>
          </div>

          <div className="space-y-6 mt-8">
            <h2 className="text-xl font-bold font-mono">REFLECTION PROMPTS</h2>
            
            {lesson.prompts.map((prompt, index) => (
              <div key={index}>
                <label className="block text-gray-400 mb-2">
                  {prompt}
                </label>
                <textarea
                  value={responses[index] || ''}
                  onChange={(e) => setResponses({
                    ...responses,
                    [index]: e.target.value
                  })}
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  rows={4}
                  placeholder="Type your reflection here..."
                />
              </div>
            ))}

            <button
              onClick={saveReflection}
              disabled={saving || Object.keys(responses).length < lesson.prompts.length}
              className="w-full bg-cyan-500 text-black font-mono font-bold py-3 px-4 rounded hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'SAVING...' : 'COMPLETE MODULE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}