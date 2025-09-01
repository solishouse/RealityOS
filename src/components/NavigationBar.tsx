// src/components/NavigationBar.tsx
'use client'

import { useState } from 'react'
import { Home, BookOpen, TrendingUp, User, Menu, X, LogOut, ChevronRight, Crown, Star, Moon, Sun } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/contexts/ThemeContext'
import { Button, Badge } from '@/components/ui'

interface NavigationBarProps {
  user: any
  profile: any
  currentView?: 'dashboard' | 'lesson' | 'progress' | 'profile'
  onNavigate?: (view: string) => void
}

export default function NavigationBar({ user, profile, currentView = 'dashboard', onNavigate }: NavigationBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const isPremium = profile?.subscription_status === 'premium'

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User }
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-lg shadow-blue-500/20" />
            <span className="font-bold text-xl text-gray-900 dark:text-white">RealityOS</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate?.(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                  currentView === item.id
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Plan Badge */}
          <Badge variant={isPremium ? 'premium' : 'default'}>
            {isPremium ? (
              <>
                <Crown className="w-3.5 h-3.5 mr-1" />
                Premium Plan
              </>
            ) : (
              <>
                <Star className="w-3.5 h-3.5 mr-1" />
                Free Plan
              </>
            )}
          </Badge>

          {/* User Info */}
          <div className="flex items-center space-x-3 pl-3 border-l border-gray-200 dark:border-gray-800">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {profile?.first_name || profile?.email?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Day {profile?.current_day || 0} • {profile?.streak_count || 0} day streak
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/20">
              {profile?.first_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-lg shadow-blue-500/20" />
            <span className="font-bold text-lg text-gray-900 dark:text-white">RealityOS</span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Dark Mode Toggle (Mobile) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Plan Badge (Mobile) */}
            <Badge variant={isPremium ? 'premium' : 'default'} size="sm">
              {isPremium ? <Crown className="w-3 h-3" /> : <Star className="w-3 h-3" />}
              <span className="ml-1">{isPremium ? 'Premium' : 'Free'}</span>
            </Badge>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-400"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-2">
            <div className="py-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {profile?.first_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {profile?.first_name || profile?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Day {profile?.current_day || 0} • {profile?.streak_count || 0} day streak
                  </p>
                </div>
              </div>
            </div>

            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate?.(item.id)
                  setMobileMenuOpen(false)
                }}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {currentView === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            ))}

            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-3 py-3 text-red-600 dark:text-red-400 mt-2 border-t border-gray-100 dark:border-gray-800"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </nav>
    </>
  )
}