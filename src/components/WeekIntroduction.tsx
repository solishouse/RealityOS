// src/components/WeekIntroduction.tsx
'use client'

import { useState } from 'react'
import { ChevronRight, Target, Clock, Brain, Heart, Zap, AlertCircle } from 'lucide-react'

interface WeekIntroProps {
  weekNumber: number
  onStart: () => void
  userId: string
}

const weekData = {
  1: {
    title: "Align with your true self",
    subtitle: "Get clear on who you are and what's been holding you back",
    description: "This week is about getting honest with yourself. You'll uncover what's been running in the background: the beliefs, behaviors, and patterns that have shaped your choices. You'll start to see what's yours and what's not, so you can stop reacting from survival and start living as your true self.",
    outcomes: [
      "Identified the core patterns and sources behind your biggest struggles",
      "Named the roles you've been playing to feel safe and face what it's been costing you",
      "Reconnected with your real traits and values",
      "Released what's working against you",
      "Created clear, aligned goals and steps towards them"
    ],
    mindsetNotes: [
      "You are not broken. You are patterned, and patterns can be rewritten.",
      "Go at your pace. Take it day by day and don't rush it, or you will overwhelm yourself.",
      "These exercises are here to help you notice, not judge.",
      "You don't need to solve everything. Just notice what's true for you right now.",
      "This is the foundation. The rest of the program builds from the clarity you get here."
    ],
    timeCommitment: "30 minutes per day",
    color: "from-yellow-500 to-orange-500",
    bgPattern: "bg-gradient-to-br from-yellow-900/20 to-orange-900/20"
  },
  2: {
    title: "Learn what shapes your reality",
    subtitle: "Understand the forces behind your results and patterns",
    description: "This week, you'll discover the invisible forces that have been shaping your experience. From paradigms and beliefs to the law of attraction, you'll learn how your inner world creates your outer reality—and how to work with these forces consciously.",
    outcomes: [
      "Understood how paradigms and beliefs shape your experience",
      "Learned how vibrations and energy affect what you attract",
      "Discovered the connection between cause and effect in your life",
      "Developed tools to manage thoughts and emotions",
      "Created practices for better sleep, diet, and movement"
    ],
    mindsetNotes: [
      "Your outer world reflects your inner state",
      "Small shifts in energy create big changes in results",
      "You're learning to work WITH universal laws, not against them",
      "Awareness of these forces is the first step to mastery"
    ],
    timeCommitment: "30-45 minutes per day",
    color: "from-cyan-500 to-blue-500",
    bgPattern: "bg-gradient-to-br from-cyan-900/20 to-blue-900/20"
  },
  3: {
    title: "Build your new operating system",
    subtitle: "Rewire how you think, feel, and show up every day",
    description: "Time to install your upgrade. This week, you'll build practical tools and habits that support your aligned self. From gratitude and visualization to non-negotiables and daily rhythms, you're creating a personal operating system for sustainable change.",
    outcomes: [
      "Established a gratitude practice that reinforces positive patterns",
      "Created your personal dos and don'ts roadmap",
      "Designed a daily routine that keeps you aligned",
      "Mastered visualization to embody your future self",
      "Defined clear non-negotiables and boundaries"
    ],
    mindsetNotes: [
      "Consistency beats intensity—small daily actions compound",
      "You're building a system, not forcing an outcome",
      "What feels awkward now will feel natural soon",
      "Trust the process even when you can't see results yet"
    ],
    timeCommitment: "30-45 minutes per day",
    color: "from-purple-500 to-pink-500",
    bgPattern: "bg-gradient-to-br from-purple-900/20 to-pink-900/20"
  },
  4: {
    title: "Live what you've learned",
    subtitle: "Turn your inner work into everyday choices",
    description: "Integration week. Everything you've learned becomes real through practice. You'll create sustainable rhythms, handle triggers with grace, and share your transformation in ways that ripple outward. This isn't the end—it's your beginning.",
    outcomes: [
      "Integrated morning and evening alignment practices",
      "Developed strategies for navigating triggers",
      "Created momentum through consistent action",
      "Learned to share your growth authentically",
      "Connected with your future self's wisdom"
    ],
    mindsetNotes: [
      "You've already done the hard work—now just live it",
      "Progress isn't perfect—be gentle with yourself",
      "Your transformation inspires others just by being",
      "This is a practice, not a performance"
    ],
    timeCommitment: "20-30 minutes per day",
    color: "from-green-500 to-emerald-500",
    bgPattern: "bg-gradient-to-br from-green-900/20 to-emerald-900/20"
  }
}

