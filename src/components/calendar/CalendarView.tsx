'use client'

import { useState } from 'react'
import { CalendarEvent } from '@/types/calendar'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from 'date-fns'
import { ChevronLeft, ChevronRight, Plus, Settings } from 'lucide-react'

interface CalendarViewProps {
  events: CalendarEvent[]
  loading?: boolean
  onEventClick?: (event: CalendarEvent) => void
  onAddEvent?: () => void
  onSettingsClick?: () => void
}

export default function CalendarView({
  events,
  loading = false,
  onEventClick,
  onAddEvent,
  onSettingsClick
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewType, setViewType] = useState<'month' | 'week' | 'day'>('month')

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (viewType === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    } else if (viewType === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    }
    setCurrentDate(newDate)
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.start, date))
  }

  const renderMonthView = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 })
    const end = endOfWeek(currentDate, { weekStartsOn: 1 })
    const days = eachDayOfInterval({ start, end })

    const getEventColor = (event: CalendarEvent) => {
      return event.source?.color || '#3b82f6'
    }

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="p-2 text-center text-xs font-semibold text-gray-600 bg-gray-50">
            {day}
          </div>
        ))}
        {days.map(day => {
          const dayEvents = getEventsForDate(day)
          const isCurrentDay = isToday(day)
          const isCurrentMonth = day.getMonth() === currentDate.getMonth()

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[120px] p-1.5 bg-white ${
                isCurrentDay ? 'bg-blue-50 ring-2 ring-blue-400 ring-inset' : ''
              } ${!isCurrentMonth ? 'bg-gray-50' : ''} transition-colors hover:bg-gray-50`}
            >
              <div className={`text-sm font-semibold mb-1 ${
                isCurrentDay 
                  ? 'text-blue-600 bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center' 
                  : isCurrentMonth 
                    ? 'text-gray-900' 
                    : 'text-gray-400'
              }`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-0.5 mt-1">
                {dayEvents.slice(0, 3).map(event => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick?.(event)}
                    style={{ 
                      backgroundColor: getEventColor(event) + '20',
                      borderLeftColor: getEventColor(event),
                      borderLeftWidth: '3px'
                    }}
                    className="text-xs p-1.5 rounded text-gray-800 cursor-pointer hover:opacity-80 truncate border-l-2 transition-all"
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    {!event.allDay && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {format(event.start, 'h:mm a')}
                      </div>
                    )}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 font-medium pt-1">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderWeekView = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 })
    const end = endOfWeek(currentDate, { weekStartsOn: 1 })
    const days = eachDayOfInterval({ start, end })

    return (
      <div className="grid grid-cols-7 gap-4">
        {days.map(day => {
          const dayEvents = getEventsForDate(day)
          const isCurrentDay = isToday(day)

          return (
            <div key={day.toISOString()} className="flex-1">
              <div className={`text-center p-2 ${isCurrentDay ? 'bg-blue-100 rounded' : ''}`}>
                <div className="text-sm font-medium">{format(day, 'EEE')}</div>
                <div className={`text-lg ${isCurrentDay ? 'text-blue-600' : ''}`}>
                  {format(day, 'd')}
                </div>
              </div>
              <div className="space-y-1 mt-2">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick?.(event)}
                    className="text-xs p-2 bg-blue-100 text-blue-800 rounded cursor-pointer hover:bg-blue-200"
                  >
                    <div className="font-medium">{event.title}</div>
                    {!event.allDay && (
                      <div className="text-gray-600">
                        {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate)
    const isCurrentDay = isToday(currentDate)

    return (
      <div className="space-y-4">
        <div className={`text-center p-4 ${isCurrentDay ? 'bg-blue-50 rounded-lg' : ''}`}>
          <div className="text-2xl font-bold">{format(currentDate, 'EEEE, MMMM d, yyyy')}</div>
          {isCurrentDay && <div className="text-blue-600">Today</div>}
        </div>
        <div className="space-y-2">
          {dayEvents.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No events scheduled for this day
            </div>
          ) : (
            dayEvents.map(event => (
              <div
                key={event.id}
                onClick={() => onEventClick?.(event)}
                className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{event.title}</div>
                    {event.description && (
                      <div className="text-sm text-gray-600 mt-1">{event.description}</div>
                    )}
                    {event.location && (
                      <div className="text-sm text-gray-500 mt-1">📍 {event.location}</div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {event.allDay ? 'All day' : `${format(event.start, 'HH:mm')} - ${format(event.end, 'HH:mm')}`}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-white/80 rounded-lg transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 border border-gray-200"
            >
              Today
            </button>
            <button
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-white/80 rounded-lg transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {format(currentDate, 'EEEE')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="flex bg-white/80 rounded-lg p-1 shadow-sm border border-gray-200">
            {(['month', 'week', 'day'] as const).map(view => (
              <button
                key={view}
                onClick={() => setViewType(view)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded transition-all ${
                  viewType === view 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
          
          <button
            onClick={onAddEvent}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center"
            aria-label="Add event"
          >
            <Plus className="w-5 h-5" />
          </button>
          
          <button
            onClick={onSettingsClick}
            className="p-2 hover:bg-white/80 rounded-lg transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {viewType === 'month' && renderMonthView()}
            {viewType === 'week' && renderWeekView()}
            {viewType === 'day' && renderDayView()}
          </>
        )}
      </div>
    </div>
  )
}
