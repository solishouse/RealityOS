// src/components/ExternalProblemAssessment.tsx
'use client'

import { useState } from 'react'
import { ChevronRight, SkipForward } from 'lucide-react'

interface Props {
  problem: {
    id: string
    text: string
  }
  onComplete: (assessment: {
    control: number
    impact: number
    strategies: string[]
  }) => void
  onSkip: () => void
}

const strategies = [
  { id: 'boundaries', label: 'Set clear boundaries', description: 'Define what you will and won\'t accept' },
  { id: 'communication', label: 'Improve communication', description: 'Express needs and expectations clearly' },
  { id: 'support', label: 'Seek support', description: 'Get help from others or professionals' },
  { id: 'distance', label: 'Create distance', description: 'Limit exposure or interaction' },
  { id: 'acceptance', label: 'Practice acceptance', description: 'Accept what cannot be changed' },
  { id: 'influence', label: 'Expand influence', description: 'Find ways to increase your control' },
  { id: 'perspective', label: 'Shift perspective', description: 'Reframe how you view the situation' },
  { id: 'alternatives', label: 'Find alternatives', description: 'Explore other options or paths' }
]

export default function ExternalProblemAssessment({ problem, onComplete, onSkip }: Props) {
  const [control, setControl] = useState(5)
  const [impact, setImpact] = useState(5)
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([])

  function toggleStrategy(strategyId: string) {
    if (selectedStrategies.includes(strategyId)) {
      setSelectedStrategies(selectedStrategies.filter(id => id !== strategyId))
    } else {
      setSelectedStrategies([...selectedStrategies, strategyId])
    }
  }

  function handleComplete() {
    onComplete({
      control,
      impact,
      strategies: selectedStrategies
    })
  }

  return (
    <div className="space-y-6">
      {/* Problem Display */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="text-sm text-orange-400 mb-2">🌍 External Problem</div>
        <div className="text-2xl font-semibold">{problem.text}</div>
      </div>

      {/* Control Assessment */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-3">
          How much control do you have over this?
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          1 = No control at all | 10 = Complete control
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-400">{control}</span>
            <span className="text-sm text-gray-400">
              {control <= 3 ? 'Low Control' : control <= 7 ? 'Moderate Control' : 'High Control'}
            </span>
          </div>
          
          <input
            type="range"
            min="1"
            max="10"
            value={control}
            onChange={(e) => setControl(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${control * 10}%, #374151 ${control * 10}%, #374151 100%)`
            }}
          />
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>
      </div>

      {/* Impact Assessment */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-3">
          How much does this impact your life?
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          1 = Minimal impact | 10 = Major impact
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-orange-400">{impact}</span>
            <span className="text-sm text-gray-400">
              {impact <= 3 ? 'Low Impact' : impact <= 7 ? 'Moderate Impact' : 'High Impact'}
            </span>
          </div>
          
          <input
            type="range"
            min="1"
            max="10"
            value={impact}
            onChange={(e) => setImpact(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #FB923C 0%, #FB923C ${impact * 10}%, #374151 ${impact * 10}%, #374151 100%)`
            }}
          />
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>
      </div>

      {/* Strategy Selection */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-3">
          What strategies could help with this?
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Select all that apply
        </p>
        
        <div className="grid gap-2">
          {strategies.map((strategy) => (
            <button
              key={strategy.id}
              onClick={() => toggleStrategy(strategy.id)}
              className={`text-left p-4 rounded-lg transition-all ${
                selectedStrategies.includes(strategy.id)
                  ? 'bg-blue-500/20 border-2 border-blue-500'
                  : 'bg-gray-700 border-2 border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center ${
                  selectedStrategies.includes(strategy.id)
                    ? 'bg-blue-500'
                    : 'bg-gray-600'
                }`}>
                  {selectedStrategies.includes(strategy.id) && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </div>
                <div>
                  <div className="font-semibold">{strategy.label}</div>
                  <div className="text-sm text-gray-400 mt-1">{strategy.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onSkip}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
        >
          <SkipForward className="w-5 h-5" />
          Skip This One
        </button>
        
        <button
          onClick={handleComplete}
          className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}