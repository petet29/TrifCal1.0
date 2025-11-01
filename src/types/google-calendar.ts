export interface GoogleCalendarEvent {
  id: string
  summary?: string
  description?: string
  start: {
    dateTime?: string
    date?: string
  }
  end: {
    dateTime?: string
    date?: string
  }
  location?: string
  attendees?: GoogleAttendee[]
  organizer?: {
    email?: string
    displayName?: string
  }
  reminders?: {
    overrides?: GoogleReminder[]
  }
  status?: string
  visibility?: string
}

export interface GoogleAttendee {
  email: string
  displayName?: string
  responseStatus: string
  optional?: boolean
}

export interface GoogleReminder {
  minutes: number
  method: string
}

export interface GoogleCalendar {
  id: string
  summary: string
  backgroundColor?: string
  selected?: boolean
}
