// Type declarations for 'ical' module
declare module 'ical' {
  interface Event {
    uid?: string
    summary?: string
    description?: string
    start?: Date | string
    end?: Date | string
    location?: string
    type: string
    [key: string]: any
  }

  interface CalendarData {
    [key: string]: Event
  }

  export function parseICS(icsData: string): CalendarData
  export function parseFile(filename: string): CalendarData
}

