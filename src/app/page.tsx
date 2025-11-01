'use client'

import { useState, useEffect } from 'react'
import CalendarView from '@/components/calendar/CalendarView'
import { CalendarEvent } from '@/types/calendar'

export default function Home() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    checkAuthStatus()
    fetchGoogleCalendarEvents(currentMonth)
  }, [currentMonth])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/session')
      const data = await response.json()
      setIsAuthenticated(data.authenticated || false)
    } catch (err) {
      console.error('Error checking auth status:', err)
      setIsAuthenticated(false)
    }
  }

  const fetchGoogleCalendarEvents = async (month: Date = new Date()) => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch events for a wider range: 6 months before to 6 months after the specified month
      const firstDay = new Date(month.getFullYear(), month.getMonth() - 6, 1)
      const lastDay = new Date(month.getFullYear(), month.getMonth() + 7, 0, 23, 59, 59)
      
      const timeMin = firstDay.toISOString()
      const timeMax = lastDay.toISOString()
      
      // Fetch from ALL calendars, not just primary
      const response = await fetch(
        `/api/calendar/google/all-calendars?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`
      )
      const data = await response.json()
      
      if (response.ok) {
        setEvents(data.events || [])
        if (data.events && data.events.length === 0) {
          setError('No events found in your Google Calendar for this month')
        }
      } else if (response.status === 401) {
        setError('Please sign in with Google to view your calendar')
        // Fallback to mock data
        setEvents(getMockEvents())
      } else {
        setError(data.error || 'Failed to fetch calendar events')
        // Fallback to mock data if Google Calendar fails
        setEvents(getMockEvents())
      }
    } catch (err) {
      console.error('Error fetching calendar events:', err)
      setError('Failed to connect to calendar service')
      // Fallback to mock data
      setEvents(getMockEvents())
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async () => {
    // NextAuth v5: Use relative URL (works better with routing)
    // After redirect back, checkAuthStatus will run and update the UI
    window.location.href = '/api/auth/signin/google?callbackUrl=/'
  }

  const getMockEvents = (): CalendarEvent[] => [
    {
      id: '1',
      title: 'Family Dinner',
      description: 'Weekly family dinner at home',
      start: new Date(2024, 9, 30, 18, 0),
      end: new Date(2024, 9, 30, 20, 0),
      allDay: false,
      location: 'Home',
      source: {
        id: 'local',
        name: 'Local Calendar',
        type: 'local',
        color: '#10b981',
        enabled: true
      },
      status: 'confirmed',
      visibility: 'private'
    },
    {
      id: '2',
      title: 'Soccer Practice',
      description: 'Kids soccer practice at the field',
      start: new Date(2024, 10, 2, 15, 30),
      end: new Date(2024, 10, 2, 17, 0),
      allDay: false,
      location: 'Community Field',
      source: {
        id: 'google',
        name: 'Google Calendar',
        type: 'google',
        color: '#4285f4',
        enabled: true
      },
      status: 'confirmed',
      visibility: 'private'
    },
    {
      id: '3',
      title: 'Doctor Appointment',
      description: 'Annual checkup',
      start: new Date(2024, 10, 5, 10, 0),
      end: new Date(2024, 10, 5, 11, 0),
      allDay: false,
      location: 'Family Medical Center',
      source: {
        id: 'apple',
        name: 'Apple Calendar',
        type: 'apple',
        color: '#007aff',
        enabled: true
      },
      status: 'confirmed',
      visibility: 'private'
    }
  ]

  const handleEventClick = (event: CalendarEvent) => {
    console.log('Event clicked:', event)
    // TODO: Open event details modal
  }

  const handleAddEvent = () => {
    console.log('Add event clicked')
    // TODO: Open add event modal
  }

  const handleSettingsClick = () => {
    console.log('Settings clicked')
    // TODO: Open settings modal
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  TrifSync
                </h1>
                <span className="text-xs text-gray-500 hidden sm:inline">Family Calendar</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">
                    Signed in
                  </span>
                  <button 
                    onClick={async () => {
                      const response = await fetch('/api/auth/signout', { method: 'POST' })
                      if (response.ok) {
                        setIsAuthenticated(false)
                        window.location.reload()
                      }
                    }}
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg active:bg-gray-50 hover:bg-gray-50 shadow-sm transition-all touch-manipulation min-h-[40px] sm:min-h-[44px]"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleSignIn}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg active:from-blue-700 active:to-indigo-700 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all flex items-center space-x-1 sm:space-x-2 touch-manipulation min-h-[40px] sm:min-h-[44px]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="hidden sm:inline">Sign In with Google</span>
                  <span className="sm:hidden">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome to TrifSync</h2>
          <p className="text-base sm:text-lg text-gray-600">
            Your smart family calendar with AI assistant, multi-service integration, and intelligent notifications.
          </p>
        </div>

        {/* Calendar View */}
        <CalendarView
          events={events}
          loading={loading}
          onEventClick={handleEventClick}
          onAddEvent={handleAddEvent}
          onSettingsClick={handleSettingsClick}
          onMonthChange={setCurrentMonth}
        />

        {/* Authentication Required Message - Show first if it's a sign-in error */}
        {error && error.includes('sign in') && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Sign In Required
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Please sign in with Google to view your calendar events.</p>
                  <div className="mt-3 space-y-2">
                    <button
                      onClick={handleSignIn}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                    >
                      Sign In with Google
                    </button>
                    <div className="text-xs text-blue-600">
                      <p className="font-medium">Quick Setup Links:</p>
                      <ul className="mt-1 space-y-1">
                        <li>
                          <a 
                            href="/api/auth/setup-status" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="underline hover:text-blue-800"
                          >
                            🔍 Check Setup Status
                          </a>
                        </li>
                        <li>
                          <a 
                            href="https://console.cloud.google.com/apis/credentials" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="underline hover:text-blue-800"
                          >
                            🔑 Get Google OAuth Credentials
                          </a>
                        </li>
                        <li>
                          <a 
                            href="https://developers.google.com/oauthplayground/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="underline hover:text-blue-800"
                          >
                            🧪 Test with OAuth Playground
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Error Messages - Only show if NOT a sign-in error */}
        {error && !error.includes('sign in') && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Calendar Connection Issue
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>{error}</p>
                  <p className="mt-1">Showing sample data for now.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message - Google Calendar Connected */}
        {!error && !loading && events.length === 0 && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  🎉 Google Calendar Connected Successfully!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Your Google Calendar is now synced with TrifSync.</p>
                  <p className="mt-1">No events found for the current date range. Try:</p>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>Adding events to your Google Calendar</li>
                    <li>Importing iCal links into Google Calendar (see guide below)</li>
                    <li>Navigating to a different month</li>
                    <li>Checking if you have events in other date ranges</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Preview */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Assistant</h3>
            <p className="text-gray-600">Ask questions about your schedule, get daily digests, and receive smart notifications.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Service Sync</h3>
            <p className="text-gray-600">Connect Google Calendar, Apple Calendar, and Outlook for unified family scheduling.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM4 5h6V1H4v4zM15 5h5v6h-5V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Notifications</h3>
            <p className="text-gray-600">Get departure alerts, weather updates, and personalized reminders for your family.</p>
          </div>
        </div>
      </main>
    </div>
  )
}