export default function WeekIntroduction({ weekNumber, onStart, userId }: WeekIntroProps) {
  const [currentView, setCurrentView] = useState<'overview' | 'mindset' | 'ready'>('overview')
  const week = weekData[weekNumber as keyof typeof weekData]

  if (!week) return null

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Pattern */}
      <div className={`fixed inset-0 ${week.bgPattern} opacity-50`} />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          
          {currentView === 'overview' && (
            <div className="animate-fadeIn">
              {/* Week Badge */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full px-6 py-2 mb-4">
                  <span className="text-gray-400 font-mono text-sm">WEEK {weekNumber}</span>
                </div>
                
                {/* Title with gradient */}
                <h1 className={`text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r ${week.color} bg-clip-text text-transparent`}>
                  {week.title}
                </h1>
                <p className="text-xl text-gray-400">{week.subtitle}</p>
              </div>

              {/* Description Card */}
              <div className="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl p-8 mb-8">
                <p className="text-gray-300 leading-relaxed text-lg">
                  {week.description}
                </p>
              </div>

              {/* Outcomes */}
              <div className="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl p-8 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6 text-cyan-500" />
                  <h2 className="text-2xl font-bold">By the end of this week, you will have:</h2>
                </div>
                <div className="space-y-3">
                  {week.outcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${week.color} mt-2 flex-shrink-0`} />
                      <p className="text-gray-300">{outcome}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Commitment */}
              <div className="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-cyan-500" />
                    <span className="text-gray-300">Daily time commitment:</span>
                  </div>
                  <span className="font-mono font-bold text-cyan-500">{week.timeCommitment}</span>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={() => setCurrentView('mindset')}
                className={`w-full bg-gradient-to-r ${week.color} text-black font-mono font-bold py-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2`}
              >
                CONTINUE
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {currentView === 'mindset' && (
            <div className="animate-fadeIn">
              {/* Header */}
              <div className="text-center mb-8">
                <Brain className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2">Keep in mind</h2>
                <p className="text-gray-400">Important reminders for this week's journey</p>
              </div>

              {/* Mindset Notes */}
              <div className="space-y-4 mb-8">
                {week.mindsetNotes.map((note, index) => (
                  <div key={index} className="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <Heart className="w-5 h-5 text-pink-500 mt-1" />
                      </div>
                      <p className="text-gray-300 leading-relaxed">{note}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Extra note for Week 1 */}
              {weekNumber === 1 && (
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6 mb-8">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-yellow-200 font-semibold mb-2">A note on honesty:</p>
                      <p className="text-yellow-300/80 text-sm">
                        It can be difficult to face the hard truths, so be completely honest with yourself. 
                        If it helps, get input from someone who knows you well enough to keep you honest.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Continue Button */}
              <button
                onClick={() => setCurrentView('ready')}
                className={`w-full bg-gradient-to-r ${week.color} text-black font-mono font-bold py-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2`}
              >
                I'M READY
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {currentView === 'ready' && (
            <div className="animate-fadeIn text-center">
              {/* Ready Screen */}
              <div className="mb-8">
                <Zap className="w-16 h-16 text-yellow-500 mx-auto mb-6 animate-pulse" />
                <h2 className="text-4xl font-bold mb-4">You're ready to begin</h2>
                <p className="text-xl text-gray-400 mb-2">Week {weekNumber}: {week.title}</p>
                <p className="text-gray-500">Remember: You're not here to fix yourself.</p>
                <p className="text-gray-500">You're here to remember who you are underneath it all.</p>
              </div>

              {/* Start Button */}
              <button
                onClick={onStart}
                className={`inline-flex items-center gap-3 bg-gradient-to-r ${week.color} text-black font-mono font-bold py-5 px-12 rounded-xl hover:opacity-90 transition-all text-lg`}
              >
                START DAY 1
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Skip link for returning users */}
              <div className="mt-6">
                <button
                  onClick={onStart}
                  className="text-gray-500 hover:text-gray-400 text-sm underline"
                >
                  Skip intro next time
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Add these animations to your global CSS
const animationStyles = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}
`